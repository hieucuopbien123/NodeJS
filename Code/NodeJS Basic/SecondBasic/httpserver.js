// # Các package có sẵn trong NodeJS / Dùng http => phức tạp k dùng / querystring đã deprecated
// SSR

const http = require("http");
const qs = require('querystring');

http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    // Nếu người dùng tới trang web lần đầu nó sẽ gửi giao thức GET -> ta cho người dùng nhập thông tin form
    // khi ng dùng post thì ta hiển thị cái khác ra thay thế cho cái form 
    if (req.url === '/' && req.method === 'GET') {
        const formHTML = `
            <form method="POST" action="/">
                <input type="text" name="fullName" placeholder="Full Name"> 
                <input type="number" name="age" placeholder="Age"> 
                <button type="submit">Send</button>
            </form>
            ` 
        res.write(formHTML); // Server gửi html cho client. Nó tự tạo body và thêm phần html này vào
        res.end();
    }

    if (req.url === '/' && req.method === 'POST') {
        let body = "";
        req.on("data", function(data) {
            body += data; // Dùng event để đọc dữ liệu kiểu stream khi request có 1 lượng lớn data
        });
        req.on("end", function() {
            let postData = qs.parse(body);
            console.log(postData);
            res.write(`Full Name: ${postData.fullName} <br>
                Age: ${postData.age}`); // Chỉ gửi được string đi, nếu kp là html mà chỉ muốn gửi 1 dữ liệu object(dạng
                // string) thì client phải xử lý điều đó
            res.end();
        });
        // Để mô phỏng nhanh ta chỉ cần cho post là đọc, đọc xong gửi lại luôn
        // Nó post dữ liệu vào đúng url vì ta viết method và action trong thẻ form rồi. SSR k cần frontend riêng.
        // Form đo gửi cho server 1 request dưới dạng object có các attribute là attribute name của các thẻ input
    }
}).listen(3002);

// Server này k áp dụng thực tế vì code phức tạp, server thô sơ đơn giản, hàm write sẽ ghi lại từ đầu dẫn đến mất các 
// thứ khác của web => thật ra ta ghi vào data khác r cho client lấy là đc, đây kp là vấn đề. Chỉ có điều ta chỉ có thể
// gửi data ở dạng string đi nên client k có file html chạy js xử lý điều đó thì sẽ lỗi k hiển thị, thực tế để có file
// JS ta chỉ cần cho query đến file JS tiếp tại url server này và script tới nó là được