const jwt=require('jsonwebtoken');
const ApiResponse=require('../utils/ApiResponse')
const ApiError=require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const User=require('../models/userSchema.model')
const dotenv=require('dotenv');

dotenv.config({
    path:'.env'
});

const UpdateRequest=asyncHandler(async(req,_,next)=>{
    const accessTokens=req.body.accesstokens || req.headers.authorization?.replace("Bearer ","");
    try{
        const decodeTokens=jwt.verify(accessTokens,process.env.ACCESSTOKENSECRET)
        if(!decodeTokens) throw new ApiError(500,"invalid access tokens");
        const user=await User.findById(decodeTokens._id);
        if(!user) throw new ApiError("500","unauthorised");
        req.user=user;
        next()
    }catch(error){
        throw new ApiError(500,error?.message);
    }
})

module.exports=UpdateRequest;