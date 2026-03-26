import { useAuth } from "../context/authcontext";
import Memberlist from "../components/slidebar";
import Tasklist from "../components/tasklist";
import Assigntask from "../components/assigntask";
import { useState, useEffect, useRef } from "react";

const Dashboard = () => {
    const { user } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const overlayRef = useRef(null);

    // Close sidebar on Escape key
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") setSidebarOpen(false);
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, []);

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        document.body.style.overflow = sidebarOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [sidebarOpen]);

    const isLeaderRole =
        user?.role === "leader" || user?.role === "coLeader";

    return (
        <div
            className="h-screen w-screen overflow-hidden"
            style={{
                background: `
                    radial-gradient(circle at top, rgba(59,130,246,0.2) 0%, transparent 55%),
                    radial-gradient(circle at bottom, rgba(37,99,235,0.15) 0%, transparent 55%),
                    #020617
                `,
            }}
        >
            <div className="h-full w-full p-3 sm:p-6 flex flex-col">
                <div
                    className="relative flex-1 flex flex-col min-h-0 rounded-2xl sm:rounded-3xl
                        border border-white/15
                        bg-gradient-to-br from-white/[0.08] to-white/[0.03]
                        backdrop-blur-2xl
                        shadow-[0_8px_32px_rgba(59,130,246,0.2),inset_0_1px_1px_rgba(255,255,255,0.15)]
                        overflow-hidden"
                >
                    {/* ── Header ── */}
                    <header className="shrink-0 flex items-center justify-between px-4 sm:px-8 py-3 sm:py-4 border-b border-white/10">
                        {/* Hamburger — visible only on mobile */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            aria-label="Open sidebar"
                            className="lg:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px]
                                rounded-lg bg-white/5 border border-white/10 backdrop-blur-md
                                hover:bg-white/10 active:scale-95 transition-all"
                        >
                            <span className="w-5 h-0.5 bg-white/80 rounded-full" />
                            <span className="w-5 h-0.5 bg-white/80 rounded-full" />
                            <span className="w-3.5 h-0.5 bg-white/80 rounded-full self-start ml-[5px]" />
                        </button>

                        {/* Title */}
                        <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-xl sm:text-2xl text-white select-none">@</span>
                            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white/90">
                                Connect with{" "}
                                <span className="text-blue-300">People</span>
                            </h1>
                        </div>

                        {/* Spacer to visually centre title on mobile */}
                        <div className="w-10 lg:hidden" aria-hidden="true" />
                    </header>

                    {/* ── Body ── */}
                    <div className="flex-1 flex min-h-0 overflow-hidden">

                        {/* ── Desktop Sidebar (always visible ≥ lg) ── */}
                        <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 flex-col
                            border-r border-white/10 bg-white/5 overflow-hidden">
                            <div className="flex-1 overflow-y-auto">
                                <Memberlist />
                            </div>
                        </aside>

                        {/* ── Mobile Sidebar Overlay ── */}
                        {/* Backdrop */}
                        <div
                            ref={overlayRef}
                            onClick={() => setSidebarOpen(false)}
                            className={`lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
                                transition-opacity duration-300
                                ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                            aria-hidden="true"
                        />

                        {/* Drawer panel */}
                        <aside
                            className={`lg:hidden fixed inset-y-0 left-0 z-50 w-72 sm:w-80
                                flex flex-col bg-[#030c1f]/95 backdrop-blur-3xl
                                border-r border-white/10 shadow-2xl
                                transition-transform duration-300 ease-in-out
                                ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                        >
                            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                                <span className="text-sm font-semibold text-white/50 uppercase tracking-widest">
                                    Members
                                </span>
                                <button
                                    onClick={() => setSidebarOpen(false)}
                                    aria-label="Close sidebar"
                                    className="w-8 h-8 flex items-center justify-center rounded-full
                                        bg-white/10 text-white/60 hover:text-white hover:bg-white/20
                                        border border-white/10 transition-colors text-sm"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <Memberlist />
                            </div>
                        </aside>

                        {/* ── Main Content ── */}
                        <main className="flex-1 flex flex-col min-h-0 overflow-hidden p-4 sm:p-6 gap-4 sm:gap-5">
                            {isLeaderRole && (
                                <div className="shrink-0">
                                    <Assigntask />
                                </div>
                            )}
                            <div className="flex-1 min-h-0 overflow-hidden">
                                <Tasklist />
                            </div>
                        </main>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;