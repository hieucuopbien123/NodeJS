const https = require('https');
const express = require('express');
const fs = require('fs');
const path = require("path");
const PORT = 3443;
const app = express();

// Bảo mật server nodejs / # 1 số phương pháp bảo mật thông dụng
// Cản CSRF
var cookieParser = require('cookie-parser')
var csrf = require('csurf')
var csrfProtection = csrf({ cookie: true })
app.use(cookieParser()) // we need this because "cookie" is true in csrfProtection
app.get('/form', csrfProtection, function (req, res) { // Dùng nó như 1 middleware. Middleware này khiến req óc hàm csrfToken
    res.render('send', { csrfToken: req.csrfToken() });
})
app.post('/process', csrfProtection, function (req, res) {
    res.send('data is being processed');
})
{/* Ở trong view send ta dùng token csrf gửi kèm ẩn đi. Cái csrfToken gửi đi thực chất là nhận được từ router get
bên trên khi được send cái { csrfToken: req.csrfToken() } => kiểm chứng post có đúng header này mới được
<form action="/process" method="POST">
    <input type="hidden" name="_csrf" value="{{csrfToken}}">
    Favorite color: <input type="text" name="favoriteColor">
    <button type="submit">Submit</button>
</form> 
*/}

// Các kiểu khác / xss-filter
const xssFilters = require('xss-filters');
// console.log(xssFilters("&lt;"));
app.get('/', (req, res) => {
    let firstname = req.query.firstname; // an untrusted input
    res.send('<h1> Hello, '
        + xssFilters.inHTMLData(firstname) // xss-filters chuyển tât cả về code bth, cx dùng chống xss
        + '!</h1>');
});
app.listen(3000);

// Mã hóa dữ liệu truyền giữa máy khách và máy chủ với TLS, SSL
app.use("/", (req,res) => {
    res.send("Hello");
})
https.createServer({
    key: fs.readFileSync(path.join(__dirname + '/key.pem')),
    cert: fs.readFileSync(path.join(__dirname + '/cert.pem')),
    passphrase: "hieucuopbien123"
}, app).listen(PORT, () => {console.log("Hello")});

// redirect nếu người dùng vào http sẽ sang https
// if (NODE_ENV === 'production') {
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});
