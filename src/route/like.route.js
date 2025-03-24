const express=require('express');
const Likes=require('../controllers/like.controllers.js');
const router=express.Router();
const UpdateRequest=require('../middleware/auth.middleware.js');

router.route('/toggleVideoLike/:id').post(UpdateRequest,Likes.toggleVideoLike);
router.route('/toggleCommentLike/:id').post(UpdateRequest,Likes.toggleCommentLike);
router.route('/toggleTweetLike/:id').post(UpdateRequest,Likes.toggleTweetLike);
router.route('/getallLikeVideo').get(UpdateRequest,Likes.getallLikeVideo);

module.exports=router;