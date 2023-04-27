// NodeJS version mới
const test = require("node:test");

async function test1(){
  const res = await fetch("https://nodejs.org/api/documentation.json");
  if(res.ok){
    const data = await res.json();
    console.log(data);
  }
}
test1();

// Node 18 cung cấp test runner module nhưng dùng khó hiểu vl
// Để tránh conflict với các npm package khác nên cung namespace node: dùng cho các in-build module
test("top level test", async(t) => {
  await t.test("subtest 1", (t) => {
    assert.strictEqual(1,1);
  })
  await t.test("subtest 2", (t) => {
    assert.strictEqual(2,2);
  })
})
