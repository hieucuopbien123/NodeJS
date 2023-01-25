// # Dùng redis

const redis = require("redis");

(async () => {
    const client = redis.createClient(6379); // Mặc định nó cũng chạy trên 127.0.0.1:6379
    client.on('error', (err) => console.log('Redis Client Error', err));
    client.on('connect'     , () => console.log('connect'));
    client.on('ready'       , () => console.log('ready'));
    client.on('reconnecting', () => console.log('reconnecting'));
    client.on('error'       , () => console.log('error'));
    client.on('end'         , () => console.log('end'));

    await client.connect();
    console.log(await client.ping());
    const data = await client.setNX("test", "Fun"); // Trả ra true or false, có set được hay k
    // setNX là async, setX là sync
    console.log(data);
    client.set("name", "Flavio");
    client.set("age", 37);
    const value = await client.get("name");
    console.log(value);
    client.del("name");

    // Chuyển qua thao tác với list
    client.lPush('names', 'Flavio'); // Push vào đầu list
    client.rPush('names', 'Roger'); // Push vào cuối list
    client.lPush('names', 'Syd')
    const result = await client.lRange('names', 0, -1); // Lấy giá trị mảng
    client.rPop('names')
    console.log(result);
    client.del('names'); // Xóa list

    // Thao tác với set
    client.sAdd('nameset', 'Flavio')
    client.sAdd('nameset', 'Roger', 'Syd') // Add multiple item
    var names = ['Flavio', 'Roger', 'Syd']
    client.sAdd('nameset', names)
    var names = await client.sMembers('nameset');
    console.log(names);
    client.sPop('nameset'); // Xóa 1 item bất kỳ từ set
    client.sPop('nameset', 3); // Xóa 3 item bất kỳ từ set
    client.del('nameset'); // Xóa cả set

    // Working with hash
    client.hSet('person:1', 'name', 'Flavio', 'age', 37); // Từng cặp key val liên tiếp
    client.hSet('person:1', 'age', 38); // Update hash
    client.hIncrBy('person:1', 'age', 1); // hIncrBy sẽ tăng giá trị số lên bao nhiêu. Tương tự cx có incrBy, decrBy
    const items = await client.hGetAll('person:1');
    console.log(items);
    client.del('person:1');

    // 1 người gửi message tới channel là tất cả subscriber nhận được
    const subscriber = client.duplicate(); // or gọi lại createClient
    await subscriber.connect();
    // await subscriber.subscribe('dogs', (message) => { // channel dogs
    //     console.log(message);
    // }) // Đương nhiên có hàm unsubscribe
    client.publish('dogs', 'Roger'); // k lưu vào redis mà chỉ các subscriber nhận được. Nó cho phép 2 người lạ trò 
    // chuyện được với nhau như socket, tương tự 1 trình chuyển tiếp tin nhắn

    // Chức năng chính của redis là nó làm cache tăng tốc request gần như tức thời. Nếu dữ liệu k có cache mới truy vấn 
    // vào database r lại cập nhập vào cache.

    client.quit();
})();