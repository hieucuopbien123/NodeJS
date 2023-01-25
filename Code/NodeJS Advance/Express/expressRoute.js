// # Dùng express / DÙng middleware => tổng hợp đầy đủ: function 3 tham số, 4 tham số, middleware là router,
// middleware là thư viện bên thứ 3

var express = require("express");
var app = express();
var router = express.Router()

// 1 cách khác để có middleware ở 1 path cụ thể là dùng express.Router(); và cho app use nó.
// 1 function(req,res,next){} đã được gọi là 1 middleware của nodejs r. Các midddlewarre được dùng bởi use thì thg có
// next() để bắt request còn dùng tiếp middleware của nó nx chứ
router.use(function (req, res, next) {
    console.log('middleware run')
    next();
})
router.get('/', function (req, res) { // middleware có thể k có next nếu muốn dừng luôn.
    // res.send("dfaksdfjskldf");
    // res.send('hello, user!'); // lỗi send 2 lần vì set 2 Header 2 request -> test middleware check err bên dưới
    throw new Error("Eror");
})
app.use("/", router);

function errorHandling(err, req, res, next) { // Middleware 4 đối số sẽ có err ở đầu và chỉ chạy khi có error
    // console.error(err.stack);
    res.status(500).send('Something broke!')
    // Nó k chạy cái hàm send về sau vì ta cố tình tạo lỗi ở đây là send 2 lần, mà send chỉ chạy 1 lần nên khi gặp lỗi
    // nó chạy vào đây lại send tiếp thì cx k đc vì chỉ send 1 lần => đấy là nếu chơi lỗi send 2 lần
    // Lỗi ta chủ động throw thì sẽ send cho client 'Something broke!' vì 1 request luôn phải có 1 response mà chưa
    // có response nên đó sẽ là response
}
app.use(errorHandling);
// Nhận 4 đối số sẽ có thể bắt lỗi, khi nào có lỗi thì sẽ chạy, thật ra lỗi nó tự động in trên server nên cái này làm nó
// in lỗi 2 lần

// Cx có thể sử dụng middleware bên thứ 3 cx với hàm use

app.listen(3000);