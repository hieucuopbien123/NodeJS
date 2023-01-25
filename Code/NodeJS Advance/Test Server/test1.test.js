// Dùng tool / # Dùng Jest

// spyOn cho phép ta quản lý các hàm import từ file khác. Các VD trc các hàm từ file khác ta quản lý nó vẫn chưa tốt
// Ví dụ muốn hàm thực hiện theo ý ta trong 5 turn r quay lại ban đầu 10 turn xong lại theo ý ta thì spyOn ms làm đc
// Hơn nx khi ta dùng jest.mock 1 file nào đó thì module file đó thành undefined hết và buộc phải định nghĩa lại
// giá trị trả ra của tất cả. Do đó dùng spy chỉ tác động vào 1 hàm sẽ tốt hơn.
var sum = require('./testFunction');
test('use spy',() => {
    const addMock = jest.spyOn(sum, "add"); // Quản lý hàm add(chỉ hàm add)
    addMock.mockImplementation(() => "mock"); // Định nghĩa lại hàm add
    expect(sum.add(1, 2)).toEqual("mock");
    addMock.mockRestore(); // Cho hàm add quay lại ban đầu, chỉ có tác dụng khi dùng spyOn bên trên > mockReset > mockClear
    expect(sum.add(1, 2)).toEqual(3);

    // Cách khác k dùng spyOn bằng cách ta lưu lại r gán về như cũ
    const saveAdd = sum.add;
    // Hàm bth k thể mock đc trừ khi dùng spyOn, jest.mock() or jest.fn()
    sum.add = jest.fn(saveAdd); // Biến hàm này thành chính nó nhưng dùng fn làm nó mock đc
    sum.add.mockImplementation(() => "mock"); // Mock nó
    expect(sum.add(1, 2)).toEqual("mock");
    sum.add = saveAdd;
    expect(sum.add(1, 2)).toEqual(3);
})