const mongoose = require("mongoose");
require("dotenv").config();

const conn = mongoose.createConnection(process.env.URI_MONGODB_NEW);

conn.on("connected", function() {
  console.log(`Mongodb:: connected ${this.name}`);
});

conn.on("disconnected", function(){
  console.log(`Mongodb:: disconnected::${this.name}`);
})

conn.on("error", function(error){
  console.log(`Mongodb:: error::${JSON.stringify(error)}`);
})

// disconnected thì kiểu bị lỗi và disconnect thì sẽ chạy vào. Nhưng terminal ta chủ động CTRL+C để disconnected thì nó lại k chạy sự kiện disconnected. Do đó phải tự tắt process khi ấn CTRL+C => bắt signkill, rồi tự close để phát sự kiện disconnected
process.on("SIGINT", async() => {
  await conn.close();
  process.exit(0);
})

module.exports = conn;