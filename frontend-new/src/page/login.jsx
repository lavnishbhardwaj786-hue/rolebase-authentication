import { useState } from "react";
import { useAuth } from "../context/authcontext";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [logindata, setlogindata] = useState({ name: "", password: "" });
    const [loading, setLoading]     = useState(false);
    const [error, setError]         = useState("");
    const { login }                 = useAuth();
    const navigate                  = useNavigate();

    const handlesubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res  = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logindata),
            });
            const data = await res.json();
            if (data.success) {
                login(data);
                navigate("/dashboard");
            } else {
                setError(data.message || "Invalid credentials. Try again.");
            }
        } catch {
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handlechange = (e) => {
        setlogindata({ ...logindata, [e.target.name]: e.target.value });
        if (error) setError("");
    };

    return (
        <div
            className="h-screen w-screen flex items-center justify-center overflow-hidden"
            style={{
                background: `
                    radial-gradient(ellipse 80% 60% at 50% 0%, rgba(59,130,246,0.18) 0%, transparent 60%),
                    radial-gradient(ellipse 60% 50% at 80% 100%, rgba(99,102,241,0.12) 0%, transparent 60%),
                    #020617
                `,
            }}
        >
            {/* Subtle grid texture */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                                      linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            />

            <div className="relative w-full max-w-sm mx-4">
                {/* Glow behind card */}
                <div className="absolute inset-0 rounded-3xl bg-blue-500/10 blur-2xl scale-110" />

                {/* Card */}
                <div className="relative rounded-3xl border border-white/10
                    bg-gradient-to-b from-white/[0.08] to-white/[0.03]
                    backdrop-blur-2xl shadow-[0_24px_64px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]
                    px-8 py-10 flex flex-col gap-6">

                    {/* Top shine */}
                    <div className="absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent" />

                    {/* Logo */}
                    <div className="flex flex-col items-center gap-3 mb-1">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600
                            flex items-center justify-center shadow-lg shadow-orange-500/25">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
                                <path fillRule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087ZM12 10.5a.75.75 0 0 1 .75.75v4.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72v-4.94a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                Task<span className="text-orange-400">Flow</span>
                            </h1>
                            <p className="text-white/35 text-sm mt-0.5">Sign in to your workspace</p>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handlesubmit} className="flex flex-col gap-4">
                        {/* Username */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-white/45 uppercase tracking-wider">
                                Username
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={logindata.name}
                                placeholder="Enter your username"
                                onChange={handlechange}
                                required
                                className="w-full bg-white/[0.06] border border-white/10 rounded-xl
                                    px-4 py-2.5 text-sm text-white placeholder-white/20
                                    focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.09]
                                    transition-all duration-200"
                            />
                        </div>

                        {/* Password */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-white/45 uppercase tracking-wider">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={logindata.password}
                                placeholder="Enter your password"
                                onChange={handlechange}
                                required
                                className="w-full bg-white/[0.06] border border-white/10 rounded-xl
                                    px-4 py-2.5 text-sm text-white placeholder-white/20
                                    focus:outline-none focus:border-orange-500/50 focus:bg-white/[0.09]
                                    transition-all duration-200"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl
                                bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 rounded-xl font-semibold text-sm text-white
                                bg-orange-500 hover:bg-orange-400 active:scale-[0.98]
                                disabled:opacity-50 transition-all duration-150 mt-1
                                shadow-lg shadow-orange-500/20"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                                    </svg>
                                    Signing in…
                                </span>
                            ) : "Sign In"}
                        </button>
                    </form>

                    {/* Register link */}
                    <p className="text-center text-sm text-white/25">
                        No account?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/register")}
                            className="text-orange-400 hover:text-orange-300 font-medium transition-colors"
                        >
                            Register
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;