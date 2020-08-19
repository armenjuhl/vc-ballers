exports.createPostValidator = (req, res, next) => {
  req.check('title', 'Title is required').notEmpty();
  req.check('title', 'Title must be between 4 - 150 characters').isLength({
    min: 4,
    max: 150
  });

  req.check('body', 'Body is required').notEmpty();
  req.check('body', 'Body must be between 4 - 150 characters').isLength({
    min: 4,
    max: 150
  });
  const errors = req.validationErrors();
  if (errors) {
    const firstError = errors.map((error) => error.msg)[0];
    return res.status(400).json({error: firstError});
  }
  next();
};

exports.userSignupValidator = (req, res, next) => {
  console.log('Inside validator. \nREQ: ' + JSON.stringify(req));
  req.check('name', 'Name is required').notEmpty();
  req.check('email', 'Email is required').notEmpty();
  req.check('email', 'must be between 3 - 50 characters').notEmpty()
      .matches(/.+\@.+\..+/)
      .withMessage("Email must contain @")
      .isLength({
        min: 3,
        max: 2000
      });

  req.check('password', "Password is required").notEmpty();
  req.check('password')
      .isLength({min: 6})
      .withMessage("Password must contain at least 6 characters")
      .matches(/\d/)
      .withMessage('Password must contain at least one number');

const errors = req.validationErrors();

if (errors) {
  const firstError = errors.map(error => error.msg)[0];
  return res.status(400).json({error: firstError});
}
next();
};
