const sum = require('./testFunction'); // require thì k cần đuôi như import

function total(values = []) {
    return values.reduce(sum.sum, 0);
}
// function đầu của reduce(total,currentval,index,arr)->return giá trị lưu vào total cho vòng sau,cuối dùng lấy total

module.exports = total;