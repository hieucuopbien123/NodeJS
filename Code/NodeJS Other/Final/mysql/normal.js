// NodeJS Final / Dùng mysql2

const express = require("express");
const app = express();
const PORT = 4444;
const mysql = require("mysql2");

function getConnection() {
  return mysql.createConnection({ // Tự hiểu công 3306 của mysql
    host: "127.0.0.1",
    user: "testuser",
    password: "testpass",
    database: "aliconcon",
    insecureAuth: true,
  })
}

app.get("/normal", (req, res) => {
  const conn = getConnection();
  conn.connect(err => {
    // Chạy bất đồng bộ, connect thành công sẽ đi vào đây
    if(err){
      console.error("error connecting: ", err);
      return;
    }
    conn.query("select * from user limit 10", (error, records, fields) => {
      if(err) throw error;

      console.log("records[0]:::", records);
      res.send(records[0]);
      conn.end(); 
      // Nếu k đóng connect ở đây, chạy lệnh show processlist; trong terminal của mysql sẽ thấy dù server trả về kết quả, connection vẫn còn và lần query sau sẽ tạo connection mới thành 2 connection, phải chờ hết timeout or đóng server thì mới giải phóng hết connection.
      // Nếu đóng connect ở đây, vẫn k tốt bằng createPool vì mỗi lần gọi api là tạo mới connection và xóa sẽ lâu hơn là createPool chỉ sleep và wakeup
    })
  })
});

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});

// Phải chạy mysql ở docker trước
// Test bằng: curl http://localhost:4444/normal
