const crypto = require("crypto");

// Sinh key random 
const key1 = crypto.randomBytes(32).toString("hex");
const key2 = crypto.randomBytes(32).toString("hex");

console.table({key1, key2})