// # Các module quan trọng phía server
// Dùng express 

var express = require('express')
var app = express();
const a = 1;

// Tự setup header thuần với express
app.use(function (req, res, next) {
    console.log("Run middleware use");
    res.header("Access-Control-Allow-Origin", "*"); // Mọi domain được quyền truy cập website
    // res.header("Access-Control-Allow-Origin", "https://freetuts.net"); // VD cors sẽ chỉ cho phép mỗi domain này
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Middleware trên sẽ chạy trước middleware test
const test = (req, res, next) => {
    console.log("Run middleware test");
    next();
}

app.get('/products/:id', test, function (req, res, next) {
    res.json({
        msg: 'This is CORS-enabled '
    })
})
// Gửi bằng res.json cái object như trên thì browser client nhận được và hiển thị chay luôn thôi vì đâu có được gọi 
// từ 1 dự án front end xử lý dữ liệu nhận về đâu

app.listen(3000, function () {
    console.log('web server listening on port 3000')
})