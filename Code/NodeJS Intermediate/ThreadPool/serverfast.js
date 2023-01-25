//txt file Test
const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");

app.use(helmet());
app.use(morgan('combined'));

app.get("/",(req,res) => {
    res.send("ok");
})

app.listen(5000, () => {
    console.log('Server is running at port 5000');
})
//hiện tại ứng dụng của ta chạy 1 process, nếu dùng pm2 chạy 4 cluster tức 4 process thì tốc độ sẽ nhanh hơn nhiều x2
//pm2 start serverfast.js -i 4
//Chú ý thread và process khác nhau, ở đây ta đang chia ra nhiều process hơn
//máy của ta có mỗi 2 core nên vc mở 4 hay 3 hay 2 thì tốc độ vẫn như mở 2 thôi