// # Các package có sẵn trong NodeJS

// Dùng fs
const fs = require("fs")
const data = fs.watch("child-process.js", (eventType, filename) => {
    console.log("\nThe file ", filename, " was modified!");
    console.log("The type of change was: ", eventType);
});
console.log(data);
// fs.watch là hàm theo dõi sự thay đổi của 1 file trả ra fs.FSWatcher có thể track sự thay đổi của file
// VD với lệnh trên: ta chạy node file này và sửa 1 chút của file này r save lại là nó báo
// Tham số 1 là tên file, 2 là options k quan tâm, 3 là function làm gì khi đổi, ở đây ta chỉ in ra

// Dùng yargs
console.log(process.argv);

// Dùng child_process
// Child_process có sẵn trong NodeJS giúp tạo ra các subprocess. Qtr là 2 hàm spawn và exec
const {
    spawn, exec, fork
} = require("child_process")

// Dùng spawn: chạy 1 chương trình bên ngoài trả ra 1 streaming interface có thể truy cập vào stdout/in/err
// VD: ta có thể đọc 1 bức ảnh xong dùng spawn để gọi úng dụng convert chuyển đổi định danh ảnh chẳng hạn
const testSpawn = spawn("node", ["support.js"]);
// Hàm spawn thực hiện command nào với tham số là gì. Ở đây ta chạy file support. Các lệnh của child-process chỉ dùng 
// để chạy 1 external app trong 1 process con or các lệnh thuần NodeJS mà thôi, kp là cmd
testSpawn.stdout.on('data', (data) => {
    // Nếu chạy được có kết quả in ra thì bắt nó và hiện ra stdout. Éo hiểu sao k chạy đươc
    console.log(`STDOUT: ${data}`);
});
testSpawn.stderr.on('data', (data) => {
    // stderr nếu có thì in ra
    console.error(`STDERR: ${data}`);
});
testSpawn.on('error', (error) => {
    console.error(`error: ${error.message}`);
});
testSpawn.on('close', (code) => {
    // Khi lệnh thực hiện xong. Đây là 1 lệnh cơ bản nên thực hiện tức thì xong luôn
    console.log(`Child process exited with code ${code}`);
});

// Dùng exec: mở 1 subshell và chạy lệnh gì trên subshell đó, sau khi chạy xong sẽ gọi vào hàm callback
// nên nhớ các hàm bên trong được thực hiện trên 1 process riêng khác process cha lớn bên ngoài
const ls = exec('pwd', function (error, stdout, stderr) {
    // Chỉ dùng chạy tiến trình khác chứ kp dùng các lệnh cmd bth
    if (error) {
        console.log(error.stack);
        console.log('Error code: '+error.code);
        console.log('Signal received: '+error.signal);
    }
    console.log('Child Process STDOUT: '+stdout); // stdout và stderr tự bắt chỉ cần in như này
    console.log('Child Process STDERR: '+stderr);
});
ls.on('exit', function (code) {
    console.log('Child process exited with exit code '+code);
});

// Dùng execFile: execute external app và thành công thì trả ra buffer. Lỗi lệnh pwd --version k chạy được
// Khác về cú pháp: đối số 1 là tên lệnh or link tới file chứa tập lệnh, 2 là args => ở đây chạy lệnh pwd --version
// in ra version, 3 là options, 4 là callback ở đây ta toàn bỏ qua 3. 
// const execFile = require('child_process').execFile;
// execFile('pwd', ['--version'], (error, stdout, stderr) => { 
//     if (error) {
//         console.error('stderr', stderr);
//         throw error;
//     }
//     console.log('stdout', stdout);
// });