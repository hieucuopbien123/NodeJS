// # Các package có sẵn trong NodeJS 

// Dùng events / Thao tác với stream

// Readable Stream đọc từ file
const fs = require("fs");
let data = '';
const readerStream = fs.createReadStream('input.txt'); // Đọc file bằng streams với createReadStream
readerStream.setEncoding('UTF8'); // Mặc định mã hóa dùng trong file cũng là UTF8, có thể set nhiều thuộc tính khác
readerStream.on('data', function(chunk) { // Sự kiện khi đọc data, nhận vào từng chunk
    console.log("HELELO");
    data += chunk;
    // Cứ được 1 phần dữ liệu thì xử lý xong lại xử lý tiếp, nó tự tách ra 1 cách tự động từng chunk 1 như v
    // thích hợp cho vc đọc file lớn vài GB
});
readerStream.on('end',function(){ // Khi kết thúc đọc data thì in ra
    console.log(data) // chỉ dùng được content biến data này trong stream
});
readerStream.on('error', function(err){ // Khi xảy ra lỗi in ra lỗi
    console.log(err.stack);
});

// Writeable stream
const writtenData = "This is text to write";
const writerStream = fs.createWriteStream('output.txt');
writerStream.write(writtenData);
writerStream.end(); // đánh dấu đây là cuối file, tức viết thêm vào ký tự EOF và k thể viết thêm vào sau, k có vẫn đc.
writerStream.on('finish', function() {
    console.log("Write done.");
});
writerStream.on('error', function(err){
    console.log(err.stack);
});
// Nếu ta cứ đọc và ghi file như v thì file lớn mấy cx đọc được

// Piping chuyển dữ liệu giữa các stream
let writerStream1 = fs.createWriteStream('output1.txt');
readerStream.pipe(writerStream1);//đầu ra của readerStream làm giá trị đầu vào của writerStream
//lúc tạo stream thì nó đã tự có dữ liệu r, stream đọc sẽ tự đọc, stream ghi khi có dữ liệu sẽ tự ghi
//tức là ở trên gán stream đọc phát là nó đọc mọi thứ vào stream luôn, nhưng ta bắt signal data khi đọc nó phát ra để
//lưu vào biến và in ra mà thôi. Signal 1 lần duy nhất lúc đọc dữ liệu ban đầu

// Dùng zlib
const zlib = require('zlib'); // Sử dụng thư viện zlib dùng để nén file, có sẵn trong nodejs
const gzip = zlib.createGzip(); // Phương thức có nhiệm vụ nén file, nó là 1 stream
const writeStream1 = fs.createWriteStream('output.zip');
readerStream.pipe(gzip).pipe(writeStream1); // Piping chaining kết nối đầu ra của các stream lại với nhau
// Đặt tên file zip sẽ ảnh hưởng kết quả khi giải nén. Đặt là output.txt.gz giải nén sẽ ra output.txt nhưng đặt là
// output.zip thì giải nén chỉ ra output thôi
// pipe cái readstream vào cái gzip là 1 stream lưu dữ liệu gzip nén, lại pipe lưu dữ liệu của nó cho 1 stream write
// ghi vào file
// => Nó như 1 cách khác để gán dữ liệu vào 1 stream

const http = require("http");
http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    // Header chứa thông tin về client và server như thông tin trình duyệt, ngày tháng, kiểu dữ liệu,..
    res.write("Hello World !\n"); // Stream viết data vào
    res.write(req.url); // req lưu thông tin của người dùng gửi đến. 
    // VD truy vấn đến http://127.0.0.1:3001/nodejs thì url lưu /nodejs
    res.end(); // Kết thúc, như end của cái write đó
}).listen(3001);

// ## Các module quan trọng phía server / # Dùng dotenv
console.log(process.env);
const myEnv = require('dotenv').config();
console.log(process.env.DB_USERNAME, process.env.DB_PWD);
console.log('Port sử  dụng là ' + process.env.PORT);

// Khi sử dụng dotenv-expand, ta có thể có thêm cách dùng với file .env như dùng biến trong file với $ => tức là các 
// biến trong file .env có thể tái sử dụng giá trị biến có sẵn, kể cả các thứ có sẵn trong process.env của hệ thông
console.log("1: " + process.env); // DB_PASS sai
require('dotenv-expand').expand(myEnv);
console.log("2: " + process.env); // DB_PASS thành đúng

// Dùng dotenv-expand
// Tái sử dụng bằng biến môi trường tự khai báo trong file JS dạng object 
// Thêm biến môi trường dạng object vào biến MT global process.env 
const dotenv = {
    parsed: {
        BASIC: 'basic',
        BASIC_EXPAND: '${BASIC}',
        BASIC_EXPAND_SIMPLE: '$BASIC' // thế nào cũng được
    }
};
const obj = require('dotenv-expand').expand(dotenv); // Tự thêm vào process.env luôn
console.log(obj);
console.log(process.env);

// Hoặc ta chỉ muốn tái sử dụng trong phạm vi object local mà k thêm vào biến MT ok
const dotenv2 = {
    ignoreProcessEnv: true, // chặn thêm vào process.env global
    parsed: {
        SHOULD_NOT_EXIST: 'testing'
    }
}
const obj2 = require('dotenv-expand').expand(dotenv2).parsed
console.log(obj2.SHOULD_NOT_EXIST) // testing
console.log(process.env.SHOULD_NOT_EXIST) // undefined