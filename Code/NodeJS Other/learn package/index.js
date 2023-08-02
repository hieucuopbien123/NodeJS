const express = require("express")
const app = express();
const rateLimit = require('express-rate-limit');
const Joi = require("joi");
const status = require('http-status');
var jwt = require('jsonwebtoken');
var timeout = require("connect-timeout");

// # Dùng express / Dùng connect-timeout
// app.use(timeout("5s")); // Có tác dụng với mọi route
app.post('/save', timeout('5s'), haltOnTimedout, function (req, res, next) { // Dùng với 1 route
    savePost(req.body, function (err, id) {
        if (err) return next(err)
        if (req.timedout) return; // Timeout thì ta cũng dừng luôn
        res.send('saved as id ' + id)
    })
})
function haltOnTimedout (req, res, next) {
    // Middleware timeout('5s') bắn biến timedout vào middleware sau nếu quá 5s
    if (!req.timedout) next()
}
function savePost (post, cb) {
    setTimeout(function () {
      cb(null, ((Math.random() * 40000) >>> 0))
    }, (Math.random() * 7000) >>> 0)
}
// Khi dùng connect-timeout nó sẽ truyền vào req forward to middleware tiếp theo biến timedout. Nhưng nếu bị timeout
// nó sẽ báo lỗi cho client thấy nhưng vẫn tiếp tục thực hiện những cái bên trong, do đó ta phải dùng haltOnTimedout
// để dừng lại. Ta phải dùng haltOnTimedout sau mọi middleware. VD:
// app.use(timeout('5s'))
// app.use(bodyParser())
// app.use(haltOnTimedout)
// app.use(cookieParser())
// app.use(haltOnTimedout)
// Vì bất cứ middleware nào chạy xong bị quá 5s, nó đều bắn ra biến đó
// Tuy nhiên khi tương tác với database thì mọi thứ lại k đơn giản, chẳng hạn ta cần tương tác update 1 list 200 người
// rất lâu thì nếu bị timeout giữa chừng thì k dừng được vc database update dù vẫn báo lỗi cho người dùng. Trừ khi có 1 
// hàm nguyên tử đảm bảo update hàng loạt

// # Dùng jsonwebtoken
var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
console.log(token); // Đã được hash

jwt.verify(token, 'shhhhh', function(err, decoded) {
    console.log(decoded.foo) // bar
});
console.log(jwt.verify(token, 'shhhhh'));
// Có thêm iat(issued at) là timestamp lúc tạo ra

// Bảo mật đăng nhập / # Dùng jwt
// Dùng passport kết hợp
// Hỗ trợ authentication kể cả goole, facebook, username-password database hay jsonwebtoken
// passport là middleware, passport-jwt là 1 strategy của nó
var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require("passport-jwt");
// Tự hiểu là strategy "jwt" or có thể tự specific passport.use("jwt", new JwtStrategy({...
passport.use(new JwtStrategy({
    // fromAuthHeaderAsBearerToken thì phải truyền request có header "Authorization" và value là "Bearer <token>"
    // Tức nó tự tìm trong header Authorization và lấy ra giá trị Bearer Token
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
    secretOrKey: "shhhhh" // Cho vào .env
}, (payload, done) => {
    try{
        // Check token ở đây
        console.log("payload: ", payload)
        done(null, payload); // Thành công và trả ra payload + nhảy sang middleware tiếp theo
    }catch (err) {
        done(error, false) // Trả lỗi và k nhảy sang middleware tiếp. Mặc định lỗi trả 401 Unauthorized
    }
}))
app.get('/checkjwt', passport.authenticate('jwt', { // Dùng strategy này ở url này
    session: false, // Sau khi authen thành công thì passport sẽ thiết lập 1 session login liên tục sẽ tốt nếu đăng nhập 
    // cùng 1 trình duyệt, đa phần là k cần vì API thường yêu cầu với mỗi request thôi nên vô hiệu hóa nó
    failureRedirect: '/fail', // Thất bại hay thành công thì vào đâu
    successRedirect: '/',
}));
// Lưu ý ta k hề xử lý hay gọi verify mà chỉ cần apply passport + strategy là nó tự hiểu dùng gì làm gì
// Để test, lấy luôn token của VD jwt bên trên. Dùng cái trên nó quá trừu tượng, ta k custom được nh.

// Dùng Joi
const schema = Joi.object({
    username: Joi.string()
        .alphanum() // Chỉ chưa chữ or số
        .min(3)
        .max(30)
        .required(),
    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    repeat_password: Joi.ref('password'),
    access_token: [
        Joi.string(),
        Joi.number() // K bắt buộc check access_token phải gồm chứ và số
    ],
    birth_year: Joi.number()
        .integer()
        .min(1900)
        .max(2013),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        // Là địa chỉ email có 2 phần tên miền VD example.com và phải là .com or .net
})
    .with('username', 'birth_year') // Nếu username mà có thì buộc có birth_year
    .xor('password', 'access_token') // Phải dùng và chỉ được dùng 1 trong 2
    .with('password', 'repeat_password');
console.log(schema.validate({username: 'abc', birth_year: 1994}));
console.log(schema.validate({}));

const definition = ['key', 5, { a: true, b: [/^a/, 'boom'] }];
const schema2 = Joi.compile(definition); // Tự sinh ra type schema để check VD như dưới
const schema1 = Joi.alternatives().try( // 1 trong các giá trị bên dưới
    Joi.string().valid('key'), // string buộc là "key" mới đúng
    Joi.number().valid(5),
    Joi.object({
        a: Joi.boolean().valid(true),
        b: Joi.alternatives().try(
            Joi.string().pattern(/^a/),
            Joi.string().valid('boom')
        )
    })
);
console.log(schema1.validate("key")); // true

const schemaForObject = Joi.object().keys({
    a: Joi.any()
})
const schemaForObjectExtended = schemaForObject.keys({
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().description("Mongo DB url")
}).unknown() // Mặc định true cho phép 
console.log(schemaForObjectExtended.prefs({ errors: { label: "key" } }).validate({ b: 12})); // kqtr

// # Các package khác liên quan tới server
// Dùng http-status
console.info(status.INTERNAL_SERVER_ERROR);
console.info(status[500]); // In name lỗi

console.info(status['500_NAME']);
console.info(status[`${status.INTERNAL_SERVER_ERROR}_NAME`]); // In name

console.info(status['500_MESSAGE']);
console.info(status[`${status.INTERNAL_SERVER_ERROR}_MESSAGE`]); // In message là: Both output: "A generic error 
// message, given when an unexpected condition was encountered and no more specific message is suitable."

console.info(status['500_CLASS']);
console.info(status[`${status.INTERNAL_SERVER_ERROR}_CLASS`]); // In 5xx
console.log(status.classes.SUCCESSFUL);

// Dùng validator
var validator = require('validator');
console.log(validator.isEmail('foo@bar.com')); // => true

// # 1 số phương pháp bảo mật thông dụng / Dùng thư viện chống XSS
let stringX = "\"><script>alert(1234);</script>";
let sanitized_string = validator.escape(stringX);
console.log(" \n The input string is: ", stringX);
console.log("The sanitized string is: ", sanitized_string)

// # Dùng express / Dùng express-rate-limit
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15p
    max: 20, // 1 IP max 20 request per window per 15p
    skipSuccessfulRequests: true, // Là true thì lib sẽ skip all successful request
});
app.use('/', authLimiter);

app.get("/", function(req, res) {
    res.send("Hello World")
});

app.listen(8080);