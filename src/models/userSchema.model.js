const mongoose=require('mongoose');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const {Schema}=mongoose

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },            
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true, 
        },
        fullName: {
            type: String,
            required: true,
            trim: true, 
            index: true
        },
        avatar: {
            type: String, // cloudinary url
            required: true,
        },
        coverImage: {
            type: String, // cloudinary url
        },
        watchHistory: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password: {
            type: String,
            required: [true, 'Password is required']
        },
        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
)

//hooks->mongoDB middleware
//pre->work just before the action have to take place in DB
userSchema.pre("save",async function (next){
     if(!this.isModified('password')) return next();

     this.password=await bcrypt.hash(this.password,10);
     next() ;
})

userSchema.methods.isCorrectPassword=async function (password){
     return await bcrypt.compare(password,this.password);
}

// json web tokens
userSchema.methods.generateAccessToken=function (){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESSTOKENSECRET,
        {
            expiresIn: process.env.ACCESSTOKENEXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function (){
    return jwt.sign(
        {
            _id: this._id,
            
        },
        process.env.REFRESHTOKENSECRET,
        {
            expiresIn: process.env.REFRESHTOKENEXPIRY
        }
    )
}

module.exports=mongoose.model('User',userSchema);