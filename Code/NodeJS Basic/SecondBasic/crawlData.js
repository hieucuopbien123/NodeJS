// # Các package backend NodeJS thường dùng / Dùng cheerio => deprecated request-promise rồi

var rp = require("request-promise");
var fs = require("fs");
var cheerio = require("cheerio");

// Ở phiên bản mới, nó bị lỗi k có chứng chỉ SSL or TLS cho trang web khi crawl vào. 
// Dòng code dưới sẽ bỏ qua chứng chỉ đó.
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

// Thực hiện hàm ngay khi khai báo là (<function>)(); thg dùng khi hàm này chỉ gọi 2 lần
(async function crawler() {
  var $ = await rp({
    uri: "https://freetuts.net/reactjs/tu-hoc-reactjs",
    transform: function (body) {
      return cheerio.load(body);
    }
  }).catch(error => {
    return error;
  });
  // rp() nhận trực tiếp thông tin về trang web cần crawl: 1 object có att là url hoặc uri và attr là transform là 
  // callback được gọi sau khi nó lấy html body phần body của trang web. 
  // Gọi cheerio.load(body) để parse html và trả ra 1 promise có giá trị là giá trị return của hàm transform là biến 
  // cheerio $. Hàm cheerio.load sẽ phân tích cây DOM của html và trả ra biến $ lưu các thứ của html
  // Từ đây ta dùng $ để lấy ra mọi thứ của cây DOM đó thôi.

  const titleList = $("#menu_fixed .segment"); // $(<css selector>) trả ra 1 object hay 1 mảng tùy theo selector ta 
  // chọn là duy nhất hay k. Ở đây là 1 mảng vì có thể có nhiều class segment -> dùng được các hàm như 1 mảng js bth
  const chapterList = $("#menu_fixed .chapters");
  var data = [];
  for (var i = 0; i < titleList.length; i++) {
    let title = $(titleList[i]).text().trim();
    // titleList[i] là 1 biến js, phải dùng $(<biến>) thì mới ra biến cheerio để dùng các hàm thư viện cheerio.
    // text() là lấy phần textNode của thẻ đó bao gồm cả các thẻ con của nó trả ra 1 string. Hàm trim là của string js.
    let chapter = $(chapterList[i]).find("a");

    let linkTag = [];
    $(chapterList[i]).find("a").each((i, ele) => { // Hàm find tìm trong decensdant.
      // Hàm each là hàm của jQuery và biến $ là ngôn ngữ jQuery, nó giống map của JS
      // Ta chỉ cần biết jQuery cung cho ta $ và 1 vài hàm nx với biến js mà thôi vd hàm each
      var href = $(ele).attr("href"); // attr lấy text trong attribute nào của thẻ đó
      var smallTitle = $(ele).attr("title");
      linkTag.push({
        href,
        smallTitle
      })
    })

    data.push({
      title,
      linkTag
    })
  }
  fs.writeFileSync('data.json', JSON.stringify(data, false, 1)); // Lưu kết quả crawl vào file
})();
// => Cách đơn giản nhất để crawl dữ liệu từ website

/*
Thật ra có thể lấy dữ liệu sau khi post lên 1 data gì đó chứ đâu phải lúc nào cx muốn lấy mặc định ở 1 trang web fix. VD:
var options = {
  method: 'POST',
  uri: 'http://posttestserver.com/post.php',
  form: {
    name: 'Josh' // content ta gửi tới server phải đặt attr trong form
  },
  headers: {
    'content-type': 'application/x-www-form-urlencoded'  // Is set automatically
  }
}
rp(options)
  .then(function (body) {
    // POST succeeded... => crawl luôn được vì có body rồi
  })
  .catch(function (err) {
    // POST failed...
  });
or chỉ đơn giản là có mỗi 1 đường link cx đc thì là method GET bth
rp('http://www.google.com')
    .then(function (htmlString) { function trong then nhận đc dữ liệu htm mà truyền được tiếp cho cheerio parse
        // Process html...
    })
    .catch(function (err) {
        // Crawling failed...
    });
*/

// Ta có thể dùng hàm callback cho request-promise nhận error, response(kiểm tra statusCode chẳng hạn), html
// Bởi vì dùng request-promise thực ra là gửi request cho server xử lý nên cách này lấy được hẳn statusCode và các thư
// lưu trong biến response, dữ liệu nếu thành công sẽ lưu trong đối số thứ 3
var request = require("request-promise");
request('https://123job.vn/tuyen-dung', (error, response, html) => {
  if (!error && response.statusCode == 200) {
    const $ = cheerio.load(html);

    $('.job__list-item').each((index, el) => {
      const job = $(el).find('.job__list-item-title a').text();
      console.log(job);
    })
  } else {
    console.log(error);
  }
});

// Dùng cheerio với html tự tạo
var $ = cheerio.load(`<p><b>Test</b> Paragraph.</p> <p></p> `);
$("p").first().text(function (index) {
  return "100 " + index; // giá trị return là giá trị thế cho đoạn textNode của thẻ p đầu tiên
});
console.log($("p").first().text());
$("p").last().html("Text test");
console.log($("p").last().text());
// html và text như nhau và nếu specific text bên trong thì nó sẽ replace textnode của thẻ đó, k dùng đc GT return nx
// Riêng text truyền vào đc hẳn 1 function lấy giá trị trả về. Nên dùng text hoàn toàn thay html