// # Dùng Passport / Dùng passport-local 

const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function initialize(passport, getUserByEmail, getUserById) {
  // getUserByEmail, getUserById tìm user bằng email và bằng id

  const authenticateUser = async (email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }
    console.log(password);

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  // 1 là option, 2 là hàm số xử lý khi nhận được trả ra done(,false) hay done(,user)
  // Option này bảo là username check phải là dạng email, thế thôi, các trường được truyền vào callback theo thứ tự
  // Giá trị trường ở đây là thứ ta pass vào trong form đó
  passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));

  // Ở đây ta dùng 2 middleware: 1 là local check username password như trên; 2 là session serialized
  // Cái middleware này có 2 hàm serializeUser để lưu user vào session và deserializeUser để truyền data đi khiến cho
  // mọi req đều dùng được.
  passport.serializeUser((user, done) => {
    console.log("Run to serialize");
    console.log(user);
    done(null, user.id);
  })
  // Lấy từ session gắn vào req.user => req.user bh đã tồn tại ở mỗi request, 1 là cái params 2 truyền vào done bên trên
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize

/*
Để dùng passport-local: require nó -> cho nó use cái strategy local -> định nghĩa hàm authenticate cho nó
-> định nghĩa serializeUser và deserializeUser cho biến passport -> cho app use middleware này -> ở url nào dùng nó
thì gọi là xong
Quy trình: đầu tiên với app ta cứ thao tác bình thường với các url, nhưng khi gọi vào url mà dùng middleware passport, 
nó sẽ chạy strategy bắt 2 trường username và password, và tùy vào gọi done false hay thành công mà cho kết quả tương
ứng -> tiếp theo nó tự chạy vào serialize để mọi request kể từ h đều dùng được biến user. Nếu k dùng serialize thì 
biến req.user chỉ dùng được trong url này ở case này thôi, user đó gọi tiếp k có nên muốn lấy ở mọi url phải dùng nv
=> Ở đây nó tự phối hợp. Rõ ràng login thì nó serialize thì mọi request ở mọi url đều có biên user, nhưng khi logOut 
nó tự mất là vì passport-local cung hàm req.logOut xử lý hết xóa req.user rồi.
=> Serialize tự được thực hiện ngay sau authenticateUser và middleware này chỉ thực hiện khi gọi vào url dùng nó
=> 4 hàm mà nó cung sẵn cho req là đủ bộ để tạo web có register, login, logout đầy đủ nhưng chỉ với web nodejs thôi
nên cũng ít dùng
*/