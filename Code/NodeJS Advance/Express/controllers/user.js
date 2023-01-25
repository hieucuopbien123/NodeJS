var users = [
	{id: 1, name: "User111", email: "user1@gmail.com", age: 31, avatar: 'images/user1.png'}, 
	{id: 2, name: "User2", email: "user2@gmail.com", age: 20, avatar: 'images/user2.png'},
	{id: 3, name: "User1", email: "user1.2@gmail.com", age: 25, avatar: 'images/user3.png'}
];
module.exports = {
    index: function (req, res) {
        res.render('user', {
            users: users
        });
    },
    search: (req, res) => {
        var name_search = req.query.name
        var age_search = req.query.age 
        var result = users.filter( (user) => {
            return user.name.toLowerCase().indexOf(name_search.toLowerCase()) !== -1 && user.age === parseInt(age_search)
        })
        res.render('user', {
            users: result 
        });
    },
    getCreate: (req, res) => {
        res.render('createuser')
    },

    // # Dùng express / Dùng req và res / Dùng redirect bản chất 
    postCreate: (req, res) => {
        console.log(req.body)
        users.push(req.body);
        res.redirect('/users')
        // res.render("user",{ users: users });
    },
    // Phân tích: ta dùng redirect để gửi method post xong sẽ gửi tiếp method get tới server. Nếu dùng render nó sẽ 
    // render lên 1 file html mới nhưng vẫn ở trang cũ là users/create -> điều đó là không tốt vì thực tế ta phải sang
    // trang mới r. Nút F5 có vai trò là gửi lại request gần nhất. Do đó nếu ta dùng render: ta vào post sau đó nó vẫn
    // giữ nguyên trang và render ra file user.pug(k đổi url) -> ta F5 -> request gần nhất là POST-> nó lại post server
    // tiếp user vừa mới post, thành ra 2 lần. Đó là lý do mà người ta dùng redirect để khi người dùng reload lại trang,
    // nó sẽ gửi lại method get chứ kp post tiếp. Ta cx có thể xử lý bên server là post 2 lần chỉ coi là 1 ok. 
    // Vấn đề nx là user ta lưu trong file JS này nên mỗi lần khởi động lại server là mọi thứ sẽ mất, để lưu và thay đổi
    // được vĩnh viễn ta phải lưu trên database như file json riêng or dùng sql

    getId: (req, res) => {
        var user = users.find( (user) => {
            return user.id == parseInt(req.params.id); // Tìm user có id đó và gửi
            // Khi dùng router params thì params đó được lưu vào trường params của req
        });
        res.render('show', {
            user: user
        })
    }
}