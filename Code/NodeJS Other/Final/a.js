// Dùng google api convert text to speech

const gTTS = require('gtts');

const speech = "Báo tin tức VTC trong ngày Việt Nam hôm nay, tin tức trong nước thế giới được cập nhật 24h với các bài phóng sự video clip độc quyền trên BAO vtc.vn."

const gtts = new gTTS(speech, "vi");
gtts.save("voice.mp3", function (err) {
  if(err) throw new Error(err);
  console.log("Saved!");
});