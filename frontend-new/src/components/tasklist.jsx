import { useEffect, useState } from "react";
import { getSocket } from "../socket/socket";
import TaskCard from "./taskcard";
import { useAuth } from "../context/authcontext";

const Tasklist = () => {
    const [tasks, setTasks] = useState([]);
    const socket            = getSocket();
    const { user }          = useAuth();

    useEffect(() => {
        if (!socket) return;
        socket.on("task:list",          (data)        => setTasks(data));
        socket.on("task:created",       (newTask)     => setTasks((prev) => [...prev, newTask]));
        socket.on("task:deleted",       (deletedId)   =>
            setTasks((prev) => prev.filter((t) => t._id.toString() !== deletedId.toString()))
        );
        socket.on("task:statusUpdated", (updatedTask) =>
            setTasks((prev) =>
                prev.map((t) => t._id.toString() === updatedTask._id.toString() ? updatedTask : t)
            )
        );
        return () => {
            socket.off("task:list");
            socket.off("task:created");
            socket.off("task:deleted");
            socket.off("task:statusUpdated");
        };
    }, [socket]);

    const handledelete = async (taskId) => {
        await fetch(`/api/task/${taskId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${user.token}` },
        });
    };

    const handleStatusUpdate = (taskId, status) => {
        if (!socket) return;
        socket.emit("updateTaskStatus", { taskId, status });
    };

    const pending  = tasks.filter((t) => t.status === "pending").length;
    const working  = tasks.filter((t) => t.status === "working").length;
    const complete = tasks.filter((t) => t.status === "complete").length;

    return (
        <div className="flex flex-col h-full min-h-0">

            {/* Header row */}
            <div className="shrink-0 flex items-center justify-between mb-3">
                <div>
                    <h2 className="text-white text-xl font-bold tracking-tight">Team Tasks</h2>
                    <p className="text-white/30 text-xs mt-0.5">
                        {tasks.length === 0 ? "No tasks yet" : `${tasks.length} task${tasks.length > 1 ? "s" : ""}`}
                    </p>
                </div>

                {tasks.length > 0 && (
                    <div className="flex items-center gap-1.5">
                        {pending > 0 && (
                            <span className="flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                {pending}
                            </span>
                        )}
                        {working > 0 && (
                            <span className="flex items-center gap-1 text-xs font-medium text-sky-400 bg-sky-400/10 border border-sky-400/20 px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
                                {working}
                            </span>
                        )}
                        {complete > 0 && (
                            <span className="flex items-center gap-1 text-xs font-medium text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2.5 py-0.5 rounded-full">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                {complete}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Progress bar */}
            {tasks.length > 0 && (
                <div className="shrink-0 h-0.5 rounded-full bg-white/[0.06] overflow-hidden mb-3">
                    <div
                        className="h-full bg-gradient-to-r from-sky-500 to-emerald-500 rounded-full transition-all duration-700"
                        style={{ width: `${(complete / tasks.length) * 100}%` }}
                    />
                </div>
            )}

            {/* Scrollable task list */}
            <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-white/10
                [&::-webkit-scrollbar-thumb]:rounded-full">

                {tasks.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 h-full text-white/20">
                        <div className="w-12 h-12 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-xl">
                            📭
                        </div>
                        <div className="text-center">
                            <p className="text-sm font-medium text-white/30">No tasks yet</p>
                            <p className="text-xs text-white/15 mt-0.5">Assign one above to get started</p>
                        </div>
                    </div>
                ) : (
                    tasks.map((task, index) => (
                        <TaskCard
                            key={task._id}
                            task={task}
                            handledelete={handledelete}
                            handleStatusUpdate={handleStatusUpdate}
                            index={index}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Tasklist;