const authorizationmiddleware = require("../middleware/authmiddleware.js");
const { createteam, showteam, deleteteam, addMember, removeMember,transferLeaderController,leaveTeam} = require("../controllers/teamcontroler.js")
const { checkifleader, leaderOrCoLeader } = require("../middleware/rolemiddleware.js")
const {leavemiddleware}=require("../middleware/leaveroutemiddleware.js");

const express = require('express');
const router = express.Router();


router.post('/teams', authorizationmiddleware, createteam);
router.get('/teams/:id', authorizationmiddleware, showteam);
router.delete('/teams/:id', authorizationmiddleware, checkifleader, deleteteam);


router.post('/teams/:id/members', authorizationmiddleware, leaderOrCoLeader, addMember);
router.delete('/teams/:id/members/:userId', authorizationmiddleware, leaderOrCoLeader, removeMember);


router.patch('/teams/:id/transfer-leader',authorizationmiddleware,checkifleader,transferLeaderController);
router.post('/teams/:id/leave', authorizationmiddleware,leavemiddleware,leaveTeam);


module.exports = router