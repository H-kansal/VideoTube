const asyncHandler=require('../utils/asyncHandler.js');
const ApiError=require('../utils/ApiError.js');
const ApiResponse=require('../utils/ApiResponse.js');
const Like=require('../models/like.model.js');
const Comment=require('../models/comment.model.js');
const User=require('../models/userSchema.model.js');
const Video=require('../models/videoSchema.model.js');
const Tweet=require('../models/tweet.mode.js');
const Subscription=require('../models/subscription.model.js');
const mongoose=require('mongoose');

const getChannelInfo=asyncHandler(async(req,res)=>{
    const channelUserId=req.params.id;
    if(!channelUserId) throw new ApiError(404,"provide the channel user id");
    const user=User.findById(channelUserId);
    if(!user) throw new ApiError(404,"channel user not found");
    
    // if(mongoose.isValidObjectId(channelUserId)) console.log("yes");
    
    // const channelInfo=await Video.aggregate([
    //     {
    //        $match:{
    //           "owner":channelUserId 
    //        }
    //     },
    //    {
    //      $group:{
    //         _id:null,
    //         TotalViews:{
    //             $sum:"$views"
    //         },
    //         TotalVideo:{
    //             $sum:1
    //         }
    //      }
    //    },
    // ])

    const channelInfo=await Video.find({
        owner:channelUserId
    })

    const AllSubscriber=await Subscription.find({
        channel:channelUserId
    })

    const VideoLike=await Like.find({
        
    })

    console.log(channelInfo);
    res.status(200).json(new ApiResponse(200,channelInfo,"channel information"));
})

module.exports={getChannelInfo}