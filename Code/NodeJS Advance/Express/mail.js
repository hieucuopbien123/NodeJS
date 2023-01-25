// # Dùng nodemailer
// # Xử lý upload file / Dùng formidable / Dùng express-formidable

const express = require("express");
const app = express();
const nodemailer = require("nodemailer");

const formidableMiddleware = require("express-formidable"); // Giống formidable giúp parse form
// trong express, dùng express-formidable là nhanh nhất và dễ nhất. 

// # Dùng dotenv
require("dotenv").config();
// VD: dotenv.config({ path: path.join(__dirname, "../../.env") }); khi k cùng thư mục phải specific

// Khai báo sử dụng template pug
app.set("views", "./views");
app.set("view engine", "pug");

app.use(
    formidableMiddleware({
        // multiple k set thì chỉ đc 1 file
        multiples: true // => req.files sẽ là 1 array,
    })
);
// Tức là bth cái req của ta k nhận file truyền vào, nhưng nhờ express-formidable mà ta dùng như này nên 
// req sẽ có thêm trường nx là files => các middleware thg kiểu cho thêm các attribute cho req khi nhận để xử lý
// ngoài ra trường fields là object lưu các thứ của form

app.get("/", (req, res) => {
    res.render("mail");
});

app.post("/sendMail", async (req, res) => {
    var attachments; // Khởi tạo biến chứa các attachments
    console.log(req.files.fileSend);

    // Khởi tạo đối tượng để gửi mail, createTransport trả ra đối tượng dùng để gửi mail. 1 là cấu hình cho đối tượng
    // gửi, ở đây ta cấu hình gmail với tk, mk. 2 là options k dùng
    const transporter = nodemailer.createTransport({
        service: "gmail",
        // pool: true, 
        // Ta phải create mỗi connection cho từng email. Pool hữu dụng khi ta có 1 lượng lớn message muốn gửi
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });

    // Trường hợp nếu có nhiều file được gửi về ta sẽ tạo ra 1 mảng attachment, Th có 1 file nó là 1 object
    console.log(req.files.fileSend.length);
    console.log(req.files.fileSend.size);
    if (req.files.fileSend.length > 0) {
        attachments = await req.files.fileSend.map(file => { // lấy attachment
            return {
                filename: file.name,
                path: file.path
            };
        });
    }

    // Nếu chỉ có 1 file và tồn tại
    if (req.files.fileSend.size > 0) {
        // Gán giá trị vào biến attachments
        attachments = [{
            filename: req.files.fileSend.name,
            path: req.files.fileSend.path
        }];
    }
    // Lấy các giá trị từ fields như nguoi nhận, tiêu đề, nội dung
    let {
        to,
        subject,
        text
    } = req.fields;

    // Chỉnh các giá tri của mail
    let mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        attachments,
        text,
    }; // Các trường tối thiểu phải lấy được là gửi cho ai, content, sub lấy từ fields. attachment lấy bằng formidable
    // ai gửi thì ta set up sẵn trong .env

    // sendMail là hàm gửi mail thôi, 1 là object chứa người gửi, người nhận, tiêu đề, content, tệp đính kèm
    // 2 là callback làm gì sau khi xong
    const sendMail = new Promise(function (resolve, reject) {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject({
                    msg: error,
                    type: "danger"
                });
            } else {
                resolve({
                    msg: "Email sent: " + info.response,
                    type: "success"
                });
            }
        });
    });

    // Tiến hành trả về thông báo 
    sendMail
        .then(result => {
            res.render("mail", result);
            transporter.close(); // Phải đóng luồng gửi sau khi gửi hết tất cả
        })
        .catch(err => {
            res.render("mail", err);
            transporter.close()
        });
});
app.listen(process.env.PORT || 8080);

// Cơ chế: dùng express tạo app gửi cho người dùng trang điền mail -> khi ấn gửi -> dùng express-formidable để nhận thông
// tin các trường form và file nhận đc với files và fields -> dùng nodemailer để gửi mail đi qua 2 hàm 
// createTransport là setup service gửi bằng gmail với tk, mk gì và hàm sendMail để gửi mail đi. Sau khi gửi mail thành
// công thì gửi lại file html -> thật ra file html ban đầu và về sau ở đây ta dùng chung file mail.pug và truyền biến
// vào mà thôi chứ kp gửi 2 file khác nhau nx