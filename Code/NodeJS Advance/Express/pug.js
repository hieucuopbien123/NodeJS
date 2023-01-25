// ## Các module quan trọng phía server / Dùng nodemon
// # Dùng express / Dùng middleware / Các middleware view engine

const express = require('express')
const app = express()
const useRoute = require("./routes/user")

// Các bức ảnh trong web nó k hiển thị dù đường link ta dùng là đúng là vì express nó hiểu đường link của ta là 1 router
// bình thường chứ kp là 1 tập tin tĩnh mà ta k hề định nghĩa router cho nó
// Trong NodeJS để hiện thị các tập tin tĩnh như ảnh, word, excel, pdf,.. để ng dùng tải về chẩng hạn thì ta phải thêm
// middleware cho phép nhận static file trong dự án ở 1 thư mục cố định và ta phải gom tất cả tập tin tĩnh lưu trong thư
// mục đó như dưới => khi đó link tới static file ta phải dẫn từ bên trong thư mục assets đổ đi
app.use(express.static("assets")); // hàm này gọi nhiều lần với dể định nghĩa nhiều thư mục chứu static file trong dự án
// Trong expressJS ta chỉ dẫn đường link hoặc là router, hoặc là static nhé và ta phải định nghĩa 2 cái đó khi dùng

// Khai báo đường dẫn đến thư mục chứa các template
app.set('views', './views')
// Khai báo templateEngine sử dụng
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('index')
})
app.get('/layout', (req, res) => {
    res.render('inheritLayout')
})

// Để tránh quá nhiều dòng code, trong 1 file server như này ta nên tách ra nh file js r export nó
app.use("/users", useRoute);
// Muốn tạo tính năng thêm user thì tạo 1 trang post, nhưng để user truy cập được vào trang post đó thì ta lại phải get
// đến nó đã. Muốn post thì phải dùng đến req.body, phải thêm 2 middleware nx như dưới
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 

app.listen(8888)