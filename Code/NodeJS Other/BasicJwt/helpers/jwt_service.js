const JWT = require("jsonwebtoken");
const createError = require("http-errors");
const client = require("../helpers/connections_redis");

const signAccessToken = async (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      userId
    };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1m", // 10m, 10s
    };
    JWT.sign(payload, secret, options, (err, token) => {
      if(err) reject(err);
      resolve(token);
    })
  })
};

const verifyAccessToken = (req, res, next) => {
  if(!req.headers["authorization"]){
    return next(createError.Unauthorized());
  }
  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if(err){
      // Có list các loại error trong docs
      if(err.name == "JsonWebTokenError"){
        return next(createError.Unauthorized());
      }
      return next(createError.Unauthorized(err.message));
    }
    req.payload = payload;
    next();
  })
}

const signRefreshToken = async (userId) => {
  // // Dùng hàm sync
  // const payload = {userId};
  // const secret = process.env.REFRESH_TOKEN_SECRET;
  // const options = {
  //   expiresIn: "1y", // 10m, 10s
  // };
  // const token = JWT.sign(payload, secret, options); // Nếu lỗi tự throw error nên ta k try catch nữa
  // const res = await client.set(userId.toString(), token, {
  //   EX: 365*24*60*60
  // });
  // if(res == null){ // Thành công sẽ trả ra string "OK"
  //   console.log("Redis set refresh token error");
  //   throw new Error("Redis set refresh token error");
  // } else {
  //   return token;
  // }

  // Dùng callback
  return new Promise((resolve, reject) => {
    const payload = {
      userId
    };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
    };
    JWT.sign(payload, secret, options, async (err, token) => {
      if(err) return reject(err);
      const res = await client.set(userId.toString(), token, {
        EX: 365*24*60*60
      });
      // refreshtoken mới sinh ra thì refreshtoken cũ sẽ k dùng được nx
      if(res == null){ 
        console.error("Redis set refresh token error");
        reject(createError.InternalServerError()); // Nó là lỗi internal server rõ ràng
      } else {
        resolve(token);
      }
    })
  })
};

const verifyRefreshToken = async (refreshToken) => {
  // // Dùng hàm sync
  // var decoded = JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET); // Error nó tự throw
  // const res = await client.get(decoded.userId);
  // if(res == null){
  //   throw createError.InternalServerError();
  // } 
  // if(res == refreshToken) {
  //   return decoded;
  // }
  // throw createError.Unauthorized(); 

  // Dùng callback
  return new Promise((resolve, reject) => {
    JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, payload) => {
      if(err) return reject(err);
      const token = await client.get(payload.userId);
      if(token == null){
        return reject(createError.Unauthorized());
        // Chú ý resolve hay reject thì promise vẫn chạy phần còn lại. Ta dùng return để dừng hẳn ở đây
      }
      if(token == refreshToken){
        return resolve(payload); 
      }
      return reject(createError.Unauthorized());
    });
  })
};

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};