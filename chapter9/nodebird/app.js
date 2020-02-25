const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('dotenv').config();

const { sequelize } = require('./models/');

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const passportConfig = require('./passport');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', process.env.PORT || 8001);

app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/img', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(flash());
app.use(passport.initialize()); // 이것은 passport/index.js의 serializeUser의 이벤트 리스너다 (세션 등록할 때 이벤트 발생)
app.use(passport.session()); // // 이것은 passport/index.js의 deserializeUser의 이벤트 리스너다 (매 요청마다 이벤트 발생)

app.use('/', pageRouter); // pageRouter가 메인화면, 회원가입 버튼, 로그인 버튼 이벤트 캐처; 콜백으로 layout.pug join.pug를 렌더링하는데 이 때 /auth로 라우팅하는 버튼이 있다. 
app.use('/auth', authRouter); // 그 버튼을 누른 경우에 실행; 로그인, 로그아웃, 회원가입 담당 라우터
app.use('/post', postRouter);
app.use('/user', userRouter);

app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});