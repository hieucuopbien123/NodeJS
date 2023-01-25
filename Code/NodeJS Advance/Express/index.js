var express = require('express');
var app = express();
app.get('/', function (req, res) {
    res.send("Hello world!");
});
app.post('/hello', function (req, res) {
    res.send("Ban vua gui yeu cau bang phuong thuc POST toi dia chi /hello");
});

// # Dùng express 
// Middleware có thể là router
var userRouters = require('./userRouter');
app.use('/user', userRouters); // Gán 1 hàm middleware vào 1 path nào đó or gán 1 middleware function(khi k có path)
// middleware ở đây có thể là 1 function callback or 1 file js. Middleware này sẽ là trung gian thực hiện sau khi có
// use gửi tới và trước khi chạy các hàm xử lý nó của server, nó sẽ chạy vào hàm use trước get/post/..

// Dùng middleware tĩnh và middleware động
app.get('/admin', function (req, res) { // Tĩnh
    res.send('Admin Page');
});

// Dùng đủ loại pattern trong middleware động
// route params
app.get('/users/:userId/books/:bookId', function (req, res) { // VD: http://localhost:3000/users/34/books/8989
    res.send(req.params)
})
// regexp mạnh vô
app.get('/things/:id([0-9]{5})', function (req, res) { 
    res.send('id: ' + req.params.id); // Nó là 1 object lưu các tham số trên url
});
// pattern match
app.get('/ab?cd', function (req, res) { // acd, abcd
    res.send('ab?cd')
})
app.get('/ab+cd', function (req, res) { // abcd, abbcd,..
    res.send('ab+cd')
})
app.get('/ab*cd', function (req, res) { // ab<string bất kỳ>cd
    res.send('ab*cd')
})
app.get('/ab(cd)?e', function (req, res) { // abe, abcde
    res.send('ab(cd)?e') // Nhét vào () thì là cả 1 cụm coi như 1 từ r
})

// regexp
app.get(/a/, function (req, res) { // Chỉ match mỗi a
    res.send('/a/')
})
app.get('/phonenumbers/((09|03|07|08|05)+([0-9]{8}))', function (req, res) {
    res.send(req.params); // Object là các cụm () của regexp
});

app.listen(3000);