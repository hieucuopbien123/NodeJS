// # Các package có sẵn trong NodeJS / Dùng child_process / Dùng fork

const fork = require('child_process').fork;

// Child process file
const child_file = 'Child.js';

// Spawn child process: chỉ cần truyền tên file là nó tự hiểu node file đó tương tự lệnh spawn với node v
const child = fork(child_file);

// Start listening to the child process
child.on('message', message => {
    // Message from the child process
    console.log('Message from child:', message);
});
