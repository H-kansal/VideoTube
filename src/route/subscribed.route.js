const express=require('express')
const Subscription=require('../controllers/subscription.controllers.js');
const router=express.Router();
const UpdateRequest=require('../middleware/auth.middleware.js');

router.route('/toggleSubscription/:id').put(UpdateRequest,Subscription.toggleSubscription);
router.route('/getSubscribedChannels').get(UpdateRequest,Subscription.getSubscribedChannels);

router.route('/getUserChannelSubscribers/:id').get(Subscription.getUserChannelSubscribers)
module.exports=router;