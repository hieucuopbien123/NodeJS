// Dùng package module-alias

require('module-alias/register')
const express = require("express");
const app = express();
const createError = require("http-errors");
require("dotenv").config();
const UserRoute = require("@routers/User.route.js");
require("@/helpers/connections_mongodb");
const client = require("./helpers/connections_redis.js");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3002;

app.get("/", async (req, res, next) => {
  res.send(await client.get("foo"));
});

app.use("/user", UserRoute);

// Bắt lỗi router
app.use((req, res, next) => {
  next(createError.NotFound("This route doesn't exist"));
})
// Bắt mọi lỗi khác
app.use((err, req, res, next) => {
  // Này là ta nghĩ lấy error từ createError http-errors là kiểu throw {status, message}, nếu biến err k có message thì sẽ tự mất vì hàm res.json sẽ tự bỏ qua các field undefined
  res.json({
    status: err.status || 500,
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})