const mongoose=require('mongoose');
const {Schema}=mongoose;

const tweetSchema = new Schema({
    content: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,   // this means each tweet document will store an ObjectId that references a User document.
        // By default, MongoDB only stores the ObjectId, not the actual user data.
        // To fetch the full user details along with posts, use populate()
        ref: "User"
    }
}, {timestamps: true})

module.exports=mongoose.model('Tweet',tweetSchema);