// # Các package có sẵn trong NodeJS / Dùng child_process /  Dùng thư viện @rauschma/stringio

const {onExit} = require('@rauschma/stringio');
const {spawn} = require('child_process');

async function main() {
    const filePath = process.argv[2];
    console.log('INPUT: ' + filePath);

    const childProcess = spawn('node', ["support.js"],
        {stdio: [process.stdin, process.stdout, process.stderr]});
        // VD ở đây ta dùng đối số 3 options xác định dùng các child's stdio nào
    await onExit(childProcess); 
    // Thư viện @rauschma/stringio cung thêm các hàm bổ trợ. onExit nhận vào kiểu childProcess chờ cho process này
    // hoàn thành mới đi tiếp
    console.log('### DONE');
}
main();