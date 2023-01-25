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

    // Tạo Model từ Schema và thao tác với model thay đổi documents
    const MyModel = mongoose.model('Test', new Schema({ name: String }));
    var doc = await MyModel.findOne(); // K có là ra null
    var doc = new MyModel(); // 1 doc luôn đi với 1 model
    console.log(doc instanceof MyModel); // true
    console.log(doc instanceof mongoose.Model); // true
    console.log(doc instanceof mongoose.Document); // true

    // Nếu doc ta tìm ra k có gì thì gán bên dưới sẽ lỗi, nhưng nếu có thì hàm gán bên dưới sẽ thay đổi sang giá trị
    // foo tức tương đương với lệnh updateOne còn gì
    doc.name = 'foo';
    // Tương đương với `updateOne({ _id: doc._id }, { $set: { name: 'foo' } })` trong MongoDB.
    // $set là internal name thêm vào các thứ của mongodb để tránh conflict
    await doc.save();

    var doc = await MyModel.findOne();
    await MyModel.deleteOne({ _id: doc._id }); // Xóa là mất, k thể cạp nhập tiếp biến doc value vừa lấy

    console.log(await MyModel.findOneAndUpdate(null, {name: "ST"}, {new: true}));
    // Cái 3 là option có nhiều cái VD new mặc định là false trả ra data cũ, true sẽ trả ra data mới được update

    const schema = new Schema({ name: String, age: { type: Number, min: 0 } });
    const Student = mongoose.model('Student', schema);
    let p = new Student({ name: 'foo', age: 'bar' });
    let p2 = new Student({ name: 'foo', age: -1 });
    let p3 = new Student({ name: 'foo', age: 100 });
    await p.validate(function(err) {
        console.log("Err1 " + err);
    });
    const err = p2.validateSync(); // k còn bất đồng bộ
    if (err) {
        console.log("Err2 " + err);
    }
    // Khi ta đăng lên database thì nó cũng tự check validation cho ta rồi. Nhưng ta có thể tự tạo ra các biến document
    // như này thì k có lỗi, ta vẫn có thể yêu cầu check bằng hàm validate như v. Nó sẽ throw error nếu sai

    // await Student.updateOne({}, { age: 'bar' }, { runValidators: true }); // Cái option runValidators nếu k có thì nó vẫn tự check cho ta thôi

    // Có 2 cách để ghi đè
    var doc = await Student.findOne({});
    doc.overwrite({ name: 'Freetuts.net' });
    // await doc.save(); // overwrite phải có save()

    // await Student.replaceOne({}, { name: 'Freetut.net' });

    // Thao tác với subdocuments: cx chỉ là schema con bên trong
    var childSchema = new Schema({ name: 'string' });
    var parentSchema = new Schema({
        children: [childSchema], // 1 type schema custom có thể nhét vào
        child: childSchema,
        children2: [{ // Có thể thấy children và children2 là như nhau nhưng dùng childSchema riêng có lợi riêng
            name: String
        }]
    });
    var Parent = mongoose.model("Parent", parentSchema);
    var parent = new Parent({
        children2: [{ name: "Freetuts.net" }, { name: "Hoc lap trinh" }]
    });
    console.log(parent.children2[0].name);
    parent.children2[1].name = "Node.js";
    // parent.save(function (err, data) {
    //     if (err) return console.error(err);
    //     console.log(data);
    // });
    
    // subdocument k tự động lưu khi có sự thay đổi mà phải đợi documents cha lưu trước. Hiển nhiên vì ta gán tay mà
    // Khi gọi vào middleware như save, validate,.. của cha thì cũng gọi vào tất cả thứ đó của con. VD ở đây con có 1
    // middware tên là save sẽ forward đi 1 error. parent gọi save sẽ gọi vào con trước r gọi vào cha console.log ra 
    // cái error message là #sadpanda và do error nên k thực hiện lưu document mới là invalid
    childSchema.pre('save', function (next) {
        // return next(new Error('#sadpanda'));
    });
    var parent = new Parent({ children: [{ name: 'invalid' }] });
    // await parent.save(function (err) {
    //     if(err) console.log(err.message) // #sadpanda
    // });

    // Con gọi trước r đến cha
    var childSchema1 = new mongoose.Schema({ name: "string" });
    childSchema1.pre("validate", function(next) { // Middleware luôn nhận vào next
        console.log("childSchema validate.");
        next();
    });
    // Vc dùng next sẽ khiến nó chuyển sang middleware tiếp theo nhưng vẫn chạy các câu lệnh bên dưới của middleware
    // hiện tại. Ta có thể return next() để dừng luôn các câu lệnh bên dưới nếu muốn
    childSchema1.pre("save", function(next) {
        console.log("childSchema save.");
        next();
    });
    var parentSchema1 = new mongoose.Schema({
        child1: [childSchema1]
    });
    parentSchema1.pre("validate", function(next) {
        console.log("parentSchema validate");
        next();
    });
    parentSchema1.pre("save", function(next) {
        console.log("parentSchema save");
        next();
    });
    var Parent1 = mongoose.model('Parent1', parentSchema1);
    var parent1 = new Parent1({child1: [{name: 'Freetuts.net'}, {name: 'Lap trinh NodeJS'}]})
    // parent1.save();

    // Tìm trong cha có con nào
    // var parent1 = await Parent1.findOne();
    // if(parent1)
        // console.log("Data: " + parent1.child1.id("626d04a8568037bbdeaa0761")); // => k hoạt động
    
    // Thao tác với từng document
    // Thêm vào cha 1 con nx khi 1 trường là array mảng con
    var parent2 = new Parent1;
    parent2.child1.push({ name: 'Freetuts.net' }, {name: "K bi xoa"});
    var subdoc = parent2.child1[0];
    console.log(subdoc) // In cái subdoc ra
    console.log(subdoc.isNew); // true vì mới tạo bên trên
    // await parent2.save(function (err) { if (err) console.log(err)});
    // parent2.child1.id(subdoc._id).remove(); // xóa con đầu tiên luôn
    // Điều thú vị là với từng con nó sẽ chạy middleware của con luôn, ở đây có 2 con nhưng chỉ chạy middleware 1 lần
    // vì ta xóa 1 con đầu tiên đi r. Ta k rõ thứ tự như nào nhưng nó xóa trước r mới thêm con vào cha

    // var newdoc = await parent2.child1.create({ name: 'Freetut.net' });
    // console.log(newdoc); // Hàm create nó chỉ tạo chứ éo lưu vào con nên k dùng vì ở đây ta create từ child1 là 1 subdocs
    // await parent2.save(function (err) { if (err) console.log(err)});

    var parent2 = new Parent1;
    parent2.child1.push({ name: 'Freetuts.net' }, {name: "K bi xoa"});
    // await parent2.save();
    parent2.child1 = null; // Cách xóa tất cả con(phải có save). Ở đây database sẽ chứa cha bên trong có con là null
    // await parent2.save();
    // Gọi 2 hàm save 1 lúc sẽ bị lỗi, ta phải dùng async await để fix. Dùng await thì phải bỏ callback function đi
}); 