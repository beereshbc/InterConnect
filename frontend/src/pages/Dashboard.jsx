import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import {
  Link as LinkIcon,
  Loader2,
  Users,
  Phone,
  Mail,
  Github,
  ExternalLink,
  MessageSquare,
  BookOpen,
  Zap,
  // Trophy,   // RANKING REMOVED
  CheckCircle,
  Clock,
  ChevronRight,
  Star,
  Activity,
  RefreshCw,
  LogIn,
  Target,
  Layers,
  BarChart2,
  Flame,
  // ArrowUpRight,  // RANKING REMOVED
  // Shield,        // RANKING REMOVED
  // Bell,          // RANKING REMOVED
  X,
  FileText,
  // Calendar,   // RANKING REMOVED
  // Award,      // RANKING REMOVED
  GitPullRequest,
  AlertCircle,
} from "lucide-react";

// ─── GLOBAL STYLES ─────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; }

  :root {
    --bg: #060810;
    --surface: #0d1117;
    --surface2: #131924;
    --surface3: #1a2235;
    --border: #1e2d42;
    --border2: #243348;
    --text: #e8edf5;
    --text2: #8b96aa;
    --text3: #4a5568;
    --accent: #4f8ef7;
    --accent2: #7c5cfc;
    --green: #22d3a0;
    --amber: #f5a623;
    --red: #f05252;
    --orange: #f97316;
    --font-d: 'Outfit', sans-serif;
    --font-m: 'JetBrains Mono', monospace;
  }

  html { scroll-behavior: smooth; }
  body { margin: 0; background: var(--bg); }

  ::-webkit-scrollbar { width: 3px; height: 3px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 10px; }

  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes glow { 0%,100% { opacity:.6; } 50% { opacity:1; } }
  @keyframes toastIn { from { opacity:0; transform:translateX(-50%) translateY(20px) scale(.94); } to { opacity:1; transform:translateX(-50%) translateY(0) scale(1); } }
  @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:.5; } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

  .animate-spin { animation: spin 1s linear infinite; }

  .glass {
    background: rgba(6,8,16,.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .card-tap { -webkit-tap-highlight-color: transparent; }

  /* Rich text styles */
  .rt p { margin: 0 0 8px 0; font-family: var(--font-m); font-size: 11px; color: var(--text2); line-height: 1.75; }
  .rt p:last-child { margin: 0; }
  .rt strong, .rt b { color: var(--text); font-weight: 700; }
  .rt em, .rt i { font-style: italic; color: var(--text2); }
  .rt ul, .rt ol { margin: 6px 0 8px 18px; padding: 0; }
  .rt li { margin-bottom: 5px; font-family: var(--font-m); font-size: 11px; color: var(--text2); line-height: 1.65; }
  .rt a { color: #4f8ef7; text-decoration: underline; }
  .rt h1, .rt h2, .rt h3 { color: var(--text); font-family: var(--font-d); margin: 10px 0 5px; font-weight: 700; }
  .rt h1 { font-size: 15px; }
  .rt h2 { font-size: 13px; }
  .rt h3 { font-size: 12px; }
  .rt br { display: block; content: ""; margin: 4px 0; }
  .rt amp { display: none; }
  .rt &amp; { display: none; }

  /* Mobile: sheet slides up, Desktop: panel from right */
  @media (max-width: 639px) {
    .proj-drawer {
      position: fixed !important;
      bottom: 0 !important; left: 0 !important; right: 0 !important;
      top: auto !important; width: 100% !important;
      max-height: 93dvh !important;
      border-radius: 22px 22px 0 0 !important;
      border-top: 1px solid var(--border) !important;
      border-left: none !important;
    }
    .log-detail-drawer {
      position: fixed !important;
      bottom: 0 !important; left: 0 !important; right: 0 !important;
      top: auto !important; width: 100% !important;
      max-height: 95dvh !important;
      border-radius: 24px 24px 0 0 !important;
      border-top: 1px solid var(--border) !important;
      border-left: none !important;
    }
  }
  @media (min-width: 640px) {
    .proj-drawer {
      position: fixed !important;
      top: 0 !important; right: 0 !important; bottom: 0 !important;
      left: auto !important; width: min(460px,100vw) !important;
      max-height: 100dvh !important;
      border-radius: 0 !important;
      border-left: 1px solid var(--border) !important;
      border-top: none !important;
    }
    .log-detail-drawer {
      position: fixed !important;
      top: 0 !important; right: 0 !important; bottom: 0 !important;
      left: auto !important; width: min(500px,100vw) !important;
      max-height: 100dvh !important;
      border-radius: 0 !important;
      border-left: 1px solid var(--border) !important;
      border-top: none !important;
    }
    .sm-tabs { display: flex !important; }
    .sm-live { display: flex !important; }
    .sm-name { display: block !important; }
    .sm-hide-mobile { display: none !important; }
  }
`;

// ─── Utils ──────────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";
const daysLeft = (deadline) =>
  deadline ? Math.ceil((new Date(deadline) - new Date()) / 864e5) : null;
const initials = (n = "") =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
const PALETTE = [
  "#4f8ef7",
  "#7c5cfc",
  "#22d3a0",
  "#f5a623",
  "#f05252",
  "#f97316",
  "#06b6d4",
  "#ec4899",
];
const avatarBg = (n = "") => {
  let h = 0;
  for (let i = 0; i < n.length; i++) h = n.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
};

const isRichText = (str) => /<[a-z][\s\S]*>/i.test(str);

const sanitizeHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
};

// ─── Status ─────────────────────────────────────────────────────────────────────
const ST = {
  open: {
    bg: "#0d1a2e",
    txt: "#4f8ef7",
    border: "#4f8ef730",
    dot: "#4f8ef7",
    label: "Open",
  },
  assigned: {
    bg: "#1c1508",
    txt: "#f5a623",
    border: "#f5a62330",
    dot: "#f5a623",
    label: "Assigned",
  },
  pending: {
    bg: "#160d28",
    txt: "#a78bfa",
    border: "#a78bfa30",
    dot: "#a78bfa",
    label: "In Review",
  },
  completed: {
    bg: "#071c14",
    txt: "#22d3a0",
    border: "#22d3a030",
    dot: "#22d3a0",
    label: "Completed",
  },
  terminated: {
    bg: "#200808",
    txt: "#f05252",
    border: "#f0525230",
    dot: "#f05252",
    label: "Terminated",
  },
};

// ─── Primitives ─────────────────────────────────────────────────────────────────
const Av = ({ name = "", size = 36 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      flexShrink: 0,
      background: `linear-gradient(135deg,${avatarBg(name)},${avatarBg(name + "x")})`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-m)",
      fontWeight: 700,
      color: "#fff",
      fontSize: size * 0.35,
      boxShadow: `0 0 0 2px #0d1117,0 0 0 3px ${avatarBg(name)}40`,
    }}
  >
    {initials(name)}
  </div>
);

const Chip = ({ status }) => {
  const s = ST[status] || ST.open;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 100,
        background: s.bg,
        color: s.txt,
        border: `1px solid ${s.border}`,
        fontSize: 10,
        fontFamily: "var(--font-m)",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
          boxShadow: `0 0 6px ${s.dot}`,
        }}
      />
      {s.label}
    </span>
  );
};

const Tag = ({ children, color = "#4f8ef7" }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: 6,
      color,
      background: `${color}15`,
      border: `1px solid ${color}30`,
      fontSize: 10,
      fontFamily: "var(--font-m)",
      fontWeight: 600,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
    }}
  >
    {children}
  </span>
);

// ─── Rich Text Renderer ──────────────────────────────────────────────────────────
const RichText = ({ html, clamp }) => {
  const clean = sanitizeHtml(html || "");
  return (
    <div
      className="rt"
      dangerouslySetInnerHTML={{ __html: clean }}
      style={
        clamp
          ? {
              display: "-webkit-box",
              WebkitLineClamp: clamp,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }
          : undefined
      }
    />
  );
};

const SmartText = ({ text, clamp, style = {} }) => {
  if (!text) return null;
  if (isRichText(text)) return <RichText html={text} clamp={clamp} />;
  return (
    <p
      style={{
        fontFamily: "var(--font-m)",
        fontSize: 11,
        color: "var(--text2)",
        lineHeight: 1.75,
        margin: 0,
        ...(clamp
          ? {
              display: "-webkit-box",
              WebkitLineClamp: clamp,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }
          : {}),
        ...style,
      }}
    >
      {text}
    </p>
  );
};

