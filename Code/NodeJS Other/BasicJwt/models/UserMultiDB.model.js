const mongoose = require("mongoose");

// Khi dùng multidb cùng lúc 

const { newConnection, userConnection } = require("../helpers/connections_multi_mongodb");

const UserSchemaNew = mongoose.Schema({
  username: {
    type: String,
    lowercase: true, 
    unique: true,
    required: true
  },
  password: {
    type: String, 
    required: true
  }
})

const UserSchemaUser = mongoose.Schema({
  username: {
    type: String,
    lowercase: true, 
    unique: true,
    required: true
  },
  password: {
    type: String, 
    required: true
  }
})

module.exports = {
  new: newConnection.model("users", UserSchemaNew),
  user: userConnection.model("users", UserSchemaUser),
};