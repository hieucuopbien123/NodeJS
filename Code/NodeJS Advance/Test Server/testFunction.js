// # Basic / Dùng export + require trong NodeJS

// Nodejs cố tình object hóa các thứ cho đơn giản. Nó tự thêm vào đầu file:
// var module = { exports: {} }; và var exports = module.exports;
// và thêm vào cuối file: return module.exports; và khi ta dùng require file này ở file khác sẽ nhận đc object
// module.exports => trong bất cứ file nodejs nào nó cx làm như v. Ta có thể dùng biến exports độc lập với module.exports đều ok

function sum(a, b) {
    return a + b;
}
function plus(a, b) {
    return a + b;
}
function add(a, b) {
    return a + b;
}
module.exports = { // Do chỉ có 1 object nên nhiều hàm thì phải chia ra
    sum: sum,
    plus: plus,
    add: add
}