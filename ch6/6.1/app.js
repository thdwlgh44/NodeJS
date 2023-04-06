const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const session = require('express-session');
const dotenv = require('dotenv');
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));
app.use(cookieParser('zerochopassword'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: 'zerochopassword',
    cookie: {
        httpOnly: true,
    },
    name: 'connect.sid',
}));
app.use('/', (req, res, next) => {
    if (req.session.id) {
        express.static(__dirname, 'public')(req, res, next)
    } else {
        next();
    }
});

app.use(multer().array());
app.use('/', express.static(__dirname, 'public'));

app.use('/about', (req, res, next) => {
    console.log('1 모든 요청에 실행하고 싶어요');
    next();
}, (req, res, next) => {
    console.log('2 모든 요청에 실행하고 싶어요');
    next();
}, (req, res, next) => {
    console.log('3 모든 요청에 실행하고 싶어요');
    next();
})

app.get('/', (req, res) => {
    console.log('모든 요청에 실행하고 싶어요');
    res.sendFile(path.join(__dirname, './index.html')); //리로딩 될 대 그 때마다 전송
});

app.post('/', (req, res) => {
    console.log('모든 요청에 실행하고 싶어요');
    res.send('hello express');
});

app.get('/about', (req, res) => {
    console.log('모든 요청에 실행하고 싶어요');
    res.send('hello express');
});

app.listen(app.get('port'), () => {
    console.log('익스프레스 서버 실행');
});