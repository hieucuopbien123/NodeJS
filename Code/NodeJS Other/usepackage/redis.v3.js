// # Mô hình tự hủy đơn hàng nếu chưa thanh toán quá N phút

const express = require('express');
const app = express();
const {addDelayEventOrder, connect} = require('./services/order.service');
app.use(express.json());

app.post('/order', async (req, res) => {
  try {
    const {userId, order} = req.body;
    await addDelayEventOrder({orderId: order.id, delay:1});
    res.json({
      status: 'success',
      msg: order
    })
  } catch (error) { }
})

app.listen( process.env.PORT || 3000, () => {
  console.log(`Server is running 3000`);
  connect();
})

// Chạy redis.v3 -> chạy redis.v32 -> chạy rest.http
