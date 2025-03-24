const Comment=require('../models/comment.model.js');
const User=require('../models/userSchema.model.js');
const Video=require('../models/videoSchema.model.js');
const asyncHandler=require('../utils/asyncHandler.js');
const ApiError=require('../utils/ApiError.js');
const ApiResponse=require('../utils/ApiResponse.js');

const getVideoComments =asyncHandler(async(req,res)=>{
    const videoId=req.params.id;
    if(!videoId) throw new ApiError('Video id is required',400);

    const video=await Video.findById(videoId)
    if(!video) throw new ApiError(400,'Video not found');

    const comment=await Comment.find({
        video:videoId
    }).select("-_id -video -owner -createdAt -updatedAt -__v")

    if(!comment) throw new ApiError(404,"something went wrong");

    res.status(200).json(new ApiResponse(200,comment,"All comments for video " + videoId))
})

const addComment=asyncHandler(async(req,res)=>{
    const content=req.body.content;
    const videoId=req.params.id;
    const userId=req.user._id;
    
    const user=await User.findById(userId);
    if(!user) throw ApiError(500,"user not found");
    const video=await Video.findById(videoId);
    if(!video) throw ApiError(500,"No such video exist");

    const comment=await Comment.create(
        {
            content:content,
            owner:userId,
            video:videoId
        }
    )

    if(!comment) throw new ApiError(404,"something went wrong");
    res.status(201).json(new ApiResponse(201,comment,"comment save successfully"));
})

const updateComment=asyncHandler(async(req,res)=>{
    const commentId=req.params.id;
    const content=req.body.content;
    if(!commentId) throw new ApiError(404,"comment id is required");

    const comment=await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content:content
            }
        },
        {
            new:true
        }
    )

    if(!comment) throw new ApiError(404,"something went wrong");
    res.status(200).json(new ApiResponse(200,comment,"comment updated successfully"));
})

const deleteComment =asyncHandler(async(req,res)=>{
    const commentId=req.params.id;
    if(!commentId) throw new ApiError(404,"comment id is required");
    const comment=await Comment.findById(commentId);
    if(!comment) throw new ApiError(404,"comment not found");

    const deleteComment=await Comment.deleteOne({
        _id:commentId
    })
    
    if(!deleteComment) throw new ApiError(404,"something went wrong");
    res.status(200).json(new ApiResponse(200,deleteComment,"comment deleted successfully"));
})

module.exports={addComment,updateComment,deleteComment,getVideoComments};