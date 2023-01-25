// # Dùng express / Dùng middleware

// Middleware thg dùng để parseJSON, parseCookie, kiểm tra đăng nhập, thay đổi request, response,..
var express = require('express');
var app = express();

var myLogger = function (req, res, next) {
    // res.send("ấdfsf"); // éo đc gửi ở use này k thì get bên dưới send sẽ sai. Có bnh middleware nó cũng chạy hết
    // miễn là k có 2 cái cùng send to client là được
    console.log('Middleware chạy ở route có url ' + req.url + ' và method là ' + req.method)
    next() // Nếu k gọi next nó sẽ k chạy tiếp các middleware(get, post đều là middle ware hết) chỉ có điều use luôn
    // là middle ware chạy trc get/post.
}
app.use(myLogger)

app.get("/", function (req, res, next) { // dùng next thì có next
    res.send('Response');
    console.log("Run to main");
    next()
}, function (req, res, next) {
    console.log("Hello from middleware 2")
    next()
})
// Ta cx có thể thêm 1 middleware vào get/post bằng cách truyền nó đối số thứ 3 và thêm next vào callback nhưng thông
// thường get/post xong là dừng luôn chứ k gọi next

app.listen(3000);