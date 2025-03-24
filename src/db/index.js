const mongoose=require('mongoose')
const DB_Name=require('../constants.js')
const dotenv=require('dotenv')

dotenv.config({
    path:'.env'
})
console.log(DB_Name);
const ConnectDb=async()=>{
    try{
        const ConnectInstance=await mongoose.connect(`${process.env.MONGO_URL}/${DB_Name}`);
        console.log(`your mongo connection is successful ${ConnectInstance.connection.host}`)
    }
    catch(error){
        console.log("Connection Failed !!!!");
    }
}

module.exports=ConnectDb
