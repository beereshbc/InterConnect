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
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes scanline { 0%{top:0} 100%{top:100%} }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 3px; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#06080f",
          color: "#f0f4ff",
          fontFamily: "'DM Mono', monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* BG */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "20%",
              width: "60%",
              height: "60%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #9c3ae808 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.03,
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, #9c3ae820, transparent)",
              animation: "scanline 5s linear infinite",
            }}
          />
        </div>

        {/* Navbar */}
        <nav
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 40px",
            background: "#0c0f18cc",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #1e2330",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: "linear-gradient(135deg, #9c3ae8, #7c2abf)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 13,
                color: "#fff",
                boxShadow: "0 0 16px #9c3ae840",
              }}
            >
              SA
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#f0f4ff",
                  letterSpacing: "-0.01em",
                }}
              >
                InterConnect
              </div>
              <div
                style={{
                  fontSize: 9,
                  color: "#9c3ae8",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                Super Admin Portal
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 12px",
                background: "#9c3ae814",
                border: "1px solid #9c3ae830",
                borderRadius: 8,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#9c3ae8",
                  display: "inline-block",
                  boxShadow: "0 0 6px #9c3ae8",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#9c3ae8",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Alpha Access
              </span>
            </div>
            <button
              onClick={handleLogout}
              style={{
                padding: "7px 16px",
                borderRadius: 8,
                background: "#3a1a1a",
                border: "1px solid #f8717140",
                color: "#f87171",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer",
              }}
            >
              ⊗ Logout
            </button>
          </div>
        </nav>

        <div
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "60px 40px",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 52, textAlign: "center" }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 16px",
                background: "#9c3ae814",
                border: "1px solid #9c3ae830",
                borderRadius: 100,
                marginBottom: 20,
              }}
            >
              <span
                style={{
                  fontSize: 9,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#9c3ae8",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#9c3ae8",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                Super Admin Command Center
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(28px, 4vw, 48px)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: "#f0f4ff",
                marginBottom: 16,
              }}
            >
              Welcome,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #9c3ae8, #b65aff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Super Admin
              </span>
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "#6b7a99",
                maxWidth: 500,
                margin: "0 auto",
              }}
            >
              Full platform oversight — approve problems, manage admins &
              students, monitor all activity.
            </p>
          </motion.div>

          {/* Navigation Tiles */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 16,
            }}
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
                style={{
                  gridColumn: tile.span === 2 ? "span 2" : "span 1",
                  background: "#0c0f18",
                  border: `1px solid ${tile.accent}25`,
                  borderRadius: 16,
                  padding: tile.span === 2 ? "28px 32px" : "24px",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  transition: "border-color 0.2s, box-shadow 0.2s",
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
                {/* Background glow */}
                <div
                  style={{
                    position: "absolute",
                    top: tile.span === 2 ? -60 : -40,
                    right: -40,
                    width: tile.span === 2 ? 180 : 120,
                    height: tile.span === 2 ? 180 : 120,
                    borderRadius: "50%",
                    background: `${tile.accent}08`,
                    filter: "blur(30px)",
                    pointerEvents: "none",
                  }}
                />
                <div
                  style={{
                    position: "relative",
                    zIndex: 1,
                    display: "flex",
                    alignItems: tile.span === 2 ? "center" : "flex-start",
                    gap: 20,
                  }}
                >
                  <div
                    style={{
                      width: tile.span === 2 ? 56 : 48,
                      height: tile.span === 2 ? 56 : 48,
                      borderRadius: 14,
                      background: `${tile.accent}14`,
                      border: `1px solid ${tile.accent}30`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: tile.span === 2 ? 22 : 18,
                      flexShrink: 0,
                      color: tile.accent,
                    }}
                  >
                    {tile.icon}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: tile.span === 2 ? 20 : 15,
                        fontWeight: 800,
                        color: "#f0f4ff",
                        marginBottom: 6,
                      }}
                    >
                      {tile.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "'DM Mono', monospace",
                        fontSize: 12,
                        color: "#6b7a99",
                        lineHeight: 1.6,
                      }}
                    >
                      {tile.sub}
                    </div>
                  </div>
                  {tile.span === 2 && (
                    <div
                      style={{
                        marginLeft: "auto",
                        fontSize: 18,
                        color: `${tile.accent}80`,
                      }}
                    >
                      →
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick stats preview */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              marginTop: 28,
              background: "#0c0f18",
              border: "1px solid #1e2330",
              borderRadius: 14,
              padding: "18px 28px",
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {[
              { label: "Session", value: "ACTIVE", color: "#4ade80" },
              { label: "Role", value: "ALPHA", color: "#9c3ae8" },
              { label: "Edition", value: "26.0", color: "#e85d3a" },
              { label: "System", value: "LIVE", color: "#3a9de8" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 18,
                    fontWeight: 800,
                    color: s.color,
                  }}
                >
                  {s.value}
                </div>
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 10,
                    color: "#6b7a99",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    marginTop: 3,
                  }}
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
