const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const initializePassport = require('./passport-config')

/*
Mô tả:
Trang / là trang home chứa mọi thú sau khi login sẽ thấy
Trang /register để đăng ký
Trang /login thì sau khi đk, có thể đăng nhập
/logout là 1 button gọi delete vào logout 
Dùng mảng users[] thay thế cho database, coi nó là database session
*/

// Bảo mật đăng nhập / # Dùng passport / Dùng passport-local
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

const users = []

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

// # Các package khác liên quan tới server
// Dùng express-flash + express-session
app.use(flash()); // Mọi request sẽ có hàm req.flash() để truyền message
app.use(session({
  cookies: { secure: true },
  secret: "test", // Dùng để encrypt information trong cookies
  resave: true, // K resave khi k có sự thay đổi
  saveUninitialized: true // Lưu cả các giá trị empty
}))

// # Dùng Passport / Dùng passport-local
app.use(passport.initialize())
// Bây giờ thì passport-local khiến cho mỗi request có thêm 4 hàm: 
// req.login()
// req.logout()
// req.isAuthenticated()
// req.isUnauthenticated()

// Dùng passport session
app.use(passport.session()) // 1 middleware khác đổi giá trị user là session id(từ cookie của client thành
// true deserialized user object). Kiểu app.use(passport.authenticate('session')); tức giá trị session phải theo 
// strategy riêng của passport ấy. VD ta dùng cái gì trong cookies thì nó sẽ đi qua passport.session và theo ta xử
// lý bên trong thì mọi request sẽ dùng được biến req.user

// # Các package khác liên quan tới server / Dùng method-override
/* 
Thư viện này giúp override các method mà client k support nên k gọi được.
VD: Client k support put method
Phía server dùng: app.use(methodOverride('X-HTTP-Method-Override'))
Phía client gọi: POST vào / và header có trường (X-HTTP-Method-Override: "PUT")
=> Nó sẽ tự động bắt và biến thành PUT vào / xử lý bên server. Middleware này nên đặt trước mọi middleware khác
*/
// Ta cũng có thể override với query string. VD: dùng như dưới và ta gọi POST vào ?_method=DELETE thì server sẽ chạy
// biến POST thành DELETE
app.use(methodOverride('_method'))

app.get("/test", (req, res) => {
  // Ta gọi vào get thì làm sao có data mà biết req.user là ai vì ai chả get được. Thật ra k đúng vì mỗi user vào nó 
  // đều serialized lưu vào session và deserialized vào req.user nên đã đăng nhập là sẽ có
  res.send(req.user.name);
})

// Gọi vào mặc định mà chưa register sẽ vào login, register rồi sẽ vào trang logout => mặc định
app.get('/', checkAuthenticated, (req, res) => {
  res.render('index.ejs', { name: req.user.name })
  // Nhờ deserializedUser mà có thể dùng req.user trực tiếp để truy cập vào đúng user hiện tại
})

// Vào login ta muốn là chưa register, nên nếu register rồi sẽ quay về mặc định
app.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs')
})

// Post vào trang login để đăng nhập sẽ check authenticate. Tùy vào loại strategy mà nó yêu cầu có middleware 
// initialize và cả authenticate ở từng url như passport-local
app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: "Invalid username or password", // failureFlash: true
  successFlash: "Welcome!",
  // Sau khi redirect thì phải thông báo người dùng biết thành công hay thất bại thì cần flash nhưng express 3 k hỗ
  // trợ mà dùng: connect-flash. => dùng middleware flash phải có express-session. 
  // flash message chỉ dùng với web nodejs mới xem được chứ connect database bth thì k
  // Nó tự động truyền vào file html với data là message.error
}), function(req, res){ // Thừa vì có successRedirect r
  res.redirect("/success");
});

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs')
})

// Post vào trang register để đăng ký sẽ hash và lưu cái đã hash vào database
app.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    users.push({
      id: Date.now().toString(),
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', (req, res) => {
  req.logOut()
  res.redirect('/login')
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  console.log("checkNotAuthenticated");
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}

app.listen(3000)

