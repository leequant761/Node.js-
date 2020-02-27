// API VERSION 2
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.use( async (req, res, next) => { // 클라이언트가 직접 API 직접 호출, 허용된 도메인에서만
    const domain = await Domain.findOne({
        where: { host: url.parse(req.get('origin')).host },
    });
    if (domain) {
        cors({ origin: req.get('origin') })(req, res, next); // 미들웨어 커스터마이징 방법
    } else {
        next();
    }
});

// 토큰 발급 라우터
router.post('/token', apiLimiter, async(req, res) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: {
                model: User,
                attributes: ['nick', 'id'],
            }
        });
        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }
        const token = jwt.sign({
            id: domain.user.id,
            nick: domain.user.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '30m', // 30분
            issuer: 'nodebird',
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다',
            token,
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            code: 400,
            message: '서버 에러',
        });
    }
});


// 토큰 테스트 라우터
router.get('/test', verifyToken, apiLimiter, (req, res) => {
    res.json(req.decoded);
});


router.get('/posts/my', verifyToken, apiLimiter, (req, res) => {
    Post.findAll({ where: { userId: req.decoded.id } })
        .then((posts) => {
            console.log(posts);
            res.json({
                code: 200,
                payload: posts,
            });
        })
        .catch((error) => {
            console.error(error);
            return res.status(500).json({
                code: 500,
                message: '서버 에러',
            });
        });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (req, res) => {
    try{
        const hashtag = await Hashtag.findOne({ where: { title: req.params.title } });
        if (!hashtag) {
            return res.status(404).json({
                code: 200,
                payload: posts,
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

module.exports = router;