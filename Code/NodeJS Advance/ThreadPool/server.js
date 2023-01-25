const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
require('dotenv').config();

// # Các package có sẵn trong NodeJS / Dùng os
// Thêm 2 dòng dưới là hiệu suất của app tăng vì nó dùng tối đa số thread có thể dùng trong máy. Nếu máy có 4 threads mà ta dùng nhiều hơn 
// thì cx k nhanh hơn, nếu máy nhiều tác vụ nặng mà dùng hết số threads thì có thể cx k khá hơn, thg thì họ có server chuyên dụng cho vc này
// k chạy tác vụ cá nhân gì khác
// const os = require("os");
// process.env.UV_THREADPOOL_SIZE = os.cpus().length; // cách set giá trị biến môi trường

// # Các package backend NodeJS thường dùng / Dùng bcrypt
// Dùng bcrypt sẽ làm nặng tác vụ của server
app.get("/", async (req,res) => {
    // Đối số 2 là number of rounds mà salt được sinh ra dựa vào nó, càng lớn càng khó. VD cho 30 thì gần như server 
    // crash luôn vì mã hóa là công việc quá nặng
    const hasPassword = await bcrypt.hash("This is a password", 10);
    res.send(hasPassword);
})

app.listen(process.env.PORT | 5000, () => {
    console.log('Server is running at port 5000');
})

// Dùng tool / # Dùng apache benchmark
// Tạo request với apache benchmark: ab -n 200 -c 100 http://localhost:5000/

// Nếu mặc định thì nodejs dùng thread số lượng 4, cụ thể sẽ thấy tầm 50 request được thực hiện trong 1s
// vói dòng máy quad core. VD dòng máy dual core là 2 core, mỗi core dùng được 2 thread là max 4 thread thì dòng
// quad core có 4 core nên chạy được max 8 thread. Do máy ta là máy 4 thread nên vc chỉnh sửa ở đây k tạo ra sự khác
// biệt nhưng dòng máy quad core có thể lên nhanh lên tới 80 request 1s, còn của ta xấp xỉ 30/s
// Ta có thể điều chỉnh bằng cách thêm vào file .env: UV_THREADPOOL_SIZE=bao nhiêu
// Set the number of threads used in libuv's threadpool to size threads.
// Khi hệ thống chạy nó tự tìm trong biến môi trường có UV_THREADPOOL_SIZE là bnh để chạy, nếu ta k set tự lấy 4 thôi