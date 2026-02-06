const express=require('express');
const authmiddleware=require("../middleware/auth-middleware.js")
const adminmiddleware=require("../middleware/admin-middleware.js")
const router=express.Router();
// the sequence of middlewares is important here first authmiddleware will run then adminmiddleware
router.get('/welcome',authmiddleware,adminmiddleware,(req,res)=>{
    res.status(200).json({
        message:"welcome to admin dashboard"
    });
});

module.exports=router