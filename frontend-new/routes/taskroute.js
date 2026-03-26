const authorizationmiddleware=require("../middleware/authmiddleware.js");
const {leaderOrCoLeader}=require("../middleware/rolemiddleware.js")
const {createtask,deletetask,updatestatus,showtask}=require("../controllers/taskcontroller.js")
const express=require('express');
const router=express.Router();

router.post('/task',authorizationmiddleware,leaderOrCoLeader,createtask);
router.delete('/task/:id',authorizationmiddleware,deletetask);
router.patch('/task/:id/status',authorizationmiddleware,updatestatus);
router.get('/teams/:id/tasks',authorizationmiddleware,showtask);

module.exports=router