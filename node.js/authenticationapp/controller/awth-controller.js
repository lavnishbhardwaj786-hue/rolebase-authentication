const user=require("../models/user.js");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
// resigter controller 


const registeruser=async (req,res) => {
try{
const {username,email,password,role}=req.body;

const checkexistinguser=await user.findOne({ $or:[{ username,email}]});
if (checkexistinguser){
    return res.status(409).json({
        success:false,
        message:"user exist with same name or id "
    });
}
// hash user password 
const salt= await bcrypt.genSalt(10);
const hashedpassword=await bcrypt.hash(password,salt);

const newlycreateduser=new user({
    username,
    email,
    password:hashedpassword,
    role:role||'user'
});
await newlycreateduser.save();
if(newlycreateduser){
    res.status(201).json({
        success:true,
        message:'user reigistered sucessfully'
    });
}else{
 res.status(404).json({
        success:false,
        message:'unable to register user '
    });
}
}
catch(e){
    console.log(e);
    res.status(500).json({
        success:false,
        message:"there is an error occured "
    });
}
};
// login controller 
const loginuser=async(req,res)=>{
try{
const {username,password}=req.body;

const checkexistinguser=await user.findOne({ $or:[{username}]});
if (!checkexistinguser){
    return res.status(400).json({
        success:false,
        message:"user dosent exists  "
    });
}
const ispasswordmatch=await bcrypt.compare(password,checkexistinguser.password);
if(!ispasswordmatch){
    return res.status(400).json({
        success:false,
        message:"user invalid name or id "
    });
}
// now we are going to create a token which is used as a time for the person to visit the site if it expires then he lost excess to the site 
// for this we will use jsonweb token which will store the tokens 
const excessToken=jwt.sign({// the token will hold all this information 
    userId:checkexistinguser._id,// data base wali id ha ye 
    username:checkexistinguser.username,
    role:checkexistinguser.role
},"6879",{
expiresIn:'13m'
});
res.status(200).json({
    success:true,
    message:"logged in successful",
    excessToken
});
}
catch(e){
    console.log(e);
    res.status(500).json({
        success:false,
        message:"there is an error occured "
    });
}
};
const changepassword=async(req,res)=>{
    try{ 
    const userid=userInfo.userId;
    const {oldpassword,newpassword}=req.body;
    // find current user
    const loggeduser=user.findById(userid);
    if(!loggeduser){ 
    return res.status(404).json({
        success:false,
        message:"user not found",
    });
    }

    //check if old password is correct 
    const checkpassmatch=bcrypt.compare(oldpassword,loggeduser.password);
    if(!checkpassmatch){
        res.status(400).json({
            success:false,
            message:"password don't match new password ",
        });
    };
    const salt=await bcrypt.genSalt(10);
    const newhashedpassword=await bcrypt.hash(newpassword,salt);

    // update the user password 
    loggeduser.password=newhashedpassword;
    await loggeduser.save();
    res.status(200).json({
        success:true,
        message:"password changed successfully",
    });
}catch(e){
      console.log(e);
    res.status(500).json({
        success:false,
        message:"there is an error occured "
    });
}
}
module.exports={
    registeruser,
    loginuser,
    changepassword,
}