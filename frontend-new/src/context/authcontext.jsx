import { createContext, useState, useContext } from "react";
import { connectSocket, disconnectSocket } from "../socket/socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({
        token: localStorage.getItem("token"),
        userId: localStorage.getItem("userId"),
        teamId: localStorage.getItem("teamId"),
        teamName: localStorage.getItem("teamName"),
        role: localStorage.getItem("role")
    });

    const login = (data) => {
        setUser({
            token: data.token,
            userId: data.userId,
            teamId: data.teamId,
            teamName: data.teamName,
            role: data.role
        });
        connectSocket(data.token, data.teamId);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("teamId", data.teamId);
        localStorage.setItem("teamName", data.teamName);
        localStorage.setItem("role", data.role);
    };

    const logout = () => {
        setUser({ token: null, userId: null, teamId: null, teamName: null, role: null });
        disconnectSocket();
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};