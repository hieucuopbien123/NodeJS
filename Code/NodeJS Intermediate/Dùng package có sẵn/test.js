// # Các package có sẵn trong NodeJS / Dùng url / Dùng http

var http = require('http');
var dt = require('./server');

var url = require('url');
// url trước cx dùng xử lý 1 url bth nhưng có thể dùng nó lấy data từ query như dưới. Query server nhận 
// được nó phức tạp lắm éo phải 1 dòng text url

http.createServer(function (req, res) {
    // Tự set header
    res.writeHead(200, {'Content-Type': 'text/html'});

    // Cách lấy data query ez nhất
    var q = url.parse(req.url, true).query; // true là chơi parse query string thành object.
    var txt = q.name + " live in " + q.address + ". Now is " + dt.myDateTime();

    res.end(txt);
}).listen(8080);

// VD vào: http://localhost:8080/?name=tam&address=DN