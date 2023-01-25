// # Các hàm thao tác tự tạo 

function isObject(item) {
    return item && typeof item === "object" && !Array.isArray(item) && item != null; // Vì null và array cx là type object
}
function mergeObject(target, source) {
    // 2 TH khi mà browser k sử dụng official polyfill thì k có hàm Object.assign
    if (typeof Object.assign !== "function") {
        (function () {
            Object.assign = function (target) {
                // We must check against these specific cases.
                if (target === undefined || target === null) {
                    throw new TypeError("Cannot convert undefined or null to object");
                }
                let output = Object(target);
                for (let index = 1; index < arguments.length; index++) {
                    let source = arguments[index];
                    if (source !== undefined && source !== null) {
                        for (let nextKey in source) {
                            // Chỉ copy các thuộc tính nó thực sự sở hữu, k tính các property của mà nó kế thừa từ cái khác
                            if (source.hasOwnProperty(nextKey)) {
                                output[nextKey] = source[nextKey];
                            }
                        }
                    }
                }
                return output;
            };
        })();
    }
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach((key) => {
            if (isObject(source[key])) { 
                // Nếu thuộc tính lại tạo object thì phải check k có thì merge bth nhưng cả 2 có thì recursive
                if (!(key in target)) {
                    Object.assign(output, {
                        [key]: source[key],
                    });
                } else {
                    output[key] = mergeObject(target[key], source[key]);
                }
            } else {
                Object.assign(output, {
                    [key]: source[key],
                });
            }
        });
    }
    return output;
}

var item1 = {
    a: undefined
}
var item2 = {
    a: {a: 3}
}
console.log(mergeObject(item1, item2));