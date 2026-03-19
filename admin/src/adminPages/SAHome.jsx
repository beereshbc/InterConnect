import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const SAHome = () => {
  const navigate = useNavigate();

  const saAdmin = (() => {
    try {
      return JSON.parse(localStorage.getItem("saAdmin") || "{}");
    } catch {
      return {};
    }
  })();

  const handleLogout = () => {
    localStorage.removeItem("saToken");
    localStorage.removeItem("saAdmin");
    navigate("/super-admin/login");
  };

  const TILES = [
    {
      icon: "◈",
      title: "SA Dashboard",
      sub: "Platform-wide analytics, entity counts & recent activity",
      path: "/super-admin/dashboard",
      accent: "#9c3ae8",
      span: 2,
    },
    {
      icon: "⬡",
      title: "Problem Management",
      sub: "Approve, reject & assign coordinators to problem statements",
      path: "/super-admin/problems",
      accent: "#3a9de8",
    },
    {
      icon: "⊞",
      title: "Admin Management",
      sub: "View, block & manage all admin accounts",
      path: "/super-admin/admins",
      accent: "#fbbf24",
    },
    {
      icon: "◎",
      title: "Student Management",
      sub: "View, block & track all student accounts",
      path: "/super-admin/students",
      accent: "#4ade80",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Syne', sans-serif !important; }
        .font-mono    { font-family: 'DM Mono', monospace !important; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes scanline { 0%{top:0} 100%{top:100%} }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 3px; }
      `}</style>

      <div
        className="min-h-screen relative overflow-hidden font-mono"
        style={{ background: "#06080f", color: "#f0f4ff" }}
      >
        {/* BG */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute"
            style={{
              top: "-20%",
              left: "20%",
              width: "60%",
              height: "60%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle,#9c3ae808 0%,transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.03,
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div
            className="absolute left-0 right-0 h-px"
            style={{
              background:
                "linear-gradient(90deg,transparent,#9c3ae820,transparent)",
              animation: "scanline 5s linear infinite",
            }}
          />
        </div>

        {/* Navbar */}
        <nav
          className="sticky top-0 z-[100] h-16 flex items-center justify-between px-10 font-mono"
          style={{
            background: "#0c0f18cc",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #1e2330",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-extrabold text-sm text-white"
              style={{
                background: "linear-gradient(135deg,#9c3ae8,#7c2abf)",
                boxShadow: "0 0 16px #9c3ae840",
              }}
            >
              SA
            </div>
            <div>
              <div
                className="font-display text-base font-extrabold"
                style={{ color: "#f0f4ff", letterSpacing: "-0.01em" }}
              >
                InterConnect
              </div>
              <div
                className="font-mono text-[9px] uppercase tracking-widest"
                style={{ color: "#9c3ae8" }}
              >
                Super Admin Portal
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg"
              style={{ background: "#9c3ae814", border: "1px solid #9c3ae830" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "#9c3ae8", boxShadow: "0 0 6px #9c3ae8" }}
              />
              <span
                className="font-mono text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#9c3ae8" }}
              >
                Alpha Access
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-1.5 rounded-lg font-mono text-[12px] font-bold cursor-pointer"
              style={{
                background: "#3a1a1a",
                border: "1px solid #f8717140",
                color: "#f87171",
              }}
            >
              ⊗ Logout
            </button>
          </div>
        </nav>

        <div className="max-w-4xl mx-auto px-10 py-16 relative z-10">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-14 text-center"
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
              style={{ background: "#9c3ae814", border: "1px solid #9c3ae830" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "#9c3ae8" }}
              />
              <span
                className="font-mono text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#9c3ae8" }}
              >
                Super Admin Command Center
              </span>
            </div>
            <h1
              className="font-display font-extrabold leading-tight mb-4"
              style={{
                fontSize: "clamp(28px,4vw,48px)",
                color: "#f0f4ff",
                letterSpacing: "-0.025em",
              }}
            >
              Welcome,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#9c3ae8,#b65aff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Super Admin
              </span>
            </h1>
            <p
              className="font-mono text-[13px] max-w-md mx-auto"
              style={{ color: "#6b7a99" }}
            >
              Full platform oversight — approve problems, manage admins &amp;
              students, monitor all activity.
            </p>
          </motion.div>

          {/* Navigation Tiles */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-2 gap-4 mb-7"
          >
            {TILES.map((tile) => (
              <motion.div
                key={tile.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                whileHover={{ y: -4, transition: { duration: 0.18 } }}
                onClick={() => navigate(tile.path)}
                className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
                style={{
                  gridColumn: tile.span === 2 ? "span 2" : "span 1",
                  background: "#0c0f18",
                  border: `1px solid ${tile.accent}25`,
                  padding: tile.span === 2 ? "28px 32px" : "24px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${tile.accent}50`;
                  e.currentTarget.style.boxShadow = `0 8px 32px ${tile.accent}14`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = `${tile.accent}25`;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="absolute pointer-events-none"
                  style={{
                    top: tile.span === 2 ? -60 : -40,
                    right: -40,
                    width: tile.span === 2 ? 180 : 120,
                    height: tile.span === 2 ? 180 : 120,
                    borderRadius: "50%",
                    background: `${tile.accent}08`,
                    filter: "blur(30px)",
                  }}
                />
                <div
                  className={`relative z-10 flex ${tile.span === 2 ? "items-center" : "items-start"} gap-5`}
                >
                  <div
                    className="rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{
                      width: tile.span === 2 ? 56 : 48,
                      height: tile.span === 2 ? 56 : 48,
                      background: `${tile.accent}14`,
                      border: `1px solid ${tile.accent}30`,
                      fontSize: tile.span === 2 ? 22 : 18,
                      color: tile.accent,
                    }}
                  >
                    {tile.icon}
                  </div>
                  <div>
                    <div
                      className="font-display font-extrabold mb-1.5"
                      style={{
                        fontSize: tile.span === 2 ? 20 : 15,
                        color: "#f0f4ff",
                      }}
                    >
                      {tile.title}
                    </div>
                    <div
                      className="font-mono text-[12px] leading-relaxed"
                      style={{ color: "#6b7a99" }}
                    >
                      {tile.sub}
                    </div>
                  </div>
                  {tile.span === 2 && (
                    <div
                      className="ml-auto text-lg"
                      style={{ color: `${tile.accent}80` }}
                    >
                      →
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="rounded-2xl flex justify-around flex-wrap gap-4"
            style={{
              background: "#0c0f18",
              border: "1px solid #1e2330",
              padding: "18px 28px",
            }}
          >
            {[
              { label: "Session", value: "ACTIVE", color: "#4ade80" },
              { label: "Role", value: "ALPHA", color: "#9c3ae8" },
              { label: "Edition", value: "26.0", color: "#e85d3a" },
              { label: "System", value: "LIVE", color: "#3a9de8" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-display text-lg font-extrabold"
                  style={{ color: s.color }}
                >
                  {s.value}
                </div>
                <div
                  className="font-mono text-[10px] uppercase tracking-widest mt-1"
                  style={{ color: "#6b7a99" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default SAHome;
