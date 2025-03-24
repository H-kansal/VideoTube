const express=require('express');
const {Registeruser,loginUser,refreshAccessTokens,logOutUser,UpdatePassword,updateAvatar,updateCover}=require('../controllers/AddUser.controllers.js');
const upload=require('../middleware/multer.middleware.js')
const UpdateRequest=require('../middleware/auth.middleware.js');
const router=express.Router();

router.route('/register').post(upload.fields(
   [{name:'avatar',maxcount:1},
    {name:'cover',maxcount:1}]
),Registeruser);

router.route('/login').post(loginUser);

router.route('/logout').post(UpdateRequest,logOutUser); 
router.route('/refreshAccesstokens').post(refreshAccessTokens)
router.route('/updatePassword').post(UpdateRequest,UpdatePassword);
router.route('/updateAvatar').post(upload.single('avatar'),UpdateRequest,updateAvatar);
router.route('/updateCoverImage').post(upload.single('cover'),UpdateRequest,updateCover);
module.exports=router;