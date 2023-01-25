import axios from 'axios';
const API_URL = "http://localhost:5000";

const cloudinaryUpload = async (fileToUpload) => {
    return axios.post(API_URL + '/uploads/cloudinary-upload', fileToUpload)
        .then(res => res.data)
        .catch(err => console.log(err))
}

export default cloudinaryUpload;