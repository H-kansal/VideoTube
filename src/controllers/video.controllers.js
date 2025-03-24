const asyncHandler=require('../utils/asyncHandler.js');
const ApiError=require('../utils/ApiError.js')
const ApiResponse=require('../utils/ApiResponse.js');
const User=require('../models/userSchema.model.js');
const Video=require('../models/videoSchema.model.js');
const uploadFile=require('../utils/cloudinary.utils.js');
const { default: mongoose } = require('mongoose');

const publishAVideo=asyncHandler(async(req,res)=>{
    const {title,description,duration}=req.body;
    const user=await User.findById(req.user?.id);
    if(!user) throw new ApiError(500,"user not found");

    const thumbnail=req.files?.['thumbnail'][0].path;
    const video=req.files?.['video'][0].path;
    if(!video) throw new ApiError(401,'Video is required');
    
    const uploadthumbnail=await uploadFile(thumbnail);
    const uploadvideo=await uploadFile(video);
    if(!uploadthumbnail) throw new ApiError(500,"something went wrong while uploading thumbnail");
    if(!uploadvideo) throw new ApiError(500,"something went wrong while uploading video");
    console.log(uploadthumbnail.url)
    console.log(uploadvideo.url)
    const newVideo=await Video.create({
        videoFile:uploadvideo?.url,
        thumbnail:uploadthumbnail?.url,
       title,
       description,
       duration,
       owner:req.user?._id
    })
    
    if(!newVideo) throw new ApiError(500,"something went wrong");
    res.status(201).json(new ApiResponse(201,newVideo,"video upload successfully"));
})

const getVideo=asyncHandler(async(req,res)=>{
    const videoID=req.params.id;
    const video=await Video.findById(videoID);
    if(!video) throw new ApiError(500,"invalid videoID");
    res.status(200).json(new ApiResponse(200,video.videoFile,"query complete successfully"));
})

const updateVideo =asyncHandler(async(req,res)=>{
    const videoID=req.params.id;
    const {title,description,duration}=req.body;
    const video=await Video.findByIdAndUpdate(
       videoID,
        {
            $set:{
                title:title,
                description:description,
                duration:duration
            }
        },
        {
            new:true
        }
    )
    if(!video) throw new ApiError(500,"something went wrong")
    res.status(200).json(new ApiResponse(200,video,"update successfully"));
})

const deleteVideo =asyncHandler(async(req,res)=>{
    const videoID=req.params.id;
    const video=await Video.findById(videoID);
    if(!video) throw new ApiError(500,"No such video exist");

    const DeleteVideo=await Video.deleteOne({
        _id:videoID
    })
    if(!DeleteVideo) throw new ApiError(500,"something went wrong");
    res.status(200).json(new ApiResponse(200,"delete successfully"));
})

const getAllVideo=asyncHandler(async(req,res)=>{
    const { page, limit, query, sortBy, sortType,userId} = req.query
    const filter={};
    if(query) filter.title={$regex: query, $options: "i"};
    if(userId) filter.owner=new mongoose.ObjectId(userId);
    
    const limitNumber=parseInt(limit);
    const pageNumber=parseInt(page);
    const sortOrder=parseInt(sortType);
    const AllVideo=await Video.aggregate([
        {
            $match:filter
        },
        {
            $sort:{[sortBy]:sortOrder}
        },
        {
            $skip:(pageNumber-1)*limitNumber
        },
        {
            $limit:limitNumber
        }
    ])

    if(!AllVideo) throw new ApiError(500,"something went wrong");
    res.status(200).json(new ApiResponse(200,AllVideo,"get all video successfully"));
})


module.exports={publishAVideo,getVideo,updateVideo,deleteVideo,getAllVideo};