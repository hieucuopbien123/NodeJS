const express = require('express');
const app = express();

const {get, set, setnx, incrby, exists, connect} = require("./model.redis");

app.get('/order', async (req,res) => {
    const time = new Date().getTime();
    console.log('Time request:::' + time);
    
    // Nhớ xóa redis cũ đi trước khi chạy
    const slTonKho = 10;
    const keyName = 'IPhone13';

    const slMua = 1;

    const getKey = parseInt(await get(keyName));
    if(!getKey) {
        await set(keyName, 0);
    }

    var slBan = parseInt(await get(keyName));
    slBan = await incrby(keyName, slMua);
    if(slBan > slTonKho){
        console.log("Het hang");
        return res.json({
            status: 'error',
            msg: 'HET HANG',
            time
        })
    }
    // Bh thì cái redis lưu số lượng request của khách chứ k còn là số lượng thực tế bán được nx. Ta cũng có thể
    // dùng như database lưu số lượng thực tế bán được bằng cách check slBan lớn hơn slTonKho thì set là số lượng đã
    // bán chỉ là số lượng tồn kho thôi trong database thực tế ok mà, trong redis như nào kệ nó

    console.log("Hooray!! So luong request hien tai la: " + slBan);
    // Đảm bảo kết quả chỉ có 10 người nhận được thông báo này, số còn lại toàn hiện hết hàng. Có thể chạy với ab test thử
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