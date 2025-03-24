const express=require('express');
const cors=require('cors');
const app=express();

// middleware are use after app form

// some middleware
app.use(
    cors({
        origin:process.env.CORS_ORIGIN
    })
)
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"))

// router

const HealthRouter=require('./route/healthCheck.route.js');
const UserRouter=require('./route/NewUser.route.js');
const TweetRouter=require('./route/Tweet.route.js');
const VideoRouter=require('./route/video.route.js');
const Subscribed=require('./route/subscribed.route.js');
const Comment=require('./route/comment.route.js');
const Like=require('./route/like.route.js');
const Channel=require('./route/dashboard.route.js');

app.use('/app/program',HealthRouter);
app.use('/app/program',UserRouter);
app.use('/app/program',TweetRouter);
app.use('/app/program',VideoRouter);
app.use('/app/program',Subscribed);
app.use('/app/program',Comment);
app.use('/app/program',Like);
app.use('/app/program',Channel);
module.exports=app