const app=require('./app.js');
const dotenv=require('dotenv');   // this is for .env file so that we can read informtion from it
const ConnectDb=require('./db/index.js')

dotenv.config({    // this is to config the dotenv
    path:'./.env'
});

const PORT=process.env.PORT;   // way to access the data from .env file
console.log(PORT);
// console.log(process.env)
// console.log(process.env.MONGO_URL);
ConnectDb()
.then((res)=>{
    app.listen(PORT,()=>{
        console.log(`server is running on port ${PORT}`);
    })    
})
.catch((err)=>{
   console.log("Mongo is failing to connect");
})