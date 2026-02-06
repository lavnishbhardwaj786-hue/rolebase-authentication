const express=require("express");
const router=express.Router();
const authmiddleware=require("../middleware/auth-middleware.js")



router.get('/welcome',authmiddleware,(req,res)=>{// here we can write it as a handler function to prevent un-authorized excess router.get("/path",handler1,handler2,handler3(req,res)=>{}) 
// and if one handler function fails the all things got terminated
const {username,email,role}=req.userInfo;// we can access the user info from the req object as we have set it in the auth middleware    

res.status(200).json({
        message:"welcome to home page ",      
        user:{
            username:username,
            email:email,
            role:role
        }
    });
});

module.exports=router;

