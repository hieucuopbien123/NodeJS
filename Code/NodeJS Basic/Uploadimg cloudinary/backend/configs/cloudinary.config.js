const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary,
    folder: "testimg", // folder lưu trong cloudinary
    allowedFormats: ['jpg', 'png'],
    filename: function (req, file, cb) { // Nhận request từ multer thì xử lý lưu filename như nào
        cb(null, file.originalname); 
    }
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;