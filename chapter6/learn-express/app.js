var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug'); // pug 템플릿 엔진 사용

app.use(logger('dev'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // 쿠키에 맞는 서비스를 하려면 쿠키파서 뒤에 위치
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser('secret code'));
app.use(session({
  resave: false, // 요청이 왔을 때 세션에 수정사항이 생기지 않더라도 재저장 할래?
  saveUninitialized: false, // 세션에 저장할 내역이 없는데 저장할래? ; 방문자 추적에 사용(??)
  secret: 'secret code', // cookieParser의 비밀키(??)
  cookie: {
    httpOnly: true, // 클라이언트에서 쿠키 확인 못함
    secure: false, // https가 아닌 환경에서 사용가능 ; 배포시에는 true 권장
  },
}));
app.use(flash()); // req.flash 메서드 추가됨

// 라우터에는 무조건 res.method를 넣어야한다! 혹은 next('route')
app.use('/', indexRouter); // / 라는 주소가 왔을 때만 indexRouter라는 미들웨어 실행
app.use('/users', usersRouter); // /users 라는 주소가 왔을 때만 indexRouter라는 미들웨어 실행

// catch 404 and forward to error handler; 요청을 처리할 라우터가 없을 때 실행되는 미들웨어
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
