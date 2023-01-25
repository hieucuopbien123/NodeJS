// # Dùng multer / Dùng multer lưu trong ổ đĩa bth

var express = require('express');
var multer = require('multer');
var app = express();

// diskStorage xác định nơi lưu file vào đĩa. Ta phải set 1 object có destination là hàm số có req, file, cb với req là
// request gửi tới. file là object lưu thông tin về ảnh. cb là 1 thứ mà multer cung cấp nhận vào 1 là error, 2 là 
// url trên ổ đĩa xác định để lưu ảnh vào
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log(file);
        cb(null, __dirname + "/uploads"); // Đường dẫn upload ảnh
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "_" +  file.originalname); // File lúc này sẽ được lưu vào vùng nhớ tạm thời
    }
});
const upload = multer({ storage: storage });
// Sau khi xác định tên file và đường dẫn thì ta phải sử dụng nó với multer như này, thành 1 biến lưu thông tin vc upload

// # Dùng express / Dùng middleware của expressjs
app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.json()); // parsing application/json
app.use(express.urlencoded({ // parsing application/xwww-form-urlencoded
    extended: true
}));
app.use(express.static('./uploads')); // Khai báo static folder, chứa css và ảnh

// app.use(upload.array()); // parsing multipart/form-data => k cần dùng cái này

app.get("/", (req, res) => {
    res.render("form"); // Tìm trong ./views
});

// Dùng .array() => lấy files từ req được 1 mảng 
// Nếu ta send("<mã HTML>") sẽ bất tiện khi mã HTML dài -> cải tiến ta nhét vào file và dùng sendFile("<link tuyệt đối
// tới file HTML>") -> nhưng link tuyệt đối sẽ khó cho vc bảo trì và nâng cấp => dùng các loại viewengine như pug 
// Middleware express.static k giúp ích trong send. Thực tế dùng __dirname cũng được nhưng nên dùng viewengine với web SSR
app.post("/", upload.array("avatar", 2), (req, res) => { // Bắt form trường có field name là avatar, max là 2 file
    const { body, files } = req;
    console.log(files);
    res.render("info", { body, files }); // render ra cái info.pug với tham số truyền vào pug là body và files. Truyền 
    // cả mảng files vào thì bên trong pug lấy được files[1] như bth
});
// Để dùng từ frontend chỉ cần tạo form POST vào "/" với enctype="multipart/form-data" và bên trong form có trường 
// input là type="file", name="avatar"

// Còn có hàm single trả ra 1 middleware xử lý 1 single file theo cái form cho trước, truyền vào tên trường có file
// hàm array truyền vào tên file và số lượng max trả ra 1 middleware xử lý multiple file cùng tên các trường
// Ví dụ cho 1 cái choose file nhưng multiple files thì phải dùng array

app.listen(3000);

// Cơ chế: client gửi cho server các object thì nó lưu trong body như 1 object. 
// client gửi cho server 1 file trong 1 form thì nó sẽ trả ra 1 object file lưu các thứ như originalname là tên ban
// đầu và fieldname là thuộc tính name của thẻ input trong form. Khi gửi 1 file tức là post vào "/" thì chạy hàm 
// middleware đầu tiên nhưng lúc đó nó sẽ tạo cái storage là nơi lưu và tên file lưu(có thể thao tác với file và req 
// trong hàm đó) và cài nó vào biến upload qua hàm multer sẽ lưu cái file kia vào storage đã xđ r sau đó chạy hàm 
// middleware thứ 2 là render lên màn hình. Sau đó pass vào trường files trong req dùng cho middleware tiếp theo.
// multer ở TH này nó chỉ giúp ta lưu cái file post bằng form vào trong thư mục uploads mà thôi. Tất cả chỉ có thế
// => POST 1 file bất kỳ -> copy file đó lưu vào 1 đường dẫn khác -> đọc file ra từ đường dẫn khác đó để hiển thị.
// Tức là biến req.files là lấy dât file lưu trong ổ đĩa rồi.

// => K dùng được với file gif