var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/chat.html");
});

io.on("connection", function (socket) {
    socket.on('chat message', function (msg) {
        io.emit('chat message', msg);
    });
});
// => Quanh quẩn io.on/emit và socket.on/emit mà thôi.
// Mỗi client kết nối vào server sẽ có 1 cái socket đính vào nó và socket đó chính là đối số của hàm là đối số 2.
// Ở client ta chỉ có thể cho socket on or emit cái gì. Ở server ta dùng io để on/emit cho client bắt và socket của 
// từng client để bắt chính cái socket client đó phát ra. Tức là bên cạnh io thì socket của callback chính là 
// socket của riêng 1 cái client gửi đến. Bên trên socket là ta tương tác với 1 client đó mà thôi

// Tức là phía client có thể điều khiển socket của client, phát ra thì chỉ có socket client đó ở server bắt đc.
// Phía server dùng cả socket của mọi client và 1 socket server. Server phát, mọi client đều bắt nhưng server phát thì 
// chỉ phát sự kiện thuộc về server mà thôi(hình như là bị hạn chế thôi)
// Client của server phát thì chỉ client socket ở phía client bắt đc
// Client của server broadcast thì cũng như server phát nhưng k phát cho client hiện tại mà thôi

http.listen(3000, function () {
    console.log("listening on *:3000");
});