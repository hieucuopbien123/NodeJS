// # Dùng mongodb / # Dùng package mongoose

// Kết nối database server, tạo database và bắt sự kiện
// Password user MongoDB Cloud Server: NguyenThuHieu123
// Mongodb+srv://hieu:NguyenThuHieu123@cluster0.xfemg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
// Trong cái đường link này khi connect nó đã tự yêu cầu tạo ra 1 data tên là myFirstDatabase nếu chưa có rồi
var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://hieu:NguyenThuHieu123@cluster0.xfemg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {useNewUrlParser: true,  useUnifiedTopology: true}
);
// mongoose.set("useNewUrlParser", true); sẽ tránh deprecated warning
// Cả cái useUnifiedTopology cũng tránh deprecated warning, vì current Server Discovery and Monitoring engine is deprecated

var db = mongoose.connection;
// Có thể dùng gộp là: var db = mongoose.createConnection('mongodb+srv://hieu:NguyenThuHieu123@cluster0.xfemg.mongodb.net\
// myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true,  useUnifiedTopology: true});
db.on('error', function(err) { // Khi có error
    if (err) console.log("Error: " + err)
});
// db.on('error', console.error.bind(console, 'connection error:')); // bind this là console chả khác mẹ gì

// Bắt sự kiện open => bất đồng bộ. Do ct vẫn tiếp tục bắt sự kiện kể cả khi chạy đến dòng cuối cùng nên ct sẽ k tự động kết thúc mà sẽ mở mãi
db.once('open', async function() { 
    console.log("Kết nối thành công !");

    // Thao tác với Schema SchemaTypes
    // Khi ta update schema này thì vẫn thao tác tiếp được miên cùng tên schema, data theo kiểu schema mới được thêm
    // vào database mà k ảnh hưởng data cũ mà coi là bổ sung vào. K có mặc định là rỗng. Nhưng k thể vô lý VD 1 thuộc tính
    // ta cho là unique nhưng lần sau ta add trùng xong sửa schema thành k còn unique nx sẽ lỗi vì data xung đột với data unique từ trc
    var Schema = mongoose.Schema; // Tạo ra khung khuôn mẫu của dữ liệu
    var blogSchema = new Schema({
        title:  String,
        author: String,
        body:   String,
        hidden: {
            type: Boolean,
            required: true
        },
        comments: [{
            body: String,
            date: Date
        }],
        date: {
            type: Date,
            default: Date.now
        }
    });
    blogSchema.add({
        meta: {
            votes: Number,
            favs: Number
        }
    });

    // Thao tác với static function và methods
    blogSchema.methods.showMessages = function() {
        // Dùng methods hay method đều đc. K dùng arrow function vì hỏng biến this.
        // Hàm này được gọi bởi mỗi document của schema này thì cái this là từng document sau khi đã gán hết mọi thứ
        // do được gọi bởi mỗi documents nên thg truyền vào callback để gọi tiếp ở đây
        console.log(this.model("Blog").find({title: "Lập"}).mongooseCollection.name);
        // this là document này, nhưng this.model('<tên model>'); để truy cập sâu vào Model của cả database tên là Blog
        // rồi trong list các document của model lấy ra 1 object có tính chất là title: "Lập" chưa hiểu nó làm gì -> nch
        // là k dùng this.model trong methods bth, chỉ dùng trong static thôi
        console.log(`Đã thêm Blog mới có tên "${this.title}"`);
    }
    // Cái trên là instance methods xử lý cấp document. Để xử lý tác vụ ở cấp Model thì dùng static method
    blogSchema.statics.findByTitle = function(title) {
        return this.find({ title: new RegExp(title, "i") });
        // Ở cấp model thao tác lấy các document có tính chất title chứa title truyền vào hàm incasesensitive
    }; // or
    blogSchema.static("findByAuthor", function(author) {
        return this.find({ author }); // Tìm các document có {author: author} với truyền vào author
    });

    // Tạo Model từ Schema và thao tác với model thay đổi documents
    // Nó hiển thị cấu trúc như file json, có nhiều database và bên trong database có các schema, bên trong schema có
    // các document key:val hiển thị trên database server
    var Blog = mongoose.model('Blog', blogSchema);
    var dataInsert = {
        title:  'Lập trình NodeJS căn bản', 
        author: 'Freetuts.net',
        body:   'Nội dung lập trình NodeJS căn bản',
        hidden: false,
        meta: {
            votes: 1,
            favs: 2
        }
    }

    let blogs = await Blog.findByTitle("Lập"); // Bất đồng bộ. Ở đây ra tất cả document có Lập
    blogs = blogs.concat(await Blog.findByAuthor("Free")); // Chả có tác giả nào là free nên rông. Static gọi lúc nào cx đc
    console.log("Blogs list: ");
    console.log(blogs);
    
    // Thao tác với từng document
    var blogCollections = new Blog(dataInsert); // Tạo 1 collection cho model và collection có data đầu tiên
    console.log("Check");
    console.log(blogCollections.isNew);
    blogCollections.save(function (err, data) { // Bắt sự kiện khi tạo xong thì làm gì
        if (err) return console.error(err);
        // console.log(data);
        blogCollections.showMessages()
    });

    // Tạo Model từ Schema và thao tác với model thay đổi documents
    var animalSchema = new Schema({
        name:  String,
        date: {
            type: Date,
            default: Date.now
        }
    });
    // query giúp mở rộng các câu truy vấn
    animalSchema.query.byName = function(name) {
        // Chỉ query khi name trùng với name truyền vào hàm
        return this.where({ name: new RegExp(name, 'i') });
    };
    var Animal = mongoose.model('Animal', animalSchema);
    Animal.create({ name: 'fido'}, function (err, small) {
        if (err) return console.log(err);
    });
    // query find() của mongoDB như SELECT của SQL đó
    Animal.find().byName('fido').exec(function(err, animals) {
        console.log("Find animal: " + animals); // Tìm các animals có tên fido và in ra
    });
    Animal.findOne().byName('fido').exec(function(err, animal) { // findOne chỉ lấy 1 cái đầu tiên tìm ra
        console.log("Find one animal: " + animal);
    });

    // Thao tác với virtual
    // Virtual ảo hóa giúp kết hợp nhiều giá trị thành 1 giá trị mà k phải thêm gì vào database, như JOIN của SQL ấy
    var personSchema = new Schema({
        name: {
            first: String,
            last: String
        }
    });
    personSchema.virtual('fullName').get(function () { // Virtual phải khai báo ngay sau khi tạo schema
        return this.name.first + ' ' + this.name.last;
    });
    var Person = mongoose.model('Person', personSchema); // Đưa nó vào một Model dựa théo schema
    var axl = new Person({ // Tạo môt document
        name: { first: 'Nguyen', last: 'Rose' }
    });
    var personDocument = new Person(axl); // Tạo 1 document cho model
    personDocument.save(function (err, data) {
        if (err) return console.error(err);
        console.log(data);
    });
    console.log("Data: ");
    console.log(axl.fullName);
    // Bình thường mỗi lần lấy kết hợp cả trường first và last trong name ta phải viết  + nó lại. Điều này là bất tiẹn
    // và virtual đã định nghĩa ra 1 thuộc tính mới cho schema là fullName mà mỗi doc của model tạo từ cái schema
    // đó có thể lấy trực tiếp từ fullName. Nó chỉ là virtual của dự án nên database server k sinh trường mới fullName
});
// Quy trình tạo ra MongoDB Server -> liên kết mongodb server vào NodeJS qua thư viện mongoose -> chạy server -> tạo 
// schema tư mongo -> tạo instance của schema cụ thể chưa những gì -> chuyển cái instance schema đó sang model -> 
// tạo ra document cho model đó