const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        if (exUser) {
            req.flash('joinError', '이미 가입된 이메일입니다.')
            return res.redirect('/join');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 특이사항: 'local'이 'localStrategy', 'kakao'이 'kakaoStrategy'를 가르킴;
// app.js에서 라우팅 전에 passport 설정을 초기화 했기에 ../passport/index.js의 실행이 먼저 됐다.
// 
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => { // 이것은 passport/localStrategy의 done의 이벤트 리스너다
        if (authError) {
            console.error(authError);
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            return res.redirect('/');
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/');
        });
    }) (req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙인다
});

router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    resizeBy.redirect('/');
})

router.get('/kakao', passport.authenticate('kakao')); // 카카오 로그인 시작

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});

module.exports = router;