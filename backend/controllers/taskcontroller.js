const User = require("../models/usermodel.js");
const Team = require("../models/teammodel.js");
const Task = require("../models/taskmodel.js");
const { createTask, deleteTask, updateTaskStatus, showTask } = require("../services/taskservices.js");

const createtask = async (req, res) => {
    try {
        const assignee = await User.findOne({ email: req.body.email });
        if (!assignee) {
            return res.status(404).json({ message: "Assignee not found", success: false });
        }
        const taskData = {
            title: req.body.title,
            description: req.body.description,
            team: req.body.team,
            assignedTo: assignee._id,
            assignedBy: req.user.id
        };

        const createdtask = await createTask(taskData);

        const populatedTask = await Task.findById(createdtask._id)
            .populate("assignedTo", "name")
            .populate("assignedBy", "name");
        // ✅ emit to team so everyone sees new task instantly

        req.io.to(req.body.team).emit("task:created", populatedTask);

        res.status(200).json({ message: "task created successfully", success: true, taskmade: populatedTask });
    } catch (e) {
        res.status(500).json({ message: "task can not be created", important: e.message });
    }
};

const deletetask = async (req, res) => {
    try {
        const taskid = req.params.id;
        const data = await deleteTask(taskid);

        if (!data) {
            return res.status(404).json({ message: "Task not found", success: false });
        }

        // ✅ emit to team so everyone sees deletion instantly
        req.io.to(data.team.toString()).emit("task:deleted", data._id.toString());


        res.status(200).json({ message: "task deleted successfully", success: true });
    } catch (e) {
        res.status(500).json({ message: "not able to delete task", error: e.message });
    }
};

const updatestatus = async (req, res) => {
    try {
        const taskId = req.params.id;
        const { status } = req.body;

        // ✅ fixed to match your Task model
        const allowedStatus = ["pending", "working", "complete"];
        if (!allowedStatus.includes(status)) {
            return res.status(400).json({ message: "Invalid status", success: false });
        }

        const updatedTask = await updateTaskStatus(taskId, status);
        res.status(200).json({ message: "task is updated", success: true, taskupdated: updatedTask });
    } catch (e) {
        res.status(404).json({ message: "not able to update task", error: e.message });
    }
};

const showtask = async (req, res) => {
    try {
        const teamid = req.params.id;
        const gettask = await showTask(teamid);
        res.status(200).json({ message: "all tasks visible", success: true, gettasks: gettask });
    } catch (e) {
        res.status(500).json({ message: "not able to show task", success: false });
    }
};

module.exports = { createtask, deletetask, updatestatus, showtask };