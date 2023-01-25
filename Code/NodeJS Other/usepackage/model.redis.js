// Dùng redis / # Basic

"use strict"
const redis = require("redis");
const client = redis.createClient(6379);

// Tạo ra 1 hàm connect và gọi connect khi cho server khởi chạy listen
const connect = async() => {
    try{
        await client.connect(); 
    }catch(err) {
        console.log(err);
    }
}

const get = async (key) => {
    try{
        return await client.get(key);
    }catch(err){
        console.log(err);
    }
}

const set = async (key, count) => {
    try{
        await client.set(key, count);
    }catch(err) {
        console.log(err);
    }
}

const incrby = async (key, count) => {
    try{
        return await client.incrBy(key, count);
    }catch(err) {
        console.log(err);
    }
}

const decrby = async (key, count) => {
    try{
        return await client.decrBy(key, count)
    }catch(err) {
        console.log(err);
    }
}

const exists = async (key) => {
    try{
        return await client.exists(key);
    }catch(err) {
        console.log(err);
    }
}

const setnx = async (key, count) => {
    try{
        return await client.setnx(key, count);
    }catch(err) {
        console.log(err);
    }
}

module.exports = {
    get,
    set,
    incrby,
    exists,
    setnx,
    decrby,
    connect
}