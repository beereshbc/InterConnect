// ─────────────────────────────────────────────────────────────────────────────
// SALayout.jsx  — shared sidebar layout for all SA pages
// ─────────────────────────────────────────────────────────────────────────────
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const SA_ACCENT = "#9c3ae8";

const NAV_ITEMS = [
  { icon: "◈", label: "Dashboard", path: "/super-admin/dashboard" },
  { icon: "⬡", label: "Problems", path: "/super-admin/problems" },
  { icon: "⊞", label: "Admins", path: "/super-admin/admins" },
  { icon: "◎", label: "Students", path: "/super-admin/students" },
];

export function SALayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("saToken");
    localStorage.removeItem("saAdmin");
    navigate("/super-admin/login");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideIn { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #0c0f18; }
        ::-webkit-scrollbar-thumb { background: #2a1a4a; border-radius: 3px; }
        input[type=range] { -webkit-appearance:none; height:4px; border-radius:2px; background:#1e2330; outline:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; cursor:pointer; border:2px solid #0c0f18; background: ${SA_ACCENT}; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#06080f",
          display: "flex",
          fontFamily: "'DM Mono', monospace",
          color: "#f0f4ff",
        }}
      >
        {/* ── Sidebar ── */}
        <div
          style={{
            width: collapsed ? 64 : 230,
            background: "#0c0f18",
            borderRight: "1px solid #1e2330",
            display: "flex",
            flexDirection: "column",
            transition: "width 0.2s",
            flexShrink: 0,
            position: "sticky",
            top: 0,
            height: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Logo */}
          <div
            style={{
              padding: collapsed ? "20px 14px" : "20px 20px",
              borderBottom: "1px solid #1e2330",
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={() => navigate("/super-admin")}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: "linear-gradient(135deg, #9c3ae8, #7c2abf)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 12,
                color: "#fff",
                flexShrink: 0,
                boxShadow: "0 0 12px #9c3ae840",
              }}
            >
              SA
            </div>
            {!collapsed && (
              <div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 14,
                    fontWeight: 800,
                    color: "#f0f4ff",
                    letterSpacing: "-0.01em",
                    lineHeight: 1,
                  }}
                >
                  Super Admin
                </div>
                <div
                  style={{
                    fontSize: 8,
                    color: "#9c3ae8",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    marginTop: 2,
                  }}
                >
                  InteConnect
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "16px 10px", overflowY: "auto" }}>
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: collapsed ? "10px 14px" : "10px 14px",
                    borderRadius: 9,
                    background: active ? "#9c3ae820" : "transparent",
                    border: active
                      ? "1px solid #9c3ae840"
                      : "1px solid transparent",
                    borderLeft: active
                      ? `3px solid ${SA_ACCENT}`
                      : "3px solid transparent",
                    color: active ? SA_ACCENT : "#8892a4",
                    cursor: "pointer",
                    marginBottom: 6,
                    transition: "all 0.15s",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                    fontWeight: active ? 700 : 500,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: 14, flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  {!collapsed && item.label}
                </button>
              );
            })}
          </nav>

          {/* Bottom */}
          <div style={{ padding: "12px 10px", borderTop: "1px solid #1e2330" }}>
            <button
              onClick={() => setCollapsed((c) => !c)}
              style={{
                width: "100%",
                padding: "9px 14px",
                borderRadius: 9,
                background: "transparent",
                border: "1px solid #1e2330",
                color: "#6b7a99",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "'DM Mono', monospace",
                marginBottom: 8,
              }}
            >
              {collapsed ? "→" : "← Collapse"}
            </button>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "9px 14px",
                borderRadius: 9,
                background: "#3a1a1a",
                border: "1px solid #f8717140",
                color: "#f87171",
                cursor: "pointer",
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {collapsed ? "⊗" : "⊗ Logout"}
            </button>
          </div>
        </div>

        {/* ── Main ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            overflow: "hidden",
          }}
        >
          {/* Top bar */}
          <div
            style={{
              height: 60,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 32px",
              borderBottom: "1px solid #1e2330",
              background: "#0c0f18",
              flexShrink: 0,
            }}
          >
            <div>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#f0f4ff",
                }}
              >
                {title}
              </div>
              {subtitle && (
                <div style={{ fontSize: 11, color: "#6b7a99", marginTop: 2 }}>
                  {subtitle}
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
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
                  background: "#4ade80",
                  display: "inline-block",
                  boxShadow: "0 0 6px #4ade80",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#4ade80",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Live
              </span>
            </div>
          </div>

          {/* Content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── Shared atoms ─────────────────────────────────────────────────────────────
export const Pill = ({ children, type = "default" }) => {
  const map = {
    approved: { bg: "#1a3a2a", color: "#4ade80", border: "#4ade8040" },
    pending: { bg: "#3a2e1a", color: "#fbbf24", border: "#fbbf2440" },
    rejected: { bg: "#3a1a1a", color: "#f87171", border: "#f8717140" },
    blocked: { bg: "#3a1a1a", color: "#f87171", border: "#f8717140" },
    active: { bg: "#1a2a3a", color: "#3a9de8", border: "#3a9de840" },
    default: { bg: "#1e2330", color: "#8892a4", border: "#ffffff20" },
  };
  const s = map[type] || map.default;
  return (
    <span
      style={{
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.04em",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
};

export const Badge = ({ children, color = "#3a9de8" }) => (
  <span
    style={{
      padding: "2px 10px",
      borderRadius: 4,
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color,
      background: `${color}18`,
      border: `1px solid ${color}40`,
      fontFamily: "'DM Mono', monospace",
    }}
  >
    {children}
  </span>
);

export const SABtn = ({
  children,
  onClick,
  variant = "primary",
  small,
  disabled,
  loading,
}) => {
  const map = {
    primary: {
      bg: "linear-gradient(135deg,#9c3ae8,#7c2abf)",
      color: "#fff",
      border: "none",
      shadow: "0 4px 16px #9c3ae830",
    },
    success: {
      bg: "#1a3a2a",
      color: "#4ade80",
      border: "1px solid #4ade8040",
      shadow: "none",
    },
    danger: {
      bg: "#3a1a1a",
      color: "#f87171",
      border: "1px solid #f8717140",
      shadow: "none",
    },
    ghost: {
      bg: "#0c0f18",
      color: "#9c3ae8",
      border: "1px solid #9c3ae840",
      shadow: "none",
    },
    secondary: {
      bg: "#1e2330",
      color: "#c4cedf",
      border: "1px solid #2a3045",
      shadow: "none",
    },
  };
  const s = map[variant] || map.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        background: s.bg,
        color: s.color,
        border: s.border,
        borderRadius: 8,
        padding: small ? "6px 14px" : "9px 20px",
        fontSize: small ? 11 : 13,
        fontWeight: 700,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        fontFamily: "'Syne', sans-serif",
        letterSpacing: "0.04em",
        opacity: disabled || loading ? 0.55 : 1,
        transition: "all 0.2s",
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        boxShadow: s.shadow,
      }}
    >
      {loading && (
        <span
          style={{
            animation: "spin 0.6s linear infinite",
            display: "inline-block",
          }}
        >
          ◌
        </span>
      )}
      {children}
    </button>
  );
};

export const SAModal = ({ title, onClose, children }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(6px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "#0c0f18",
        border: "1px solid #2a1a4a",
        borderRadius: 16,
        padding: "28px 32px",
        width: "100%",
        maxWidth: 560,
        maxHeight: "85vh",
        overflowY: "auto",
        boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px #9c3ae810",
        animation: "slideIn 0.25s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 18,
            fontWeight: 800,
            color: "#f0f4ff",
            margin: 0,
          }}
        >
          {title}
        </h2>
        <button
          onClick={onClose}
          style={{
            background: "#1e2330",
            border: "1px solid #2a3045",
            color: "#8892a4",
            width: 30,
            height: 30,
            borderRadius: 7,
            cursor: "pointer",
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          ✕
        </button>
      </div>
      {children}
    </div>
  </div>
);

export const SAField = ({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  rows,
}) => (
  <div style={{ marginBottom: 16 }}>
    <label
      style={{
        display: "block",
        fontSize: 10,
        fontWeight: 700,
        color: "#6b7a99",
        marginBottom: 5,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
      }}
    >
      {label} {required && <span style={{ color: SA_ACCENT }}>*</span>}
    </label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows || 3}
        style={{
          width: "100%",
          background: "#060810",
          border: "1px solid #1e2330",
          borderRadius: 8,
          padding: "10px 14px",
          color: "#f0f4ff",
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          resize: "vertical",
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "#060810",
          border: "1px solid #1e2330",
          borderRadius: 8,
          padding: "10px 14px",
          color: "#f0f4ff",
          fontFamily: "'DM Mono', monospace",
          fontSize: 13,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    )}
  </div>
);

export const SAToast = ({ message, type = "success", onDone }) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, []);
  const color =
    type === "error" ? "#f87171" : type === "warn" ? "#fbbf24" : "#4ade80";
  return (
    <div
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        background: "#0c0f18",
        border: `1px solid ${color}40`,
        borderLeft: `3px solid ${color}`,
        borderRadius: 10,
        padding: "12px 20px",
        fontFamily: "'DM Mono', monospace",
        fontSize: 13,
        color: "#f0f4ff",
        boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
        animation: "slideIn 0.25s ease",
      }}
    >
      <span style={{ color, marginRight: 8 }}>
        {type === "error" ? "✕" : type === "warn" ? "⚠" : "✓"}
      </span>
      {message}
    </div>
  );
};

export const Spinner = ({ size = 24, color = SA_ACCENT }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: `2px solid ${color}30`,
      borderTopColor: color,
      animation: "spin 0.7s linear infinite",
    }}
  />
);

export const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

export const avatarColor = (name = "") => {
  const colors = [
    "#e85d3a",
    "#3a9de8",
    "#9c3ae8",
    "#e8a33a",
    "#3ae87c",
    "#e83a8c",
  ];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
  return colors[Math.abs(h) % colors.length];
};

export const Avatar = ({ name = "", size = 32 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: avatarColor(name),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.34,
      fontWeight: 700,
      color: "#fff",
      fontFamily: "'DM Mono', monospace",
      flexShrink: 0,
    }}
  >
    {name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)}
  </div>
);
