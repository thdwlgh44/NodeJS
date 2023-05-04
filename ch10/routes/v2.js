const express = require('express');

const { verifyToken, apiLimiter, corsWhenDomainMatches } = require('../middlewares');
const { createToken, tokenTest, getMyPosts, getPostsByHashtag } = require('../controllers/v2');
const cors = require("cors");
const { verify } = require('jsonwebtoken');

const router = express.Router();

router.use(corsWhenDomainMatches);

// router.use((req, res, next) => {
//     cors({
//     origin: 'http://localhost:4000',
//     credentials: true, //쿠키 요청 허용 but origin이 *일 때 사용할 수 없음.
//     }) (req, res, next);
// })

// router.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4000');
//     res.setHeader('Access-Control-Allow-Headers', 'content-type');
//     next();
// })

// POST /v1/token
router.post('/token', apiLimiter, createToken);

// POST /v1/test
router.get('/test', verifyToken, apiLimiter, tokenTest);

router.get('/posts/my', verifyToken, apiLimiter, getMyPosts);
router.get('/posts/hashtag/:title', verifyToken, apiLimiter, getPostsByHashtag);

module.exports = router;