const jwt = require('jsonwebtoken');
const Team = require('../models/teammodel.js'); // adjust path
const socketmiddleware=async (socket, next) => {
    const token = socket.handshake.auth.token;
    const teamId = socket.handshake.query.teamId;

    if (!token) return next(new Error("Unauthorized: No token"));
    if (!teamId) return next(new Error("No teamId provided"));

    try {
        // Step 1 — decode JWT to get userId
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Step 2 — find team and locate this user inside members array
        const team = await Team.findById(teamId);

        if (!team) return next(new Error("Team not found"));

        // Step 3 — find this user's entry in members array
        const memberEntry = team.members.find(
            (m) => m.user.toString() === userId.toString()
        );

        if (!memberEntry) return next(new Error("User not part of this team"));

        // Step 4 — attach everything to socket.data
        socket.data.userId = userId;
        socket.data.role = memberEntry.role;   // "leader" | "coLeader" | "member"
        socket.data.teamId = teamId;

        next();
    } catch (err) {
        next(new Error("Unauthorized: Invalid token"));
    }
};
module.exports={
    socketmiddleware
}