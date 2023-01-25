// # Các package có sẵn trong NodeJS / Dùng http

// # Xử lý upload file / Dùng formidable / Dùng mv

const http = require('http');
const formidable = require('formidable');
const fs = require('fs');
const mv = require('mv');

const viewFormUpload = fs.readFileSync('./upload.html')

http.createServer(function (req, res) {
    if (req.url == '/upload' && req.method == 'POST') {

        const options = {
            encoding: "UTF-8", // Default => mấy cái options khác éo chạy
        }
        const form = new formidable.IncomingForm(options); // Khởi tạo form

        var files = [];
        var fields = [];

        // Với mỗi trường bình thường từ form nhận được
        form.on('field', function(field, value) {
            fields.push([field, value]);
        })
        // Với mỗi file nhận được
        form.on('file', function(field, file) {
            files.push([field, file]); // file ở đây là mảng 1 phần tử là 1 object phức tạp
            console.log("Z", files[0][1].path);
        })
        // Đây là cách bắt multiple files, mỗi lần có form tới thì nếu gửi file sẽ bắt signal file, nếu là form 
        // text bth sẽ phát signal field

        // Sau khi nhận được nội dung của form xong thì parse form
        form.parse(req, function (err) { 
            console.log("X: ", fields);
            console.log("Y: ", files);
            for(var i = 0; i < files.length; i++) {
                // Lấy đường dẫn tạm thời của file khi upload lên đây sẽ lưu trong bộ nhớ cache là RAM ở ổ C
                let oldPath = files[i][1].path; 
                // Lấy đường dẫn mới sẽ lưu file này vào
                let newPath = __dirname + '/uploads/' + files[i][1].name; // __dirname là đường dẫn thư mục hiện tại

                console.log("Get from: " + oldPath);
                console.log("Save to: " + newPath);

                // Tiến hành move bằng cách rename file tạm thời thành đường dẫn file mới với fs
                // fs.rename(oldPath, newPath, (err) => {}); 
                // Là asynchronous nhưng cái này bị lỗi k truy cập đc vào 1 vài file trong ổ C, đặc biệt là các file ở
                // vùng đệm vì bị hạn chế bởi quyền.
                // => package mv giải quyết vấn đề đó, nó chuyên move file kể cả ở vùng đệm mà k bị hạn chế bởi quyền
                // Có thể xóa file async với: fs.unlink(link to file, callback);
                mv(oldPath, newPath, function (err) {
                    if (err) return res.end(err)
                })
            }
            return res.end('<h1 style="color: green;">Upload success !</h1>')
        })

    } else {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        return res.end(viewFormUpload);
    }
}).listen(6969);
// Cơ chế: truy cập vào port server -> server gửi lại file html -> trình duyệt render ra trang web -> client upload 
// file -> trình duyệt bắt API lưu file vào thư mục -> gửi lại cho client upload thành công

// Package formidable chỉ cung đúng 1 thứ: formidable.IncomingForm(options) trả ra kiểu IncomingForm 
// Form đó có hàm parse(request nhận đc khi dùng với form, callback(err,field,file)) chỉ cần qt file lưu các thông số 
// nhận vào ta có thể dùng nó để lấy cái đường dẫn file upload lên form như bên trên


// # Các package có sẵn trong NodeJS 
// Dùng path
var path = require('path');
console.log(path.basename("./hello/test.png", ".png")); // Lấy tên file
console.log(path.basename("./hello/test.png"));
console.log(path.dirname("./hello/test.png")); // Lấy đường dẫn tới thư mục chứa file
console.log(path.delimiter); // Trong window là ; ngăn cách thư muc
console.log(path.extname('freetuts.coffee.md'));
console.log(path.extname('freetuts'));
// Lấy path từ 1 Object path.format() => có root, dir, base, ext, name
console.log(path.format({
    dir: '/home/user/dir',
    base: 'file.txt'
}))
console.log(path.format({
    dir: '/',
    name: 'file',
    ext: '.txt' // name và ext thì chả cần base
}))
console.log(path.format({
    base: 'file.txt'
}))
console.log(path.format({ // => bố tổ cái đường dẫn mà cồng kềnh vl. 1 cái format là 1 đường dẫn
    root: "C:\\",
    dir: "C:\\path\\dir",
    base: "file.txt",
    ext: ".txt",
    name: "file"
}))
// or ngược lại
console.log(path.parse('C:\\path\\dir\\index.html'));

