// Dùng mongodb / # Basic / Dùng express-mongo-santinize

const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Cho phép . và thế $ bằng _
app.use(
    mongoSanitize({
        allowDots: true,
        replaceWith: '_',
    }),
);

app.use(
    mongoSanitize({
        dryRun: true, // Chạy chế độ dry run = testing
        onSanitize: ({ req, key }) => { // Call mỗi khi input được sanitize
            console.warn(`This request[${key}] is sanitized`, req);
        },
    }),
);

// Default thì req.body, req.params, req.headers, req.query bị loại bỏ $ và . từ user input
app.use(mongoSanitize());

// Dùng trực tiếp k qua middleware. Nó bắt key có $ => username: '{"$gt": ""}' sẽ k hoạt động
const payload = {"username": {"$gt": ""}};
const hasProhibited = mongoSanitize.has(payload);
console.log(hasProhibited);
console.log(payload);
console.log(mongoSanitize.sanitize(payload, {
    replaceWith: '_'
}));
console.log(payload);

// # Các package backend NodeJS thường dùng / Dùng clean-css
var CleanCSS = require('clean-css');
var options = {
    format: 'beautify', // Formats output in a really nice way
    format: 'keep-breaks'
};
console.log(new CleanCSS(options).minify('a{font-weight:bold;}'));