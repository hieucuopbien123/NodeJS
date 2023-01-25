const express = require('express');
const app = express();

// # Các package backend NodeJS thường dùng / Dùng shelljs 
// # Các package khác liên quan tới server / Dùng ngrok (bỏ) / Dùng localtunnel
const shell = require("shelljs")

/*
// Như này là tạo ra url connect r
const ngrok = require('ngrok');
(async function() {
    const url = await ngrok.connect({
        authtoken: "28enFgtujgtRzjXYfps9sukrW4p_3ZDEb3j1U8AYBboAMMgCK",
        addr: 3001,
        proto: "http"
    });
    const api = ngrok.getApi();
    const apiUrl = ngrok.getUrl();
    const tunnels = await api.listTunnels(); // Nó tạo ra 2 cái tunnel http và https cùng tên

    await api.stopTunnel(tunnels.tunnels[0].name); // Close tunnel 1 là https sẽ k truy cập được
    // Còn start kệ mẹ nó đi, éo start được thì thôi
    // const tunnelD = await api.tunnelDetail(tunnels.tunnels[0].name); // Khi close thì k thể xem được detail

    // await ngrok.authtoken("28enFgtujgtRzjXYfps9sukrW4p_3ZDEb3j1U8AYBboAMMgCK");
    // await ngrok.disconnect(url); // stops one
    // await ngrok.disconnect(); // stops all
    // await ngrok.kill(); // kills ngrok process

    console.log(url);
    console.log(apiUrl);
    console.log(tunnels);
    const requests = await api.listRequests();
    console.log(requests);
    await api.deleteAllRequests();
    // await api.replayRequest(requestId, tunnelName); // Còn có relay request
    // const request = await api.requestDetail(requestId); // Xem detail request
})();
*/

const localtunnel = require('localtunnel');

(async () => {
    const tunnel = await localtunnel({ port: 3001, subdomain: "nguyenthuhieu" });

    // The assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
    console.log(tunnel.url);

    tunnel.on('close', () => {
        console.log("close tunnel");
    });
})();

// shelljs chuyển hóa các câu lệnh như bash script. VD: cd cat chmod exec ls mkdir mv 
shell.echo("xin chao");
shell.echo(shell.ls("-A","./"));

// # Basic / Dùng export + require trong NodeJS
// Dùng cross-env / Dùng cross-env
const configData = require("config"); // Có thể require 1 thư mục cùng cấp là config ntn với file json
const configurationData = configData.get("database");
// Package cross-env sẽ cho biến process.env.NODE_ENV
// Package config dùng kết hợp khi dùng require sẽ tìm vào thư mục config cùng cấp với thư mục hiện tại
// Bên trong nó sẽ tìm file có tên: <process.env.NODE_ENV>.js tùy MT hiện tại là gì mà nó tìm file tương ứng
// thêm vào đó nó cho phép ta lấy ra luôn 1 object có content là file json mà ta có thể lấy từng trường qua hàm get
// như trên

// Dùng escape-html
var escape = require('escape-html');
app.get('/', (req,res) => {
    var html = escape('foo & bar');
    // return res.send(html); hay return res.send("foo & bar"); hay như dưới đều ok
    // escape-html là code html mà trình duyệt có thể chuyển đổi tương đương với ký tự hiểu được
    // Tuy nhiên viết bth thì trình duyệt cx hiểu được nên cái này chả cần
    return res.send("foo &amp; bar");
})

// Có thể dùng thuần như này
var config = {
    name: "dev",
    id: 1
};
if(process.env.NODE_ENV === "production"){
    config = {
        name: "prod",
        id: 2
    }
}
console.log(config.name + " " + config.id);
console.log(configurationData);

app.listen(3001, () => {
    console.log('The server is running at 3001 in mode: ' + process.env.NODE_ENV);
})