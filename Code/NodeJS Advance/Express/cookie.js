// # Các package khác liên quan tới server / cookie-parser

const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
app.use(cookieParser({
    "Name": "Hieu"
}));
// cookieParser(secret, options); dùng signed cookie thì có 1 là array or object và cái đó dùng để unsign cookie về sau
// 2 là options object thêm vào cookieParse. 1 là secret để sign cookie

// # Dùng express: tạo server backend / Tự setup header thuần với express
app.get('/cookie', function (req, res) {
    res.cookie('name', 'freetuts.net', {
        expires: new Date(Date.now() + 900000)
    });
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('authorNe', 'thehalfheart@gmail.com'); // Gửi thêm thông tin k cần thiết vào header đc
    res.setHeader('blog', 'freetuts.netsadfafkfjs');
    res.send("success");
    // res.redirect(404, "/getCookie"); // thích mã nào thì chơi, nếu 302 là found mặc định. 404 notfound cx đc
    // nhưng trang web sẽ hiện hỏi có muốn chuyển sang getCookie k
    // 1) Mỗi khi send to client là 1 lần nó setHeader. Thông thường các kiểu data thông thường nó tự setHeader rồi
    // nên ta chỉ cần gửi thôi. Cho nên kiểu dữ liệu gửi đi phải là cùng 1 kiểu, k thể gửi vừa html vừa string được.
    // Nhiều TH nó bắt ta phải setHeader nếu k có sẽ lỗi cơ. Cho nên ta nên tự setHeader để nhơ
    // 2) Hàm write và send khác gì nhau: send là send cả cục dữ liệu, write là write vào từng chunk nối tiếp nhau và
    // write bị giới hạn chỉ đc dùng kiểu string or buffer, dùng write buộc phải có res.end() để báo hiệu kết thúc
    // 3) Khi đã setHeader để gửi đi, k đc set 1 header khác gửi đi tiếp. Tức là client gửi 1 request, server cx chỉ trả
    // về 1 response 1 lần duy nhất.
    // 4) Hàm redirect sẽ chuyển hướng gửi 1 request get tới url nào. Nhưng vc chuyển hướng đồng nghĩa với vc thực hiện
    // 1 request mới. Nên nhớ mỗi request đều có 1 response và mỗi request và response đều có 1 header. Lần request
    // đầu tiên trả ra response có header là text/html là mặc định(thực tế attribute này của header đúng với nhiều 
    // kiểu dữ liệu ta gửi đi, gửi string bth cx là text/html bởi vì (đã biết) nó tạo trang html và ghi dòng này vào
    // body để browser dịch ra). Bởi vì hàm redirect làm 2 nhiệm vụ: gửi trả 1 response k có dữ liệu gì cho request đầu
    // tiên của client với mã lỗi 302(Found! là mặc định(có thể chỉnh sửa)), sau đó gửi 1 request get tới url tiếp theo
    // Ở TH này dùng content-type html or plain đều như nhau
    // 5) Quy tắc: k thể setHeader sau khi đã gửi cho client. Ở ví dụ này, chăng hạn ta gọi send sau đó gọi redirect.
    // đầu tiên send là đã setHeader xong r gửi cho client 1 response r. Sau đó gọi redirect nó sẽ lại set 1 header khác
    // để tạo ra 1 response khác để gửi tiếp nhưng 1 request chỉ có 1 response thôi, ở đây là 2 response sẽ lỗi
});
// res.cookie(name, value, [options]) với options là 1 object có domain(string domain của cookie), encode(function), 
// expires(date thời gian cookie hết hạn, k set or bằng 0 thì nó tạo ra session cookie tồn tại tạm thời trong bộ nhớ và
// tự xóa khi hết phiên đăng nhập), httpOnly(bool đánh dấu cookie chỉ có thể truy cập được ở máy chủ web-bảo mật), maxAge
// (number thời gian cookie hết hạn so với thời điểm đặt tính bằng ms), path(string mặc định là "/"), secure(bool) đánh
// dấu cookie chỉ dùng được ở https, signed(bool) đánh dấu cookie nên được signed, sameSite(bool/string) gt sameSite của
// thuộc tính set cookie

// # Các package khác liên quan tới server / cookie-parser
app.get('/getCookie', function (req, res) {
    if (req.cookies.name)
        res.send(`Cookie name co gia tri la ${req.cookies.name}`)
    else res.send('Khong the tim lay cookie co ten la name')
});

app.get('/deleteCookie', function (req, res) {
    res.clearCookie('name'); // 1 là tên cookie, 2 là options
    res.send('Da xoa cookie')
});

app.listen(3000);