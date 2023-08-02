const mongoose = require("mongoose");
const dbConnection = require("../helpers/connections_mongodb");
const bcrypt = require("bcrypt");

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
});

// Bắt trước khi chạy lệnh save của model sẽ chạy middleware này trước
UserSchema.pre('save', async function(next){
  try {
    console.log("Called before save:::", this.email, this.password);
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(this.password, salt);
    this.password = hashPassword;
    next();
  } catch (error) {
    next(error);
  }
})

UserSchema.methods.isCheckPassword = async function(password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch(error){

  }
}

module.exports = dbConnection.model("users", UserSchema);