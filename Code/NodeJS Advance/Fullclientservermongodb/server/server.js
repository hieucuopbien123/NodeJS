const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config({ path: "./config.env" });
// default của dotenv là: path.resolve(process.cwd(), '.env') nhưng ta có thể tùy chỉnh tên file cũng như đườn dẫn thoải mái

const port = process.env.PORT || 8088;
app.use(cors());
app.use(express.json());
app.use(require("./routes/record")); // Middleware có thể là 1 thư mục bth

// Thao tác với database tách ra thư mục riêng cho rõ
const dbo = require("./db/conn");

app.listen(port, () => {
    dbo.connectToServer(function (err) { // Server start là tạo connection luôn
        if (err) console.error(err);
    });
    console.log(`Server is running on port: ${port}`);
});