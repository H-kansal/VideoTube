const express=require('express');
const Comments=require('../controllers/comment.controllers.js');
const UpdateRequest=require('../middleware/auth.middleware.js');
const router=express.Router();

router.route('/addComment/:id').post(UpdateRequest,Comments.addComment);

router.route('/updateComment/:id').put(Comments.updateComment);

router.route('/deleleComment/:id').delete(Comments.deleteComment)

router.route('/getallVideo/:id').get(Comments.getVideoComments);
module.exports=router;