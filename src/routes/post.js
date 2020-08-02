const express = require('express');
const {getPosts, createPost} = require('../controllers/post');
const {createPostValidator} = require('../validator/index');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');


const router = express.Router();

router.get('/', getPosts);
router.post('/post', requireSignin, createPostValidator, createPost);

router.param('userId', userById);

module.exports = router;
