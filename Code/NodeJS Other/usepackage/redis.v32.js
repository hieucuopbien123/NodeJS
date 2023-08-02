const redis = require('redis');
const client = redis.createClient();
const express = require('express');
const app = express();

// Thực tế phải cho tất cả vào hàm async để thành công mới setup redis. Ở đây chạy local nên connect nhanh được thôi
const connectRedis = async () => {
  await client.connect();
}
connectRedis();

client.configSet('notify-keyspace-events', 'Ex'); 
client.subscribe('__keyevent@0__:expired', (message) => { // Or dùng: await client.pSubscribe('__keyspace@*__:*');
  console.log("message::", message);
});

app.listen( process.env.PORT || 3010, async () => {
  console.log(`EventListener is running 3010`);
})
