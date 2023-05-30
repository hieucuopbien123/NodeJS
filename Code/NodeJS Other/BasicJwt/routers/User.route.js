const express = require("express");
const route = express.Router();
const User = require("../models/User.model");
const createError = require("http-errors");

const { userValidate } = require("../helpers/validation");

route.post("/register", async (req, res, next) => {
  try{
    const { email, password } = req.body;

    // if(!email || !password){
    //   throw createError.BadRequest();
    // }
    const { error } = userValidate(req.body);
    console.log(`::error validation::`, error);
    if(error){
      throw createError(error.details[0].message);
    }

    const isExist = await User.findOne({
      username: email,
    });
    if(isExist){
      throw createError.Conflict(`${email} is already been registerd`);
    }
    const isCreate = await User.create({
      username: email,
      password
    })
    return res.json({
      status: "okey",
      elements: isCreate
    })
  } catch(error){
    next(error);
  }
})
route.post("/refresh-token", (req, res, next) => {
  res.send("function refresh-token");
})
route.post("/login", (req, res, next) => {
  res.send("function login");
})
route.post("/logout", (req, res, next) => {
  res.send("function logout");
})

module.exports = route;