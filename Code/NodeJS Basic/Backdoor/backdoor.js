// # Backdoor

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Doing nothing
app.post("/", function (req, res) {
    console.log(req.body);
    res.send();
});
app.listen(3001, () => {
    console.log("app is up");
});
app.get("/new-victim", (req, res) => {
    console.log(req.query);
    res.send();
});