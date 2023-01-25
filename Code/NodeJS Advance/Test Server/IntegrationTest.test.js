// Dùng tool / # Dùng Jest

// Integration Test là kiểu test code của ta dùng đến code khác chạy có đúng k
// Test được cái này phải mô phỏng code khác mà ta dùng, bằng cách tạo mock
// Ta gọi hàm total, mà total lại gọi đến hàm sum, như v muốn test total ta phải test cả sum, nhưng rõ ràng ta chỉ
// muốn test thằng total thôi, sum là code của ng khác ta k quan tâm. Khi đó ta phải mock hàm sum
// Cách thay đổi chức năng của 1 hàm ở file có rồi

jest.mock('./testFunction'); // Báo hiệu mọi import từ file này có thể được mock

const sum = require('./testFunction');
sum.sum.mockReturnValue(1); // sum bh có thể mock, ta ép nó luôn return 1 -> Mọi hàm bên dưới dùng sum đều có sum return 1
// Có thể đối nội dung hàm với: = jest.fn(<hàm>); như bên dưới
const total = require('./mockFunction');
test('works', () => {
    expect(total([1, 2, 3, 4])).toEqual(10);
})

// Nhưng như trên thì ít dùng vì hàm sum nó quá ez và nhanh. Dùng tương tự với axios và read file
const fs = require('fs');
function readContent(file) {
    return fs.readFileSync(file);
}
jest.mock('fs'); // Báo hiệu mọi hàm dùng từ thư viện này đều có thể mock
// fs.readFileSync = jest.fn().mockReturnValue('foo'); //or
fs.readFileSync.mockReturnValue('foo');
test('testReadFile', () => {
    expect(readContent('./text.txt')).toEqual('foo');
})

// Or ta có thể đối nhiều hàm trong module ngắn gọn hơn ntn. VD: mock hàm get của thư viện axios
const axios = require('axios');
jest.mock('axios', () => ({ // chỉ muốn mock hàm nào trong module
    get: jest.fn().mockResolvedValue({ data: { foo: 'bar' }})
})) // mockResolvedValue tương đương với 1 promise trả ra giá trị resolve bất đồng bộ.
// Tương tự: mockResolvedValueOnce, mockRejectedValue, mockRejectedValueOnce
test('mock axios.get', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
    expect(response.data).toEqual({ foo: 'bar' });
});

// Bên cạnh vc sửa hàm có sẵn ở file khác, ta có thể mock 1 hàm mới. VD cần test hàm forEach dưới đây nhận vào 1
// function, bh nếu ta dùng function của file khác thì phải kiểm tra function file đó có đúng k trc đã thành ra bị
// lệ thuộc. nếu ta tạo hẳn 1 function mới để test sẽ hay hơn
function forEach(items, callback) {
    for (let index = 0; index < items.length; index++) {
        callback(items[index]);
    }
}
test('test foreach', () => {
    const mockCallback = jest.fn(x => 42 + x); // Hàm fn cho phép tạo 1 function mới
    forEach([0, 1], mockCallback); // Test hàm tạo ra. Từ đây ta có thể lấy các thứ để kiểm tra hàm tạo ra đã được
    // dùng như thế nào. VD ở trên hàm đc gọi 2 lần thì check như sau:
    expect(mockCallback.mock.calls.length).toBe(2); // Mock function được gọi 2 lần
    expect(mockCallback.mock.calls[0][0]).toBe(0); // tham số thứ nhất của lần gọi đầu tiên là 0
    expect(mockCallback.mock.calls[1][0]).toBe(1); // tham số thứ nhất của lần gọi thứ 2 là 1
    expect(mockCallback.mock.results[0].value).toBe(42); // giá trị trả về của lần gọi đầu tiên là 42
});
// Mọi mock function đều có thuộc tính mock lưu cách hàm được gọi và thuộc tính được lưu trữ

// Ta cx có thể khiến cho hàm trả về giá trị gì sau mỗi lần
test('test mock return value', () => {
    const filterTestFn = jest.fn();
    filterTestFn.mockReturnValueOnce(true).mockReturnValueOnce(false);
    // filterTestFn sẽ trả về true ở lần gọi đầu và false ở lần gọi thứ 2
    const result = [11, 12].filter(num => filterTestFn(num));
    console.log(result); // [11] true nên chỉ có 11
    console.log(filterTestFn.mock.calls);
    // [ [11], [12] ] calls lấy tất cả đối số
});


// jest.fn().mockImplementation(<function>) = jest.fn(<function>) chỉ là 1 cách viết định nghĩa khác
// nhưng ta còn có thể chỉ định nghĩa cho lần đầu tiên với mockImplementationOnce(<function>);
sum.plus.mockImplementationOnce(()=>"hello");
test('works1', () => {
    expect(sum.plus()).toEqual("hello");
    expect(sum.plus()).toEqual("hello"); // Lần này k còn đúng nx, nó quay về 1
})
