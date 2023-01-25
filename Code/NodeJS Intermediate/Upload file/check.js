// # Các package có sẵn trong NodeJS / Dùng fs

var fs = require("fs");
fs.rename(".\\up.html",".\\upload.html", (err) => {
    console.log(err);
});
console.log("CHECK");