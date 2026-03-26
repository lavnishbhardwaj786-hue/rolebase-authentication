import { useState, useRef, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../context/authcontext";

const statusConfig = {
    pending: {
        color: "text-amber-400",
        bg: "bg-amber-400/10 border-amber-400/25",
        dot: "bg-amber-400",
        pulse: false,
    },
    working: {
        color: "text-sky-400",
        bg: "bg-sky-400/10 border-sky-400/25",
        dot: "bg-sky-400",
        pulse: true,
    },
    complete: {
        color: "text-emerald-400",
        bg: "bg-emerald-400/10 border-emerald-400/25",
        dot: "bg-emerald-400",
        pulse: false,
    },
};

const statuses = ["pending", "working", "complete"];

const TaskCard = ({ task, handledelete, handleStatusUpdate, index }) => {
    const { user }                        = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const [dropdownPos, setDropdownPos]   = useState({ top: 0, left: 0 });
    const [visible, setVisible]           = useState(false);
    const triggerRef                      = useRef(null);

    // Always read status directly from task prop — never cache it in local state
    const cfg = statusConfig[task.status] ?? statusConfig.pending;

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), index * 70);
        return () => clearTimeout(t);
    }, [index]);

    const openDropdown = useCallback(() => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setDropdownPos({ top: rect.bottom + 6, left: rect.left });
        }
        setShowDropdown((p) => !p);
    }, []);

    useEffect(() => {
        if (!showDropdown) return;
        const handler = (e) => {
            if (triggerRef.current && !triggerRef.current.contains(e.target))
                setShowDropdown(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [showDropdown]);

    const handleStatusClick = (s) => {
        handleStatusUpdate(task._id, s); // emits socket event → server → task:statusUpdated
        setShowDropdown(false);
    };

    const dropdown = showDropdown
        ? ReactDOM.createPortal(
            <div
                style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, zIndex: 99999 }}
                className="bg-[#0f1520] border border-white/10 rounded-xl shadow-2xl w-44 overflow-hidden py-1"
            >
                {statuses.map((s) => {
                    const c = statusConfig[s];
                    const isActive = task.status === s;
                    return (
                        <button
                            key={s}
                            onClick={() => handleStatusClick(s)}
                            className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5 text-sm font-medium
                                transition-colors hover:bg-white/[0.06] ${c.color}
                                ${isActive ? "bg-white/[0.04]" : ""}`}
                        >
                            <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                            <span className="capitalize">{s}</span>
                            {isActive && (
                                <svg className="ml-auto w-3.5 h-3.5 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            )}
                        </button>
                    );
                })}
            </div>,
            document.body
        )
        : null;

    return (
        <div
            className="group relative rounded-xl border border-white/[0.08] bg-white/[0.04]
                hover:bg-white/[0.07] transition-all duration-300
                hover:border-white/[0.14] hover:-translate-y-0.5"
            style={{
                opacity:    visible ? 1 : 0,
                transform:  visible ? "translateY(0)" : "translateY(12px)",
                transition: "opacity 0.3s ease, transform 0.3s ease, background 0.2s, border-color 0.2s",
            }}
        >
            {/* Status accent bar */}
            <div className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full ${cfg.dot} opacity-50`} />

            <div className="p-4 pl-5">
                {/* Title */}
                <h3 className="text-white text-base font-semibold leading-snug tracking-tight mb-1">
                    {task.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-white/40 leading-relaxed mb-3">
                    {task.description}
                </p>

                {/* Meta */}
                <div className="flex items-center gap-2 mb-3 text-xs text-white/30">
                    <span className="text-white/50">{task.assignedBy?.name}</span>
                    <svg className="w-3 h-3 opacity-25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                    <span className="text-white/50">{task.assignedTo?.name}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06]">
                    <button
                        ref={triggerRef}
                        onClick={openDropdown}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border
                            text-xs font-semibold transition-all duration-200 hover:brightness-125
                            ${cfg.color} ${cfg.bg}`}
                    >
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot} ${cfg.pulse ? "animate-pulse" : ""}`} />
                        <span className="capitalize">{task.status}</span>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-2.5 h-2.5 opacity-50">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </button>

                    {dropdown}

                    {user.role !== "member" && (
                        <button
                            onClick={() => handledelete(task._id)}
                            className="text-xs font-medium text-red-400/70 hover:text-red-300
                                bg-red-500/[0.07] hover:bg-red-500/15 border border-red-500/15
                                px-3 py-1 rounded-full transition-all duration-200
                                opacity-0 group-hover:opacity-100"
                        >
                            Remove
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;