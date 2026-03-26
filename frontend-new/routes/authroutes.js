const express=require('express');
const {registeruser,loginuser}=require("../controllers/authcontroller.js");

const router=express.Router();

router.post('/auth/register',registeruser);
router.post('/auth/login',loginuser);


module.exports=router