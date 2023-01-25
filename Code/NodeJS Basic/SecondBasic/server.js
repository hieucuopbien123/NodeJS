// # Các package có sẵn trong NodeJS / Dùng http => phức tạp k dùng

var http = require("http");
var fs = require("fs");

var server = http.createServer(function (request, response) {
    // Biến request: là biến lưu trữ thông tin gửi lên của client
    // Biến response: là biến lưu trữ các thông tin trả về cho client
    // Hàm createServer tạo ra 1 server xử lý mọi request của client
    
    if (request.url == '/about.html') {
        // Thiết lập Header
        response.writeHead(200, {
            "Context-type": "text/html"
        });
        fs.createReadStream('./about.html').pipe(response);
    }
    // Bh ta mới hiểu khi GET thì req là stream rỗng, res là writeStream write thẳng vào client. Là stream thì cx là
    // event. Tức ta có thể dùng pipe của stream để ghi file html vào trong response. Browser nó tự hiểu, gửi 1 phần 
    // html thì nó tự tạo ra cấu trúc trang html và thêm vào body, còn gửi cả file html đầy đủ thì nó tự chỉ hiển thị 
    // file đó còn khi post thì req là read stream đọc từ request của client, res vẫn là writeStream ghi vào client 

    else {
        response.setHeader('Context-type', 'text/plain'); // setHeader và writeHead tương tự nhau và writeHead sẽ đè lên 
        // setHeader nếu trùng. Và 2 hàm này phải đặt trước write và end vì header phải set đầu tiên ở trước content
        response.setHeader('author', 'thehalfheart@gmail.com');
        response.setHeader('blog', 'freetuts.netsadfafkfjs'); // bị đè
        // Thiết lập Header
        response.writeHead(404, {
            "blog": "freetuts.net" // Mấy cái thêm vao sau k thấy xuất hiện
        });
        // writeHead(statusCode, headerObject); => có các loại status code là 100 Continue/101 Switching Protocols
        // 2xx Success/200 Ok/201 Created/404 Not Found
        response.write('404 Not Found ' + request.url);
        response.end();
    }
});

server.listen(3000, function () {
    console.log('Connected Successfull!');
});