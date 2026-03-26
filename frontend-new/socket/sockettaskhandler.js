const { socketUpdateTaskStatus, socketShowTask } = require('./taskservices.js');

const socketforrealtimetask = async(socket, io, teamId, userId, role) => {

       await socketShowTask(socket, teamId);

    socket.on("updateTaskStatus", (data) => {
        socketUpdateTaskStatus(socket, io, teamId, userId, role, data);
    });

    socket.on("showTask", (data) => {
        socketShowTask(socket, io, teamId, userId, role, data);
    });
    
};

module.exports = {
    socketforrealtimetask
};
