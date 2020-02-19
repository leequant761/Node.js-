var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { // GET
  res.render('index', { title: 'Express' }); // 응답: 템플릿 엔진 사용!
});

module.exports = router;