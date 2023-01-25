// # Tổng kết module JS / # Dùng promise

// 2 kiểu khởi tạo promise
// C1:
new Promise((resolve, reject) => {
    resolve();
})
// C2:
Promise.resolve(); // Kiểu 1 có thể xử lý thêm trươc khi resolve còn kiểu 2 resolve mẹ nó luôn

// 2 kiểu khởi tạo promise để dùng
// C1:
var testPromise1 = Promise.resolve();
// C2:
var testPromise2 = (age) => {
    return new Promise9((resolve, reject) => {
        if(age > 18) resolve();
        else reject();
    })
}
// C1 sẽ thực hiện luôn hàm Promise(vì phải lấy giá trị cuối dùng gán vào biến), C2 phổ biến hơn khi nào gọi hàm
// thì mới quyết định resolve hay reject.

function checkIsAdult(age) {
    return new Promise((resolve, reject) => {
        if (age >= 18) resolve('Da tren 18, an ngon nhoe');
        else reject('Chua an duoc, can than boc lich');
    });
}
checkIsAdult(13).catch(err => console.log(err));