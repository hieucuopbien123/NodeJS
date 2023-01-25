console.log('In Child.js');
// If the send method is available
if(process.send) {
    // Send Hello
    process.send("Hello, this is child process.");

    // Send multiple messages
    setTimeout((function() {
        return process.send("This was send after 1 second.");
    }), 1000);
    setTimeout((function() {
        return process.send("This was send after 2 seconds.");
    }), 2000);
    setTimeout((function() {
        return process.send("This was send after 3 seconds.");
    }), 3000); 
}
// Khi dùng fork nó sẽ thiết lập kênh IPC(Inter-process communication). Từ đó ta có thể dùng process.send để
// gửi từ process con sang cha. Fork chính là Th đặc biệt của spawn chỉ dùng cho chạy tiến trình khác ỏ file
// khác này