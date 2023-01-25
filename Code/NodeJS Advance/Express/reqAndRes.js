// # Dùng express / Dùng req và res => tổng hợp

var express = require('express');
var app = express();

app.use(express.urlencoded({
    extended: true
}));

// Dùng cURL
// VD: curl -d "username='admin&password=1234" -X POST "http://localhost:3000/user/123?userID=123&action=changeProfile" 
app.post('/user/:userid', (req, res) => {
    console.log(req.params.userid) // "123"
    console.log(req.query.userID) // "123"
    console.log(req.query.action) // "changeProfile"
    console.log(req.body.username); //admin
    console.log(req.body.password); //1234
    console.log(req.protocol)
    console.log(req.hostname)
    console.log(req.path)
    console.log(req.originalUrl)
    console.log(req.subdomains)
    // subdomain là tên miền phụ. Ví dụ: mysite.com là tên miền của 1 website chính, nhưng ta muốn tạo 1 web forum cho
    // web đó thì mua 1 tên miền mới sẽ tốn chi phí, thay vì v ta tạo ra forum.mysite.com thì vừa có sự liên kết mà k 
    // mất thêm tiền. Khi đó forum là subdomain, VD www.google.com thì www là subdomain. Có thể có 2,3 subdomain cx đc
    console.log(req.header('Content-Type')) // Lấy các thông tin header gửi đi
    console.log(req.header('Content-Length')) // Đây là các thông tin phổ biến tự có
    console.log(req.header('user-agent')) // User sử dụng cái gì để gửi đi, VD curl
    console.log(req.header('Authorization'))
    // Lấy cookie gửi đến server nếu trang web này đã truy cập server từ trước và ở lần trước đó file html server gửi đi
    // có chứa cookie lưu vào máy của client rồi thì bh ta lấy đc cookie đó để thao tác tùy ý
    console.log(req.cookies); // K có cookie thì undefined thôi
})

app.get("/", function (req, res) {
    // res.send({ web: ['freetuts', '.net', 'laptrinh'] }) // Gửi object sẽ tự động chuyển về dạng json
    res.send('<h1>Freetuts</h1>') // Trả về html
    // res.send('normal text') // Trả về text thông thường
})

app.get("/testjson", function (req, res) {
    res.status(302); // Tự bịa ra status luôn, nhớ là các cái này phải set trước khi gửi vì gửi phát là k có thao tác 
    // gì gửi cho client nx; 1xx:data; 2xx:success; 3xx:chuyển hướng; 4xx: lỗi client; 5xx: lỗi server
    res.json({
        web: ['freetuts', '.net', 'laptrinh']
    })
    // Hàm json y như send nhưng nhưng chỉ với kiểu dữ liệu json
})

app.get("/redirect", function (req, res) {
    res.redirect('/'); // Có thể dùng cụ thể http://localhost:3000/
    res.end()
})

app.listen(3000);