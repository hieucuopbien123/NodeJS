const mongoose = require("mongoose");

const dbConnection = require("../helpers/connections_mongodb");

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    lowercase: true, // Khi lưu vào DB sẽ tự chuyển sang lowercase
    unique: true,
    required: true
  },
  password: {
    type: String, 
    required: true
  }
})

module.exports = dbConnection.model("users", UserSchema);