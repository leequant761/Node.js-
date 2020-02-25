// 다른 사용자를 팔로우할 수 있는 /user/:id/follow 라우터
const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try{
        const user = await User.findOne({ where: { id: req.user.id }} ); // req.user 는 app.js에서 passport.session() 시 생성
        await user.addFollowing(parseInt(req.params.id, 10));
        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;