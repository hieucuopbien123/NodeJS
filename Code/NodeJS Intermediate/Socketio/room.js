var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/views/room.html");
});

// Tức bình thường io ta dùng là namespace mặc định "/"
var freetuts = io.of("/freetuts"); // Khởi tạo namespace tên "/freetuts"

freetuts.on("connection", function (socket) { // Có người kết nối vào namespace đó
    console.log("Một người vừa kết nối.");
    socket.on("join room", function (data) {
        socket.join("freetutsRoom"); // Hàm join(tên phòng) sẽ join vào 1 phòng

        // Trả lại thông báo cho người vào phòng
        socket.emit("notification", "Bạn đã tham gia vào phòng");

        // Trả lại thông báocho tất cả người còn lại trong phòng
        freetuts.to("freetutsRoom").emit("notification", "Một người đã vào phòng.");
        // Trong 1 room thì lệnh emit chỉ có tác dụng với người đó còn gửi đến cả room thì dùng <namespace>.to(tên room).emit(...)
    });

    socket.on("leave room", function (data) {
        socket.leave("freetutsRoom"); // Hàm rời phòng
        // Trả lại thông báo cho người vào phòng
        socket.emit("notification", "Bạn đã rời phòng");
        // Trả lại thông báo cho tất cả người trong phòng
        freetuts.to("freetutsRoom").emit("notification", "Một người đã rời phòng.");
    });
});

// Nó hỗ trợ dùng nhiều namespace và trong namespace có nhiều phòng đc

http.listen(3000, function () {
    console.log("listening on *:3000");
});