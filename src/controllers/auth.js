const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/user');
const expressJwt = require('express-jwt');

exports.signup = async (req, res ) => {
  const userExists = await User.findOne({email: req.body.email});
  if (userExists) return res.status(403).json({
    error: "Email is taken!"
  });
  const user = await new User(req.body);
  await user.save();
  res.status(200).json({ message: "User sign up successful" })
};

exports.signin = (req, res) => {
//  Locate user with email
  const {email, password} = req.body;
  User.findOne({email}, (err, user) => {
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please try again"
      })
    }

    //  if errors or no user
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "email and password do not match"
      })
    }

//  if user: authenticated
//  generate token with user id and secret
    const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
//  persist the token in cookie with expiry client
    res.cookie('t', token, {expire: new Date() + 9999});
//  return response with user and token to frontend client
    const {_id, name, email} = user;
    return res.json({token, user: {_id, email, name}})
  });
};
  exports.signout = (req, res) => {
    res.clearCookie('t');
    return res.json({message: 'Signout successful'});
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256']
});
