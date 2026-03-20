// SALayout.jsx — shared sidebar layout for all SA pages — Tailwind CSS
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const SA_ACCENT = "#9c3ae8";

const NAV_ITEMS = [
  { icon: "◈", label: "Dashboard", path: "/super-admin/dashboard" },
  { icon: "⬡", label: "Problems", path: "/super-admin/problems" },
  { icon: "⊞", label: "Admins", path: "/super-admin/admins" },
  { icon: "◎", label: "Students", path: "/super-admin/students" },
  { icon: "◐", label: "Notifications", path: "/super-admin/notifications" },
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
        .font-display { font-family: 'Syne', sans-serif !important; }
        .font-mono    { font-family: 'DM Mono', monospace !important; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes slideIn { from{transform:translateY(12px);opacity:0} to{transform:translateY(0);opacity:1} }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track  { background: #0c0f18; }
        ::-webkit-scrollbar-thumb  { background: #2a1a4a; border-radius: 3px; }
        input[type=range] { -webkit-appearance:none; height:4px; border-radius:2px; background:#1e2330; outline:none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; cursor:pointer; border:2px solid #0c0f18; background:#9c3ae8; }
      `}</style>

      <div
        className="min-h-screen flex font-mono"
        style={{ background: "#06080f", color: "#f0f4ff" }}
      >
        {/* ── Sidebar ── */}
        <div
          className="flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-hidden transition-all duration-200"
          style={{
            width: collapsed ? 64 : 230,
            background: "#0c0f18",
            borderRight: "1px solid #1e2330",
          }}
        >
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer overflow-hidden"
            style={{
              padding: collapsed ? "20px 14px" : "20px 20px",
              borderBottom: "1px solid #1e2330",
            }}
            onClick={() => navigate("/super-admin")}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-extrabold text-xs text-white flex-shrink-0"
              style={{
                background: "linear-gradient(135deg,#9c3ae8,#7c2abf)",
                boxShadow: "0 0 12px #9c3ae840",
              }}
            >
              SA
            </div>
            {!collapsed && (
              <div>
                <div
                  className="font-display text-sm font-extrabold leading-none"
                  style={{ color: "#f0f4ff", letterSpacing: "-0.01em" }}
                >
                  Super Admin
                </div>
                <div
                  className="font-mono text-[8px] uppercase tracking-widest mt-0.5"
                  style={{ color: "#9c3ae8" }}
                >
                  InteConnect
                </div>
              </div>
            )}
          </div>

          {/* Nav */}
          <nav className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="w-full flex items-center gap-2.5 rounded-lg font-mono text-xs font-bold transition-all duration-150 cursor-pointer whitespace-nowrap overflow-hidden"
                  style={{
                    padding: "10px 14px",
                    background: active ? "#9c3ae820" : "transparent",
                    border: active
                      ? "1px solid #9c3ae840"
                      : "1px solid transparent",
                    borderLeft: active
                      ? "3px solid #9c3ae8"
                      : "3px solid transparent",
                    color: active ? "#9c3ae8" : "#8892a4",
                  }}
                >
                  <span className="text-sm flex-shrink-0">{item.icon}</span>
                  {!collapsed && item.label}
                </button>
              );
            })}
          </nav>

          {/* Bottom */}
          <div
            className="p-2.5 space-y-2"
            style={{ borderTop: "1px solid #1e2330" }}
          >
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="w-full py-2.5 px-3.5 rounded-lg font-mono text-[11px] cursor-pointer transition-colors overflow-hidden"
              style={{
                background: "transparent",
                border: "1px solid #1e2330",
                color: "#6b7a99",
              }}
            >
              {collapsed ? "→" : "← Collapse"}
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2.5 px-3.5 rounded-lg font-mono text-[11px] font-bold cursor-pointer whitespace-nowrap overflow-hidden"
              style={{
                background: "#3a1a1a",
                border: "1px solid #f8717140",
                color: "#f87171",
              }}
            >
              {collapsed ? "⊗" : "⊗ Logout"}
            </button>
          </div>
        </div>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          {/* Top bar */}
          <div
            className="h-[60px] flex items-center justify-between px-8 flex-shrink-0"
            style={{ borderBottom: "1px solid #1e2330", background: "#0c0f18" }}
          >
            <div>
              <div
                className="font-display text-base font-extrabold"
                style={{ color: "#f0f4ff" }}
              >
                {title}
              </div>
              {subtitle && (
                <div
                  className="font-mono text-[11px] mt-0.5"
                  style={{ color: "#6b7a99" }}
                >
                  {subtitle}
                </div>
              )}
            </div>
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{ background: "#9c3ae814", border: "1px solid #9c3ae830" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80" }}
              />
              <span
                className="font-mono text-[10px] font-bold uppercase tracking-widest"
                style={{ color: "#4ade80" }}
              >
                Live
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8">{children}</div>
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
      className="inline-block px-2.5 py-0.5 rounded-full font-mono text-[11px] font-semibold tracking-wide whitespace-nowrap"
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
      }}
    >
      {children}
    </span>
  );
};

export const Badge = ({ children, color = "#3a9de8" }) => (
  <span
    className="inline-block px-2.5 py-px rounded font-mono text-[10px] font-bold tracking-widest uppercase"
    style={{ color, background: `${color}18`, border: `1px solid ${color}40` }}
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
      className="inline-flex items-center gap-1.5 rounded-lg font-display font-bold tracking-wide transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      style={{
        background: s.bg,
        color: s.color,
        border: s.border,
        boxShadow: s.shadow,
        padding: small ? "6px 14px" : "9px 20px",
        fontSize: small ? 11 : 13,
      }}
    >
      {loading && (
        <span
          className="inline-block"
          style={{ animation: "spin 0.6s linear infinite" }}
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
    className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
    style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(6px)" }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full rounded-2xl overflow-y-auto"
      style={{
        background: "#0c0f18",
        border: "1px solid #2a1a4a",
        padding: "28px 32px",
        maxWidth: 560,
        maxHeight: "85vh",
        boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px #9c3ae810",
        animation: "slideIn 0.25s ease",
      }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2
          className="font-display text-lg font-extrabold m-0"
          style={{ color: "#f0f4ff" }}
        >
          {title}
        </h2>
        <button
          onClick={onClose}
          className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-sm cursor-pointer"
          style={{
            background: "#1e2330",
            border: "1px solid #2a3045",
            color: "#8892a4",
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
  <div className="mb-4">
    <label
      className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5"
      style={{ color: "#6b7a99" }}
    >
      {label} {required && <span style={{ color: SA_ACCENT }}>*</span>}
    </label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows || 3}
        className="w-full rounded-lg font-mono text-[13px] outline-none resize-vertical"
        style={{
          background: "#060810",
          border: "1px solid #1e2330",
          padding: "10px 14px",
          color: "#f0f4ff",
          boxSizing: "border-box",
        }}
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg font-mono text-[13px] outline-none"
        style={{
          background: "#060810",
          border: "1px solid #1e2330",
          padding: "10px 14px",
          color: "#f0f4ff",
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
      className="fixed bottom-7 right-7 z-[9999] font-mono text-[13px] rounded-xl px-5 py-3"
      style={{
        background: "#0c0f18",
        border: `1px solid ${color}40`,
        borderLeft: `3px solid ${color}`,
        color: "#f0f4ff",
        boxShadow: "0 8px 32px rgba(0,0,0,0.7)",
        animation: "slideIn 0.25s ease",
      }}
    >
      <span className="mr-2" style={{ color }}>
        {type === "error" ? "✕" : type === "warn" ? "⚠" : "✓"}
      </span>
      {message}
    </div>
  );
};

export const Spinner = ({ size = 24, color = SA_ACCENT }) => (
  <div
    className="rounded-full flex-shrink-0"
    style={{
      width: size,
      height: size,
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
    className="rounded-full flex items-center justify-center font-mono font-bold text-white flex-shrink-0"
    style={{
      width: size,
      height: size,
      background: avatarColor(name),
      fontSize: size * 0.34,
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
