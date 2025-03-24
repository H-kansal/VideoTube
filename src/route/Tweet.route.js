const express=require('express');
const router=express.Router();
const MyTweet=require('../controllers/tweet.controllers')
const UpdateRequest=require('../middleware/auth.middleware')

router.route('/createTweet').post(UpdateRequest,MyTweet.CreateTweet);
router.route('/UserTweets').get(UpdateRequest,MyTweet.getUserTweets);
router.route('/updateTweets').put(UpdateRequest,MyTweet.updateTweet);
router.route('/deleteTweet').delete(UpdateRequest,MyTweet.deleteTweet);
module.exports=router;