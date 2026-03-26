const team=require("../models/teammodel.js");


const checkifleader = async (req, res, next) => {
            console.log("the this to check",req.user);
    try {
        const teamid = req.params.id;
        const teamdata = await team.findOne({
            _id: teamid,
            members: {
                $elemMatch: {
                    user: req.user.id,
                    role: "leader"
                }
            }
        });
        if (!teamdata) {
            return res.status(403).json({
                message: "Only team leader can perform this action",
                success: false
            });
        }
         next();
    } catch (e) {
        res.status(500).json({
            message: "not able to find leader in catch ",
            success: false,
            error: e.message
        })
    }
}
const leaderOrCoLeader = async (req, res, next) => {
    try {
        const teamId = req.params.id || req.body.team; // ✅ fallback to body

        const teamdata = await team.findOne({
            _id: teamId,
            members: {
                $elemMatch: {
                    user: req.user.id,
                    role: { $in: ["leader", "coLeader"] }
                }
            }
        });

        if (!teamdata) {
            return res.status(403).json({
                message: "Leader or co-leader permission required"
            });
        }

        next();

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    checkifleader,
    leaderOrCoLeader
};