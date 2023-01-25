import cloudinaryUpload from "./service/uploads";
import { useState } from "react";

const App = () => {
  const [imgData, setImg] = useState("");

  // # Dùng multer / Dùng kết hợp cloudinary / Dùng multer-storage-cloudinary
  // Xử lý upload file phía frontend 
  const handleFileUpload = async (e) => {

    // Phải upload thông qua 1 form data. Nch là cứ nhét formdata + multer cloudinary là ok
    const uploadData = new FormData();
    uploadData.append("testname", e.target.files[0], "test"); // name, value | blob, filename
    // Loại file có giá trị là e.target.files[0] và lưu dạng filename => trường thứ 3 là file.originalname 
    // ở backend, trường số 1 là fieldname ở backend. Trường thứ 2 có thể là kiểu blob cũng được

    // Nếu dùng FormData để truyền ảnh thì các trường khác sẽ phải truyền tiếp vào formdata như này thì backend \
    // mới lấy được thông qua req.body.title
    uploadData.append("title", "Hello");

    console.log(e.target.files[0]);
    console.log(uploadData);

    const data = await cloudinaryUpload(uploadData);
    console.log(data);
    setImg(data.secure_url);
  }
  
  return (
    <div style={{textAlign: "center"}}>
      <div style={{ margin: 10 }}>
        <label style={{ margin: 10 }}>Cloudinary:</label>
        <input
          type="file"
          onChange={(e) => handleFileUpload(e)}
        />
      </div>
      <img alt="" src={imgData}/>
    </div>
  );
};

export default App;