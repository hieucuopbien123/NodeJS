// ## Các module quan trọng phía server

// # Dùng express
const express = require("express");
const app = express();
const path = require('path');

// Dùng middleware của expressjs
app.use(express.static(__dirname + '/uploads')); // Phải dùng đường dẫn tuyệt đối mọi lúc
// Nhờ middleware này nên khi sử dụng ảnh chẳng hạn thì mặc định là đã ở thư mục đó r 
// -> VD chỉ cần: <img src="/1629434291323_bkg.jpg">

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./form.html")); // Chú ý sendFile phải dùng tuyệt đối
});

app.listen(8080);