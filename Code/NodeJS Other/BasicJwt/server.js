const express = require("express");
const app = express();
const createError = require("http-errors");
require("dotenv").config();
const UserRoute = require("./routers/User.route.js");
require("./helpers/connections_mongodb");

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const PORT = process.env.PORT || 3002;

app.get("/", (req, res, next) => {
  res.send("Home page");
});

app.use("/user", UserRoute);

// Bắt lỗi router
app.use((req, res, next) => {
  next(createError).NotFound("This route doesn't exist");
})
// Bắt mọi lỗi khác
app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
