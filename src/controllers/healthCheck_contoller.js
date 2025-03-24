const asyncHandler=require('../utils/asyncHandler.js')
const ApiResponse=require('../utils/ApiResponse.js')

const HealthCheck=asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200,"OK","Health check complete"));
})

module.exports=HealthCheck;