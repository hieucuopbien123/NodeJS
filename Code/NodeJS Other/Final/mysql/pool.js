// NodeJS Final / Dùng mysql2

const express = require("express");
const app = express();
const PORT = 4444;
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "testuser",
  password: "testpass",
  database: "aliconcon",
  connectionLimit: 10 // max 10 connections
})

// Hàm execute và query giúp tự đóng connection (chuyển sang sleep) sau khi thực hiện xong 1 query đó
// Ở đây dùng callback, trong "Projects/ BlogWeb" dùng async await được
app.get("/pool", (req, res) => {
  pool.execute("select * from user limit 10", (error, records, fields) => { // pool.query y hệt
    if(err){
      console.error("error: ", err);
      res.send(err);
      return;
    }
    console.log("records[0]:1111::", records);
    res.send(records[0]);
    pool.end();
  })
});

// Nếu cần exec nhiều query có thể chỉ dùng 1 instance liên tục thay vì sleep và wakeup liên tục nhưng phải tự releaseConnection ở cuối
app.get("/connectionpool", (req, res) => {
  pool.getConnection(function(err, conn) {
    if(err){
      console.log("error::", err);
    }
    conn.query("select * from user limit 10", (error, records, field) => {
      if(error) {
        console.log("error::", error);
        res.send(error);
        return;
      }
      console.log("records[0]::3333::", records);
      res.send(records[0]);
    })
    pool.releaseConnection(conn);
  })
});

app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
