const Tweet=require('../models/tweet.mode.js');
const User=require('../models/userSchema.model.js');
const ApiError=require('../utils/ApiError.js')
const ApiResponse=require('../utils/ApiResponse.js');
const asyncHandler = require('../utils/asyncHandler.js');

const CreateTweet=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user?._id);
    if(!user) throw new ApiError(404,'User not found');
    const {text}=req.body;
    if(!text) throw new ApiError(400,"Please enter a text");
    const tweet=await Tweet.create({
        content:text,
        owner:user?._id
    })
    if(!tweet) throw new ApiError(500,"something went wrong");

    res.status(201).json(new ApiResponse(200,text,"your tweet comment successfully"));
})

const getUserTweets=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user?._id);
    if(!user) throw new ApiError(404,'User not found');
    
    const tweets=await Tweet.aggregate([
        {
            $match:{
                owner:req.user?._id
            }
        },
        {
            $project:{
                content:1,
                _id:0
            }
        }
    ])

    if(!tweets) throw new ApiError(404,"something went wrong");
    
    res.status(201).json(new ApiResponse(201,tweets,"All tweets of user"));
})

const updateTweet=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user?._id);
    if(!user) throw new ApiError(404,'User not found');
    
    const TweetId=req.body?._id;
    const tweet=await Tweet.findById(TweetId);
    if(!tweet) throw newApiError(401,"something went wrong");
    
    const NewContent=req.body?.content;
    tweet.content=NewContent;
    await tweet.save();
    res.status(201).json(new ApiResponse(200,tweet,"Tweet updated successfully"));
})

const deleteTweet=asyncHandler(async(req,res)=>{
    const user=await User.findById(req.user?._id);
    if(!user) throw new ApiError(404,'User not found');
    
    const TweetId=req.body?._id;
    const tweet=await Tweet.findById(TweetId);
    if(!tweet) throw newApiError(401,"something went wrong");
    
    const deletedTweet=await Tweet.deleteOne(
        {
            _id:req.body?._id
        }
    )

    if(!deletedTweet) throw new ApiError(500,"something went wrong");
    res.status(201).json(new ApiResponse(200,deletedTweet,"Tweet deleted successfully"));
})

module.exports={CreateTweet,getUserTweets,updateTweet,deleteTweet}