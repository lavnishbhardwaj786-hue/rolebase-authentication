const Task = require('../models/taskmodel.js');

const createTask = async (taskData) => {
    return await Task.create(taskData);
};

const deleteTask = async (taskId) => {
    return await Task.findByIdAndDelete(taskId);
};

const updateTaskStatus = async (taskId, status) => {
    const taskData = await Task.findById(taskId);
    if (!taskData) throw new Error("Task not found");
    taskData.status = status;
    await taskData.save();
    return taskData;
};

const showTask = async (teamId) => {
    return await Task.find({ team: teamId })
        .populate("assignedTo", "name")
        .populate("assignedBy", "name");
};

module.exports = { createTask, deleteTask, updateTaskStatus, showTask };