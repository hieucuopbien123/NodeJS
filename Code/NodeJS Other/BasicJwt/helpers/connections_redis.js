const redis = require("redis");
const client = redis.createClient({
  port: 1,
  host: "127.0.0.1",
  // legacyMode: true // dùng như v3 là tự động connect nhưng v4 gọi v3 k ổn đâu
});

// client.on("error", function(error) {
//   console.error("err");
//   // Bắt xong éo process.exit(0); thà để mặc định nó tự in lỗi và dừng ct còn hơn
// });

client.on("connect", async function() {
  try{
    console.log(await client.ping());
    // await client.set("foo", "x", { EX: 100 });
    // console.log(await client.get("foo"));
    // await client.disconnect();
  } catch(err){
    console.log("Err init redis:: ", err);
  }
});

client.on("ready", function() {
  console.log("Redis is ready");
});

async function connectRedis() {
  await client.connect();
}
connectRedis();
// Connect và duy trì 1 instance mãi mãi

module.exports = client;