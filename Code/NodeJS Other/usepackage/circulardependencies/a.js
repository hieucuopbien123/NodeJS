// # Basic / Dùng export + require trong NodeJS / circular dependencies

// TH1:
// var b = require('./b');
// console.log(b);
// module.exports = {
//     getThisName : getThisName,
//     getOtherModuleName : getOtherModuleName,
//     name : getName
// }

//TH2:
var b = require('./b');
console.log(b);
const getThisName = () => {
    return b.getOtherModuleName()
}
const getOtherModuleName = () => {
    return b.getThisName();
}
const getName = () => {
    return 'moduleA is OK'
}
exports.getThisName = getThisName;
exports.getOtherModuleName = getOtherModuleName;
exports.name = getName;

// Lỗi circular dependencies sẽ biểu hiện dạng myFunction is not a function. NN là khi module A gọi module B, 
// module B lại gọi module A. Khi dùng front end thì sẽ lỗi kiểu Maximum call stack size exceeded
// Th trên k có lỗi vì k gọi hàm lồng nhau.

// Cơ chế: 
// - Khi file được require lần đầu tiên nó sẽ chạy từ trên xuống, nếu file từng được require trong dự án 1 lúc nào
// đó rồi(kể cả kp ở file này) thì nó sẽ k chạy từ trên xuống của file require nữa mà lấy luôn biến export. Vì trong mỗi
// file thì mọi thứ là fix nên chỉ cần thực thi 1 lần mà thôi còn đâu lây thẳng vào export; 
// - Theo thứ tự, 1 file k thể dùng 1 hàm export của file khác nếu file đó chưa từng được chạy từ trên xuống và đi qua hàm 
// export. VD: C require A, A require B, B lại require A => Chạy file C require A -> chạy file A require B -> chạy file B
// require A quay vòng -> nhưng NodeJS nó k cho quay vòng như v vì: file A chưa được chạy từ trên xuống lần nào nên k thể
// nhảy vào lấy hàm exports của file A theo quy tắc 2 nên buộc phải chạy từ trên xuống với file A nhưng nó lại require B 
// tiếp tức quay vòng nên NodeJS bỏ qua -> lúc này trong file B ta in ra instance vừa require từ A thì hiển nhiên k có 
// gì nên in ra object rỗng nhưng nó vẫn lưu điều này lại trong bộ nhớ vì file A chưa được chạy từ trên xuống dưới.
// Sau khi chạy qua require b thì nó đi xuống chạy các hàm của a, khi đó nó nạp vào b nếu phần export của b đã dùng vì
// nó lưu điều này lại r mà.
//- Sự khác biệt khi dùng module.exports 1 cục và exports từng cái với định nghĩa phía trên: Thực chất trong tình huống
// bth nó k khác gì nhau nhưng chỉ ở circular này thì nó mới khác nhau gây lỗi. Xét TH C require A, A require B, B require
// A và chạy file C -> thì khi chạy từ trên xuống của file B nó có dùng: var a = require("./a.js"); nhưng k được vì 
// file A chưa chạy từ trên xuống nên bỏ qua, thực ra nó k bỏ qua mà nó lưu như 1 instance của A trong file b.js -> 
// nó lưu đó và chờ nếu như module a.js mà định nghĩa thêm các thuộc tính gì thì nó sẽ tự lưu vào instance này.
// Thực ra mỗi file đều có 1 biến số global gọi là module.exports mà có thể viết gọn là exports, các file khác khi require
// file này thực ra là lấy đúng cái biến này của global và đồng bộ với nó của global. Khi ta dùng như cách 1 là đang thực
// hiện gán biến module.exports của a.js thành 1 giá trị khác. Do file b đã require file a và lưu tạm giá trị là undefine
// rồi và vc thay đổi giá trị của biến global module.exports(file A) nó k được đồng bộ với biến instance a của file B mà
// biến instance này chỉ chờ bắt thay đổi thuộc tính thôi. Nên là Th2 dùng exports.name = getName tức là thêm 1 thuộc tính
// name cho biến exports thì tất cả các instance của file A trong các file khác đều bắt được và lúc này instance a trong
// file B sẽ có thêm attr name = getName luôn. Nó kiểu địa chỉ ấy, ta gán module.exports thì nó sang mẹ địa chỉ mới giá
// trị mới, còn địa chỉ cũ mà các file khác bắt vẫn mang giá trị cũ
// Tức là tư duy mỗi module chỉ require 1 lần là sai, thực chất nó require trong từng file và lưu biến instance, chỉ là
// chạy từ đều đến cuối 1 lần thôi
// Do mỗi file có instance riêng nên file b ta gán a.test = 1 thì chỉ dùng trong file đó thôi chứ k dùng được ở các file 
// khác cũng require A
