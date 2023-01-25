// # Các package có sẵn trong NodeJS / Dùng child_process / Dùng fork

// VD: dùng fork chạy 3 tiến trình ở 3 process riêng
const child_process = require('child_process');
for(var i=0; i<3; i++){
    var worker_process = child_process.fork("support.js", [i]);
    worker_process.on('close', function (code) {
        console.log('child process exited with code ' + code);
    });
}