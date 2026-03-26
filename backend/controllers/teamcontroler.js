const team = require("../models/teammodel.js")
const User = require("../models/usermodel.js")
const Task = require("../models/taskmodel.js")  // ← add this import

const createteam = async (req, res) => {
    try {
        console.log("REQ USER:", req.user);
        console.log("PERSON:", req.user.id);
        const person = req.user.id;
        const teamdata = {
            name: req.body.name,
            createdBy: person,
            members: [
                {
                    user: person,
                    role: "leader"
                }
            ]
        }
        if (!req.body.name) {
            return res.status(400).json({
                message: "Team name is required"
            });
        }
        const existingTeam = await team.findOne({ createdBy: req.user.id });
        if (existingTeam) {
            return res.status(400).json({ message: "You already have a team" });
        }
        const createdteam = await team.create(teamdata);
        res.status(201).json({
            message: "team created",
            team: createdteam
        })
    }
    catch (e) {
        res.status(500).json({
            message: "it is very clear the team is not created",
            errormessage: e.message
        })
    }
}

const showteam = async (req, res) => {
    try {
        const userId = req.user.id;
        const teamId = req.params.id;

        const teamData = await team.findOne({
            _id: teamId,
            "members.user": userId
        }).populate("createdBy", "name").populate("members.user", "name email");

        res.status(200).json({
            message: "we got team data",
            members: teamData
        })
    } catch (error) {
        res.status(500).json({
            message: "it is very clear the team is not created",
            error: error.message
        })
    }
}

const deleteteam = async (req, res) => {
    try {
        const teamid = req.params.id;
        const teamData = await team.findById(teamid);
        if (!teamData) {
            return res.status(404).json({
                message: "Team not found"
            });
        }
        const data = await team.findByIdAndDelete(teamid);
        res.status(200).json({
            message: "the team deleted successfully",
            something: "successful"
        })
    }
    catch (error) {
        res.status(500).json({
            message: "it is very clear the team is not created",
            error: error.message
        })
    }
}

const addMember = async (req, res) => {
    try {
        const assignee = await User.findOne({ email: req.body.email });

        if (!assignee) {
            return res.status(404).json({
                message: "User not found",
                success: false
            });
        }

        const teamId = req.params.id;
        const teamData = await team.findById(teamId);

        if (!teamData) {
            return res.status(404).json({ message: "Team not found" });
        }

        const exists = teamData.members.find(
            m => m.user.toString() === assignee._id.toString()
        );

        if (exists) {
            return res.status(400).json({ message: "User already in team" });
        }

        teamData.members.push({
            user: assignee._id,
            role: "member"
        });

        await teamData.save();

        res.status(200).json({
            message: "Member added successfully",
            success: true,
            team: teamData
        });

    } catch (error) {
        console.log("ADD MEMBER ERROR:", error.message)
        res.status(500).json({
            message: "Error adding member",
            error: error.message
        });
    }
};

const removeMember = async (req, res) => {
    try {
        const teamId = req.params.id;
        const userId = req.params.userId;

        const teamdata = await team.findById(teamId);

        if (!teamdata) {
            return res.status(404).json({
                message: "Team not found"
            });
        }

        // Remove member from team
        teamdata.members = teamdata.members.filter(
            member => member.user.toString() !== userId
        );
        await teamdata.save();

        // Delete all tasks assigned to this member in this team
        await Task.deleteMany({
            team: teamId,
            assignedTo: userId
        });

        res.status(200).json({
            message: "Member removed successfully",
            success: true
        });

    } catch (error) {
        res.status(500).json({
            message: "Error removing member",
            error: error.message
        });
    }
};

const transferLeaderController = async (req, res) => {
    try {
        const teamId = req.params.id;  // fixed: was req.params.teamId but route uses :id
        const currentUserId = req.user.id;
        const { newLeaderId } = req.body;

        const teamdata = await team.findById(teamId);

        if (!teamdata) {
            return res.status(404).json({
                message: "Team not found"
            });
        }
        const member = teamdata.members.find(
            m => m.user.toString() === newLeaderId
        );

        if (!member) {
            return res.status(400).json({
                message: "User is not a team member"
            });
        }
        teamdata.members.forEach(member => {
            if (member.user.toString() === newLeaderId) {
                member.role = "leader";
            }
            if (member.user.toString() === currentUserId) {
                member.role = "coLeader";
            }
        });

        await teamdata.save();

        res.json({
            message: "Leadership transferred successfully",
            teamdataa: teamdata
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const leaveTeam = async (req, res) => {
    try {
        const teamId = req.params.id;
        const memberId = req.user.id;

        const teamdata = await team.findById(teamId);

        if (!teamdata) {
            return res.status(400).json({
                message: "Team doesn't exist",
                success: false
            });
        }

        const memberfound = teamdata.members.find(
            m => m.user.toString() === memberId
        );

        if (!memberfound) {
            return res.status(400).json({
                message: "Member doesn't exist",
                success: false
            });
        }

        teamdata.members = teamdata.members.filter(
            m => m.user.toString() !== memberId
        );

        await teamdata.save();

        res.json({
            message: "Member removed successfully",
            success: true
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    createteam,
    showteam,
    deleteteam,
    addMember,
    removeMember,
    transferLeaderController,
    leaveTeam,
}