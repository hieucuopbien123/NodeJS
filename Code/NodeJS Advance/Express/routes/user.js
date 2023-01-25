// # Dùng express 

// Dùng middleware / Middleware có thể là router / Dùng đúng mô hình MVC
const express = require('express')
const user_router = express.Router()
// Ta k dùng chung: const app = express(); như trc nx vì express cung cho ta phương thức Router() để tạo 
// mới 1 router. File này lưu 1 router như 1 middleware mà file chính có thể dùng nó cho 1 middleware nào đó

const user_controller = require("../controllers/user");
// Tuân theo mô hình MVC thì ta nên tách controller ra riêng để clean code, ta dùng dạng object

user_router.get("/", user_controller.index)
user_router.get('/create', user_controller.getCreate)
user_router.post('/create', user_controller.postCreate)

// Xây dựng tính năng tìm kiếm user: Khi ta search trong input ra giá trị bất kỳ, nó sẽ gửi 1 request tới server và tiến 
// hành chuyển trang -> request nó gửi tới có thể xem trong tab network là gửi search?<key>=<value> tới link 
// http://localhost:8888/users và req.query mà server nhận được là object {<key>: value} => ta chỉ cần search trong list
// các user có key trùng với key của req và gửi lại cho client mà thôi
user_router.get('/search', user_controller.search)

// Dùng middleware tĩnh và middleware động
// Do user có thể chứa rất nhiều trường thông tin nên ta k thể in tất cả 1 lúc mà sẽ hiển thị link tên gửi get tới 
// từng user và ở đây ta tạo ra mỗi trang riêng với từng user với path: http://localhost/8888/users/<số>
// nhưng ta k thể tạo 100 app.get tương ứng với 100 user được nên express có Router params với dấu :id như dưới
user_router.get('/:id', user_controller.getId)

module.exports = user_router;