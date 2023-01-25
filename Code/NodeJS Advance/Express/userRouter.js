// # Dùng express 
// Middleware có thể là router

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    res.send('Ban da truy cap dia chi /user bang phuong thuc GET');
});
router.post('/', function (req, res) {
    res.send('Ban da truy cap dia chi /user bang phuong thuc POST');
});

// Xuất bộ định tuyến này để có thể sử dụng ở file khác
module.exports = router;