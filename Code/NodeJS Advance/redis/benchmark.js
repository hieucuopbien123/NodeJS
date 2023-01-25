// # Dùng api-benchmark => bỏ

var apiBenchmark = require("api-benchmark");
const fs = require("fs");

// Chạy server và chạy file này sẽ gửi hàng loạt request tới server sẽ tự sinh file html chứa kết quả
var services = {
    server1: "http://localhost:3000/",
};
var options = {
    minSamples: 100,
};

// Test với 2 server k có redis và có redis
var routeWithoutCache = { route1: "users?email=Nathan@yesenia.net" };
var routeWithCache = { route1: "cached-users?email=Nathan@yesenia.net" };

apiBenchmark.measure(
    services,
    routeWithoutCache,
    options,
    function (err, results) {
        apiBenchmark.getHtml(results, function (error, html) {
            // Sau khi test xong sẽ ghi kết quả vào file no-cache-results.html
            fs.writeFile("no-cache-results.html", html, function (err) {
                if (err) return console.log(err);
            });
        });
    }
);

apiBenchmark.measure(
    services,
    routeWithCache,
    options,
    function (err, results) {
        apiBenchmark.getHtml(results, function (error, html) {
            fs.writeFile("cache-results.html", html, function (err) {
                if (err) return console.log(err);
            });
        });
    }
);