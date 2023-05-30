// Dự án lớn có thể phải connect nhiều db 1 lúc

const mongoose = require("mongoose");

function newConnection(uri){
  const conn = mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  conn.on("connected", function() {
    console.log(`Mongodb:: connected ${this.name}`);
  });
  
  conn.on("disconnected", function(){
    console.log(`Mongodb:: disconnected::${this.name}`);
  })
  
  conn.on("error", function(error){
    console.log(`Mongodb:: error::${JSON.stringify(error)}`);
  })
  return conn;
}

const newConnection = newConnection(process.env.URI_MONGODB_NEW);
const userConnection = newConnection(process.env.URI_MONGODB_USER);

module.exports = {
  newConnection,
  userConnection
};