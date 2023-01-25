// Dùng tool / # Dùng Jest

// Dùng jest thì đuôi file test là .test.js; nó chỉ nhận vào 1 function or 1 object mà thôi
const sum = require('./testFunction');

test.only('adds 1 plus 2 to equal 3', () => { // Trong tên của test k nên để ký tự khác chữ và số sẽ k chạy đc 1 TH cụ thể
    expect(sum(1, 2)).toBe(3);
});
// 1 là tên case trong test suite, 2 là hàm số chạy test; 
// Còn expect(<hàm gì>)(.not).toBe(<kết quả mong muốn đầu ra>)
// Tương tự có thể xử lý trong hàm r expect(<data>).toEqual(<data>)
test.only('zero', () => {
    const z = 0;
    expect(z).not.toBeNull();
    expect(z).toBeDefined();
    expect(z).not.toBeUndefined();
    expect(z).not.toBeTruthy();
    expect(z).toBeFalsy();
});
// Số: toBeGreaterThan,toBeLessThanOrEqual; float buộc kbh ss bằng mà dùng toBeCloseTo; 
// string: toMatch(/regexp/); Iterable: toContain();
// exception: expect(<function>).toThrow(<error>/(<expect nó throw bất cứ kiểu gì>));

// Nếu chỉ muốn chạy 1 cái gì đó thì thêm .only vào -> nếu có nh .only sẽ chạy tất cả các hàm có only. Nếu dùng only sẽ 
// k có cách nào chạy các hàm k có only
// Nếu có nhiều hàm expect trong 1 case, nó sẽ chạy hết các hàm expect, sai 1 cái cx báo lỗi