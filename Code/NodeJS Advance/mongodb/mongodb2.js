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
    const schema = new Schema({ name: String }); // console.log(schema); // Truy cập nhiều thuộc tính của schema
    console.log(schema.path('name') instanceof mongoose.SchemaType); // true
    console.log(schema.path('name') instanceof mongoose.Schema.Types.String); // true
    console.log(schema.path('name').instance); // 'String'

    var testSchema = new Schema({
        binary:  Buffer,
        age:     { type: Number, min: 18, max: 65 }, // Set được max, min
        mixed:   Schema.Types.Mixed,
        _someId: Schema.Types.ObjectId,
        decimal: Schema.Types.Decimal128,
        array: [], // Mảng thì dùng [] chứ k cần viết type Array
        ofDates: [Date],
        ofBuffer: [Buffer],
        ofMixed: [Schema.Types.Mixed], // Viết dài dòng này cx được
        ofObjectId: [Schema.Types.ObjectId],
        ofArrays: [[]],
        ofArrayOfNumbers: [[Number]],
        nested: {
            stuff: { type: String, lowercase: true, trim: true } // Thêm tính chất của String
        },
        map: Map,
        mapOfString: { // Object 2 thuộc tính là type và of
            type: Map,
            of: String
        },
        details: {
            type: {
                type: String
            }, // Nếu muốn 1 thuộc tính là tên là type thì buộc làm như này vì nếu dùng type: String nó sẽ hiểu lầm cả cái detail này 1 String
            color: String
        },
    })

    var numberSchema = new Schema({
        integerOnly: {
            type: Number,
            get: v => Math.round(v), // Dùng được thêm cả get set cho thuộc tính
            set: v => Math.round(v),
            alias: 'i'
        }
    });

    // Thao tác với từng document
    var numberDoc = mongoose.model('Number', numberSchema); // Chú ý đặt tên biến k được trùng với các kiểu types, type của model phải là số ít 
    // và database server sẽ tự chuyển sang số nhiều cho ta. 1 model = là 1 collection
    var doc = new numberDoc(); // Gán luôn khi tạo or tạo rỗng r khai báo sau đều được
    doc.integerOnly = 2.001;
    console.log(doc.integerOnly); // 2
    console.log(doc.i); // 2
    // Ta tạo ra 1 instance doc như này thì database server cũng tạo schema cho ta nhưng k có document nào, phải gọi
    // query save để lưu vào database thì mới có.

    // Thao tác với Schema SchemaTypes / Validation
    var schema2 = new Schema({
        test: {
            type: String,
            index: true,
            unique: true
            // index chỉ định thuộc tính này có dùng index; unique sẽ dùng unique index, còn sparse sẽ dùng sparse index
        },
        test2: {
            type: String,
            enum: ['large', 'small'],
            uppercase: true,
            minlength: 2
            // String còn có trim, lowercase, maxlength, match
        },
        test3: {
            type: Date,
            min: ['2025-12-09', "Ngày bị nhỏ quá rồi"],
            max: '2019-19-02'
        },
        phoneNumber: {
            type: String,
            validate: {
                validator: function(v) {
                    return /\d{3}-\d{3}-\d{4}/.test(v);
                },
                message: props => `${props.value} is not a valid phone number!`
            },
            select: false // Xác định default projection for queries. Khi lấy kiểu mặc định thì có lấy nó k
        },
    });

    var Test = mongoose.model('Test', schema2);
    // Có nhiều cú pháp để thêm document chứ k cần lúc nào cũng new
    Test.create({ test: 'small' }, function (err, small) {
        if (err) return console.log(err);
    });
    // Hoặc có thể insert nhiều cái vào nhanh
    Test.insertMany([{ test: 'medium' }, { test: "big" }], function(err) {
        if (err) return console.log(err);
    });
}); 