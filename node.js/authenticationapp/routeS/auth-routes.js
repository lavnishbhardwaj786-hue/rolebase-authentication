const express=require("express");
const router=express.Router();

const {registeruser,loginuser,changepassword}=require("../controller/awth-controller.js");


// routes relted to auth 
router.post('/register',registeruser);
router.post('/loginuser',loginuser);
router.post('/change-password',changepassword);


module.exports=router;