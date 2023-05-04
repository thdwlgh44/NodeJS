const express = require('express');

const { verifyToken, deprecated } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v1');
const { verify } = require('jsonwebtoken');

const router = express.Router();

router.use(deprecated);

// POST /v1/token
router.post('/token', createToken);

// POST /v1/test
router.get('/test', verifyToken, tokenTest);

router.get('/posts/my', verifyToken, getMyPosts);
router.get('/posts/hashtag/:title', verifyToken, getPostsByHashtag);

module.exports = router;