const User = require("models/User.model");
const createError = require("http-errors");
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require("../helpers/jwt_service");
const client = require("../helpers/connections_redis");
const { userValidate } = require("../helpers/validation");

module.exports = {
  register: async (req, res, next) => {
    try{
      const { email, password } = req.body;
  
      // K nên check thô như này
      // if(!email || !password){
      //   throw createError.BadRequest();
      // }
      const { error } = userValidate(req.body);
      if(error){
        console.log(`::error validation::`, error);
        throw createError(error.details[0].message);
      }
  
      const isExist = await User.findOne({
        username: email,
      });
      if(isExist){
        throw createError.Conflict(`${email} is already been registerd`);
      }
      
      // create của mongodb có lưu vào db nhưng k bắt được chạy middleware, phải dùng save
      // const isCreate = await User.create({
      //   username: email,
      //   password
      // })
      const user = new User({
        username: email, 
        password
      });
      const saveUser = await user.save();
  
      return res.json({
        status: "okey",
        elements: saveUser
      })
    } catch(error){
      next(error);
    }
  },
  refreshToken: async (req, res, next) => {
    try {
      console.log(req.body);
      const { refreshToken } = req.body;
      if(!refreshToken) throw createError.BadRequest();
      const { userId } = await verifyRefreshToken(refreshToken);
      const accessToken = await signAccessToken(userId);
      const refToken = await signRefreshToken(userId);
      console.log(refToken);
      res.json({
        accessToken,
        refToken
      });
    } catch(error){
      next(error);
    }
  },
  login: async (req, res, next) => {
    try{
      const { error } = userValidate(req.body);
      if(error){
        console.log("Error::", error);
        throw createError(error.details[0].message);
      }
      const { email, password } = req.body;
      const user = await User.findOne({username: email});
      if(!user){
        throw createError.NotFound("User not registered");
      }
      const isValid = await user.isCheckPassword(password);
      if(!isValid){
        throw createError.Unauthorized();
      }
      const accessToken = await signAccessToken(user._id);
      const refreshToken = await signRefreshToken(user._id);
      res.json({
        accessToken,
        refreshToken
      });
    } catch (error){
      next(error);
    }
  },
  logout: async (req, res, next) => {
    try{
      const { refreshToken } = req.body;
      if(!refreshToken){
        throw createError.BadRequest();
      }
      const { userId } = await verifyRefreshToken(refreshToken);
      const resRedis = await client.del(userId.toString());
      if(resRedis == 1){
        res.json({
          message: "Logged out!"
        })
      } else {
        throw createError.InternalServerError();
      }
    } catch(err){
      next(err);
    }
  }, 
  getlist: (req, res, next) => {
    const listUsers = [
      {
        email: "abc@gmaill.com",
      },
      {
        email: "def@gmaill.com",
      }
    ];
    res.status(200).json({listUsers});
  }
};