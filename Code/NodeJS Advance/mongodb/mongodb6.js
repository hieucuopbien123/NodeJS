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

    // Thao tác với cursor, aggregation, populate
    // Populate trong mongoose giúp join các docs có qh với nhau kể cả các document từ các collections khác
    
    // ref giúp ta biết model này join với model nào qua attr nào
    const personSchema = Schema({
        _id: Schema.Types.ObjectId,
        name: String,
        age: Number,
        stories: [{ type: Schema.Types.ObjectId, ref: 'Story' }] // ref phải đặt là tên model sẽ tạo ra từ schema khác
    });
    const storySchema = Schema({
        author: { type: Schema.Types.ObjectId, ref: 'Person5' },
        title: String,
        fans: [{ type: Schema.Types.ObjectId, ref: 'Person5' }]
    });
    // Các type ObjectId, Number, String, và Buffer đều sử dụng được options ref. Nhưng nên sử dụng ObjectID ngoại
    // trư trường hợp đặc biệt
    const Story = mongoose.model('Story', storySchema);
    const Person5 = mongoose.model('Person5', personSchema);
    const author = new Person5({
        _id: new mongoose.Types.ObjectId(), // Khởi tạo 1 id random
        name: 'Nguyễn Du',
        age: 0
    });

    // Muốn thay thế full callback phải bằng await + try catch mới đủ
    // try {
    //     const data = await author.save();
    //     if(data) {
    //         const story1 = new Story({
    //             title: 'Truyện Kiều',
    //             author: author._id // Lấy giá trị của author._id cho refs
    //         }); 
    //         await story1.save();
    //     }
    // } catch(err) {
    //     console.log(err);
    // }
    // Select ra tương tự join trong SQL
    try{
        const data = await Story.findOne({ title: 'Truyện Kiều' }).populate('author');
        // populate có thể chỉnh lấy các trường gì. VD: .populate('author', 'name'); thì cả author chỉ lấy ra name
        // ta cũng có thể populate với nhiều path: await Story.find(...).populate('fans').populate('author');
        // or thêm conditional: 
        const data2 = await Story.findOne()
        .populate({
            path: 'author',
            match: { age: { $lte: 50 } },
            select: 'name _id'
        })
        console.log("Chi tiết: " + data);
        console.log(data2);
    }catch(err){
        console.log(err);
    }

    const stories = await Story.find().sort({ title: 1 }).populate({
        path: 'fans',
        options: { limit: 2 }
    }); // Lấy 2 story kèm populate tới bảng chứa fan
    if(stories[0]){
        console.log(stories[0].fans.length);
    }
    const stories2 = await Story.find().sort({ title: 1 }).populate({
        path: 'fans',
        perDocumentLimit: 2
    }); // Lấy mọi story có fans là 1 mảng 2 phần tử
    // VD sự khác biệt: story1 chứa 10 fan, story2 chứa 4 fan
    // Dùng option limit 2 thì in ra story1 chứa 2 fan, story2 chứa 0 fan
    // Dùng perDocumentLimit 2 thì in ra story1 chứa 2 fans, story2 chứa 2 fan
    // Là vì nó đang tìm trong model Story các document story, bên trong từng doc lại có từng docs khác nên
    // perDocumentLimit sẽ bảo trong mỗi docs Story có bao nhiêu fans, chỉ dùng với mảng

    // populate lồng nhau
    var userSchema = new Schema({
        name: String,
        friends: [{ type: mongoose.Types.ObjectId, ref: 'User' }]
    });
    const User = mongoose.model('User', userSchema);
    // A có B và C là bạn, B lại có D là bạn, in ra bạn của bạn của A
    const user = new User({
        name: "D",
    });
    // try{
    //     const userD = await user.save();
    //     if(userD){
    //         const user = new User({
    //             name: "B",
    //             friends: [userD._id]
    //         });
    //         const userB = await user.save();
    //         const user2 = new User({
    //             name: "C",
    //         })
    //         const userC = await user2.save();
    //         if(userB && userC){
    //             const user = new User({
    //                 name: "A",
    //                 friends: [userB._id, userC._id]
    //             });
    //             await user.save();
    //         }
    //     }
    // }catch(err){
    //     console.log("Error: " + err);
    // }

    const dataUser = await User.findOne({ name: 'A' })
    .populate({
        path: 'friends',
        populate: { path: 'friends', select: 'name _id', model: 'User' }
    });
    if(dataUser){
        console.log("Data: " + dataUser);
        console.log("Data child: " + dataUser.friends[0]);
    }
    // Éo lấy được 1 phát json luôn mà phải gọi như này. Chú ý findOne trả ra 1 biến, find trả ra 1 mảng

    // Tái hiện: Ta có 1 model comment sẽ có content và nó nó có 2 type: BlogPost tức comment này dùng cho BlogPost thì
    // ta phải in thông tin của BlogPost có comment đó, or comment này dùng cho Product thì in thông tin của Product
    // Cả BlogPost và Product đều là 2 bảng riêng. refPath giúp ta liên kết 1 bảng với nhiểu bảng, nó trỏ đến 1 
    // attributes khác của schema này, trong attribute đó là 1 enum chứa tên các model liên kết với
    const commentSchema = new Schema({
        body: { type: String, required: true },
        on: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'onModel'
        },
        onModel: {
            type: String,
            required: true,
            enum: ['BlogPost', 'Product'], // Bên trên chỉ thao tác với 1 model thì ở đây thao tác với 1 list model
        }
    });
    const Product = mongoose.model('Product', new Schema({ name: String }));
    const BlogPost = mongoose.model('BlogPost', new Schema({ title: String }));
    const Comment = mongoose.model('Comment', commentSchema);
    // const book = await Product.create({ name: 'Freetuts' });
    // const post = await BlogPost.create({ title: 'Lập trình NodeJS' });
    // const commentOnBook = await Comment.create({
    //     body: 'Sách hay',
    //     on: book._id,
    //     onModel: 'Product'
    // });
    // const commentOnPost = await Comment.create({
    //     body: 'Thông tin rất hữu ích',
    //     on: post._id,
    //     onModel: 'BlogPost'
    // });
    const comments = await Comment.find().populate('on').sort({ body: 1 });
    console.log(comments[0].on.name); // "Freetuts"
    console.log(comments[1].on.title); // "Lập trình NodeJS"


    // populate ta thg dùng trong middleware. VD để mỗi khi find thì tự populate như nào mà k cần phải viết lại mỗi lần
    // Chú ý là middleware thì là schema gọi trước khi tạo model nhé. Middleware này cho lên trên thì Commend.find() k cần
    // gọi populate nx
    commentSchema.pre('find', function() {
        this.populate('on');
    });
    
    // Ở v5 populate họ dùng await doc.populate('path1').populate('path2').execPopulate(); thì v6 sửa thành 
    // await doc.populate(['path1', 'path2']); Bản chất populate thực ra là họ tạo thêm query mới bên trong
    // VD ở đây ta find xong thì populate cũng ra kết quả tương tự vc chỉ định populate trước khi find. Nhét cái này
    // lên trước khi tạo model thì cx cho kết quả tương tự
    commentSchema.post('find', async function(docs) { // post, lúc này tìm được r nên nhận vào docs
        for (let doc of docs) {
            // populate từng doc có thể thao tác chi tiết từng doc làm gì
            await doc.populate('on');
        }
    });

    commentSchema.post('save', function(doc, next) {
        doc.populate('on').then(function() { // Có thể populate từng doc or cả cục docs nhận được ra 1 mảng
            next(); // Có thể in ra ở đây
        });
    });

    // populate trường khác id, điều này là k thể vì đã populate buộc phải vào trường là id của document khác và nó 
    // duy nhất và immutable. Ta có thể ghi đè id thành 1 kiểu khác bằng cách dùng _id: String chẳng hạn or groups
    // nhiều trường với _id: {<object các trường>} thì khi khai báo phải tự thêm id or dùng 1 hàm increment ok
    // Mặc định nó là type ObjectId được tự sinh trong database. Khi ref populate nó sẽ tự cast sang type của _id 
    // và nếu k cast được như VD dưới từ String sang ObjectId thì nó sẽ báo lỗi k populate được
    // Lưu ý ta k thể gom 1 tập hợp trường có sẵn thành id mà phải khai báo bth tức có thể xảy ra TH trùng 1 trường
    // bên ngoài xong lại muốn trường đó có trong id nên lại nhét vào _id
    const refSchema = new Schema({
        name: String,
        nickname: String,
        age: Number,
    })
    const firstSchema = new Schema({
        name: String,
        testRef: {type: String, ref: "RefTest"}
    })
    const RefModel = mongoose.model("RefTest", refSchema);
    const FirstModel = mongoose.model("FirstModel", firstSchema);
    // const refTest = await RefModel.create({name: "This is name", nickname: "This is nickname", age: 18});
    // // const refTest2 = await RefModel.create({name: "This is name2", nickname: "This is nickname", age: 19});
    // await FirstModel.create({
    //     name: "This is name of first model",
    //     testRef: refTest.nickname
    // })
    // Ở đây nó ref nickname và ta cố tình tạo ra 2 nickname String nhưng lại k dùng mảng để xem nó in ra cái nào
    // const data = await FirstModel.find().populate("testRef"); // error
    // console.log(data);

    // !!!
    /* 
        Virtual populate: Tình huống là model author và post và 1 author có thể có nhiều post. 
        Theo Principle of Least Cardinality thì trong quy tắc one-to-many, ta k nên để one lưu many mà để many lưu one
        VD author có 10k post với dữ liệu tầm 12kb thì mỗi author ta lại lưu trong mongoDB là 1 mảng post thì chả bh dùng
        được vì nếu thao tác bất cứ thứ gì với cái mảng đó đều có poor performance vì duyệt hết rất lâu. Do đó nên để
        mỗi post lưu 1 author thì ok hơn
        => Vấn đề khi đó là ta muốn lấy list các post của 1 author thì k làm được vì cái author bh có lưu cái post nx đâu.
        Tức quan hệ vẫn có one-to-many thật nhưng lại k dùng được từ one lấy ra many. Virtual populate giải quyết
    */
    const AuthorSchema2 = new Schema({
        name: String
    });
    const BlogPostSchema2 = new Schema({
        title: String,
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    });
    // Virtual trước h nhét vào 1 schema để lấy gộp các trường của 1 schema trong từng document nhưng bh có thể dùng 
    // kết hợp populate luôn
    AuthorSchema2.virtual('posts', {
        ref: 'BlogPost',
        localField: '_id',
        foreignField: 'author' 
        // Tạo ra 1 trường mới là posts ref tới BlogPost sao cho nó lưu trường _id so sánh với trường author của blogpost
        // count: true => thêm trường này sẽ chỉ lấy ra được số lượng
    });

    const Author2 = mongoose.model('Author2', AuthorSchema2, 'Author2');
    const BlogPost2 = mongoose.model('BlogPost2', BlogPostSchema2, 'BlogPost2');
    // Sau khi có virtual cho AuthorSchema2
    const author2 = await Author2.findOne().populate('posts'); // populate cái virtual như 1 trường mới thôi
    author2.posts[0].title; // Title of the first blog post => đang null nên lỗi
    // Nếu có count: true ở virtual sẽ chỉ lấy ra được số lượng với author2.posts
    // => findOne chính là tìm kiếm bth trong Author document đầu tiên và lấy thêm thông tin về trường post của nó trong BlogPost ok thì lấy
    // Vẫn dùng được các options khác của populate như bth
    // Virtual k chưa toJSON hay toObject nên ta k thể res.json hay console.log nó mà phải làm như dưới mới dùng được console.log hay res.json
    // đối với trường được tạo ra từ virtual 
    const authorSchema3 = new Schema({ name: String }, {
        toJSON: { virtuals: true }, // So `res.json()` and other `JSON.stringify()` functions include virtuals
        toObject: { virtuals: true } // So `console.log()` and other functions that use `toObject()` include virtuals
    });
}); 