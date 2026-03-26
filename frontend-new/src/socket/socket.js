import { io } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://rolebase-authentication.onrender.com";

let socket = null;

export const connectSocket = (token, teamId) => {
    console.log("Connecting to:", BACKEND_URL);
    socket = io(BACKEND_URL, {
        auth: { token },
        query: { teamId }
    });

    socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("Socket disconnected");
    });

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};