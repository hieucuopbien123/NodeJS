var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function (req, res) {    
    res.sendFile(__dirname + "/views/broadcast.html");
});

// Cơ chế 1 client gửi cho server, server gửi cho các clients
// Mỗi 1 client mới xuất hiện là 1 socket client mới đc tạo ra. socket trong function dưới và socket trong file html
// của client là 1 và mỗi client có 1 cái. Nó như là 1 eventEmitter bth và hàm emit sẽ chỉ có mình nó nhận được
// nhưng có 1 điều đặc biệt tất cả client bắt mọi sự kiện từ server. Socket của server là io
var clients = 0;
io.on("connection", function (socket) {
    clients++;
    socket.emit("new msg", {
        msg: `Hiện tại có ${clients} đang kết nối !!`
    });
    socket.broadcast.emit("new noti", { // Gửi cho tất cả client khác trừ người gửi
        msg: "Một người vừa mới tham gia ! "
    });
    socket.on("disconnect", function () { // Signal có sẵn là disconnect, thực hiện hàm này sau đó disconnect
        // Ta cho socket của chính client bắt sự kiện khi chinish nó disconnect thì nó sẽ gửi tới mọi socket khác trước
        // đã r mới tắt
        clients--;
        socket.broadcast.emit("new noti", {
            msg: "Một người vừa mới rời đi! "
        });
    });
});

http.listen(3000, function () {
    console.log("listening on *:3000");
});