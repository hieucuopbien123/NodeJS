const express = require("express");
const route = express.Router();
const { verifyAccessToken } = require("../helpers/jwt_service");
const UserController = require("../Controllers/User.controller");

route.post("/register", UserController.register);
route.post("/refresh-token", UserController.refreshToken);
route.post("/login", UserController.login);
route.post("/logout", UserController.logout);
route.get("/getlists", verifyAccessToken, UserController.getlist);

module.exports = route;