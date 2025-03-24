// Cloudinary is a cloud-based service that helps you manage image and video uploads, storage, transformations, and delivery efficiently. It is widely used in web applications for handling media files without overloading the server.

const cloudinary=require('cloudinary').v2;
const fs=require('fs');
const dotenv=require('dotenv');
dotenv.config({
    path:'.env'
})

cloudinary.config({
    cloud_name:process.env.CLOUDINARYCLOUDNAME,
    api_key:process.env.CLOUDINARYAPIKEY,
    api_secret:process.env.CLOUDINARYAPISECRET
})

const uploadFile=async (filepath)=>{
    try {
        if(!filepath) return null;
        const response=await cloudinary.uploader.upload(filepath,{resource_type:'auto'});
        console.log('File upload on cloudinary successfully');
        fs.unlinkSync(filepath);
        return response;
    } catch (error) {
        fs.unlinkSync(filepath);
        return null;
    }
}

module.exports=uploadFile;