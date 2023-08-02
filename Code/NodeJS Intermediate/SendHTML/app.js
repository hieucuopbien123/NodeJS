const express = require("express");
const app = express();
const multer = require("multer");

// ## Các module quan trọng phía server

// # Dùng multer / Dùng multer lưu trong ổ đĩa bth
const storage = multer.diskStorage({ // diskStorage xđ store file ở local system như nào
    destination: (req, file, cb) => {
        cb(null, __dirname + "/uploads"); // Đường dẫn upload ảnh là nơi lưu ảnh
    },
    filename: (req, file, cb) => { 
        cb(null, Date.now() + "_" + file.originalname); // File cần lưu sẽ có tên là gì
    }
});
const upload = multer({
    storage: storage
});

// # Dùng express / Dùng middleware
app.use(express.static('./uploads')); // Khai báo static folder
app.set("views", "./viewsTest"); // Khai báo đường dẫn đến thư mục chứa các template
app.set("view engine", "pug"); // Khai báo templateEngine sử dụng
app.use(express.json()); // Cho phép parsing application/json
app.use(express.urlencoded({ extended: true })); // Cho phép parsing application/xwww

// Các middleware view engine / Dùng pug
app.get("/", (req, res) => {
    res.render("form");
    // Ta đã khởi tạo set thư mục viewsTest cho views nên nếu chạy render('form') => nó tìm engine views đã set
    // thì tìm trong thư mục view => tìm tiếp view engine thì thấy pug -> dùng pug render form.pug thành html và gửi
});

// Nếu k gửi ảnh nó tự bỏ qua middleware multer, k cần phải lo
app.post("/", upload.single("avatar"), (req, res) => {
    const { body, file } = req;
    console.log(file);
    res.render("info", { body, file });
});

app.listen(8080);

// Cơ chế chi tiết: truy cập vào gặp get -> render lên form là form.pug -> engine pug render thành html file gửi
// cho client -> client điền thông tin và gửi lại cho server -> server nhận đc 2 kiểu dữ liệu là file và data object
// kiểu file gặp middleware multer.single sẽ chạy vào trong -> lưu file đó vào server ở thư mục chỉ định và trả
// ra 1 object có trường filename, path, destination là thông tin file được lưu ở server, và có trường fieldname mang 
// giá trị truyền vào single và avatar -> còn data object gặp middleware express.urlencoded tách content thành biến 
// object body lưu vào req cho middleware tiếp theo -> middleware cuối có biến req lưu 2 trường body và file sẽ lấy 
// thông tin gửi vào file info.pug -> file info.pug lấy data xử lý ra trang html mới -> pug engine render thành html
// gửi cho client.