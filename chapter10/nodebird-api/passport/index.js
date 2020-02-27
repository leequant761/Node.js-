const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const { User } = require('../models');

module.exports = (passport) => { // passport 객체를 받아서 초기화를 담당하는 콜백메서드와 사용자 객체(req.user)를 가져오는 콜백메서드와 거치도록 하자
    passport.serializeUser((user, done) => {
        done(null, user.id); // app.js의 app.use(passport.initialize())와 연결됨
    });

    passport.deserializeUser((id, done) => {
        User.findOne({  // 사용자 정보를 가져올 때 팔로잉 목록과 팔로워목록도 조인해서 가져오자
            where: { id },
            include: [{
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followers',
            }, {
                model: User,
                attributes: ['id', 'nick'],
                as: 'Followings',
            }],
         })
            .then(user => done(null, user)) // app.js의 app.use(passport.session())와 연결됨
            .catch(err => done(err));
    });

    local(passport);
    kakao(passport);
};