const mongoose=require("mongoose");

// we will use claudinary for the video and image storage in the cloude storage 
// we can store them locally differently 
const imageschema = mongoose.Schema({
    url:{
        type:String,
        required:true
    },
    publicid:{
        type:String,
        required:true
    },
    uploadedby:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    }
},{Timestamps:true});


module.exports=mongoose.model('image',imageschema)
