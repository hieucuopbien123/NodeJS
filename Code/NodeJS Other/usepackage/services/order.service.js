const redis = require('redis');
const client = redis.createClient();

const addDelayEventOrder = async ({orderId, delay}) => {
  try{
    await client.set(orderId, 'This order will be cancel', {
      EX: delay
    });
  }catch(err) {
    console.log(err);
  }
}

const connect = async() => {
  try{
    await client.connect(); 
  }catch(err) {
    console.log(err);
  }
}

module.exports = {
  addDelayEventOrder,
  connect
}