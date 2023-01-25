// Dùng redis / # Usecase phiếu giảm giá tăng đột biến

const express = require('express');
const app = express();

const {get, set, setnx, incrby, exists, connect} = require("./model.redis");

app.get('/order', async (req,res) => {
    const time = new Date().getTime();
    console.log('Time request:::' + time);

    // Tái hiện tình huống còn 1 sp nhưng nhiều người cùng mua
    // Giả sử ban đầu có 10 cái IPhone13
    const slTonKho = 10;
    const keyName = 'IPhone13';

    // Mỗi người vào sẽ chỉ mua 1
    const slMua = 1;

    // Lấy số lượng đã bán cái IPhone13 này
    // Nếu chưa từng bán nó lần nào thì sẽ trả ra null chạy vào set số lượng đã bán là 0 cho redis. Cái này chỉ để set mỗi thế
    const getKey = parseInt(await get(keyName));
    if(!getKey) {
        await set(keyName, 0);
    }

    // Lấy số lượng đã bán ra và check nếu lượng vừa bán + lượng người này mua chưa quá max hàng ta có thì 
    // tăng số lượng bán lên 1, ngược lại thông báo là hết hàng
    var slBan = parseInt(await get(keyName));
    console.log("Truoc khi user order thi so luong ban ra = " + slBan);

    if(slBan + slMua > slTonKho){
        console.log(slBan + " + " + slMua + " = " + (slBan + slMua));
        console.log(slTonKho);
        console.log("Het hang");
        return res.json({
            status: 'error',
            msg: 'HET HANG',
            time
        })
    }

    slBan = await incrby(keyName, slMua);
    console.log("Sau khi user order order thi so luong ban ra = ", slBan);

    // TH này bị lỗi là vì: ta biết hàm incrBy là nguyên tử của redis tức là 2 người cùng mua hàng thì chỉ lần lượt từng
    // người được tăng lên số lượng bán là 1 nhưng ở đây chuyện đó đâu quan trọng vì khi 1 người chưa incrby xong thì
    // những người khác có thể gọi get thoải mái mà. VD ở đây chỉ còn 1 kiện hàng cuối nhưng 2 người cùng request đồng
    // thời và pass hết các cái get và điều kiện if cùng lúc vì lúc này vẫn thỏa mãn slBan + slMua > slTonKho mà
    // sau đó A và B cùng gọi incrBy và cái này atomic nên phải chạy lần lượt nên A incrBy, B cũng incrBy chứ có 
    // ai cản ô B lại đâu.
    // Lỗi nằm ở đâu? Khách vào mua hàng sẽ check nếu mua lần đầu tiên thì set số lượng bán là 0, sau đó check nếu còn
    // đủ hàng thì bán là thực hiện tăng số lượng đã bán lên 1. Hàm set ban đầu cx gây lỗi vì A và B vào cùng lúc thì
    // cùng qua điều kiện if, giả sử A gọi incrBy và B gọi set là 0 thì hàm của B được đưa vào hàng đợi, A vừa tăng lên
    // 1 xong thì hàng đợi gặp lại set về 0 à. Lỗi còn ở chỗ check qua hêt điều kiện if xong sau đó mới tăng bị quá số sp
    // có thể bán là die r
    // Biểu hiện: Người thứ 11 mua k nhận được thông báo hết hàng, database thực sự vẫn tăng số lượng đã bán lên 1
    // Để fix: ta cần người mua quá sẽ phải nhận được thông báo hết hàng và database phải dừng lại ở 10 thôi or thực tế
    // database lưu là 10 hay 1 số lớn hơn 10 kqtr vì ta là chủ ta tự hiểu nhưng khách hàng thì phải nhận được thông báo
    // Ta phải cho vc check và vc incrBy cùng thực hiện trong 1 lệnh nguyên tử 1 người phải check và mua xong thì
    // người khác mới check và mua chứ kp check ai cũng ổn xong mua là chết.
    // Nhưng trong redis k có hàm nào atomic gom như v cả mà ta chỉ biết incrBy là atomic, các hàm như get thì k atomic
    // Đơn giản chỉ cần cho họ chạy atomic trước rồi mới check điều kiện thì 1000 người vào cũng phải increby theo thứ
    // tự lần lượt và ta có thể chắc chắn rằng khi chạy vào vòng if thì đó là giá trị đúng mà k bị ảnh hưởng bởi những 
    // người khác. Ta chỉ cần chắc chắn mọi dòng code là chuẩn giá trị tại thời điểm đó mà k sợ nhiều người thực hiện cùng
    // lúc làm ảnh hưởng kết quả là được.

    return res.json({
        status: 'success',
        msg: 'OK',
        time
    })
})

app.listen(3000, () => {
    connect();
    console.log('The server is running at 3000');
})