console.log(path.isAbsolute('//server')); // true
console.log(path.isAbsolute('C:/foo/..')); // true
console.log(path.isAbsolute('bar\\baz')); // false
console.log(path.isAbsolute('.')); // false
// Trong window là như v
console.log(path.join('/foo', 'bar', 'baz/asdf', 'quux', '..')); // Còn thể loại nối => tự động nomarlize
console.log(path.normalize('/foo/bar//baz/asdf/quux/..')); // Đơn giản hóa đường dẫn
// Vì .. là lùi 2 bước thì nó trỏ đến asdf thôi

console.log(path.sep); // Ngăn cách các phần tư trong 1 path
console.log('foo\\bar\\baz'.split(path.sep)); // Nó tự hiểu trong "\\" là \

// resolve sẽ chuyển từ relative sang absolute
console.log(path.resolve('/foo/bar', '/tmp/file/', '..', 'a/../subfile'));
console.log(path.resolve('foo/bar', '/tmp/file/', '..', 'a/../subfile'));
console.log(path.resolve('foo/bar', 'tmp/file/', '..', 'a/../subfile'));
// Chú ý: nếu có segment bắt đầu bằng / thì các segment phía trc sẽ bị bỏ. Nếu có segment bắt đầu bằng / thì 
// nó sẽ chạy từ ổ đĩa hiện tại, còn nếu k bắt đầu bằng / thì sẽ chạy từ __dirname

// Dùng url
var url = require('url');
var urlString = "http://user:pass@host.com:8080/p/a/t/h?query=string#hash";
var testURL = new url.URL(urlString);
// Nó nhận vào max 2 tham số: new url.URL(input, base); input là relative thì buộc có base, input là absolute thì
// base có thể bị ignored. VD: new URL('/foo','https://example.org/'); => https://example.org/foo => Để đề phòng TH cái
// input nhận đc nó k rõ là relative hay absolute nên base thg cần để vào cái nào cx đc
console.log(testURL.origin);
console.log(testURL.username); // Cũng chỉ là trích ra từng thành phần trong đường dẫn mà thôi
console.log(testURL.host);
console.log(testURL.port);
console.log(testURL.hostname);
console.log(testURL.hash);
console.log(testURL.search);
console.log(testURL.searchParams); // Kiểu này có hàm get
console.log(testURL.searchParams.get("query"));
console.log(testURL.pathname);
console.log(testURL.password);
console.log(testURL.href);
console.log(JSON.stringify(testURL.toJSON())); // Chỉ có 1 link nên chả khác gì

const myURLs = [
    new URL('https://www.example.com'),
    new URL('https://test.example.org'),
];
console.log(JSON.stringify(myURLs)); // Chuyển object sang JSON


// Dùng fs
// TK lại 4 hàm của fs đầy đủ tham số:
fs.readFile("./uploads/plannew.txt", 'utf8', function(error, data){ // Chú ý callback nhận 2 đối số
    // Đối số 2 là charset có thể bỏ qua
    console.log('Data: ' + data);
    console.log('Error: ' + error); // Hàm readFile có callback có thể đọc luôn như này or chỉ tạo 1 stream r đọc sau 
});
var docFile = fs.readFileSync("./uploads/plannew.txt",{ // Đối số 2 là options có encoding và flag
    encoding: "utf-8",
    flag: 'r' // Cờ đọc file
});
console.log(docFile.toString());
fs.writeFile('./uploads/plannew.txt', 'Noi dung file moi cap nhat', { mode: 0o666, flag: "w", encoding:"utf-8"}, 
function(err){
    console.log(err)
    console.log('Ghi file xong!');
});
// 3 là options có encoding, mode(default là 0o666 cx k rõ là gì), flag read hay write
