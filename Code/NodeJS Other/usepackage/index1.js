const express = require("express");
const app = express();

// # Các package khác liên quan tới server / morgan
// # Dùng compression
// # Các package backend NodeJS thường dùng / Dùng clear

const morgan = require("morgan");
const compression = require("compression");

var clear = require('clear');

// Compression là 1 middleware nén data trước khi server gửi cho client. Level càng lớn thì compress càng mạnh nhưng nếu lớn quá thì server sẽ phải xử lý nhiều và chậm hơn. Khuyến nghị để mức 6. 
// Threshold với đơn vị là byte VD như ở dưới data phải lớn hơn 100kB thì mới thực hiện nén
// Filter là điều kiện khi nào thì nén. ở đây ta check nếu request của client ở phần header k có cái option x-no-compress thì mới nén. VD ta có thể gửi 1 request có header này thì dù két quả lớn hơn 100KB thì server vẫn sẽ k nén
// Những thứ khác đi kèm như pageHook là cái éo gì nó vẫn k nén
// Để mặc định thì nó sẽ nén với mọi url
app.use(compression({
    level: 6,
    threshold: 100 *1000,
    filter: (req, res) => {
        if(req.headers['x-no-compress']){
            return false;
        }
        return compression.filter(req, res);
    }
}))

app.use(
    morgan(
        ":method :url :status :response-time ms"
    )
)

app.get("/", function(req, res) {
    clear();
    setTimeout(function() {
        res.send("hello, world!".repeat(10000)); // Cho lớn để package compression nén
    }, 1000)
})
app.listen(8080);

// Lần đầu tiên load bh nó cũng request favicon.ico và k có thì sẽ 404, nó là biểu tượng của website
// VD ở trên response-time sẽ cho ra ít nhất hơn 1000ms vì dùng setTimeout