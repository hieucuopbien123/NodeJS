// # Dùng nodemon
// # Dùng socketio

var app = require('express')();
var http = require('http').createServer(app); // Khởi tạo server http nhanh
var io = require('socket.io')(http); // Phải nối cả 3 cái như này để dùng socketio

app.get('/', function (req, res) { // Dùng app bth chỉ là dùng thêm socketio qua on thôi
    res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.emit("information", { name: "Nguyen Van A", age: 19 });
}); // Tham số của function là cái socket của client phát ra signal cho chính nó ở phía client bắt
// Khi này, bất cứ khi nào có connection client vào thì server sẽ chạy hàm console bên trên, có thể có vô số client
// Gọi emit phát ra event tên là information và socket client sẽ bắt và nhận về data là object trên

http.listen(3000, function () {
    console.log('listening on port 3000');
});
// Bh mọi thay đổi trên server sẽ tự reload server nhờ vào nodemon mà kp tự tay reload