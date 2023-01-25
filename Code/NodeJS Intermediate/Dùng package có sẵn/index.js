// # Các package có sẵn trong NodeJS

// Dùng fs
// Dùng writeFileSync và writeFile
const fs = require("fs");
fs.writeFile('./text.txt', "This", data => {console.log("end")});
fs.writeFileSync('./text.txt', "This");
fs.close(0)
// close thì k dùng đc nx. Ở đây các hàm async sẽ k còn đc gọi, dùng async + try thì hàm close thg để ở finally

// Test fs/promises mở rồi đọc file
const openVar = fs.promises.open;
let filehandle;
async function testFsPromise(){
    try {
        filehandle = await openVar('text.txt', 'r');
        console.log(filehandle.readFile().then((data) => console.log(data.toString())));
    } finally {
        await filehandle?.close();
    }
}
testFsPromise();

// Dùng events
const events = require("events");
const eventEmitter = new events.EventEmitter();

// Hàm on của EventEmitter chỉ chơi với fallback
eventEmitter.on('connection', () => console.log('Kết nối sự kiện connection'));
// eventEmitter.removeAllListeners();
function callback() {
    console.log('Kết nối sự kiện connection 2');
}
eventEmitter.on('connection', callback);
// eventEmitter.removeListener('connection', callback); // Nếu chỉ muốn remove 1 sự kiện gắn với 1 callback function 
// cụ thể thì callback k đc viết TT mà phải có tên hàm thì mới remove đc như này

eventEmitter.emit("connection"); // Có nhiều listener cùng 1 sự kiện sẽ thực hiện theo thứ tự queue các hàm callback

// Hàm once của EventEmitter tạo sự kiện chỉ gọi 1 lần r tự remove
eventEmitter.once("addAuthorTitle", function(author, title) { 
    console.log("Added Author and Title " + author + " - " + title);
});
eventEmitter.emit("addAuthorTitle", "Slim Shady", "The real Slim Shady");
eventEmitter.emit("addAuthorTitle", "Slim Shady", "The real Slim Shady"); // Lần 2 k bắt nữa

// Cách viết khác để thêm 1 event vào emitter
var data = events.once(eventEmitter, "event2").then((data) => console.log(data));
eventEmitter.emit("event2", 7);

eventEmitter.setMaxListeners(10); // default là 10
console.log(eventEmitter.getMaxListeners());
console.log(eventEmitter.listeners("connection"));
// Listeners là hàm callback gắn với sự kiện. Có 2 hàm callback thì event đó có 2 listeners. 
// Hàm once khi gọi xong sẽ xóa listener đi. Tên của listener là tên hàm, các hàm anonymous sẽ k có tên của listener

// Mọi kiểu class bh đều có thể dùng đc event bằng cách cho nó kế thừa EventEmitter
class MyClass extends events.EventEmitter{ }
var instanceOfClass = new MyClass();
instanceOfClass.on("test",(data) => console.log(data));
instanceOfClass.emit("test", "Fucked");
