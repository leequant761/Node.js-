var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) { // /users/ 로 요청시 콜백 실행
  res.send('respond with a resource');
});

router.get('/flash', function(req, res) {
  req.session.message = '세션 메시지';
  req.flash('message', 'flash 메시지'); // 키, 값
  res.redirect('/users/flash/result');
});

router.get('/flash/result', function(req, res) {
  res.send(`${req.session.message} ${req.flash('message')}`);
});

// 유용한 라우팅 패턴; 주소에 /users/123?limit=5&skip=10 입력해봐라
router.get('/:id', function(req, res) {
  console.log(req.params, req.query);
  next('routes');
});

module.exports = router;
