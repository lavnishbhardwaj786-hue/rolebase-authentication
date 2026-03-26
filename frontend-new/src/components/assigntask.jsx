import { useState, useEffect } from "react";
import { useAuth } from "../context/authcontext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "https://rolebase-authentication.onrender.com";

const steps = ["title", "description", "assign"];

const Assigntask = () => {
    const { user } = useAuth();
    const [members, setMembers] = useState([]);
    const [step, setStep] = useState(0); // 0=title, 1=desc, 2=assign
    const [state, setstate] = useState({ title: "", description: "", to: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchMembers = async () => {
            if (!user.teamId) return;
            const res = await fetch(`${BACKEND_URL}/api/teams/${user.teamId}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            const allMembers = data.members.members || [];
            setMembers(allMembers.filter((m) => m.role !== "leader"));
        };
        fetchMembers();
    }, [user.teamId]);

    const handleChange = (e) =>
        setstate((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleNext = () => {
        if (step === 0 && !state.title.trim()) return;
        if (step === 1 && !state.description.trim()) return;
        setStep((s) => s + 1);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleNext();
    };

    const handleSubmit = async () => {
        if (!state.to) return;
        setLoading(true);
        const res = await fetch(`${BACKEND_URL}/api/task`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                title: state.title,
                description: state.description,
                email: state.to,
                team: user.teamId,
            }),
        });
        const data = await res.json();
        setLoading(false);
        if (data.success) {
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setstate({ title: "", description: "", to: "" });
                setStep(0);
            }, 1500);
        }
    };

    const stepLabels = ["Title", "Description", "Assign"];

    return (
        <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.04] backdrop-blur-sm p-6 shadow-xl overflow-hidden">
            {/* Subtle top glow */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <h2 className="text-white text-xl font-bold tracking-tight">Assign Task</h2>
                    <p className="text-white/35 text-xs mt-0.5">Step {step + 1} of 3 — {stepLabels[step]}</p>
                </div>

                {/* Step indicators */}
                <div className="flex items-center gap-1.5">
                    {steps.map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i < step
                                    ? "w-5 bg-orange-500"
                                    : i === step
                                    ? "w-5 bg-orange-400"
                                    : "w-3 bg-white/15"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Fields */}
            <div className="space-y-3">
                {/* Title */}
                <div className="flex gap-3">
                    <input
                        type="text"
                        name="title"
                        placeholder="Task title…"
                        value={state.title}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        disabled={step > 0}
                        className={`flex-1 bg-white/[0.06] text-white placeholder-white/25 border rounded-xl px-4 py-2.5 text-sm
                            focus:outline-none transition-all duration-200
                            ${step === 0
                                ? "border-white/15 focus:border-orange-500/60 focus:bg-white/[0.08]"
                                : "border-white/[0.06] opacity-50 cursor-not-allowed"
                            }`}
                    />
                    {step === 0 && (
                        <button
                            onClick={handleNext}
                            disabled={!state.title.trim()}
                            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed
                                text-white text-sm font-semibold rounded-xl transition-all duration-200 shrink-0"
                        >
                            Next
                        </button>
                    )}
                </div>

                {/* Description */}
                {step >= 1 && (
                    <div
                        className="flex gap-3"
                        style={{ animation: "slideDown 0.25s ease" }}
                    >
                        <input
                            type="text"
                            name="description"
                            placeholder="Describe the task…"
                            value={state.description}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            disabled={step > 1}
                            autoFocus={step === 1}
                            className={`flex-1 bg-white/[0.06] text-white placeholder-white/25 border rounded-xl px-4 py-2.5 text-sm
                                focus:outline-none transition-all duration-200
                                ${step === 1
                                    ? "border-white/15 focus:border-orange-500/60 focus:bg-white/[0.08]"
                                    : "border-white/[0.06] opacity-50 cursor-not-allowed"
                                }`}
                        />
                        {step === 1 && (
                            <button
                                onClick={handleNext}
                                disabled={!state.description.trim()}
                                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed
                                    text-white text-sm font-semibold rounded-xl transition-all duration-200 shrink-0"
                            >
                                Next
                            </button>
                        )}
                    </div>
                )}

                {/* Assign member */}
                {step >= 2 && (
                    <div
                        className="flex gap-3"
                        style={{ animation: "slideDown 0.25s ease" }}
                    >
                        <select
                            name="to"
                            value={state.to}
                            onChange={handleChange}
                            autoFocus={step === 2}
                            className="flex-1 bg-white/[0.06] text-white border border-white/15 rounded-xl px-4 py-2.5 text-sm
                                focus:outline-none focus:border-orange-500/60 focus:bg-white/[0.08] transition-all duration-200 cursor-pointer"
                        >
                            <option value="" disabled className="bg-gray-900">Select member…</option>
                            {members.map((m) => (
                                <option key={m.user._id} value={m.user.email} className="bg-gray-900">
                                    {m.user.name} · {m.role}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={handleSubmit}
                            disabled={!state.to || loading || success}
                            className={`px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-all duration-200 shrink-0
                                ${success
                                    ? "bg-emerald-500"
                                    : "bg-orange-500 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                }`}
                        >
                            {loading ? (
                                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                </svg>
                            ) : success ? (
                                "✓"
                            ) : (
                                "Assign"
                            )}
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default Assigntask;