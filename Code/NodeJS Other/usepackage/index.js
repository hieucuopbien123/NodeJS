// # Các package backend NodeJS thường dùng / Dùng chalk / Dùng figlet / Dùng marked + marked-terminal / Dùng minimist

import("chalk").then((chalk) => { // Có thể cài v4 để dùng với commonjs
    chalk = chalk.default;
    console.log(chalk.blue("this is lit"))
    console.log(chalk.blue.bgRed.bold("Blue & Bold on Red")) // Chữ xanh và đậm trên nền đỏ
    console.log(chalk.blue.bgRed("Regular Blue on Red"))
    console.log(chalk.blue("Blue") + " Default" + chalk.red(" Red"))
    console.log(chalk.red("There is an ", chalk.underline("Error")))
    console.log(chalk.rgb(127, 255, 0).bold("Custom green"))
})

var figlet = require('figlet');
figlet('Hello World!!', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data);
    console.dir("h"); // dir là in ra trong cặp ngoặc '' dạng url
});

var marked = require('marked');
var TerminalRenderer = require('marked-terminal');
marked.setOptions({
    renderer: new TerminalRenderer() // Define custom renderer
});
// marked.setOptions({
//     renderer: new TerminalRenderer({
//         codespan: chalk.underline.magenta, // Kết hợp chalk
//     })
// });
console.log(marked.marked('# Hello \n This is **markdown** printed in the `terminal`')); // show data marked
// Cái marked-terminal có mặc định kiểu trong `` sẽ là vàng, trong **** sẽ là trắng, dòng có # sẽ gạch chân màu hồng

// Lấy bth thì nó ra chán lắm => 3: --name=flavio
process.argv.forEach((val, index) => {
    console.log(`${index}: ${val}`)
})

// Ta dùng minimist để phân tích cú pháp
const args = require('minimist')(process.argv.slice(2))
console.log(args) // flavio
// Cú pháp chạy chuẩn là: node index.js test1 --name=hieu test2
// minimist sẽ lấy thành: { _: [ 'test', 'test2' ], name: 'flavio' }
