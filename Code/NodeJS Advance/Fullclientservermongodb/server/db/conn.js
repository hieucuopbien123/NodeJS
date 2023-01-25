// Dùng mongodb / # Dùng package mongodb

const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
    
var _db;

// Thế này là ta đang thao tác cả ứng dụng với cùng 1 schema employees trong database server. Thực tế trong 1 ứng dụng
// có thể tương tác với nhiểu schema khác nhau nên hàm connectToServer ta chỉ gọi connect bth chứ đừng gọi rõ 
// là schema nào xong khi cần thao tác với 1 schema thì mỗi lần sẽ tạo ra 1 connection mới. Còn cách trong VD này 
// nó tạo và close liên tục. Ta cũng có thể subscribe để đồng bộ realtime cho user hay làm chia kiến trúc kiểu
// khi nào người dùng vào router nào thì ngắt connection router cũ nếu có và tạo connection vào model ở router mới
// nếu mỗi router là 1 schema trong database
/*
export async function executeStudentCrudOperations() {
    const uri = process.env.DB_URI;
    let mongoClient;

    try {
        mongoClient = await connectToCluster(uri); // Tạo connection
        const db = mongoClient.db('school'); // Liên kết schema
        const collection = db.collection('students'); // Liên kết với modal có nhiều document

        // Xử lý query
        // console.log('CREATE Student');
        // await createStudentDocument(collection);
        console.log(await findStudentsByName(collection, 'John Smith'));

        console.log('UPDATE Student\'s Birthdate');
        await updateStudentsByName(collection, 'John Smith', { birthdate: new Date(2001, 5, 5) });
        console.log(await findStudentsByName(collection, 'John Smith'));
    } finally {
        await mongoClient.close(); // Close khi xong
    }
}
*/
module.exports = {
    connectToServer: function (callback) {
        client.connect(function (err, db) {
            // Verify we got a good "db" object
            if (db){
                _db = db.db("employees");
                console.log("Successfully connected to MongoDB."); 
            }
            return callback(err);
        });
    },
    getDb: function () {
        return _db;
    },
};