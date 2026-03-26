import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";



export default function FrontPage() {
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* ── animated grid canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      const spacing = 64;
      t += 0.008;

      // vertical lines
      for (let x = 0; x <= width; x += spacing) {
        const alpha = 0.04 + 0.03 * Math.sin(t + x * 0.015);
        ctx.strokeStyle = `rgba(249,115,22,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      // horizontal lines
      for (let y = 0; y <= height; y += spacing) {
        const alpha = 0.04 + 0.03 * Math.sin(t + y * 0.015);
        ctx.strokeStyle = `rgba(249,115,22,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      // glowing dot at intersections (sparse)
      for (let x = 0; x <= width; x += spacing * 3) {
        for (let y = 0; y <= height; y += spacing * 3) {
          const pulse = 0.5 + 0.5 * Math.sin(t * 1.5 + x * 0.02 + y * 0.02);
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(249,115,22,${0.15 * pulse})`;
          ctx.fill();
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  /* ── cursor glow ── */
  const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });

  return (
    <div
      className="min-h-screen bg-gray-950 text-white font-sans overflow-x-hidden"
      style={{ fontFamily: "'DM Sans', 'Inter', sans-serif" }}
      onMouseMove={handleMouseMove}
    >
      {/* cursor glow */}
      <div
        className="pointer-events-none fixed z-0 rounded-full transition-transform"
        style={{
          width: 480,
          height: 480,
          left: mousePos.x - 240,
          top: mousePos.y - 240,
          background:
            "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 border-b border-gray-800/60 backdrop-blur-md bg-gray-950/70">
        {/* logo */}
        <div className="flex items-center gap-2 select-none">
          <span className="w-7 h-7 rounded bg-orange-500 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
              <path d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v.75c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875v-.75C22.5 3.839 21.66 3 20.625 3H3.375Z" />
              <path fillRule="evenodd" d="m3.087 9 .54 9.176A3 3 0 0 0 6.62 21h10.757a3 3 0 0 0 2.995-2.824L20.913 9H3.087ZM12 10.5a.75.75 0 0 1 .75.75v4.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3a.75.75 0 0 1-1.06 0l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72v-4.94a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-wide text-white">
            Task<span className="text-orange-500">Flow</span>
          </span>
        </div>

        {/* links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
          <a href="#features" className="hover:text-orange-400 transition-colors">Features</a>
          <a href="#how" className="hover:text-orange-400 transition-colors">How it works</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1.5 text-sm text-gray-300 border border-gray-700 rounded hover:border-orange-500 hover:text-white transition-all duration-200"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-4 py-1.5 text-sm font-medium text-white bg-orange-500 rounded hover:bg-orange-400 transition-colors"
          >
            Register
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">
        {/* canvas bg */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ opacity: 1 }}
        />
        {/* orange glow blob */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-6">
          {/* badge */}
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            Real-time team collaboration
          </span>

          <h1
            className="text-5xl md:text-7xl font-black leading-none tracking-tight"
            style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}
          >
            Ship tasks
            <br />
            <span className="text-orange-500">as a team.</span>
          </h1>

          <p className="text-gray-400 text-lg max-w-xl leading-relaxed">
            TaskFlow brings your whole team onto one live board — assign, track,
            and complete work in real time, with role-based access built in from day one.
          </p>

          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => navigate("/register")}
              className="px-7 py-3 rounded font-semibold text-white bg-orange-500 hover:bg-orange-400 active:scale-95 transition-all duration-150 shadow-lg shadow-orange-500/20"
            >
              Get started free
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-7 py-3 rounded font-semibold text-gray-300 border border-gray-700 hover:border-orange-500 hover:text-white transition-all duration-150"
            >
              Sign in
            </button>
          </div>

          {/* mini stat row */}
          <div className="flex items-center gap-8 mt-6 text-sm text-gray-500">
            {["Live updates", "Role-based access", "No refresh needed"].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <span className="text-orange-500">✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        {/* dashboard preview mockup */}
        <div className="relative z-10 mt-20 w-full max-w-5xl mx-auto">
          <div className="rounded-xl border border-gray-800 bg-gray-900 shadow-2xl shadow-black/60 overflow-hidden">
            {/* fake window bar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-800 bg-gray-900">
              <span className="w-3 h-3 rounded-full bg-red-500/70" />
              <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
              <span className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="ml-4 text-xs text-gray-600 font-mono">taskflow — dashboard</span>
            </div>
            {/* mock dashboard body */}
            <div className="grid grid-cols-12 min-h-48">
              {/* sidebar */}
              <div className="col-span-3 border-r border-gray-800 p-4 flex flex-col gap-3">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Members</p>
                {["Alex (Leader)", "Sara", "Rajan", "You"].map((m, i) => (
                  <div key={m} className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: ["#f97316","#3b82f6","#8b5cf6","#22c55e"][i] + "33", color: ["#f97316","#3b82f6","#8b5cf6","#22c55e"][i] }}
                    >
                      {m[0]}
                    </span>
                    <span className="text-xs text-gray-400">{m}</span>
                  </div>
                ))}
              </div>
              {/* main area */}
              <div className="col-span-9 p-4 flex flex-col gap-3">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Tasks</p>
                {[
                  { title: "Design landing page", who: "Sara", status: "complete", color: "text-green-400" },
                  { title: "Fix socket auth bug", who: "Rajan", status: "working", color: "text-blue-400" },
                  { title: "Write API docs", who: "You", status: "pending", color: "text-yellow-400" },
                ].map((task) => (
                  <div key={task.title} className="flex items-center justify-between px-3 py-2 rounded bg-gray-800/60 border border-gray-700/50 text-xs">
                    <span className="text-gray-300 font-medium">{task.title}</span>
                    <span className="text-gray-500">→ {task.who}</span>
                    <span className={`font-semibold ${task.color}`}>{task.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* glow under mockup */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-2/3 h-6 rounded-full blur-xl bg-orange-500/10" />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-gray-800 px-8 py-6 flex items-center justify-center text-sm text-gray-600">
        <span>© 2026 TaskFlow. All rights reserved.</span>
      </footer>
    </div>
  );
}