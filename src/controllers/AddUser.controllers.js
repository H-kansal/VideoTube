//Optional chaining (?.) prevents errors when accessing properties of null or undefined values. It stops execution and returns undefined instead of throwing an error.
const asyncHandler=require('../utils/asyncHandler.js')
const ApiResponse=require('../utils/ApiResponse.js')
const ApiError=require('../utils/ApiError.js')
const User=require('../models/userSchema.model.js')
const uploadFile=require('../utils/cloudinary.utils.js')
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');

dotenv.config({
    path:'.env'
});``

const GenerateAccessAndRefreshTokens=(user)=>{
   try{
    const RefreshTokens=user.generateRefreshToken()
    const AccessTokens=user.generateAccessToken()
    
    return {AccessTokens,RefreshTokens}
   }catch(err){
       console.log(err);
   }
}

const Registeruser=asyncHandler(async (req,res)=>{
    let {username,email,fullName,password}=req.body;
    // console.log("checked0")
    if([username,email,fullName,password].some((ele)=>{
        ele?.trim()!==""
    })){
       throw new  ApiError(400,"All credential are required");
    }

// console.log("checked1");
// $or -> match documents where at least one of multiple conditions is true.
const CkeckUser=async ()=>{
    const userExist=await User.findOne({
        $or:[
            {username:username},{email:email}
        ]
    })
    if(userExist) throw new ApiError(404,"user already exist");
}
    
await CkeckUser();
// console.log("checked2");

const avatarPath=req.files?.['avatar'][0].path;
if(!avatarPath) throw new ApiError(409,"upload images");

const CoverImagePath=req.files?.['cover'][0].path

const uploadAvatar=async ()=>{
    return await uploadFile(avatarPath);
}

let AvatarImage=await uploadAvatar();
if(!AvatarImage) throw new ApiError(400,"avatar not upload")

let CoverImage;
if(CoverImagePath){
    const uploadCoverImage=async ()=>{
     return await uploadFile(CoverImagePath);
    }
    CoverImage=await uploadCoverImage();
    if(!CoverImage) throw new ApiError(400,"coverImage not upload");
}

console.log("image uploaded");
const CreateUser=async ()=>{
        return await User.create({
            username,
            email,
            fullName,
            avatar:AvatarImage.url,
            coverImage:CoverImage?.url,
            password
         })
}

const NewUser=await CreateUser();

    console.log("usercreated");

    const createdUser=async ()=>{
        return await User.findById(NewUser._id).select("-password -refreshToken");
    }

const confirmUser=await createdUser();
    if(!confirmUser) throw new ApiError(500,"something went wrong");
    return res.status(200).json(new ApiResponse(200,confirmUser,"User Register successsfully"));
})

const loginUser=asyncHandler(async (req,res)=>{
   const {email,password}=req.body;
   if(!password) throw new ApiError(404,"password is required");
   if(!email) throw new ApiError(404,"Email is required");
   
   const FindUser=async()=>{
      return await User.findOne({email:email});
   }
   
   const user=await FindUser();
   if(!user) throw new ApiError(404,"user not register");
   const checkPassword=await user.isCorrectPassword(password)
   if(!checkPassword) throw new ApiError(404,"Enter correct password");
   
   const {AccessTokens,RefreshTokens}=GenerateAccessAndRefreshTokens(user);
   user.refreshToken=RefreshTokens;
   await user.save({validateBeforeSave:false});
   
   const Logginuser=await FindUser()
   const options={
    httpOnly:true
   }
   
   res.status(201).cookie("accesstokens",AccessTokens,options).cookie("refreshtokens",RefreshTokens,options).json(new ApiResponse(200,Logginuser,"login successfully"));
})

const logOutUser=asyncHandler(async (req,res)=>{
   try{
        const user=await User.findByIdAndUpdate(
            req.user?._id,
            {
            $set:{
                refreshToken:undefined,
            }
            },
            {
                new:true
            }
        )
        const options={
            httpOnly:true,
        }
        res.status(201).clearCookie("accesstokens",options).clearCookie("refreshtokens",options).json(new ApiResponse(200,user,"logout successfully"));
   }catch(error){
     throw new ApiError(500,error?.message);
   }
})

const refreshAccessTokens=asyncHandler(async(req,res)=>{
    const incomingRefreshTokens=req.cookies.refreshtokens || req.body.refreshtokens;
    
    const verifyRefreshTokens=jwt.verify(incomingRefreshTokens,process.env.REFRESHTOKENSECRET);
    if(!verifyRefreshTokens) throw new ApiError(500,"invalid RefreshTokens");

    const user=User.findOne({_id:incomingRefreshTokens._id});
    if(!user) throw new ApiError(500,"invalid refresh tokens");
    
    const {AccessTokens,RefreshTokens}=GenerateAccessAndRefreshTokens(user);
    user.refreshToken=RefreshTokens;
    await user.save({validateBeforeSave:false});
    
    const options={
        httpOnly:true
    }

    res.status(200).cookie("accesstokens",AccessTokens,options).cookie("refreshtokens",RefreshTokens,options).json(new ApiResponse(200,user,"refresh successfully"));
})

const UpdatePassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body;
    console.log(req.user._id)
    const user=await User.findById(req.user?._id);
    console.log(user)
    const checkOldPassword=user?.isCorrectPassword(oldPassword);
    if(!checkOldPassword) throw new ApiError(500,"Enter correct old password");
    
    // const UpdatePassword=await User.findByIdAndUpdate(
    //     req.user?._id,
    //    { 
    //     $set:{
    //         password:newPassword
    //     }
    //    },
    //     {new:true}
    // )
    user.password=newPassword;
    await user.save({validateBeforeSave:false})
    
    res.status(201).json(new ApiResponse(201,"Password update successfully"));
})

const updateAvatar=asyncHandler(async(req,res)=>{
    const Avatar=req.file?.path;
    if(!Avatar) throw new ApiError(500,"Not upload successfully");
    const upload=await uploadFile(Avatar);
    if(!upload) throw new ApiError("500","something went wrong while uploading");

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
           $set:{
            avatar:upload.url
           }
        },
        {new:true}
    )

    if(!user) throw new ApiError(500,"somthing went wrong while upadting");

    res.status(201).json(new ApiResponse(300,user,"update successfully"));
})

const updateCover=asyncHandler(async(req,res)=>{
    const coverImageLocalpath=req.file?.path;

    if(!coverImageLocalpath) throw new ApiError(500,"cover image not upload successfully");

    const coverImage=await uploadFile(coverImageLocalpath);
    if(!coverImage) throw new ApiError(500,"something went wrong while uploading the image");

    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                coverImage:coverImage.url
            }
        },
        {
            new:true
        }
    )

    res.status(201).json(new ApiResponse(201,user,"cover image update successfully"));
})

module.exports={Registeruser,loginUser,refreshAccessTokens,logOutUser,UpdatePassword,updateAvatar,updateCover};