const express=require('express');
const ChannelInfo=require('../controllers/dashboard.controllers.js');
const router=express.Router();

router.route('/getChannelInfo/:id').get(ChannelInfo.getChannelInfo);

module.exports=router;