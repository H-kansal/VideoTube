// multer is middleware use to upload files on pages or form
const multer=require('multer');
const path=require('path');

// define our custom method how the upload file is stored(destination) and what is the name by which it stored
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        console.log("path:",path.join(__dirname,'../../public'))
        cb(null,path.join(__dirname,'../../public'))
    },
    filename:function(req,file,cb){
        const uniqueSuffix=Date.now()+'-'+Math.round(Math.random()*1e9);
        const ext=path.extname(file.originalname);
        cb(null,file.fieldname+uniqueSuffix+ext);
    }
})

const upload=multer({
    storage:storage
})

module.exports=upload;