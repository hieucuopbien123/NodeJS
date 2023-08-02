// # Chia cấu trúc thư mục: như này khá chuẩn, ít nhất là gồm .env, app.js, routes, views, public, configs, bin

// # Các package khác liên quan tới server / http-errors / cookie-parser / morgan
// # Dùng dotenv
// # Dùng cors

// # Dùng express
// Hàm use của express là sử dụng 1 middleware
// Các middleware view engine

// # NodeJS Final / Debug trong nodejs

require('dotenv').config();
var express = require('express');
var app = express();

var createError = require('http-errors');

var cookieParser = require('cookie-parser');
app.use(cookieParser());

var logger = require('morgan');
app.use(logger('dev'));

var path = require('path');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const uploadRouter = require('./routes/upload');

const cors = require('cors');
app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));

// Dùng jade
// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Dùng middleware của expressjs
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware có thể là router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/uploads', uploadRouter);

// Middleware là error handler
app.use(function(req, res, next) {
  console.log("Run here");
  next(createError(404));
});
// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development => hay

  // Dùng biến môi trường
  console.log(req.app.get('env'));
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  
  // Render the error page
  res.status(err.status || 500);
  res.render('error'); // Gửi file error.jade về cho client
});

module.exports = app;