const ToastBar = ({ message, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3500);
    return () => clearTimeout(t);
  }, [onDone]);
  const colors = { success: "#22d3a0", error: "#f05252", warn: "#f5a623" };
  const c = colors[type] || colors.success;
  return (
    <div
      style={{
        position: "fixed",
        bottom: "calc(env(safe-area-inset-bottom,0px) + 88px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 32px)",
        maxWidth: 420,
        zIndex: 9999,
        background: "#0d1117",
        border: `1px solid ${c}40`,
        borderLeft: `3px solid ${c}`,
        borderRadius: 14,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 10,
        color: "var(--text)",
        boxShadow: `0 20px 60px rgba(0,0,0,.8)`,
        animation: "toastIn .3s cubic-bezier(.175,.885,.32,1.275) both",
        fontSize: 13,
        fontFamily: "var(--font-d)",
      }}
    >
      <span style={{ color: c, fontSize: 16 }}>
        {type === "error" ? "✕" : type === "warn" ? "⚠" : "✓"}
      </span>
      <span
        style={{
          flex: 1,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {message}
      </span>
    </div>
  );
};

const SH = ({ title, accent = "#4f8ef7", count, action, actionLabel }) => (
  <div
    style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}
  >
    <div
      style={{
        width: 3,
        height: 18,
        borderRadius: 3,
        background: accent,
        flexShrink: 0,
      }}
    />
    <span
      style={{
        fontFamily: "var(--font-d)",
        fontWeight: 700,
        color: "var(--text)",
        fontSize: "clamp(13px,3.5vw,15px)",
        letterSpacing: "-0.01em",
      }}
    >
      {title}
    </span>
    {count !== undefined && (
      <span
        style={{
          padding: "1px 8px",
          borderRadius: 100,
          background: `${accent}18`,
          color: accent,
          border: `1px solid ${accent}28`,
          fontSize: 11,
          fontFamily: "var(--font-m)",
          fontWeight: 600,
        }}
      >
        {count}
      </span>
    )}
    <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
    {action && (
      <button
        onClick={action}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: accent,
          fontSize: 11,
          fontFamily: "var(--font-m)",
          fontWeight: 600,
          whiteSpace: "nowrap",
          padding: 0,
        }}
      >
        {actionLabel || "View all →"}
      </button>
    )}
  </div>
);

const Brick = ({ icon, label, value, accent, sub, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    style={{
      background: "var(--surface)",
      border: `1px solid var(--border)`,
      borderRadius: 16,
      padding: 16,
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -30,
        right: -30,
        width: 80,
        height: 80,
        borderRadius: "50%",
        background: `${accent}0a`,
        filter: "blur(20px)",
        pointerEvents: "none",
      }}
    />
    <div style={{ position: "relative" }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          marginBottom: 10,
          background: `${accent}18`,
          border: `1px solid ${accent}28`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: accent,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontFamily: "var(--font-d)",
          fontWeight: 800,
          color: "var(--text)",
          fontSize: "clamp(20px,5vw,26px)",
          lineHeight: 1,
          marginBottom: 4,
        }}
      >
        {value ?? 0}
      </div>
      <div
        style={{
          fontFamily: "var(--font-m)",
          fontSize: 10,
          color: "var(--text3)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
      {sub && (
        <div
          style={{
            marginTop: 3,
            fontSize: 10,
            color: accent,
            fontFamily: "var(--font-m)",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  </motion.div>
);

// ─── Modal ───────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 1000,
      background: "rgba(0,0,0,.85)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16,
    }}
  >
    <motion.div
      initial={{ scale: 0.94, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.94, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onClick={(e) => e.stopPropagation()}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border2)",
        borderRadius: 20,
        width: "100%",
        maxWidth: 480,
        maxHeight: "90dvh",
        overflowY: "auto",
        boxShadow: "0 40px 100px rgba(0,0,0,.8)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px 16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-d)",
            fontWeight: 700,
            color: "var(--text)",
            fontSize: "clamp(15px,4vw,17px)",
            margin: 0,
          }}
        >
          {title}
        </h2>
        <button
          onClick={onClose}
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            color: "var(--text2)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          ✕
        </button>
      </div>
      <div style={{ padding: "20px 24px 24px" }}>{children}</div>
    </motion.div>
  </div>
);

// ─── Log Detail Drawer ────────────────────────────────────────────────────────────
const LogDetailDrawer = ({
  log,
  onClose,
  onMarkComplete,
  onClaim,
  claiming,
}) => {
  if (!log) return null;
  const days = daysLeft(log.deadlineAt);
  const isPending = log.task_status === "pending";
  const overdue =
    (log.task_status === "assigned" || isPending) && days !== null && days <= 0;
  const eff = overdue ? "terminated" : log.task_status;
  const st = ST[eff] || ST.open;
  const proj = log.projectId?.problem?.title || log.projectId?.projectID || "—";

  const InfoRow = ({ icon, label, value, color = "var(--text2)" }) => (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "10px 0",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          color: "var(--text3)",
          flexShrink: 0,
          marginTop: 1,
          width: 14,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-m)",
            fontSize: 9,
            color: "var(--text3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 3,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "var(--font-m)",
            fontSize: 12,
            color,
            lineHeight: 1.5,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="log-detail-drawer"
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 32 }}
      style={{
        background: "#080b14",
        zIndex: 600,
        overflowY: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "12px 0 4px",
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 4,
            background: "var(--border2)",
          }}
        />
      </div>

      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "rgba(8,11,20,.95)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          padding: "12px 16px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 9,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 3,
              }}
            >
              Task Detail
            </div>
            <div
              style={{
                fontFamily: "var(--font-d)",
                fontWeight: 700,
                color: "var(--text)",
                fontSize: "clamp(13px,3.5vw,15px)",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {log.taskTitle}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Chip status={eff} />
            <button
              onClick={onClose}
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text2)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          padding: 16,
          paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 32px)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 8,
          }}
        >
          {[
            {
              l: "Points",
              v: log.assignedTaskPoints ?? 0,
              c: "#f5a623",
              icon: "⬡",
            },
            {
              l: "Deadline",
              v: log.deadlineDays ? `${log.deadlineDays}d` : "—",
              c: "#4f8ef7",
              icon: "⏱",
            },
            {
              l: overdue
                ? "Overdue"
                : days !== null && (log.task_status === "assigned" || isPending)
                  ? `${days}d left`
                  : log.task_status === "completed"
                    ? "Done"
                    : "—",
              v:
                log.task_status === "completed"
                  ? fmtDate(log.closedAt)
                  : fmtDate(log.deadlineAt),
              c: overdue
                ? "#f05252"
                : days !== null && days <= 2
                  ? "#f97316"
                  : log.task_status === "completed"
                    ? "#22d3a0"
                    : "var(--text3)",
              icon: log.task_status === "completed" ? "✓" : "📅",
            },
          ].map((s) => (
            <div
              key={s.l}
              style={{
                textAlign: "center",
                padding: "12px 6px",
                borderRadius: 12,
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-d)",
                  fontWeight: 800,
                  fontSize: 16,
                  color: s.c,
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {s.icon} {s.v}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-m)",
                  fontSize: 8,
                  color: "var(--text3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            padding: "12px 14px",
            borderRadius: 12,
            background: "var(--surface)",
            border: "1px solid #4f8ef720",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Layers size={14} style={{ color: "#4f8ef7", flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 9,
                color: "var(--text3)",
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              Project
            </div>
            <div
              style={{
                fontFamily: "var(--font-d)",
                fontWeight: 600,
                fontSize: 13,
                color: "var(--text)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {proj}
            </div>
          </div>
          <div
            style={{
              fontFamily: "var(--font-m)",
              fontSize: 10,
              color: "var(--text3)",
            }}
          >
            {fmtDate(log.createdAt)}
          </div>
        </div>

        {log.description && (
          <div
            style={{
              borderRadius: 14,
              padding: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 9,
                color: "#4f8ef7",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <FileText size={11} /> Description
            </div>
            <SmartText text={log.description} />
          </div>
        )}

        {log.requirements && (
          <div
            style={{
              borderRadius: 14,
              padding: 14,
              background: "var(--surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 9,
                color: "#f5a623",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <AlertCircle size={11} /> Requirements
            </div>
            <SmartText text={log.requirements} />
          </div>
        )}

        {log.closureNote && (
          <div
            style={{
              borderRadius: 14,
              padding: 14,
              background: "var(--surface)",
              border: "1px solid #22d3a020",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 9,
                color: "#22d3a0",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <CheckCircle size={11} /> Completion Note
            </div>
            <SmartText text={log.closureNote} />
          </div>
        )}

        {(log.githubIssueLink || log.githubPrLink) && (
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {log.githubIssueLink && (
              <a
                href={log.githubIssueLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 14px",
                  borderRadius: 12,
                  textDecoration: "none",
                  background: "var(--surface)",
                  border: "1px solid #4f8ef728",
                }}
              >
                <Github size={14} style={{ color: "#4f8ef7", flexShrink: 0 }} />
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 9,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                    }}
                  >
                    Issue
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 11,
                      color: "#4f8ef7",
                    }}
                  >
                    View ↗
                  </div>
                </div>
              </a>
            )}
            {log.githubPrLink && (
              <a
                href={log.githubPrLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "12px 14px",
                  borderRadius: 12,
                  textDecoration: "none",
                  background: "var(--surface)",
                  border: "1px solid #22d3a028",
                }}
              >
                <GitPullRequest
                  size={14}
                  style={{ color: "#22d3a0", flexShrink: 0 }}
                />
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 9,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                    }}
                  >
                    Pull Request
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 11,
                      color: "#22d3a0",
                    }}
                  >
                    View ↗
                  </div>
                </div>
              </a>
            )}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          {log.task_status === "open" && onClaim && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onClaim(log._id);
                onClose();
              }}
              disabled={claiming}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 12,
                background: "#071c14",
                border: "1px solid #22d3a035",
                color: "#22d3a0",
                fontSize: 13,
                fontFamily: "var(--font-m)",
                fontWeight: 700,
                cursor: claiming ? "wait" : "pointer",
                opacity: claiming ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              {claiming ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Target size={14} />
              )}
              Claim This Task
            </motion.button>
          )}
          {log.task_status === "assigned" && onMarkComplete && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onMarkComplete(log);
                onClose();
              }}
              style={{
                flex: 1,
                padding: "14px 0",
                borderRadius: 12,
                background: "#071c14",
                border: "1px solid #22d3a035",
                color: "#22d3a0",
                fontSize: 13,
                fontFamily: "var(--font-m)",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <CheckCircle size={14} /> Mark Complete
            </motion.button>
          )}
          <button
            onClick={onClose}
            style={{
              padding: "14px 20px",
              borderRadius: 12,
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text2)",
              fontSize: 12,
              fontFamily: "var(--font-m)",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Mark Complete Modal ──────────────────────────────────────────────────────────
const MarkCompleteModal = ({ log, onClose, onSubmit }) => {
  const [form, setForm] = useState({ githubPrLink: "", closureNote: "" });
  const [saving, setSaving] = useState(false);
  const handle = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(log._id, form);
    setSaving(false);
  };
  const inp = {
    width: "100%",
    borderRadius: 10,
    padding: "10px 14px",
    background: "var(--surface2)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: 13,
    fontFamily: "var(--font-m)",
    outline: "none",
  };
  return (
    <Modal title="Submit Task for Review" onClose={onClose}>
      <div
        style={{
          marginBottom: 16,
          padding: "12px 14px",
          borderRadius: 12,
          background: "var(--surface2)",
          border: "1px solid var(--border)",
        }}
      >
        <p
          style={{
            color: "var(--text2)",
            fontSize: 12,
            fontFamily: "var(--font-m)",
            lineHeight: 1.7,
            margin: 0,
          }}
        >
          Submitting:{" "}
          <strong style={{ color: "var(--text)" }}>{log.taskTitle}</strong>
          <br />
          Provide your work link so the coordinator can review &amp; award
          points.
        </p>
      </div>
      <form onSubmit={handle}>
        <div style={{ marginBottom: 14 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontFamily: "var(--font-m)",
              fontSize: 10,
              color: "var(--text3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            GitHub PR / Commit Link <span style={{ color: "#22d3a0" }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <LinkIcon
              size={13}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--text3)",
              }}
            />
            <input
              type="url"
              required
              placeholder="https://github.com/..."
              value={form.githubPrLink}
              onChange={(e) =>
                setForm({ ...form, githubPrLink: e.target.value })
              }
              style={{ ...inp, paddingLeft: 34 }}
              onFocus={(e) => (e.target.style.borderColor = "#22d3a060")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontFamily: "var(--font-m)",
              fontSize: 10,
              color: "var(--text3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Completion Note (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Any details the reviewer should know..."
            value={form.closureNote}
            onChange={(e) => setForm({ ...form, closureNote: e.target.value })}
            style={{ ...inp, resize: "none", lineHeight: 1.6 }}
            onFocus={(e) => (e.target.style.borderColor = "#22d3a060")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "9px 16px",
              borderRadius: 10,
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text2)",
              cursor: "pointer",
              fontSize: 12,
              fontFamily: "var(--font-m)",
              fontWeight: 600,
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !form.githubPrLink}
            style={{
              padding: "9px 20px",
              borderRadius: 10,
              background: "#071c14",
              border: "1px solid #22d3a035",
              color: "#22d3a0",
              cursor: saving || !form.githubPrLink ? "not-allowed" : "pointer",
              opacity: !form.githubPrLink ? 0.5 : 1,
              fontSize: 12,
              fontFamily: "var(--font-m)",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            {saving && <Loader2 size={13} className="animate-spin" />} Submit
            Work
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Community Banner ─────────────────────────────────────────────────────────────
const CommunityBanner = ({ link, projectTitle }) => {
  if (!link) return null;
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noreferrer"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      style={{
        display: "block",
        textDecoration: "none",
        borderRadius: 16,
        padding: "14px 16px",
        position: "relative",
        overflow: "hidden",
        background:
          "linear-gradient(135deg,#160d28 0%,#0d1a2e 50%,#071c14 100%)",
        border: "1px solid #7c5cfc30",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "radial-gradient(circle,#7c5cfc18,transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          position: "relative",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            flexShrink: 0,
            background: "#7c5cfc18",
            border: "1px solid #7c5cfc35",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MessageSquare size={20} style={{ color: "#a78bfa" }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-d)",
              fontWeight: 700,
              color: "var(--text)",
              fontSize: "clamp(13px,3.5vw,14px)",
              marginBottom: 2,
            }}
          >
            Join the Community
          </div>
          <div
            style={{
              fontFamily: "var(--font-m)",
              fontSize: 11,
              color: "var(--text2)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Connect with contributors of{" "}
            <span style={{ color: "#a78bfa" }}>
              {projectTitle || "this project"}
            </span>
          </div>
        </div>
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 14px",
            borderRadius: 10,
            background: "#7c5cfc20",
            border: "1px solid #7c5cfc40",
            color: "#a78bfa",
            fontSize: 11,
            fontFamily: "var(--font-m)",
            fontWeight: 700,
          }}
        >
          Join <ExternalLink size={11} />
        </div>
      </div>
    </motion.a>
  );
};

