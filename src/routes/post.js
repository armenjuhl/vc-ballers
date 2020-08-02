const express = require('express');
const {getPosts, createPost} = require('../controllers/post');
const {createPostValidator} = require('../validator/index');
const { requireSignin } = require('../controllers/auth');


const router = express.Router();

router.get('/', requireSignin, getPosts);
router.post('/post', requireSignin, createPostValidator, createPost);

module.exports = router;
