// # Event loop của NodeJS

// Nhét vào IO/callback luôn thực hiện immediate trước
var fs = require('fs');
fs.readFile("test-file.txt", function() {
    setTimeout(function(){
        console.log("SETTIMEOUT1");
    });
    setImmediate(function(){
        console.log("SETIMMEDIATE1");
    });
});

// May rủi thực hiện trước hay sau
setTimeout(function(){
    console.log("SETTIMEOUT2");
});
setImmediate(function(){
    console.log("SETIMMEDIATE2");
});