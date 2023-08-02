const axios = require("axios");
const express = require("express");
const app = express();

// # Dùng redis
const redis = require("redis");
const redisClient = redis.createClient(6379, 'redis'); // Redis server started at port 6379
const MOCK_API = "https://jsonplaceholder.typicode.com/users/";

// Trường hợp truy vấn dữ liệu qua email thông qua database
app.get("/users", (req, res) => {
    // Có thể request thử với email Sincere@april.biz
    const email = req.query.email;
    try {
        axios.get(`${MOCK_API}?email=${email}`).then(function (response) {
            const users = response.data;
            console.log("User successfully retrieved from the API");
            res.status(200).send(users);
        });
    } catch (err) {
        res.status(500).send({ error: err.message });
    }
});

// Trường hợp truy vấn dữ liệu qua email thông qua cache của redis đẩy nhanh tốc độ request
app.get("/cached-users",async (req, res) => {
    const email = req.query.email;
    try {
        try{
        await redisClient.connect();
        }catch(e) {
            console.log(e);
        }
        const data = await redisClient.get(email);
        if (data) {
            console.log("User successfully retrieved from Redis");
            res.status(200).send(JSON.parse(data));
        } else {
            const response = await axios.get(`${MOCK_API}?email=${email}`);
            console.log(response);
            if(response){
                const users = response.data;
                // Request chưa có trong cache thì query bth r lưu vào cache
                // Hàm setEx thì key vẫn là đối dố 1, value là đối số thứ 3, nhưng thêm đối số 2 là timeout. Redis sẽ lưu cặp key value này trong khoảng giá trị timeout r tự bị xóa. setEx cx là hàm atomic 
                redisClient.setEx(email, 600, JSON.stringify(users)); // Chỉ tồn tại trong 600s
                console.log("User successfully retrieved from the API");
                res.status(200).send(users); // Mặc định status tự xác định
            };
        }
    } catch (err) {
        res.status(500).send({ error: err.message });
    }finally{
        redisClient.quit();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});