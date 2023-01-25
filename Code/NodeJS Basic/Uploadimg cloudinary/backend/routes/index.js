// # Dùng express / Middleware có thể là router / Dùng express.Route

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // # Dùng express / Các middleware view engine / Dùng jade
  res.render('index', { title: 'Express' }); // truyền title vào file jade
});

module.exports = router;
