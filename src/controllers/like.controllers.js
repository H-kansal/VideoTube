const asyncHandler=require('../utils/asyncHandler.js');
const ApiError=require('../utils/ApiError.js');
const ApiResponse=require('../utils/ApiResponse.js');
const Like=require('../models/like.model.js');
const Comment=require('../models/comment.model.js');
const User=require('../models/userSchema.model.js');
const Video=require('../models/videoSchema.model.js');
const Tweet=require('../models/tweet.mode.js');

const toggleVideoLike=asyncHandler(async(req,res)=>{
    const videoId=req.params.id;
    if(!videoId) throw new ApiError(404,"please provide video id");
    const userId=req.user._id;
    const video=await Video.findById(videoId);
    if(!video) throw new ApiError(404,"video not found");
    
    const like=await Like.create({
        video:videoId,
        likedBy:userId
    })

    if(!like) throw new ApiError(404,"something went wrong");

    res.status(200).json(new ApiResponse(200,like,"video liked successfully"));
})

const toggleCommentLike=asyncHandler(async(req,res)=>{
    const commentId=req.params.id;
    if(!commentId) throw new ApiError(404,"please provide video id");
    const userId=req.user._id;
    const comment=await Comment.findById(commentId);
    if(!comment) throw new ApiError(404,"comment not found");
    
    const like=await Like.create({
        comment:commentId,
        likedBy:userId
    })

    if(!like) throw new ApiError(404,"something went wrong");

    res.status(200).json(new ApiResponse(200,like,"comment liked successfully"));
})

const toggleTweetLike=asyncHandler(async(req,res)=>{
    const tweetId=req.params.id;
    if(!tweetId) throw new ApiError(404,"please provide tweet id");
    const userId=req.user._id;
    const tweet=await Comment.findById(tweetId);
    if(!tweet) throw new ApiError(404,"comment not found");
    
    const like=await Like.create({
        tweet:tweetId,
        likedBy:userId
    })

    if(!like) throw new ApiError(404,"something went wrong");

    res.status(200).json(new ApiResponse(200,like,"tweet liked successfully"));
})

const getallLikeVideo=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const user=await User.findById(userId);
    if(!user) throw new ApiError(404,"no user found");
    
    const video=await Like.find({
        likedBy:userId,
        comment:undefined,
        tweet:undefined
    }).populate('video').select("-likedBy -comment -tweet -_id -__v");

    if(!video) throw new ApiError(404,"something went wrong");
    res.status(200).json(new ApiResponse(200,video,"all liked videos"));
})

module.exports={toggleVideoLike,toggleCommentLike,toggleTweetLike,getallLikeVideo};