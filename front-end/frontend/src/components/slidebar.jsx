import { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../context/authcontext";

const roleConfig = {
    leader:   { label: "Leader",    color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/25" },
    coLeader: { label: "Co-Leader", color: "text-violet-400", bg: "bg-violet-400/10 border-violet-400/25" },
    member:   { label: "Member",    color: "text-white/40",   bg: "bg-white/[0.06] border-white/10" },
};

const avatarColors = [
    "from-violet-500 to-indigo-500",
    "from-sky-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-pink-500",
    "from-amber-500 to-orange-500",
];

const getInitials = (name = "") =>
    name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

const getAvatarColor = (name = "") =>
    avatarColors[name.charCodeAt(0) % avatarColors.length];

const Memberlist = () => {
    const { user, login } = useAuth();
    const [members, setMembers]           = useState([]);
    const [email, setEmail]               = useState("");
    const [message, setMessage]           = useState("");
    const [showAddInput, setShowAddInput] = useState(false);
    const [addLoading, setAddLoading]     = useState(false);
    const [menuMemberId, setMenuMemberId] = useState(null);
    const [menuPos, setMenuPos]           = useState({ top: 0, left: 0 });
    const menuBtnRefs                     = useRef({});

    const fetchMembers = async () => {
        if (!user.teamId) return;
        const res  = await fetch(`/api/teams/${user.teamId}`, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        setMembers(data.members.members);
    };

    useEffect(() => { fetchMembers(); }, [user.teamId]);

    // Close portal menu on outside click
    useEffect(() => {
        if (!menuMemberId) return;
        const handler = (e) => {
            const btn = menuBtnRefs.current[menuMemberId];
            if (btn && btn.contains(e.target)) return;
            setMenuMemberId(null);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [menuMemberId]);

    const openMenu = (memberId) => {
        const btn = menuBtnRefs.current[memberId];
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        // Position to the right of button, aligned to its bottom
        setMenuPos({
            top:  rect.bottom + window.scrollY + 6,
            left: Math.min(
                rect.left + window.scrollX,
                window.innerWidth - 170  // keep inside viewport
            ),
        });
        setMenuMemberId((prev) => (prev === memberId ? null : memberId));
    };

    const handleCreateTeam = async () => {
        const teamName = prompt("Enter team name:");
        if (!teamName) return;
        const res  = await fetch("/api/teams", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
            body: JSON.stringify({ name: teamName }),
        });
        const data = await res.json();
        if (data.team)
            login({ token: user.token, userId: user.userId, teamId: data.team._id, teamName: data.team.name, role: "leader" });
    };

    const handleAddMember = async () => {
        if (!email) return;
        setAddLoading(true);
        const res  = await fetch(`/api/teams/${user.teamId}/members`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
            body: JSON.stringify({ email }),
        });
        const data = await res.json();
        setAddLoading(false);
        setMessage(data.message);
        if (data.success) { setEmail(""); setShowAddInput(false); fetchMembers(); }
    };

    const handleRemoveMember = async (memberId) => {
        setMenuMemberId(null);
        const res = await fetch(`/api/teams/${user.teamId}/members/${memberId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.ok)
            setMembers((prev) => prev.filter((m) => m.user._id.toString() !== memberId.toString()));
    };

    const handleTransferLeader = async (newLeaderId) => {
        setMenuMemberId(null);
        const res = await fetch(`/api/teams/${user.teamId}/transfer-leader`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${user.token}` },
            body: JSON.stringify({ newLeaderId }),
        });
        if (res.ok) { fetchMembers(); login({ ...user, role: "coLeader" }); }
    };

    const canManage = user.role === "leader" || user.role === "coLeader";

    // Portal dropdown — escapes overflow:hidden completely
    const portalMenu = menuMemberId
        ? ReactDOM.createPortal(
            <div
                style={{ position: "fixed", top: menuPos.top, left: menuPos.left, zIndex: 99999, minWidth: 160 }}
                className="bg-[#0f1520] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <button
                    onClick={() => handleTransferLeader(menuMemberId)}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-amber-400
                        hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors"
                >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                    </svg>
                    Make Leader
                </button>
                <div className="mx-3 my-1 border-t border-white/[0.06]" />
                <button
                    onClick={() => handleRemoveMember(menuMemberId)}
                    className="w-full text-left px-4 py-2.5 text-xs font-medium text-red-400
                        hover:bg-red-500/[0.08] flex items-center gap-2.5 transition-colors"
                >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                    </svg>
                    Remove
                </button>
            </div>,
            document.body
        )
        : null;

    // ── No team state ──────────────────────────────────────────────────────────
    if (!user.teamId) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 h-full py-12 px-6">
                <div className="w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-2xl">👥</div>
                <div className="text-center">
                    <p className="text-white/60 text-sm font-medium">No team yet</p>
                    <p className="text-white/25 text-xs mt-0.5">Create one to get started</p>
                </div>
                <button
                    onClick={handleCreateTeam}
                    className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-white text-sm font-semibold transition-all"
                >
                    Create Team
                </button>
            </div>
        );
    }

    // ── Main ──────────────────────────────────────────────────────────────────
    return (
        <div className="flex flex-col h-full overflow-hidden">

            {/* Team header */}
            <div className="shrink-0 px-5 py-4 border-b border-white/[0.06]">
                <p className="text-white/35 text-[10px] font-semibold uppercase tracking-widest mb-0.5">Team</p>
                <h3 className="text-white text-lg font-bold tracking-tight truncate">{user.teamName}</h3>
                <p className="text-white/30 text-xs mt-0.5">
                    {members.length} member{members.length !== 1 ? "s" : ""}
                </p>
            </div>

            {/* Scrollable member list */}
            <div className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-transparent
                [&::-webkit-scrollbar-thumb]:bg-white/10
                [&::-webkit-scrollbar-thumb]:rounded-full">
                {members.map((member, i) => {
                    const rc = roleConfig[member.role] || roleConfig.member;
                    // Only show ⋯ button for leader managing non-leader members
                    const showMenu = user.role === "leader" && member.role !== "leader";

                    return (
                        <div
                            key={member.user._id}
                            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl
                                hover:bg-white/[0.05] transition-colors duration-150"
                            style={{ animation: `memberFadeIn 0.3s ease ${i * 0.05}s both` }}
                        >
                            {/* Avatar */}
                            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getAvatarColor(member.user.name)}
                                flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                {getInitials(member.user.name)}
                            </div>

                            {/* Name + role badge */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium leading-tight truncate">
                                    {member.user.name}
                                </p>
                                <span className={`inline-flex items-center text-[10px] font-semibold
                                    px-1.5 py-0.5 rounded-md border mt-0.5 ${rc.color} ${rc.bg}`}>
                                    {rc.label}
                                </span>
                            </div>

                            {/* ⋯ menu button — ONLY for leader managing others, hidden until hover */}
                            {showMenu && (
                                <button
                                    ref={(el) => { menuBtnRefs.current[member.user._id] = el; }}
                                    onClick={() => openMenu(member.user._id)}
                                    className="w-7 h-7 flex items-center justify-center rounded-lg
                                        text-white/25 hover:text-white/70 hover:bg-white/[0.08]
                                        transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                                        <circle cx="4"  cy="10" r="1.5"/>
                                        <circle cx="10" cy="10" r="1.5"/>
                                        <circle cx="16" cy="10" r="1.5"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Footer — add member */}
            <div className="shrink-0 px-4 py-3 border-t border-white/[0.06] space-y-2">
                {showAddInput && (
                    <div className="space-y-2" style={{ animation: "memberFadeIn 0.2s ease" }}>
                        <input
                            type="email"
                            placeholder="member@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
                            autoFocus
                            className="w-full bg-white/[0.06] text-white placeholder-white/25
                                border border-white/10 rounded-xl px-3.5 py-2 text-sm
                                focus:outline-none focus:border-orange-500/50 transition-all"
                        />
                        <button
                            onClick={handleAddMember}
                            disabled={!email || addLoading}
                            className="w-full py-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-40
                                text-white text-sm font-semibold rounded-xl transition-all"
                        >
                            {addLoading ? "Adding…" : "Add Member"}
                        </button>
                        {message && <p className="text-xs text-center text-white/40">{message}</p>}
                    </div>
                )}

                {canManage && (
                    <button
                        onClick={() => { setShowAddInput((p) => !p); setMessage(""); }}
                        className={`w-full py-2 rounded-xl text-sm font-medium transition-all duration-200 border
                            ${showAddInput
                                ? "bg-white/[0.04] border-white/10 text-white/40 hover:text-white/60"
                                : "bg-white/[0.05] border-white/10 text-white/55 hover:bg-white/[0.09] hover:text-white"
                            }`}
                    >
                        {showAddInput ? "Cancel" : "+ Add Member"}
                    </button>
                )}
            </div>

            {/* Portal menu rendered at body level — never clipped */}
            {portalMenu}

            <style>{`
                @keyframes memberFadeIn {
                    from { opacity: 0; transform: translateX(-8px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </div>
    );
};

export default Memberlist;