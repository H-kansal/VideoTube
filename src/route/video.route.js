const express=require('express');
const router=express.Router();
const UpdateRequest=require('../middleware/auth.middleware.js');
const Videos=require('../controllers/video.controllers.js')
const upload=require('../middleware/multer.middleware.js');

router.route('/uploadVideo').post(upload.fields([
    {name:'thumbnail',maxSize:1},
    {name:'video',maxSize:1},
]),UpdateRequest,Videos.publishAVideo);

router.route('/getVideo/:id').get(UpdateRequest,Videos.getVideo);
router.route('/updateVideo/:id').put(Videos.updateVideo);
router.route('/deleteVideo/:id').delete(Videos.deleteVideo);
router.route('/getAllVideo').get(Videos.getAllVideo);
module.exports=router;