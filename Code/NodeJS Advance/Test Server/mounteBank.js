// Dùng tool / # Dùng MounteBank => bỏ

const axios = require("axios");

// Có thể get post delete
// post
async function postData(port) {
    const value = await axios.post("http://localhost:2525/imposters", {
        "protocol": "http", // or tcp,smtp
        "port": port,
        "name": "thanh_toan_credit_success",
        "requests": [],
    })
};
// postData(4001);
// 1 post k đc có 2 dữ liệu

// get
async function getData(port) {
    const value = await axios.get(`http://localhost:2525/imposters`, {}) //or: http://localhost:2525/imposters/${port}
    console.log(value.data);
}
getData(4001);

// delete
async function deleteData(port) {
    const value = await axios.delete(`http://localhost:2525/imposters/${port}`);
}
// deleteData(4001);

// nhưng làm như v sẽ k có dữ liệu gì cả, ta muốn có thêm dữ liệu phải dùng thêm stub. Nếu dùng stub thì buộc phải có 
// 2 thành phần là response.is và predicated.equals.path/method là tối thiểu để server chấp nhận
// Ở dưới ta làm 1 cái post có khá đầy đủ các thứ
async function postDataFull(port) {
    const value = await axios.post("http://localhost:2525/imposters", {
        "protocol": "http",
        "port": port,
        "name": "thanh_toan_credit_success",
        "requests": [],
        "stubs": [{
            "responses": [{
                "is": {
                    "status_code": 200,
                    "headers": {
                        "content-type": "application/json"
                    },
                    "body": {
                        "status": {
                            "code": "success",
                            "message": "Success"
                        },
                        "data": {}
                    }
                }
            }],
            "predicates": [{
                "equals": {
                    "path": "/payment/create_order/credit",
                    "method": "POST",
                    "body": {
                        "data": {
                            "card": {
                                "numbers": "11111111"
                            }
                        }
                    }
                }
            }]
        }]
    })
};

async function deleteDataFull(port) {
    const value = await axios.delete(`http://localhost:2525/imposters/${port}/&`, {
        "protocol": "http",
        "port": 4444,
        "name": "thanh_toan_credit_success",
        "requests": [],
        "stubs": [{
                "responses": [{
                    "is": {
                        "status_code": 400,
                        "headers": {
                            "content-type": "application/json"
                        },
                        "body": {
                            "status": {
                                "code": "error",
                                "message": "card number not existed"
                            },
                            "data": {}
                        }
                    }
                }],
                "predicates": [{
                    "equals": {
                        "path": "/payment/create_order/credit",
                        "method": "POST",
                        "body": {
                            "data": {
                                "card": {
                                    "numbers": "11111112"
                                }
                            }
                        }
                    }
                }]
            },
            {
                "responses": [{
                    "is": {
                        "status_code": 500,
                        "headers": {
                            "content-type": "application/json"
                        },
                        "body": {
                            "status": {
                                "code": "timeout",
                                "message": "service unavailable"
                            },
                            "data": {}
                        }
                    }
                }],
                "predicates": [{
                    "equals": {
                        "path": "/payment/create_order/credit",
                        "method": "POST",
                        "body": {
                            "data": {
                                "card": {
                                    "numbers": "11111113"
                                }
                            }
                        }
                    }
                }]
            },
            {
                "responses": [{
                    "is": {
                        "status_code": 200,
                        "headers": {
                            "content-type": "application/json"
                        },
                        "body": {
                            "status": {
                                "code": "success",
                                "message": "Success"
                            },
                            "data": {}
                        }
                    }
                }],
                "predicates": [{
                    "equals": {
                        "path": "/payment/create_order/credit",
                        "method": "POST",
                        "body": {
                            "data": {
                                "card": {
                                    "numbers": "11111111"
                                }
                            }
                        }
                    }
                }]
            }
        ]
    });
}