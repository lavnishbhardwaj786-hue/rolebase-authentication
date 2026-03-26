    const { showTask, updateTaskStatus } = require('../services/taskservices.js');

    // send tasks when user connects
    const socketShowTask = async (socket, teamId) => {
        try {
            const tasks = await showTask(teamId);
            socket.emit("task:list", tasks);
        } catch (err) {
            socket.emit("error", { message: "Could not fetch tasks" });
        }
    };

    // member updates status → whole team sees it
    const socketUpdateTaskStatus = async (socket, io, teamId, userId, role, data) => {
        try {
            // ✅ fixed status values to match model
            const allowedStatus = ["pending", "working", "complete"];
            if (!allowedStatus.includes(data.status)) {
                socket.emit("error", { message: "Invalid status" });
                return;
            }

            // member can only update their OWN task
            if (role === "member" && taskData.assignedTo.toString() !== userId.toString()) {
                socket.emit("error", { message: "You can only update your own task" });
                return;
            }
            const taskData = await updateTaskStatus(data.taskId, data.status);

            io.to(teamId).emit("task:statusUpdated", taskData);
        } catch (err) {
            socket.emit("error", { message: "Could not update task status" });
        }
    };

    module.exports = { socketShowTask, socketUpdateTaskStatus };