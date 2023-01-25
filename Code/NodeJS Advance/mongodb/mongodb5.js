var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hieu:NguyenThuHieu123@cluster0.xfemg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
    {useNewUrlParser: true,  useUnifiedTopology: true}
);
var db = mongoose.connection;
db.on('error', function(err) {
    if (err) console.log("Error: " + err)
});
db.once('open', async function() {
    var Schema = mongoose.Schema;
    
    var personSchema = new Schema({
        name: {
            first: String,
            last: String
        },
        occupation: { type: String, default: "talk show host"}
    });
    var Person = mongoose.model('Person1', personSchema);

    // Thao tác với query helper: có 2 cách tạo 1 query chính
    // With a JSON doc => nhiều kiểu dùng conditional
    Person. find({
        occupation: /host/,
        'name.last': 'Ghost',
        age: { $gt: 17, $lt: 66 },
        likes: { $in: ['vaporizing', 'talking'] } // Trường like mang giá trị là 1 giá trị nào đó trong mảng
    }).limit(10).sort({ occupation: -1 }) // sort giảm dần occupation
    .select({ name: 1, occupation: 1 }).exec(function(err, data) {
        if(err) console.log(err);
        console.log(data);
    });

    // Using query builder
    Person.find({ occupation: /host/ })
    .where('name.last').equals('Ghos')
    .where('age').gt(17).lt(66)
    .where('likes').in(['vaporizing', 'talking']).limit(10).sort('-occupation')
    .select('name occupation').exec(function(err, data) {
        if(err) console.log(err);
        console.log(data);
    });
    // Nếu gặp data mà k có trường age chẳng hạn thì nó coi là thỏa mãn và vẫn lấy

    // Tạo Model từ Schema và thao tác với model thay đổi documents
    const q = Person.updateMany({'name.last': "Ghost"}, {'name.last': "Ghos"});
    await q.then(() => console.log('Update 2')); // Khi dùng then thì mới thực hiện
    // Chỉ được thực hiện 1 lần. Nếu q.then 2 lần là sai. Nó k cho lưu query vào biến mà gọi liên tiếp, ta có thể tạo 
    // static function để lưu query xong gọi lúc nào cx được

    // Thao tác với cursor, aggregation, populate
    // Ta cần thao tác event với 1 list các document thỏa mãn điều kiện gì đó thì dùng cursor
    var cursor = Person.find({ occupation: /host/ }).cursor();
    cursor.on('data', function(doc) {
        console.log("Có thể được gọi ở bất cứ document nào: " + doc);
    });
    cursor.on('close', function() {
        console.log("Gọi xong"); // Được gọi khi đã hoàn tất
    });

    // Versus Aggregation: tính năng này có thể làm những thứ như query. Chỉ dùng nó khi thực sự cần thiết vì kết quả trả 
    // ra là POJOs(plain old js object), kp là 1 mongoose documents => nch là k dùng
    const docs = await Person.aggregate([{ $match: { 'name.last': 'Ghos' } }]);
    console.log(docs[0] instanceof mongoose.Document); // false
    console.log(docs);
    
    // Aggregate cx k tự cast kiểu dữ liệu như gọi query bth
    const doc = await Person.findOne();
    const idString = doc._id.toString();
    const queryRes = await Person.findOne({ _id: idString }); // ok vì tự cast string sang ObjectId của MongoDB
    const aggRes = await Person.aggregate([{ $match: { _id: idString } }]); // K tự cast nên k tìm thấy id ra mảng rỗng
    console.log(queryRes);
    console.log(aggRes);

    // Validation
    var catSchema = new Schema({
        name: {
            type: String,
            required: [true, "Phai co name"] // Ghi đè message
        }
    });
    var Cat = db.model('Cat', catSchema);
    var cat = new Cat(); // Thiếu tên
    cat.save(function(error) {
        console.log("Error1: " + error); // Vì nó đã check lỗi validate r
        error = cat.validateSync();
        console.log("Error2: " + error); // Check lại vẫn sẽ ra đúng lỗi đó thôi
    });

    // Asynchronous Validation
    const userSchema = new Schema({
        name: {
            type: String,
            validate: () => Promise.reject(new Error('Oops!'))
        },
        email: {
            type: String,
            // Dùng hàm validator trả ra chỉ khi trả ra true mói không lỗi. Nó dùng validate bất đồng bộ
            // VD ở dưới resolve(true) sẽ k lỗi, resolve false vẫn lỗi
            validate: {
                validator: () => Promise.resolve(false),
                message: 'Không thể xác minh email'
            }
        }
    });
    const User = db.model('User', userSchema);
    const user = new User();
    user.email = 'test@test.co';
    user.name = 'test';
    user.validate().catch(error => {
        if(error.errors['name']) // error xảy ra ở trường name
            console.log(error.errors['name'].message);
        if(error.errors['email'])
            console.log(error.errors['email'].message);
    });


    // // Middleware ở phiên bản v5 cho phép return về 1 promise thay cho việc dùng next
    // userSchema.pre('save', function() {
    //     return doStuff().then(() => doMoreStuff()); // Ở đây phải tạo ra hàm bất đồng bộ từ trước
    // });
    // // Or, in Node.js >= 7.6.0 cho phép k cần return luôn
    // userSchema.pre('save', async function() {
    //     await doStuff();
    //     await doMoreStuff();
    // });

    // Dùng middleware
    // Thông thường 1 middleware bị lỗi sẽ kéo theo các middleware sau bị dừng lại
    // hàm callback or return promise. Ta có thể tái hiện điều đó
    userSchema.pre('save', function(next) {
        const err = new Error('something went wrong');
        // Gọi next() mà truyền vào một tham số err 
        next(err);
    });
    userSchema.pre('save', function() {
        // Return về một promise rồi reject lỗi
        return new Promise((resolve, reject) => {
            reject(new Error('something went wrong'));
        });
    });
    userSchema.pre('save', function() {
        // Throw error như là một tác vụ đồng bộ
        throw new Error('something went wrong');
    });
    // Còn 1 cách bắt lỗi nx là trong từng document thì save có hàm callback(err, data) mà ta có thể bắt err

    userSchema.post('init', function(doc) {
        console.log('%s đã được bắt đầu', doc._id);
    });
    userSchema.post('validate', function(doc) {
        console.log('%s đã được validate (nhưng chưa luư )', doc._id);
    });
    userSchema.post('save', function(doc) {
        console.log('%s Đã được lưu', doc._id);
    });
    userSchema.post('remove', function(doc) {
        console.log('%s Đã được remove', doc._id);
    });

    // Khi có nhiều post hook cùng tên nó sẽ gọi lần lượt. Ở đây sẽ thực hiện middleware này đầu tiên
    userSchema.post('save', function(doc, next) {
        setTimeout(function() {
            console.log('post1');
            next();
        }, 10);
    });
    // Sau đó đợi middleware trên gọi next() thì middleware này mới chạy
    userSchema.post('save', function(doc, next) {
        console.log('post2');
        next();
    });
    // Error handling middleware là 1 loại riêng có 3 tham số là middleware chuyên bắt lỗi
    userSchema.post('save', function(error, doc, next) { // Middleware bắt lỗi sẽ có 3 tham số
        if (error.name === 'MongoError' && error.code === 11000) {
            next(new Error('There was a duplicate key error'));
        } else {
            next();
        }
    });
    // Tại sao ta nói là middleware lỗi sẽ k gọi các middleware sau mà ta lại gọi next(error) cho nó ? Là vì khi truyền
    // error vào next thì nó sẽ tìm middleware chuyên bắt lỗi để xử lý và cuối cùng chạy ra ngoài kết thúc luôn. Do đó
    // cái callback của hook thg xử lý thêm error, bỏ qua các middleware bth

    // Có nhiều middleware phải tách riêng ra như ở dưới document gọi remove hay khi query gọi remove sẽ khác nhau
    // document middleware
    catSchema.pre('remove', { document: true }, function() {
        console.log('Removing doc!');
    });
    // query middleware.
    catSchema.pre('remove', { query: true }, function() {
        console.log('Removing!');
    });
    const Cat2 = db.model('Cat2', catSchema);
    const cat2 = new Cat2({name: "Hieu"});
    await cat2.save();
    Cat2.remove({name: "Hieu"}, function (err, result) {
        if (err){
            console.log(err)
        }else{
            console.log("Result :", result) 
        }
    });
    // Từ model ta có thể remove document trong nó như này or bản thân document remove con của nó thì gọi vào
    // document middleware hay query middleware tương ứng. Tuy nhiên hàm remove của model đã bị deprecated và h thay
    // bằng bộ: deleteOne, deleteMany, bulkWrite rồi
}); 