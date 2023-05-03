const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');
const passport = require('passport');
const { sequelize } = require('./models');
//process.env.COOKIE_SECRET 없음
// dotenv.config(); //process.env

// 변경된 코드
dotenv.config({path: path.join(__dirname, '/.env')});

//process.env.COOKIE_SECRET 있음
const authRouter = require('./routes/auth');
const indexRouter = require('./routes');
const v1Router = require('./routes/v1'); //routes 폴더에서 작성한 token 발급을 app.js에서 적용
const passportConfig = require('./passport');

const app = express();
passportConfig();
app.set('port', process.env.PORT || 8002);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
})

//개발시에만 force : true를 통해 테이블 자동 삭제 후 재실행, 운영에서는 빼고 할 것
sequelize.sync({ force: false })
    .then(() => {
        console.log('데이터베이스 연결 성공')
    })
    .catch((err) => {
        console.log(err);
    })

app.use(morgan('dev')); //'dev'는 개발모드로 자세히 로깅, 'combined'는 운영에 필요한 최소한의 로깅 => 실제 서버 공간을 많이 차지하므로 선택을 잘 해야 한다.
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // req.body를 ajax json 요청으로부터
app.use(express.urlencoded({ extended: false})); // req.body 폼으로부터
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    }
}));
app.use(passport.initialize()); // req.user, req.login, req.isAuthenticate, req.logout
app.use(passport.session()); // connect.sid 라는 이름으로 세션 쿠키가 브라우저로 전송

app.use('/auth', authRouter);
app.use('/', indexRouter);
app.use('/v1', v1Router);

app.use((req, res, next) => { // 404 NOT FOUND
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err: {}; // 에러 로그는 사용자 화면에 표시하지 않고 서비스에 넘긴다.
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
})