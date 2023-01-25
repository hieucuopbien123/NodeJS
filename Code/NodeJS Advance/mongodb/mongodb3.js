var mongoose = require('mongoose');
mongoose.connect('mongodb+srv://hieu:NguyenThuHieu123@cluster0.xfemg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
    {useNewUrlParser: true,  useUnifiedTopology: true}
);
var db = mongoose.connection;
db.on('error', function(err) {
    if (err) console.log("Error: " + err)
});
db.once('open', async function() {
    console.log("Kết nối thành công !");
    var Schema = mongoose.Schema;
    
    // Thao tác với Schema SchemaTypes
    var staffSchema = new Schema({
        name: {
            type: String,
            required: function() {
                this.age > 0 // Trong 1 instance mới thêm vào thì age phải lớn hơn 0 mới bắt buộc thêm name người đó
            }
        },
        age: Number
    });
    var Staff = mongoose.model('Staff', staffSchema);

    // Tạo Model từ Schema và thao tác với model thay đổi documents
    // Staff.create({ name: 'Hello', age: 10 }, function (err, data) {
    //     if (err) return console.log(err);
    // })
    Staff.find({ name: 'Hello' }).where('age').gt(1).exec(function(err,data) {
        console.log("Hello " + data);
    });
    // Khi tất cả các query độc lập nhau thì ta sẽ dùng callback function với đối số 2 or hàm exec như trên nhưng nếu muốn query sau thực hiện 
    // sau khi query trước thực hiện thì phải await. VD ở trên ta muốn thêm vào 1 data mới sau đó mới find thì phải dùng await sẽ chuẩn
    // Ta có thể query trực tiếp như này or tạo ra static function cho schema mà dùng. Nếu find k có tham số thì mặc định lấy tất cả và thêm vào 
    // các hàm static có sẵn như where, gt để lọc or tự định nghĩa hàm static riêng

    console.log(await Staff.find({ name: 'Hello', age: { $gte: 9 } }));
    await Staff.find({ name: /hello/i }, null, { skip: 10 }).exec();
    // Có exec ở cuối hay k cũng được. 2 là chỉ định field return ra, ở đây là tất cả. 3 là các option
    // VD với 2: query.select('age name'); or query.select(['age', 'name']); => éo được, k dùng kiểu này
    const data = await Staff.findById("626ceba14e7bc4c037cef4be");
    console.log(data);
    // Staff.deleteOne({ name: 'Hello' }, function (err) {
    //     if (err) return console.log(err);
    // }); // Tương tự có delete, deleteById
    Staff.updateOne({ name: 'Hell' }, { name: 'T-90' }, function(err, res) {
        if (err) throw err;
        // console.log(res); // trả về thông tin sau khi update như có bao nhiêu cái được update,...
    });

    // Thao tác với ChangeStream subcribe sự kiện
    // Change Stream bắt sự kiện chỉ dùng khi đã kết nối với 1 MongoDB replica. Mặc định kết nối r. Replica giúp làm database dự phòng 
    (async function run() {
        const personSchema = new mongoose.Schema({
            name: String
        });
        const Person = mongoose.model("Person", personSchema, "Person"); // Đối số 3 là collections cx chả hiểu là sao nx
        Person.watch().on("change", data => console.log(new Date(), data)); // Bắt sự kiện
        // await Person.create({ name: "Axl Rose" }); // Thử thêm doc cho nó bắt
    })();

    // Thao tác với từng document
    const schema = new Schema({
        docArr: [{ name: String }],
        singleNested: new Schema({ name: String })
    });
    const Test = mongoose.model('Test', schema);
    const doc = new Test({
        docArr: [{ name: 'foo' }],
        singleNested: { name: 'bar' }
    });
    console.log("Check: ", doc.singleNested.parent() === doc); // Lấy ra schema cha của schema con
    console.log(doc.docArr[0].parent() === doc); // Nó cũng lấy cha của 1 thuộc tính (thuộc tính bth có thể coi là 1 implicit schema)

    const schema2 = new Schema({
        level1: new Schema({
            level2: new Schema({
                test: String
            })
        })
    });
    const Test2 = mongoose.model('Test2', schema2);
    const doc2 = new Test2({ level1: { level2: {test: "data"} } });
    console.log(doc2);
    console.log(doc2.level1.level2.parent() === doc2); // false
    console.log(doc2.level1.level2.parent() === doc2.level1); // true
    console.log(doc2.level1.level2.ownerDocument() === doc2); // true
    
    // Thực tế mảng các thuộc tính bình thường cũng tính là schema implicitly
    var parentSchema = new Schema({
        children: [{ name: 'string' }]
    }); // Giống nhau
    var parentSchema = new Schema({
        children: [new Schema({ name: 'string' })]
    });

    // Trong mongoose6 thì cái child là subdocument có property name nhưng trong mongo5 sẽ cần option typePojoToMixed 
    // là true mới được, ta k cần qt bản v5. 
    // => type: { name: String } chỉ là single nested, coi bỏ type đi => Dù sao cx k nên dùng như này dễ nhầm
    var parentSchema = new Schema(
        {
            child: { type: { name: String } }
        }
    ); // Giống nhau
    var parentSchema = new Schema({
        child: new Schema({ name: 'string' })
    });

    var personSchema = new Schema({
        name: {
            first: String,
            last: String
        },
        occupation: { type: String, default: "talk show host"}
    });
    var Person = mongoose.model('Person1', personSchema);
    // await Person.create({ 'name.last': 'Ghost', 'name.first': 'Space'});
    Person.findOne({ 'name.last': 'Ghost' }, 'name occupation', function (err, person) {
        if (err) return console.log(err);
        // In ra "Space Ghost is a talk show host".
        console.log('%s %s is a %s.', person.name.first, person.name.last,
            person.occupation);
    });
}); 