// ─── Coordinator Card ─────────────────────────────────────────────────────────────
const CoordinatorCard = ({ coordinator }) => {
  if (!coordinator)
    return (
      <div
        style={{
          borderRadius: 12,
          padding: 14,
          textAlign: "center",
          background: "var(--surface2)",
          border: "1px solid var(--border)",
        }}
      >
        <p
          style={{
            color: "var(--text3)",
            fontSize: 11,
            fontFamily: "var(--font-m)",
            margin: 0,
          }}
        >
          No coordinator assigned yet.
        </p>
      </div>
    );
  return (
    <div
      style={{
        borderRadius: 12,
        padding: 14,
        background: "var(--surface2)",
        border: "1px solid #4f8ef720",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <Av name={coordinator.name} size={40} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-d)",
              fontWeight: 700,
              color: "var(--text)",
              fontSize: "clamp(12px,3vw,14px)",
              marginBottom: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {coordinator.name}
          </div>
          <div
            style={{
              fontFamily: "var(--font-m)",
              fontSize: 10,
              color: "#4f8ef7",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            Project Coordinator
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {coordinator.email && (
              <a
                href={`mailto:${coordinator.email}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  textDecoration: "none",
                  color: "var(--text2)",
                }}
              >
                <Mail size={11} style={{ color: "#4f8ef7", flexShrink: 0 }} />
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-m)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {coordinator.email}
                </span>
              </a>
            )}
            {coordinator.phone && (
              <a
                href={`tel:${coordinator.phone}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  textDecoration: "none",
                  color: "var(--text2)",
                }}
              >
                <Phone size={11} style={{ color: "#22d3a0", flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontFamily: "var(--font-m)" }}>
                  {coordinator.phone}
                </span>
              </a>
            )}
            {coordinator.college && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  color: "var(--text3)",
                }}
              >
                <BookOpen
                  size={11}
                  style={{ color: "#f5a623", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontFamily: "var(--font-m)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {coordinator.college}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Log Card ──────────────────────────────────────────────────────────────────────
const LogCard = ({
  log,
  showClaim = false,
  onClaim,
  claiming = false,
  onMarkComplete,
  onViewDetail,
}) => {
  const days = daysLeft(log.deadlineAt);
  const isPending = log.task_status === "pending";
  const overdue =
    (log.task_status === "assigned" || isPending) && days !== null && days <= 0;
  const eff = overdue ? "terminated" : log.task_status;
  const st = ST[eff] || ST.open;
  const proj = log.projectId?.problem?.title || log.projectId?.projectID || "—";
  return (
    <div
      style={{
        borderRadius: 14,
        padding: 14,
        background: "var(--surface)",
        border: `1px solid ${st.border}`,
        borderLeft: `3px solid ${st.dot}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 10,
          marginBottom: 8,
        }}
      >
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              fontFamily: "var(--font-d)",
              fontWeight: 700,
              color: "var(--text)",
              fontSize: "clamp(12px,3.5vw,14px)",
              lineHeight: 1.3,
              marginBottom: 3,
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {log.taskTitle}
          </div>
          <div
            style={{
              fontFamily: "var(--font-m)",
              fontSize: 10,
              color: "var(--text3)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {proj} · {fmtDate(log.createdAt)}
          </div>
        </div>
        <Chip status={eff} />
      </div>

      {log.description && (
        <div style={{ marginBottom: 10 }}>
          <SmartText text={log.description} clamp={2} />
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          alignItems: "center",
          fontSize: 11,
          fontFamily: "var(--font-m)",
        }}
      >
        <span style={{ color: "#f5a623", fontWeight: 700 }}>
          ⬡ {log.assignedTaskPoints ?? 0} pts
        </span>
        {log.deadlineDays && (
          <span style={{ color: "var(--text3)" }}>⏱ {log.deadlineDays}d</span>
        )}
        {(log.task_status === "assigned" || isPending) && log.deadlineAt && (
          <span
            style={{
              color:
                days <= 0 ? "#f05252" : days <= 2 ? "#f97316" : "var(--text3)",
              fontWeight: days <= 2 ? 700 : 400,
            }}
          >
            {days <= 0 ? "⚠ Overdue" : `${days}d left`}
          </span>
        )}
        {log.task_status === "completed" && log.closedAt && (
          <span style={{ color: "#22d3a0" }}>✓ {fmtDate(log.closedAt)}</span>
        )}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginLeft: "auto",
            alignItems: "center",
          }}
        >
          {onViewDetail && (
            <button
              onClick={() => onViewDetail(log)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#4f8ef7",
                fontSize: 11,
                fontFamily: "var(--font-m)",
                fontWeight: 700,
                padding: 0,
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              Details <ChevronRight size={11} />
            </button>
          )}
          {log.task_status === "assigned" && onMarkComplete && (
            <button
              onClick={() => onMarkComplete(log)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#22d3a0",
                fontSize: 11,
                fontFamily: "var(--font-m)",
                fontWeight: 700,
                padding: 0,
              }}
            >
              ✓ Done
            </button>
          )}
        </div>
      </div>

      {showClaim && log.task_status === "open" && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => onClaim(log._id)}
          disabled={claiming}
          className="card-tap"
          style={{
            marginTop: 12,
            width: "100%",
            padding: "11px 0",
            borderRadius: 10,
            background: "#071c14",
            border: "1px solid #22d3a035",
            color: "#22d3a0",
            fontSize: 12,
            fontFamily: "var(--font-m)",
            fontWeight: 700,
            cursor: claiming ? "wait" : "pointer",
            opacity: claiming ? 0.6 : 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {claiming ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            <Target size={13} />
          )}
          {claiming ? "Claiming…" : "Claim This Task"}
        </motion.button>
      )}
    </div>
  );
};

// ─── Project Card ──────────────────────────────────────────────────────────────────
const ProjCard = ({ p, onClick }) => {
  const done = p.myTasksDone ?? 0;
  const active = p.myTasksActive ?? 0;
  return (
    <motion.div
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="card-tap"
      style={{
        borderRadius: 18,
        padding: 16,
        cursor: "pointer",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        position: "relative",
        overflow: "hidden",
        transition: "border-color .2s",
      }}
    >
      {p.communityLink && (
        <div
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#7c5cfc",
            boxShadow: "0 0 8px #7c5cfc",
            animation: "glow 2s ease-in-out infinite",
          }}
        />
      )}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            flexShrink: 0,
            background: "#4f8ef715",
            border: "1px solid #4f8ef728",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#4f8ef7",
            fontFamily: "var(--font-m)",
            fontWeight: 700,
            fontSize: 11,
          }}
        >
          {p.projectID?.slice(-3)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: "var(--font-d)",
              fontWeight: 700,
              color: "var(--text)",
              fontSize: "clamp(12px,3.5vw,14px)",
              lineHeight: 1.3,
              marginBottom: 3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {p.problem?.title || "—"}
          </div>
          <div
            style={{
              fontFamily: "var(--font-m)",
              fontSize: 10,
              color: "var(--text3)",
            }}
          >
            {p.projectID}
          </div>
        </div>
      </div>
      <div
        style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 12 }}
      >
        {p.problem?.theme && <Tag color="#7c5cfc">{p.problem.theme}</Tag>}
        {p.myRole && <Tag color="#f5a623">{p.myRole}</Tag>}
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
        {p.communityLink && (
          <a
            href={p.communityLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "7px 0",
              borderRadius: 8,
              textDecoration: "none",
              background: "#7c5cfc15",
              border: "1px solid #7c5cfc30",
              color: "#a78bfa",
              fontSize: 10,
              fontFamily: "var(--font-m)",
              fontWeight: 600,
            }}
          >
            <MessageSquare size={10} /> Community
          </a>
        )}
        {p.githubRepoLink && (
          <a
            href={p.githubRepoLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              padding: "7px 0",
              borderRadius: 8,
              textDecoration: "none",
              background: "#4f8ef715",
              border: "1px solid #4f8ef730",
              color: "#4f8ef7",
              fontSize: 10,
              fontFamily: "var(--font-m)",
              fontWeight: 600,
            }}
          >
            <Github size={10} /> Repo
          </a>
        )}
      </div>
      <div style={{ marginBottom: 12 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 5,
            fontSize: 10,
            color: "var(--text3)",
            fontFamily: "var(--font-m)",
          }}
        >
          <span>{p.projectProgressRate ?? 0}% overall</span>
          <span>
            {done}/{p.myLogs?.length ?? 0} tasks
          </span>
        </div>
        <div
          style={{
            height: 4,
            borderRadius: 10,
            background: "var(--surface3)",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${p.projectProgressRate ?? 0}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{
              height: "100%",
              borderRadius: 10,
              background: "linear-gradient(90deg,#4f8ef7,#7c5cfc)",
            }}
          />
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 6,
        }}
      >
        {[
          ["Score", p.myScore, "#f5a623"],
          ["Active", active, "#f97316"],
          ["Done", done, "#22d3a0"],
        ].map(([l, v, c]) => (
          <div
            key={l}
            style={{
              textAlign: "center",
              padding: "8px 0",
              borderRadius: 10,
              background: "var(--surface2)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-d)",
                fontWeight: 700,
                fontSize: 14,
                color: c,
              }}
            >
              {v}
            </div>
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 8,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>
      {/* RANKING REMOVED: coordinators strip kept but Trophy icon replaced */}
      {p.coordinators?.length > 0 && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            marginTop: 10,
            padding: "8px 10px",
            borderRadius: 10,
            background: "var(--surface2)",
          }}
        >
          <Users size={10} style={{ color: "#7c5cfc", flexShrink: 0 }} />
          <span
            style={{
              fontFamily: "var(--font-m)",
              fontSize: 10,
              color: "#a78bfa",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              flex: 1,
            }}
          >
            {p.coordinators[0].name}
            {p.coordinators.length > 1 && (
              <span style={{ color: "var(--text3)" }}>
                {" "}
                +{p.coordinators.length - 1}
              </span>
            )}
          </span>
          <span
            style={{
              fontFamily: "var(--font-m)",
              fontSize: 8,
              color: "var(--text3)",
              textTransform: "uppercase",
              flexShrink: 0,
            }}
          >
            Coord
          </span>
        </div>
      )}
    </motion.div>
  );
};

// ─── Project Drawer ────────────────────────────────────────────────────────────────
const ProjectDrawer = ({
  drawer,
  logs,
  openLogs,
  claiming,
  onClaim,
  onClose,
  onMarkComplete,
  onViewDetail,
}) => {
  const myLogs = logs.filter(
    (l) =>
      l.projectId?._id?.toString() === drawer._id?.toString() ||
      l.projectId?.toString() === drawer._id?.toString(),
  );
  const drawerOpenLogs = (openLogs || []).filter(
    (l) =>
      l.projectId?._id?.toString() === drawer._id?.toString() ||
      l.projectId?.toString() === drawer._id?.toString(),
  );
  const coordinators = drawer.coordinators || [];
  return (
    <motion.div
      className="proj-drawer"
      initial={{ opacity: 0, y: "100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{ background: "#0a0d16", zIndex: 500, overflowY: "auto" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "12px 0 4px",
        }}
      >
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 4,
            background: "var(--border2)",
          }}
        />
      </div>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "rgba(10,13,22,.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border)",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            minWidth: 0,
            flex: 1,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              flexShrink: 0,
              background: "#4f8ef720",
              border: "1px solid #4f8ef740",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#4f8ef7",
              fontFamily: "var(--font-m)",
              fontWeight: 700,
              fontSize: 10,
            }}
          >
            {drawer.projectID?.slice(-3)}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 9,
                color: "#4f8ef7",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {drawer.projectID}
            </div>
            <div
              style={{
                fontFamily: "var(--font-d)",
                fontWeight: 700,
                color: "var(--text)",
                fontSize: "clamp(12px,3.5vw,14px)",
                lineHeight: 1.2,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {drawer.problem?.title || "—"}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              padding: "4px 10px",
              borderRadius: 20,
              background: drawer.is_blocked ? "#200808" : "#071c14",
              color: drawer.is_blocked ? "#f05252" : "#22d3a0",
              border: `1px solid ${drawer.is_blocked ? "#f0525220" : "#22d3a020"}`,
              fontSize: 10,
              fontFamily: "var(--font-m)",
              fontWeight: 600,
            }}
          >
            {drawer.is_blocked ? "🔒 Blocked" : "● Active"}
          </span>
          <button
            onClick={onClose}
            className="card-tap"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              color: "var(--text2)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
            }}
          >
            ✕
          </button>
        </div>
      </div>
      <div
        style={{
          padding: 16,
          paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 32px)",
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        {drawer.communityLink && (
          <CommunityBanner
            link={drawer.communityLink}
            projectTitle={drawer.problem?.title}
          />
        )}
        <div
          style={{
            borderRadius: 14,
            padding: 14,
            background: "var(--surface2)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-m)",
              fontSize: 9,
              color: "#4f8ef7",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 10,
            }}
          >
            ◆ My Contribution
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 8,
            }}
          >
            {[
              ["Score", drawer.myScore, "#f5a623"],
              ["Done", drawer.myTasksDone, "#22d3a0"],
              ["Active", drawer.myTasksActive, "#f97316"],
              ["Logs", myLogs.length, "#4f8ef7"],
            ].map(([l, v, c]) => (
              <div
                key={l}
                style={{
                  textAlign: "center",
                  padding: "10px 4px",
                  borderRadius: 10,
                  background: "var(--surface)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-d)",
                    fontWeight: 800,
                    fontSize: "clamp(15px,4vw,18px)",
                    color: c,
                  }}
                >
                  {v}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-m)",
                    fontSize: 8,
                    color: "var(--text3)",
                    textTransform: "uppercase",
                  }}
                >
                  {l}
                </div>
              </div>
            ))}
          </div>
          {drawer.myRole && (
            <div
              style={{
                marginTop: 10,
                fontFamily: "var(--font-m)",
                fontSize: 11,
                color: "var(--text2)",
              }}
            >
              Role:{" "}
              <span style={{ color: "var(--text)" }}>{drawer.myRole}</span>
            </div>
          )}
        </div>
        <div
          style={{
            borderRadius: 14,
            padding: 14,
            background: "var(--surface2)",
            border: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-m)",
              fontSize: 9,
              color: "#f5a623",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 10,
            }}
          >
            ◆ Project Details
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 8,
              marginBottom: 10,
            }}
          >
            {[
              {
                l: "Contributors",
                v: drawer.contributors?.length ?? 0,
                c: "#4f8ef7",
                i: <Users size={12} />,
              },
              {
                l: "Progress",
                v: `${drawer.projectProgressRate ?? 0}%`,
                c: "#22d3a0",
                i: <Activity size={12} />,
              },
              {
                l: "Tasks Done",
                v: drawer.totalTasksCompleted ?? 0,
                c: "#22d3a0",
                i: <CheckCircle size={12} />,
              },
              {
                l: "Total Tasks",
                v: drawer.totalTasksCreated ?? 0,
                c: "#f5a623",
                i: <Zap size={12} />,
              },
              {
                l: "Points Given",
                v: drawer.totalPointsDistributed ?? 0,
                c: "#f05252",
                i: <Star size={12} />,
              },
            ].map(({ l, v, c, i }) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  background: "var(--surface)",
                }}
              >
                <div style={{ color: c }}>{i}</div>
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-d)",
                      fontWeight: 700,
                      fontSize: 15,
                      color: c,
                    }}
                  >
                    {v}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 8,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                    }}
                  >
                    {l}
                  </div>
                </div>
              </div>
            ))}
            <div
              style={{
                gridColumn: "1/-1",
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                background: "var(--surface)",
                border: "1px solid #7c5cfc20",
              }}
            >
              <Users size={12} style={{ color: "#7c5cfc", flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: "var(--font-d)",
                    fontWeight: 700,
                    fontSize: 13,
                    color: "#a78bfa",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {coordinators.length === 0
                    ? "Unassigned"
                    : coordinators.length === 1
                      ? coordinators[0].name
                      : `${coordinators[0].name} +${coordinators.length - 1} more`}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-m)",
                    fontSize: 8,
                    color: "var(--text3)",
                    textTransform: "uppercase",
                  }}
                >
                  {coordinators.length <= 1 ? "Coordinator" : "Coordinators"}
                </div>
              </div>
              {coordinators.length > 0 && coordinators[0].email && (
                <a
                  href={`mailto:${coordinators[0].email}`}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 4,
                    textDecoration: "none",
                    padding: "5px 10px",
                    borderRadius: 8,
                    flexShrink: 0,
                    background: "#7c5cfc15",
                    color: "#a78bfa",
                    fontSize: 10,
                    fontFamily: "var(--font-m)",
                    border: "1px solid #7c5cfc28",
                  }}
                >
                  <Mail size={10} /> Mail
                </a>
              )}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 6,
              fontSize: 10,
              color: "var(--text3)",
              fontFamily: "var(--font-m)",
            }}
          >
            <span>Overall Progress</span>
            <span style={{ color: "#4f8ef7" }}>
              {drawer.projectProgressRate ?? 0}%
            </span>
          </div>
          <div
            style={{
              height: 6,
              borderRadius: 10,
              background: "var(--surface3)",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${drawer.projectProgressRate ?? 0}%` }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
              style={{
                height: "100%",
                borderRadius: 10,
                background: "linear-gradient(90deg,#4f8ef7,#7c5cfc)",
                boxShadow: "0 0 10px #4f8ef760",
              }}
            />
          </div>
        </div>
        {drawer.problem?.description && (
          <div
            style={{
              borderRadius: 14,
              padding: 14,
              background: "var(--surface2)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 9,
                color: "var(--text3)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              ◆ Problem Statement
            </div>
            <SmartText text={drawer.problem.description} />
            <div
              style={{
                display: "flex",
                gap: 5,
                flexWrap: "wrap",
                marginTop: 12,
              }}
            >
              {drawer.problem?.theme && (
                <Tag color="#7c5cfc">{drawer.problem.theme}</Tag>
              )}
              {(drawer.problem?.tags || []).map((t) => (
                <Tag key={t} color="var(--text3)">
                  {t}
                </Tag>
              ))}
            </div>
          </div>
        )}
        {coordinators.length > 0 && (
          <div>
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 9,
                color: "#4f8ef7",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              ◆ Coordinators ({coordinators.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {coordinators.map((coord, i) => (
                <CoordinatorCard key={coord._id || i} coordinator={coord} />
              ))}
            </div>
          </div>
        )}
        <div>
          <div
            style={{
              fontFamily: "var(--font-m)",
              fontSize: 9,
              color: "var(--text3)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 10,
            }}
          >
            ◆ Project Links
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}
          >
            {[
              {
                l: "GitHub",
                href: drawer.githubRepoLink,
                c: "#4f8ef7",
                i: <Github size={14} />,
              },
              {
                l: "Live Demo",
                href: drawer.liveHostedLink,
                c: "#22d3a0",
                i: <ExternalLink size={14} />,
              },
              {
                l: "Resources",
                href: drawer.resourcesLink,
                c: "#f5a623",
                i: <BookOpen size={14} />,
              },
              {
                l: "Community",
                href: drawer.communityLink,
                c: "#7c5cfc",
                i: <MessageSquare size={14} />,
                highlight: true,
              },
            ]
              .filter((lnk) => lnk.href)
              .map((lnk) => (
                <a
                  key={lnk.l}
                  href={lnk.href}
                  target="_blank"
                  rel="noreferrer"
                  className="card-tap"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "12px",
                    borderRadius: 12,
                    textDecoration: "none",
                    background: lnk.highlight ? "#7c5cfc12" : "var(--surface)",
                    border: `1px solid ${lnk.highlight ? "#7c5cfc30" : "var(--border)"}`,
                  }}
                >
                  <span style={{ color: lnk.c }}>{lnk.i}</span>
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-m)",
                        fontSize: 9,
                        color: "var(--text3)",
                        textTransform: "uppercase",
                      }}
                    >
                      {lnk.l}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-m)",
                        fontSize: 10,
                        color: lnk.c,
                      }}
                    >
                      Open ↗
                    </div>
                  </div>
                </a>
              ))}
          </div>
        </div>
        {drawerOpenLogs.length > 0 && (
          <div>
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 9,
                color: "#22d3a0",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              ◆ Available Tasks ({drawerOpenLogs.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {drawerOpenLogs.map((l) => (
                <LogCard
                  key={l._id}
                  log={l}
                  showClaim
                  onClaim={onClaim}
                  claiming={claiming === l._id}
                  onMarkComplete={onMarkComplete}
                  onViewDetail={onViewDetail}
                />
              ))}
            </div>
          </div>
        )}
        {myLogs.length > 0 && (
          <div>
            <div
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 9,
                color: "#f97316",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                marginBottom: 10,
              }}
            >
              ◆ My Task Logs ({myLogs.length})
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {myLogs.map((l) => (
                <LogCard
                  key={l._id}
                  log={l}
                  onMarkComplete={onMarkComplete}
                  onViewDetail={onViewDetail}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Bottom Nav ────────────────────────────────────────────────────────────────────
const BottomNav = ({ tab, setTab, TABS }) => {
  const ICONS = {
    overview: <BarChart2 size={20} />,
    projects: <Layers size={20} />,
    tasks: <Target size={20} />,
    open: <Flame size={20} />,
    // ranking: <Trophy size={20} />,  // RANKING REMOVED
  };
  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 200,
        background: "rgba(6,8,16,.92)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid var(--border)",
        paddingBottom: "env(safe-area-inset-bottom,0px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
      {TABS.map((t) => {
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="card-tap"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "10px 12px",
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: active ? "#4f8ef7" : "var(--text3)",
              minWidth: 56,
              transition: "color .2s",
            }}
          >
            {t.badge !== undefined && t.badge > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "#4f8ef7",
                  color: "#fff",
                  fontSize: 8,
                  fontFamily: "var(--font-m)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {t.badge > 99 ? "99+" : t.badge}
              </span>
            )}
            <motion.div
              animate={{ scale: active ? 1.15 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              {ICONS[t.id]}
            </motion.div>
            <span
              style={{
                fontFamily: "var(--font-m)",
                fontSize: 8,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {t.label}
            </span>
            {active && (
              <motion.div
                layoutId="nav-ind"
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 20,
                  height: 2,
                  borderRadius: 2,
                  background: "#4f8ef7",
                }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════════════
const Dashboard = () => {
  const appCtx = (() => {
    try {
      return useAppContext();
    } catch {
      return null;
    }
  })();
  const axiosInst = appCtx?.axios;
  const ctxToken = appCtx?.studentToken;
  const navigate = (() => {
    try {
      return useNavigate();
    } catch {
      return null;
    }
  })();

  const resolveToken = () =>
    ctxToken ||
    localStorage.getItem("studentToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("sToken") ||
    null;

  const authGet = async (url) => {
    const token = resolveToken();
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    if (axiosInst) return await axiosInst.get(url, { headers });
    const base = import.meta.env?.VITE_BASE_URL || "";
    const res = await fetch(`${base}${url}`, {
      headers: { ...headers, "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
  };

  const authPatch = async (url, payload = {}) => {
    const token = resolveToken();
    const headers = token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : {};
    if (axiosInst) return await axiosInst.patch(url, payload, { headers });
    const base = import.meta.env?.VITE_BASE_URL || "";
    const res = await fetch(`${base}${url}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
  };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toastData, setToastData] = useState(null);
  const [tab, setTab] = useState("overview");
  const [lFilter, setLFilter] = useState("all");
  const [claiming, setClaiming] = useState(null);
  const [drawer, setDrawer] = useState(null);
  const [completingLog, setCompletingLog] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [logDetail, setLogDetail] = useState(null);

  const boom = (message, type = "success") => setToastData({ message, type });

  const load = useCallback(async () => {
    const token = resolveToken();
    if (!token) {
      boom("Please log in to view your dashboard.", "error");
      setLoading(false);
      return;
    }
    try {
      const { data: r } = await authGet("/api/student/dashboard");
      if (r.success) setData(r);
      else boom(r.message || "Failed to load.", "error");
    } catch (e) {
      boom(e?.response?.data?.message || "Failed to load dashboard.", "error");
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, [ctxToken]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    document.body.style.overflow = drawer || logDetail ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer, logDetail]);

  const handleSync = async () => {
    setSyncing(true);
    await load();
  };
  const handleClaim = async (logId) => {
    setClaiming(logId);
    try {
      const { data: r } = await authPatch(
        `/api/student/logs/${logId}/self-assign`,
      );
      if (r.success) {
        boom(r.message, "success");
        await load();
      } else boom(r.message || "Failed.", "error");
    } catch (e) {
      boom(e?.response?.data?.message || "Failed.", "error");
    } finally {
      setClaiming(null);
    }
  };
  const handleMarkComplete = async (logId, formPayload) => {
    try {
      const { data: r } = await authPatch(
        `/api/student/logs/${logId}/complete`,
        formPayload,
      );
      if (r.success) {
        boom("Submitted for review!", "success");
        setCompletingLog(null);
        await load();
      } else boom(r.message || "Failed.", "error");
    } catch (e) {
      boom(e?.response?.data?.message || "Failed.", "error");
    }
  };

  const logs = data?.student?.logs || [];
  const LC = {
    all: logs.length,
    assigned: logs.filter(
      (l) => l.task_status === "assigned" || l.task_status === "pending",
    ).length,
    completed: logs.filter((l) => l.task_status === "completed").length,
    terminated: logs.filter((l) => l.task_status === "terminated").length,
  };
  const fLogs =
    lFilter === "all"
      ? logs
      : logs.filter((l) => {
          if (lFilter === "assigned")
            return l.task_status === "assigned" || l.task_status === "pending";
          return l.task_status === lFilter;
        });

  // RANKING REMOVED: `ranking` destructured but not used in UI
  const { student, stats, projects, openLogs /*, ranking */ } = data || {};

  // RANKING REMOVED: "ranking" tab removed from TABS array
  const TABS = [
    { id: "overview", label: "Home" },
    { id: "projects", label: "Projects", badge: stats?.totalProjects },
    { id: "tasks", label: "Tasks", badge: LC.all },
    { id: "open", label: "Open", badge: openLogs?.length },
    // { id: "ranking", label: "Ranks" },  // RANKING REMOVED
  ];

  // ── Loading ──
  if (loading)
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 20,
          background: "var(--bg)",
        }}
      >
        <style>{GLOBAL_STYLES}</style>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          style={{
            width: 50,
            height: 50,
            borderRadius: 14,
            background: "linear-gradient(135deg,#4f8ef7,#7c5cfc)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            color: "#fff",
          }}
        >
          ◎
        </motion.div>
        <p
          style={{
            fontFamily: "var(--font-m)",
            fontSize: 11,
            color: "var(--text3)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Loading dashboard…
        </p>
      </div>
    );

  if (!resolveToken() && !data)
    return (
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          padding: 24,
          background: "var(--bg)",
        }}
      >
        <style>{GLOBAL_STYLES}</style>
        <div style={{ fontSize: 48, opacity: 0.1 }}>◎</div>
        <h1
          style={{
            fontFamily: "var(--font-d)",
            fontWeight: 800,
            color: "var(--text)",
            fontSize: "clamp(18px,5vw,24px)",
            margin: 0,
            textAlign: "center",
          }}
        >
          Not Logged In
        </h1>
        <p
          style={{
            fontFamily: "var(--font-m)",
            fontSize: 12,
            color: "var(--text3)",
            textAlign: "center",
            margin: 0,
          }}
        >
          Please log in to access your dashboard.
        </p>
        {navigate && (
          <button
            onClick={() => navigate("/register")}
            style={{
              padding: "12px 28px",
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background: "linear-gradient(135deg,#4f8ef7,#7c5cfc)",
              color: "#fff",
              fontFamily: "var(--font-d)",
              fontWeight: 700,
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <LogIn size={16} /> Go to Login
          </button>
        )}
      </div>
    );

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div
        style={{
          minHeight: "100dvh",
          background: "var(--bg)",
          color: "var(--text)",
        }}
      >
        {/* Ambient bg */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -200,
              left: "15%",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,#4f8ef708 0%,transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -200,
              right: "5%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,#7c5cfc08 0%,transparent 70%)",
            }}
          />
        </div>

        {/* TOP NAV */}
        <nav
          className="glass"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            height: 56,
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "linear-gradient(135deg,#4f8ef7,#7c5cfc)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: "#fff",
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              ◎
            </div>
            <div
              className="sm-live"
              style={{
                display: "none",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 20,
                background: "#22d3a015",
                border: "1px solid #22d3a030",
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#22d3a0",
                  boxShadow: "0 0 6px #22d3a0",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-m)",
                  fontSize: 10,
                  color: "#22d3a0",
                  fontWeight: 700,
                }}
              >
                Live
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleSync}
              className="card-tap"
              style={{
                padding: "6px 12px",
                borderRadius: 10,
                cursor: "pointer",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                color: "var(--text2)",
                fontSize: 11,
                fontFamily: "var(--font-m)",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />{" "}
              Sync
            </motion.button>
            {student && (
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Av name={student.name} size={32} />
                {/* RANKING REMOVED: rank sub-text replaced with points */}
                <div className="sm-name" style={{ display: "none" }}>
                  <div
                    style={{
                      fontFamily: "var(--font-d)",
                      fontWeight: 700,
                      color: "var(--text)",
                      fontSize: 12,
                    }}
                  >
                    {student.name?.split(" ")[0]}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 9,
                      color: "#f5a623",
                    }}
                  >
                    ⬡ {stats?.totalPoints ?? 0} pts
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* DESKTOP TABS */}
        <div
          className="sm-tabs glass"
          style={{
            display: "none",
            position: "sticky",
            top: 56,
            zIndex: 90,
            borderBottom: "1px solid var(--border)",
            padding: "0 16px",
            gap: 0,
            overflowX: "auto",
          }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "12px 16px",
                background: "none",
                cursor: "pointer",
                fontFamily: "var(--font-m)",
                fontWeight: 700,
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                whiteSpace: "nowrap",
                color: tab === t.id ? "#4f8ef7" : "var(--text3)",
                borderBottom:
                  tab === t.id ? "2px solid #4f8ef7" : "2px solid transparent",
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
                transition: "color .2s",
                marginBottom: -1,
              }}
            >
              {t.label}
              {t.badge !== undefined && (
                <span
                  style={{
                    padding: "1px 7px",
                    borderRadius: 100,
                    background: tab === t.id ? "#4f8ef718" : "var(--surface2)",
                    color: tab === t.id ? "#4f8ef7" : "var(--text3)",
                    fontSize: 9,
                    fontFamily: "var(--font-m)",
                  }}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* CONTENT */}
        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: 1200,
            margin: "0 auto",
            padding: "16px 12px",
            paddingBottom: "calc(env(safe-area-inset-bottom,0px) + 88px)",
          }}
        >
          {/* HERO */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              borderRadius: 20,
              overflow: "hidden",
              marginBottom: 20,
              background: "linear-gradient(135deg,#0d1526 0%,#0a0d16 100%)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              style={{
                height: 3,
                background: "linear-gradient(90deg,#4f8ef7,#7c5cfc,#f05252)",
              }}
            />
            <div style={{ padding: 16 }}>
              {/* Profile */}
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 14,
                }}
              >
                <Av name={student?.name || ""} size={52} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      flexWrap: "wrap",
                      marginBottom: 4,
                    }}
                  >
                    <h1
                      style={{
                        fontFamily: "var(--font-d)",
                        fontWeight: 800,
                        color: "var(--text)",
                        margin: 0,
                        fontSize: "clamp(16px,4.5vw,22px)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2,
                      }}
                    >
                      {student?.name}
                    </h1>
                    <span
                      style={{
                        padding: "3px 10px",
                        borderRadius: 100,
                        fontSize: 10,
                        fontFamily: "var(--font-m)",
                        fontWeight: 600,
                        ...(student?.isBlocked
                          ? {
                              background: "#200808",
                              color: "#f05252",
                              border: "1px solid #f0525228",
                            }
                          : {
                              background: "#071c14",
                              color: "#22d3a0",
                              border: "1px solid #22d3a028",
                            }),
                      }}
                    >
                      {student?.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 11,
                      color: "var(--text3)",
                      marginBottom: 8,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {student?.email}
                  </div>
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                    {student?.branch && (
                      <Tag color="#4f8ef7">{student.branch}</Tag>
                    )}
                    {student?.department && (
                      <Tag color="#7c5cfc">{student.department}</Tag>
                    )}
                    {student?.program && (
                      <Tag color="#f5a623">{student.program}</Tag>
                    )}
                  </div>
                  {student?.githubLink && (
                    <a
                      href={student.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 5,
                        marginTop: 8,
                        textDecoration: "none",
                        color: "#4f8ef7",
                        fontSize: 11,
                        fontFamily: "var(--font-m)",
                      }}
                    >
                      <Github size={12} /> GitHub ↗
                    </a>
                  )}
                </div>

                {/* RANKING REMOVED: Rank badge replaced with Points badge */}
                <div
                  style={{
                    textAlign: "center",
                    borderRadius: 14,
                    padding: "12px 16px",
                    border: "1px solid var(--border)",
                    background: "var(--surface2)",
                    flexShrink: 0,
                    marginLeft: "auto",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 8,
                      color: "var(--text3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      marginBottom: 4,
                    }}
                  >
                    Points
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-d)",
                      fontWeight: 900,
                      fontSize: "clamp(22px,6vw,30px)",
                      color: "#f5a623",
                      lineHeight: 1,
                    }}
                  >
                    {stats?.totalPoints ?? 0}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 9,
                      color: "var(--text3)",
                      marginTop: 4,
                    }}
                  >
                    earned
                  </div>
                </div>
              </div>

              {/* Stats Strip */}
              <div
                style={{
                  display: "grid",
                  gap: 6,
                  gridTemplateColumns: "repeat(4,1fr)",
                  marginBottom: 8,
                }}
              >
                {[
                  { l: "Score", v: stats?.totalScore, c: "#f5a623" },
                  { l: "Points", v: stats?.totalPoints, c: "#f05252" },
                  { l: "Projects", v: stats?.totalProjects, c: "#4f8ef7" },
                  { l: "Logs", v: stats?.totalLogs, c: "#7c5cfc" },
                ].map((s) => (
                  <div
                    key={s.l}
                    style={{
                      textAlign: "center",
                      padding: "10px 4px",
                      borderRadius: 12,
                      background: "var(--surface3)",
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--font-d)",
                        fontWeight: 800,
                        fontSize: "clamp(14px,4vw,18px)",
                        color: s.c,
                        lineHeight: 1,
                      }}
                    >
                      {s.v ?? 0}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-m)",
                        fontSize: 8,
                        color: "var(--text3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginTop: 3,
                      }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {[
                  { l: "Done", v: stats?.completedLogs, c: "#22d3a0" },
                  { l: "Active", v: stats?.assignedLogs, c: "#f5a623" },
                  {
                    l: "Rate",
                    v: `${stats?.completionRate ?? 0}%`,
                    c: "#4f8ef7",
                  },
                ].map((s) => (
                  <div
                    key={s.l}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "5px 12px",
                      borderRadius: 10,
                      background: `${s.c}12`,
                      border: `1px solid ${s.c}25`,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-d)",
                        fontWeight: 700,
                        fontSize: 13,
                        color: s.c,
                      }}
                    >
                      {s.v ?? 0}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-m)",
                        fontSize: 9,
                        color: "var(--text3)",
                        textTransform: "uppercase",
                      }}
                    >
                      {s.l}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ── OVERVIEW ── */}
          {tab === "overview" && (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {(projects || []).filter((p) => p.communityLink).length > 0 && (
                <div>
                  <SH
                    title="Community Spaces"
                    accent="#7c5cfc"
                    count={
                      (projects || []).filter((p) => p.communityLink).length
                    }
                  />
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: 8 }}
                  >
                    {(projects || [])
                      .filter((p) => p.communityLink)
                      .map((p) => (
                        <CommunityBanner
                          key={p._id}
                          link={p.communityLink}
                          projectTitle={p.problem?.title}
                        />
                      ))}
                  </div>
                </div>
              )}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2,1fr)",
                  gap: 10,
                }}
              >
                <Brick
                  icon={<Star size={15} />}
                  label="Total Score"
                  value={stats?.totalScore}
                  accent="#f5a623"
                  delay={0}
                />
                <Brick
                  icon={<Zap size={15} />}
                  label="Points"
                  value={stats?.totalPoints}
                  accent="#f05252"
                  delay={0.05}
                />
                <Brick
                  icon={<CheckCircle size={15} />}
                  label="Tasks Done"
                  value={stats?.completedLogs}
                  accent="#22d3a0"
                  delay={0.1}
                />
                <Brick
                  icon={<Clock size={15} />}
                  label="Active"
                  value={stats?.assignedLogs}
                  accent="#f97316"
                  sub={stats?.assignedLogs > 0 ? "In progress" : "All clear"}
                  delay={0.15}
                />
              </div>
              <div>
                <SH
                  title="My Projects"
                  accent="#4f8ef7"
                  count={projects?.length}
                  action={() => setTab("projects")}
                  actionLabel="All →"
                />
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill,minmax(min(100%,280px),1fr))",
                    gap: 12,
                  }}
                >
                  {(projects || []).slice(0, 4).map((p) => (
                    <ProjCard key={p._id} p={p} onClick={() => setDrawer(p)} />
                  ))}
                  {!projects?.length && (
                    <div
                      style={{
                        gridColumn: "1/-1",
                        textAlign: "center",
                        padding: "48px 0",
                        borderRadius: 16,
                        border: "1px dashed var(--border)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 32,
                          opacity: 0.08,
                          marginBottom: 10,
                        }}
                      >
                        ◉
                      </div>
                      <p
                        style={{
                          fontFamily: "var(--font-m)",
                          fontSize: 12,
                          color: "var(--text3)",
                          margin: 0,
                        }}
                      >
                        No projects joined yet.
                      </p>
                    </div>
                  )}
                </div>
              </div>
              {LC.assigned > 0 && (
                <div>
                  <SH
                    title="Active Tasks"
                    accent="#f5a623"
                    count={LC.assigned}
                    action={() => {
                      setTab("tasks");
                      setLFilter("assigned");
                    }}
                    actionLabel="View all →"
                  />
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {logs
                      .filter(
                        (l) =>
                          l.task_status === "assigned" ||
                          l.task_status === "pending",
                      )
                      .slice(0, 3)
                      .map((l) => (
                        <LogCard
                          key={l._id}
                          log={l}
                          onMarkComplete={setCompletingLog}
                          onViewDetail={setLogDetail}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* RANKING REMOVED: Leaderboard snippet section removed */}

              {/* Available tasks */}
              <div
                style={{
                  borderRadius: 18,
                  overflow: "hidden",
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                }}
              >
                <div style={{ padding: "16px 16px 10px" }}>
                  <SH
                    title="Available Tasks"
                    accent="#22d3a0"
                    count={openLogs?.length}
                  />
                </div>
                <div
                  style={{
                    padding: "0 12px 14px",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {(openLogs || []).slice(0, 3).map((l) => (
                    <LogCard
                      key={l._id}
                      log={l}
                      showClaim
                      onClaim={handleClaim}
                      claiming={claiming === l._id}
                      onMarkComplete={setCompletingLog}
                      onViewDetail={setLogDetail}
                    />
                  ))}
                  {!openLogs?.length && (
                    <div style={{ textAlign: "center", padding: "32px 0" }}>
                      <p
                        style={{
                          fontFamily: "var(--font-m)",
                          fontSize: 11,
                          color: "var(--text3)",
                          margin: 0,
                        }}
                      >
                        No open tasks available.
                      </p>
                    </div>
                  )}
                </div>
                {openLogs?.length > 3 && (
                  <div
                    style={{
                      padding: "12px 14px",
                      borderTop: "1px solid var(--border)",
                    }}
                  >
                    <button
                      onClick={() => setTab("open")}
                      className="card-tap"
                      style={{
                        width: "100%",
                        padding: "10px 0",
                        borderRadius: 10,
                        cursor: "pointer",
                        background: "#22d3a010",
                        border: "1px solid #22d3a028",
                        color: "#22d3a0",
                        fontFamily: "var(--font-m)",
                        fontWeight: 700,
                        fontSize: 11,
                      }}
                    >
                      See all {openLogs.length} tasks →
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── PROJECTS ── */}
          {tab === "projects" && (
            <div>
              <SH
                title="All Projects"
                accent="#4f8ef7"
                count={projects?.length}
              />
              {!projects?.length ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "64px 0",
                    borderRadius: 16,
                    border: "1px dashed var(--border)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 13,
                      color: "var(--text3)",
                      margin: 0,
                    }}
                  >
                    No projects joined yet.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill,minmax(min(100%,280px),1fr))",
                    gap: 12,
                  }}
                >
                  {(projects || []).map((p) => (
                    <ProjCard key={p._id} p={p} onClick={() => setDrawer(p)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── MY TASKS ── */}
          {tab === "tasks" && (
            <div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 16,
                  overflowX: "auto",
                  paddingBottom: 4,
                  scrollbarWidth: "none",
                }}
              >
                {Object.entries(LC).map(([k, c]) => (
                  <button
                    key={k}
                    onClick={() => setLFilter(k)}
                    className="card-tap"
                    style={{
                      flexShrink: 0,
                      padding: "7px 14px",
                      borderRadius: 10,
                      cursor: "pointer",
                      fontFamily: "var(--font-m)",
                      fontWeight: 700,
                      fontSize: 11,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      background: lFilter === k ? "#4f8ef7" : "var(--surface)",
                      color: lFilter === k ? "#fff" : "var(--text3)",
                      border: `1px solid ${lFilter === k ? "#4f8ef7" : "var(--border)"}`,
                    }}
                  >
                    {k} ({c})
                  </button>
                ))}
              </div>
              {fLogs.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "64px 0",
                    borderRadius: 16,
                    border: "1px dashed var(--border)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 12,
                      color: "var(--text3)",
                      margin: 0,
                    }}
                  >
                    No logs in this category.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill,minmax(min(100%,340px),1fr))",
                    gap: 12,
                  }}
                >
                  {fLogs.map((l) => (
                    <LogCard
                      key={l._id}
                      log={l}
                      onMarkComplete={setCompletingLog}
                      onViewDetail={setLogDetail}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── OPEN TASKS ── */}
          {tab === "open" && (
            <div>
              <SH
                title="Available Tasks"
                accent="#22d3a0"
                count={openLogs?.length}
              />
              <p
                style={{
                  fontFamily: "var(--font-m)",
                  fontSize: 11,
                  color: "var(--text3)",
                  marginBottom: 16,
                }}
              >
                Claim a task to start the deadline clock.{" "}
                <span style={{ color: "#f5a623", fontWeight: 700 }}>
                  Max 5 active at a time.
                </span>
              </p>
              {!openLogs?.length ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "64px 0",
                    borderRadius: 16,
                    border: "1px dashed var(--border)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-m)",
                      fontSize: 12,
                      color: "var(--text3)",
                      margin: 0,
                    }}
                  >
                    No open tasks right now.
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill,minmax(min(100%,340px),1fr))",
                    gap: 12,
                  }}
                >
                  {(openLogs || []).map((l) => (
                    <LogCard
                      key={l._id}
                      log={l}
                      showClaim
                      onClaim={handleClaim}
                      claiming={claiming === l._id}
                      onMarkComplete={setCompletingLog}
                      onViewDetail={setLogDetail}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RANKING TAB CONTENT REMOVED */}
          {/*
          {tab === "ranking" && ( ... )} 
          */}
        </div>

        {/* Mobile Bottom Nav */}
        <BottomNav tab={tab} setTab={setTab} TABS={TABS} />

        {/* Project Drawer */}
        <AnimatePresence>
          {drawer && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawer(null)}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 400,
                  background: "rgba(0,0,0,.75)",
                  backdropFilter: "blur(8px)",
                }}
              />
              <ProjectDrawer
                drawer={drawer}
                logs={logs}
                openLogs={openLogs}
                claiming={claiming}
                onClaim={handleClaim}
                onClose={() => setDrawer(null)}
                onMarkComplete={setCompletingLog}
                onViewDetail={setLogDetail}
              />
            </>
          )}
        </AnimatePresence>

        {/* Log Detail Drawer */}
        <AnimatePresence>
          {logDetail && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLogDetail(null)}
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 550,
                  background: "rgba(0,0,0,.75)",
                  backdropFilter: "blur(8px)",
                }}
              />
              <LogDetailDrawer
                log={logDetail}
                onClose={() => setLogDetail(null)}
                onMarkComplete={(log) => {
                  setLogDetail(null);
                  setCompletingLog(log);
                }}
                onClaim={handleClaim}
                claiming={claiming === logDetail._id}
              />
            </>
          )}
        </AnimatePresence>

        {toastData && (
          <ToastBar {...toastData} onDone={() => setToastData(null)} />
        )}
        <AnimatePresence>
          {completingLog && (
            <MarkCompleteModal
              log={completingLog}
              onClose={() => setCompletingLog(null)}
              onSubmit={handleMarkComplete}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Dashboard;
