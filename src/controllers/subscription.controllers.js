const Subscription=require('../models/subscription.model.js');
const ApiError=require('../utils/ApiError.js');
const ApiResponse=require('../utils/ApiResponse.js');
const asyncHandler=require('../utils/asyncHandler.js');
const User=require('../models/userSchema.model.js');
const { default: mongoose } = require('mongoose');

const toggleSubscription=asyncHandler(async(req,res)=>{
    const subscribedChannel=req.params.id;
    const userId=req.user._id;
    const user=await User.findById(userId);
    if(!user) throw new ApiError(404,'User not found');
    
    const channel=await User.findById(subscribedChannel);
    if(!channel) throw new ApiError(404,'Channel not found');
    
    const validate=await Subscription.find({
        "channel":subscribedChannel,
        "subscriber":userId
    })
    
    if(!validate) throw new ApiError(500,"something went wrong");
    if(validate.length>0) {
        const unSubscribed=await Subscription.deleteMany({
           "channel":subscribedChannel,
           "subscriber":userId
        })
        if(!unSubscribed) throw new ApiError(500,"something went wrong");
        res.status(200).json(new ApiResponse(200,unSubscribed,"unscribed successfully"));
    }else{
        const subscribed=await Subscription.create({
            channel:subscribedChannel,
            subscriber:userId
        })
        if(!subscribed) throw new ApiError(500,"something went wrong");
        res.status(200).json(new ApiResponse(200,subscribed,"subscribed successfully"));
    }
})

const getUserChannelSubscribers =asyncHandler(async(req,res)=>{
    const channel=req.params.id;
    const user=await User.findById(channel);
    if(!user) throw new ApiError(404,'User not found');

    // const subscribers=await Subscription.aggregate([
    //     {
    //         $match:{
    //             channel:new mongoose.ObjectId(channel)
    //         },
    //     },
    //     {
    //         $project:{
    //             subscriber:1,
    //         }
    //     }
    // ])
    
    const subscribers=await Subscription.find({
        channel:channel
    }).populate('subscriber').select("-_id -channel -createdAt -updatedAt -__v")

    res.status(200).json(new ApiResponse(200,subscribers,"All users"))
})

const getSubscribedChannels =asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const user=await User.findById(userId);
    if(!user) throw new ApiError(404,'User not found');

    const subscribedChannels=await Subscription.find({
        subscriber:userId
    }).populate('channel').select("-_id -subscriber -createdAt -updatedAt -__v")

    res.status(200).json(new ApiResponse(200,subscribedChannels,"all subscibed channel"));
})

module.exports={toggleSubscription,getUserChannelSubscribers,getSubscribedChannels};