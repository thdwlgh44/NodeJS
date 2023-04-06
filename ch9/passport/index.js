const passport = require('passport');
const local = require('./localStrategy.js');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
    passport.serializeUser((user, done) => {
        done(null, user.id); // user id만 추출
    });
    // 세션 { 12390123412 : 1 } { 세션쿠키: 유저아이디 } -> 메모리에 저장된다.

    passport.deserializeUser((id, done) => {
        User.findOne({ where: { id }})
        .then((user) => done(null, user))
        .catch(err => done(err));
    });

    local();
    kakao();
};