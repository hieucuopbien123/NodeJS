const express = require("express")
const app = express();
const faker = require('faker');
const winston = require('winston');
var httpMocks = require('node-mocks-http');
const request = require('supertest');

// # Các package backend NodeJS thường dùng
// Dùng faker
console.log(faker.internet.email().toLowerCase());
console.log(faker.name.findName());

// Dùng winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        // - Write all logs with importance level of `error` or less to `error.log`
        // - Write all logs with importance level of `info` or less to `combined.log`
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
    ],
});

// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}
// Tức bh in ở cả console và file combined.log
logger.log({
    level: 'info',
    message: 'Hello distributed log files!'
});

// Dùng node-mocks-http
const checkMiddleware = (req, res, next) => {
    if(req.params.name == "hieu"){
        console.log("yes");
    }else{
        console.log('No');
    }
    next();
}
app.get("/", checkMiddleware, function(req, res) {
    res.send(faker.name.findName())
});
var requestMock  = httpMocks.createRequest({
    method: 'GET',
    url: '/',
    params: {
        name: "hieu"
    }
});
var response = httpMocks.createResponse();
checkMiddleware(requestMock, response, () => {});
// console.log(response); // Tự fake hết tất cả các trường


app.get('/user', function(req, res) {
    res.status(200).json({ name: 'john' });
});

request(app)
.get('/user')
.expect('Content-Type', /json/)
.expect('Content-Length', '15')
.expect(200) // VD 201 sẽ báo lỗi
.end(function(err, res) {
    // console.log(res);
    if (err) throw err;
})

app.listen(8080);