const express = require('express');
const session = require('express-session');
const app = express();
const { body } = require('express-validator');

// # Bảo mật đăng nhập / # Dùng Express session

app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'somesecret', // nên lưu trong env
  cookie: { maxAge: 6000 } // session hết hạn sau 60000 giây. Sau khoảng thời gian đó connectid k dùng được nx và phải set lại. Ở đây trong browser vẫn lưu connectid nhưng k dùng làm gì đc, lấy ra sẽ là null
}));
// Mặc định nó dùng httponly. Có nhiều thông số khác có thể set.

var server = app.listen(3000, "127.0.0.1", function () {
  var host = server.address().address
  var port = server.address().portS
  console.log("Example app listening at http://%s:%s", host, port)
});

app.get('/set_session', (req, res) => {
  req.session.User = {
    website: 'anonystick.com',
    type: 'blog javascript',
    like: '4550'
  }
  return res.status(200).json({status: 'success'})
})

app.get('/get_session', (req, res) => {
  if(req.session.User){
    return res.status(200).json({status: 'success', session: req.session.User})
  }
  return res.status(200).json({status: 'error', session: 'No session'})
})

app.get('/destroy_session', (req, res) => {
  req.session.destroy(function(err) {
    return res.status(200).json({status: 'success', session: 'cannot access session here'})
  })
})

// # 1 số phương pháp bảo mật thông dụng / Dùng thư viện chống XSS
app.post('/testxss', body('text').escape(), (req, res) => {
  res.send("The sanitized text is: " + req.body.text);
},);
// Send thử json là biết ngay:
// {
//   "text":"<script>alert(1337);</script>"
// }
