// # Dùng multer / Dùng kết hợp cloudinary

const express = require('express');
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');

router.post('/cloudinary-upload', 
    fileUploader.single('testname'),
    // Dùng single khi muốn lấy 1 file thôi, truyền vào tên trường mà ta xác định trong FormData ở frontend
    // Dữ liệu có trường này của req sẽ được xử lý bởi multer -> cloudinary. Còn các dữ liệu trường khác vẫn
    // ở nguyên trong body truyền tiếp đi
    (req, res, next) => {
        console.log(req.file);
        if (!req.file) {
            next(new Error('No file uploaded!'));
            return;
        }
        console.log(req.body.title);
        console.log(req.file?.path); 
        // Cái này lấy từ middleware trước đó là link ảnh trên cloud đã lưu và ta trả ra cho frontend lấy
        res.json({ secure_url: req.file?.path }); // Trả ra URL của file đã upload lên cloud để hiển thị trên trình duyệt
    }
);

// # Dùng express / Dùng middleware
router.get('/cloudinary-upload', 
    (req, res, next) => {
        res.json("test");
    }
);

module.exports = router;