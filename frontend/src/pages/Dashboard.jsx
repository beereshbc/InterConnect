import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

// ─── Utils ────────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const daysLeft = (deadline) => {
  if (!deadline) return null;
  return Math.ceil((new Date(deadline) - new Date()) / 864e5);
};

const initials = (n = "") =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

const PALETTE = [
  "#e85d3a",
  "#3a9de8",
  "#9c3ae8",
  "#e8a33a",
  "#3ae87c",
  "#e83a8c",
];
const avatarBg = (n = "") => {
  let h = 0;
  for (let i = 0; i < n.length; i++) h = n.charCodeAt(i) + ((h << 5) - h);
  return PALETTE[Math.abs(h) % PALETTE.length];
};

// ─── Status tokens ────────────────────────────────────────────────────────────
const ST = {
  open: {
    bg: "#0d1f3c",
    txt: "#3a9de8",
    border: "#3a9de835",
    dot: "#3a9de8",
    label: "Open",
  },
  assigned: {
    bg: "#2a1c08",
    txt: "#fbbf24",
    border: "#fbbf2435",
    dot: "#fbbf24",
    label: "Assigned",
  },
  completed: {
    bg: "#08271a",
    txt: "#4ade80",
    border: "#4ade8035",
    dot: "#4ade80",
    label: "Completed",
  },
  terminated: {
    bg: "#280a0a",
    txt: "#f87171",
    border: "#f8717135",
    dot: "#f87171",
    label: "Terminated",
  },
};

// ─── Primitives ───────────────────────────────────────────────────────────────
const Av = ({ name = "", size = 36 }) => (
  <div
    className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0 font-mono"
    style={{
      width: size,
      height: size,
      background: avatarBg(name),
      fontSize: size * 0.34,
    }}
  >
    {initials(name)}
  </div>
);

const Chip = ({ status }) => {
  const s = ST[status] || ST.open;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-mono font-bold uppercase tracking-widest text-[10px] whitespace-nowrap"
      style={{
        background: s.bg,
        color: s.txt,
        border: `1px solid ${s.border}`,
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: s.dot }}
      />
      {s.label}
    </span>
  );
};

const Tag = ({ children, color = "#3a9de8" }) => (
  <span
    className="inline-block rounded px-2.5 py-px font-mono font-bold uppercase tracking-widest text-[10px]"
    style={{ color, background: `${color}18`, border: `1px solid ${color}38` }}
  >
    {children}
  </span>
);

const ToastBar = ({ message, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3400);
    return () => clearTimeout(t);
  }, []);
  const c =
    { success: "#4ade80", error: "#f87171", warn: "#fbbf24" }[type] ||
    "#4ade80";
  return (
    <div
      className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2.5 px-5 py-3 rounded-xl font-mono text-[13px]"
      style={{
        background: "#0c0f18",
        border: `1px solid ${c}38`,
        borderLeft: `3px solid ${c}`,
        color: "#f0f4ff",
        boxShadow: "0 10px 40px rgba(0,0,0,.8)",
        animation: "slideUp .25s ease",
      }}
    >
      <span style={{ color: c }}>
        {type === "error" ? "✕" : type === "warn" ? "⚠" : "✓"}
      </span>
      {message}
    </div>
  );
};

const SH = ({ title, accent = "#3a9de8", count, action, actionLabel }) => (
  <div className="flex items-center gap-3 mb-4">
    <div
      className="w-[3px] h-5 rounded-sm flex-shrink-0"
      style={{ background: accent }}
    />
    <span
      className="font-display font-extrabold text-[14px]"
      style={{ color: "#f0f4ff" }}
    >
      {title}
    </span>
    {count !== undefined && (
      <span
        className="font-mono text-[10px] px-2 py-px rounded"
        style={{
          background: `${accent}18`,
          color: accent,
          border: `1px solid ${accent}28`,
        }}
      >
        {count}
      </span>
    )}
    <div className="flex-1 h-px" style={{ background: "#1e2330" }} />
    {action && (
      <button
        onClick={action}
        className="font-mono text-[10px] cursor-pointer bg-transparent border-none"
        style={{ color: accent }}
      >
        {actionLabel || "View all →"}
      </button>
    )}
  </div>
);

const Brick = ({ icon, label, value, accent, sub }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className="relative rounded-2xl overflow-hidden"
    style={{
      background: "#0c0f18",
      border: `1px solid ${accent}1a`,
      padding: "18px 20px",
    }}
  >
    <div
      className="absolute -top-6 -right-6 w-16 h-16 rounded-full pointer-events-none"
      style={{ background: `${accent}0c`, filter: "blur(16px)" }}
    />
    <div className="relative z-10">
      <div className="text-lg mb-2.5" style={{ color: accent }}>
        {icon}
      </div>
      <div
        className="font-display font-extrabold leading-none mb-1"
        style={{ fontSize: 28, color: "#f0f4ff" }}
      >
        {value}
      </div>
      <div
        className="font-mono text-[10px] uppercase tracking-widest"
        style={{ color: "#6b7a99" }}
      >
        {label}
      </div>
      {sub && (
        <div className="font-mono text-[9px] mt-0.5" style={{ color: accent }}>
          {sub}
        </div>
      )}
    </div>
  </motion.div>
);

const LogCard = ({ log, showClaim = false, onClaim, claiming = false }) => {
  const days = daysLeft(log.deadlineAt);
  const overdue = log.task_status === "assigned" && days !== null && days <= 0;
  const st = ST[overdue ? "terminated" : log.task_status] || ST.open;
  const proj = log.projectId?.problem?.title || log.projectId?.projectID || "—";

  return (
    <div
      className="rounded-xl p-4 transition-all"
      style={{
        background: "#0c0f18",
        border: `1px solid ${st.border}`,
        borderLeft: `2.5px solid ${st.dot}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div
            className="font-display font-bold text-[13px] leading-tight truncate mb-0.5"
            style={{ color: "#f0f4ff" }}
          >
            {log.taskTitle}
          </div>
          <div className="font-mono text-[10px]" style={{ color: "#6b7a99" }}>
            {proj} · {fmtDate(log.createdAt)}
          </div>
        </div>
        <Chip status={overdue ? "terminated" : log.task_status} />
      </div>

      {log.description && (
        <p
          className="font-mono text-[11px] leading-relaxed mb-2.5"
          style={{
            color: "#8892a4",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {log.description}
        </p>
      )}

      <div className="flex flex-wrap gap-3 items-center text-[11px] font-mono">
        <span style={{ color: "#fbbf24" }}>
          ⬡ {log.assignedTaskPoints ?? 0} pts
        </span>
        {log.deadlineDays && (
          <span style={{ color: "#6b7a99" }}>⏱ {log.deadlineDays}d window</span>
        )}
        {log.task_status === "assigned" && log.deadlineAt && (
          <span
            style={{
              color: days <= 0 ? "#f87171" : days <= 2 ? "#fb923c" : "#8892a4",
              fontWeight: days <= 2 ? "bold" : "normal",
            }}
          >
            {days <= 0 ? "⚠ Overdue" : `${days}d left`}
          </span>
        )}
        {log.task_status === "completed" && log.closedAt && (
          <span style={{ color: "#4ade80" }}>✓ {fmtDate(log.closedAt)}</span>
        )}
        {log.githubIssueLink && (
          <a
            href={log.githubIssueLink}
            target="_blank"
            rel="noreferrer"
            className="ml-auto no-underline hover:opacity-75 transition-opacity"
            style={{ color: "#3a9de8" }}
          >
            Issue ↗
          </a>
        )}
        {log.githubPrLink && (
          <a
            href={log.githubPrLink}
            target="_blank"
            rel="noreferrer"
            className="no-underline hover:opacity-75 transition-opacity"
            style={{ color: "#4ade80" }}
          >
            PR ↗
          </a>
        )}
      </div>

      {log.requirements && (
        <details className="mt-2.5 group">
          <summary
            className="font-mono text-[10px] cursor-pointer list-none flex items-center gap-1 select-none"
            style={{ color: "#6b7a99" }}
          >
            <span className="group-open:rotate-90 transition-transform inline-block">
              ▶
            </span>{" "}
            Requirements
          </summary>
          <p
            className="font-mono text-[11px] leading-relaxed mt-1.5 pl-3"
            style={{
              color: "#8892a4",
              borderLeft: "1px solid #1e2330",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {log.requirements}
          </p>
        </details>
      )}

      {showClaim && log.task_status === "open" && (
        <button
          onClick={() => onClaim(log._id)}
          disabled={claiming}
          className="mt-3 w-full py-2 rounded-lg font-display font-bold text-[12px] tracking-wide cursor-pointer disabled:opacity-50 transition-all flex justify-center items-center gap-2 hover:bg-[#4ade8020]"
          style={{
            background: "#08251a",
            border: "1px solid #4ade8038",
            color: "#4ade80",
          }}
        >
          {claiming ? "Initiating..." : "✋ I'm Interested — Initiate Task"}
        </button>
      )}
    </div>
  );
};

const ProjCard = ({ p, onClick }) => {
  const done = p.myTasksDone ?? 0;
  const active = p.myTasksActive ?? 0;
  const total = p.myLogs?.length ?? 0;
  return (
    <motion.div
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      onClick={onClick}
      className="rounded-2xl p-5 cursor-pointer transition-all"
      style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#3a9de838")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e2330")}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-[11px] flex-shrink-0"
          style={{
            background: "#3a9de815",
            border: "1px solid #3a9de828",
            color: "#3a9de8",
          }}
        >
          {p.projectID?.slice(-3)}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-display font-bold text-[13px] leading-tight truncate"
            style={{ color: "#f0f4ff" }}
          >
            {p.problem?.title || "—"}
          </div>
          <div
            className="font-mono text-[10px] mt-0.5"
            style={{ color: "#6b7a99" }}
          >
            {p.projectID}
          </div>
        </div>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-3">
        {p.problem?.theme && <Tag color="#9c3ae8">{p.problem.theme}</Tag>}
        {p.problem?.category && <Tag color="#3a9de8">{p.problem.category}</Tag>}
        {p.myRole && <Tag color="#fbbf24">{p.myRole}</Tag>}
      </div>
      <div className="mb-3">
        <div
          className="flex justify-between font-mono text-[10px] mb-1"
          style={{ color: "#6b7a99" }}
        >
          <span>{p.projectProgressRate ?? 0}% overall</span>
          <span>
            {done}/{total} my tasks
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "#1e2330" }}
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${p.projectProgressRate ?? 0}%`,
              background: "#3a9de8",
              boxShadow: "0 0 6px #3a9de860",
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {[
          ["My Score", p.myScore, "#fbbf24"],
          ["Active", active, "#fb923c"],
          ["Done", done, "#4ade80"],
        ].map(([l, v, c]) => (
          <div
            key={l}
            className="text-center py-1.5 rounded-lg"
            style={{ background: "#131825" }}
          >
            <div
              className="font-display text-[15px] font-extrabold"
              style={{ color: c }}
            >
              {v}
            </div>
            <div
              className="font-mono text-[8px] uppercase tracking-widest"
              style={{ color: "#6b7a99" }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

const RRow = ({ rank, name, score, dept, isMe }) => {
  const medal = ["🥇", "🥈", "🥉"][rank - 1];
  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all"
      style={{
        background: isMe ? "#18110a" : "transparent",
        border: isMe ? "1px solid #fbbf2428" : "1px solid transparent",
      }}
    >
      <div
        className="w-7 text-center font-mono text-[12px] font-bold flex-shrink-0"
        style={{ color: isMe ? "#fbbf24" : "#6b7a99" }}
      >
        {medal || `#${rank}`}
      </div>
      <Av name={name} size={26} />
      <div className="flex-1 min-w-0">
        <div
          className="font-display font-bold text-[12px] truncate"
          style={{ color: isMe ? "#fbbf24" : "#f0f4ff" }}
        >
          {name}
          {isMe && (
            <span
              className="font-mono text-[8px] ml-1"
              style={{ color: "#e85d3a" }}
            >
              (you)
            </span>
          )}
        </div>
        {dept && (
          <div className="font-mono text-[9px]" style={{ color: "#6b7a99" }}>
            {dept}
          </div>
        )}
      </div>
      <div
        className="font-display font-extrabold text-[13px]"
        style={{ color: isMe ? "#fbbf24" : "#c4cedf" }}
      >
        {score}
      </div>
    </div>
  );
};

const Drawer = ({ proj, myLogs, openLogs, claiming, onClaim, onClose }) => (
  <motion.div
    initial={{ x: 60, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: 60, opacity: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="fixed top-0 right-0 h-screen w-full max-w-[420px] overflow-y-auto z-[500] shadow-2xl"
    style={{ background: "#0a0d16", borderLeft: "1px solid #252d3e" }}
  >
    <div
      className="sticky top-0 z-10 flex items-center justify-between px-6 py-4"
      style={{
        background: "#0a0d16cc",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid #1e2330",
      }}
    >
      <div>
        <div
          className="font-mono text-[9px] uppercase tracking-widest"
          style={{ color: "#3a9de8" }}
        >
          {proj.projectID}
        </div>
        <div
          className="font-display font-extrabold text-[14px] leading-tight mt-0.5"
          style={{ color: "#f0f4ff" }}
        >
          {proj.problem?.title || "—"}
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer font-mono text-sm"
        style={{
          background: "#1e2330",
          border: "1px solid #252d3e",
          color: "#8892a4",
        }}
      >
        ✕
      </button>
    </div>
    <div className="p-5 space-y-5">
      <div
        className="rounded-xl p-4"
        style={{ background: "#101520", border: "1px solid #1e2330" }}
      >
        <div
          className="font-mono text-[9px] uppercase tracking-widest font-bold mb-3"
          style={{ color: "#3a9de8" }}
        >
          ◆ My Contribution
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[
            ["Score", proj.myScore, "#fbbf24"],
            ["Done", proj.myTasksDone, "#4ade80"],
            ["Active", proj.myTasksActive, "#fb923c"],
          ].map(([l, v, c]) => (
            <div
              key={l}
              className="text-center py-2 rounded-lg"
              style={{ background: "#0c0f18" }}
            >
              <div
                className="font-display text-[17px] font-extrabold"
                style={{ color: c }}
              >
                {v}
              </div>
              <div
                className="font-mono text-[9px] uppercase"
                style={{ color: "#6b7a99" }}
              >
                {l}
              </div>
            </div>
          ))}
        </div>
        {proj.myRole && (
          <div className="font-mono text-[11px]" style={{ color: "#9c3ae8" }}>
            Role: <span style={{ color: "#f0f4ff" }}>{proj.myRole}</span>
          </div>
        )}
        {proj.myDescription && (
          <p
            className="font-mono text-[11px] mt-1 leading-relaxed"
            style={{ color: "#8892a4" }}
          >
            {proj.myDescription}
          </p>
        )}
      </div>

      <div
        className="rounded-xl p-4"
        style={{ background: "#101520", border: "1px solid #1e2330" }}
      >
        <div
          className="flex justify-between font-mono text-[10px] mb-2"
          style={{ color: "#6b7a99" }}
        >
          <span>Overall Progress</span>
          <span style={{ color: "#3a9de8" }}>
            {proj.projectProgressRate ?? 0}%
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: "#1e2330" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${proj.projectProgressRate ?? 0}%`,
              background: "#3a9de8",
              boxShadow: "0 0 8px #3a9de860",
            }}
          />
        </div>
        <div
          className="flex justify-between font-mono text-[10px] mt-2"
          style={{ color: "#6b7a99" }}
        >
          <span>{proj.contributors?.length ?? 0} contributors</span>
          <span>{proj.is_blocked ? "🔒 Blocked" : "🟢 Active"}</span>
        </div>
      </div>

      <div>
        <div
          className="font-mono text-[9px] uppercase tracking-widest font-bold mb-2.5"
          style={{ color: "#6b7a99" }}
        >
          ◆ Project Links
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              l: "GitHub Repo",
              href: proj.githubRepoLink,
              c: "#3a9de8",
              i: "⌥",
            },
            { l: "Live Demo", href: proj.liveHostedLink, c: "#4ade80", i: "◉" },
            { l: "Resources", href: proj.resourcesLink, c: "#fbbf24", i: "📁" },
            { l: "Community", href: proj.communityLink, c: "#9c3ae8", i: "💬" },
          ]
            .filter((lnk) => lnk.href)
            .map((lnk) => (
              <a
                key={lnk.l}
                href={lnk.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl p-3 no-underline hover:opacity-80 transition-opacity"
                style={{ background: "#101520", border: "1px solid #1e2330" }}
              >
                <span className="text-base">{lnk.i}</span>
                <div>
                  <div
                    className="font-mono text-[9px] uppercase tracking-widest"
                    style={{ color: "#6b7a99" }}
                  >
                    {lnk.l}
                  </div>
                  <div
                    className="font-mono text-[10px] mt-px"
                    style={{ color: lnk.c }}
                  >
                    Open ↗
                  </div>
                </div>
              </a>
            ))}
        </div>
      </div>

      {proj.problem?.tags?.length > 0 && (
        <div className="flex gap-1.5 flex-wrap">
          {proj.problem.tags.map((t) => (
            <Tag key={t} color="#6b7a99">
              {t}
            </Tag>
          ))}
        </div>
      )}

      {openLogs?.length > 0 && (
        <div>
          <div
            className="font-mono text-[9px] uppercase tracking-widest font-bold mb-3"
            style={{ color: "#4ade80" }}
          >
            ◆ Available Tasks ({openLogs.length})
          </div>
          <div className="space-y-2.5">
            {openLogs.map((l) => (
              <LogCard
                key={l._id}
                log={l}
                showClaim
                onClaim={onClaim}
                claiming={claiming === l._id}
              />
            ))}
          </div>
        </div>
      )}

      {myLogs?.length > 0 && (
        <div>
          <div
            className="font-mono text-[9px] uppercase tracking-widest font-bold mb-3"
            style={{ color: "#e85d3a" }}
          >
            ◆ My Task Logs ({myLogs.length})
          </div>
          <div className="space-y-2.5">
            {myLogs.map((l) => (
              <LogCard key={l._id} log={l} />
            ))}
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

// ═════════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════
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

    if (axiosInst) {
      return await axiosInst.get(url, { headers });
    }

    const base = import.meta.env?.VITE_BASE_URL || "";
    const res = await fetch(`${base}${url}`, {
      headers: { ...headers, "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
  };

  const authPatch = async (url) => {
    const token = resolveToken();
    const headers = token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : {};

    if (axiosInst) {
      return await axiosInst.patch(url, {}, { headers });
    }

    const base = import.meta.env?.VITE_BASE_URL || "";
    const res = await fetch(`${base}${url}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({}),
    });
    const data = await res.json();
    if (!res.ok) throw { response: { data } };
    return { data };
  };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState("overview");
  const [lFilter, setLFilter] = useState("all");
  const [claiming, setClaiming] = useState(null);
  const [drawer, setDrawer] = useState(null);

  const boom = (message, type = "success") => setToast({ message, type });

  const load = useCallback(async () => {
    const token = resolveToken();
    if (!token) {
      boom("Please log in to view your dashboard.", "error");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const { data: r } = await authGet("/api/student/dashboard");
      if (r.success) setData(r);
      else boom(r.message || "Failed to load.", "error");
    } catch (e) {
      boom(e?.response?.data?.message || "Failed to load dashboard.", "error");
    } finally {
      setLoading(false);
    }
  }, [ctxToken]);

  useEffect(() => {
    load();
  }, []);

  const handleClaim = async (logId) => {
    setClaiming(logId);
    try {
      const { data: r } = await authPatch(
        `/api/student/logs/${logId}/self-assign`,
      );
      if (r.success) {
        boom(r.message, "success");
        await load(); // Refresh to reflect claimed status
      } else {
        boom(r.message || "Failed to initiate task.", "error");
      }
    } catch (e) {
      boom(e?.response?.data?.message || "Failed to initiate task.", "error");
    } finally {
      setClaiming(null);
    }
  };

  const logs = data?.student?.logs || [];
  const LC = {
    all: logs.length,
    assigned: logs.filter((l) => l.task_status === "assigned").length,
    completed: logs.filter((l) => l.task_status === "completed").length,
    terminated: logs.filter((l) => l.task_status === "terminated").length,
  };
  const fLogs =
    lFilter === "all" ? logs : logs.filter((l) => l.task_status === lFilter);
  const { student, stats, projects, openLogs, ranking } = data || {};

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects", badge: stats?.totalProjects },
    { id: "tasks", label: "My Tasks", badge: LC.all },
    { id: "open", label: "Available", badge: openLogs?.length },
    { id: "ranking", label: "Rankings" },
  ];

  if (loading)
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: "#" }}
      >
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');
        .font-display{font-family:'Syne',sans-serif!important}
        .font-mono{font-family:'DM Mono',monospace!important}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.94)}}
      `}</style>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-white text-2xl"
          style={{
            background: "#",
            animation: "pulse 1.5s ease-in-out infinite",
          }}
        >
          ◎
        </div>
        <p
          className="font-mono text-[11px] uppercase tracking-widest"
          style={{ color: "#6b7a99" }}
        >
          Loading dashboard…
        </p>
      </div>
    );

  if (!resolveToken() && !data)
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: "#" }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');.font-display{font-family:'Syne',sans-serif!important}.font-mono{font-family:'DM Mono',monospace!important}`}</style>
        <div className="text-5xl opacity-20">◎</div>
        <p
          className="font-display font-bold text-xl"
          style={{ color: "#f0f4ff" }}
        >
          Not Logged In
        </p>
        <p className="font-mono text-[12px]" style={{ color: "#6b7a99" }}>
          Please log in to access your dashboard.
        </p>
        {navigate && (
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2.5 rounded-xl font-display font-bold text-[13px] cursor-pointer mt-2"
            style={{ background: "#", color: "#fff", border: "none" }}
          >
            Go to Login →
          </button>
        )}
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        .font-display{font-family:'Syne',sans-serif!important}
        .font-mono{font-family:'DM Mono',monospace!important}
        *{box-sizing:border-box}
        @keyframes spin   {to{transform:rotate(360deg)}}
        @keyframes slideUp{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:#0c0f18}
        ::-webkit-scrollbar-thumb{background:#252d3e;border-radius:3px}
        details summary::-webkit-details-marker{display:none}
      `}</style>

      <div
        className="min-h-screen font-mono"
        style={{ background: "", color: "#f0f4ff" }}
      >
        {/* ambient BG */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute"
            style={{
              top: -200,
              left: "20%",
              width: 700,
              height: 700,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,#3a9de806 0%,transparent 70%)",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: -200,
              right: "5%",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,#9c3ae808 0%,transparent 70%)",
            }}
          />
        </div>

        {/* NAV */}
        <nav
          className="sticky top-0 z-[100] flex items-center justify-between px-5 h-14"
          style={{
            background: "#",
            backdropFilter: "blur(12px)",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-lg"
              style={{ background: "#4ade8014", border: "1px solid #4ade8028" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "#4ade80", boxShadow: "0 0 5px #4ade80" }}
              />
              <span
                className="font-mono font-bold text-[10px] uppercase tracking-widest"
                style={{ color: "#4ade80" }}
              >
                Live
              </span>
            </div>
            <button
              onClick={load}
              className="px-3 py-1.5 rounded-lg font-mono text-[11px] cursor-pointer transition-colors"
              style={{
                background: "#1e2330",
                border: "1px solid #252d3e",
                color: "#8892a4",
              }}
            >
              ↻ Sync
            </button>
            {student && (
              <div className="flex items-center gap-2">
                <Av name={student.name} size={28} />
                <div className="hidden sm:block">
                  <div
                    className="font-display font-bold text-[11px]"
                    style={{ color: "#f0f4ff" }}
                  >
                    {student.name?.split(" ")[0]}
                  </div>
                  <div
                    className="font-mono text-[9px]"
                    style={{ color: "#6b7a99" }}
                  >
                    #{ranking?.myRank ?? "—"} Global
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-6">
          {/* HERO CARD */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl overflow-hidden mb-6"
            style={{
              background: "linear-gradient(135deg,#0e1622 0%,#0a0d16 100%)",
              border: "1px solid #1e2330",
            }}
          >
            <div
              className="h-[3px]"
              style={{
                background: "linear-gradient(90deg,#3a9de8,#9c3ae8,#e85d3a)",
              }}
            />
            <div className="px-6 py-5">
              <div className="flex items-start gap-4 flex-wrap mb-5">
                <Av name={student?.name || ""} size={60} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap mb-1">
                    <h1
                      className="font-display font-extrabold text-[22px] leading-tight"
                      style={{ color: "#f0f4ff" }}
                    >
                      {student?.name}
                    </h1>
                    <span
                      className="font-mono text-[10px] px-2.5 py-0.5 rounded-full"
                      style={
                        student?.isBlocked
                          ? {
                              background: "#2d0a0a",
                              color: "#f87171",
                              border: "1px solid #f8717128",
                            }
                          : {
                              background: "#08221a",
                              color: "#4ade80",
                              border: "1px solid #4ade8028",
                            }
                      }
                    >
                      {student?.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                  <div
                    className="font-mono text-[12px] mb-2.5"
                    style={{ color: "#6b7a99" }}
                  >
                    {student?.email}
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {student?.branch && (
                      <Tag color="#3a9de8">{student.branch}</Tag>
                    )}
                    {student?.department && (
                      <Tag color="#9c3ae8">{student.department}</Tag>
                    )}
                    {student?.program && (
                      <Tag color="#fbbf24">{student.program}</Tag>
                    )}
                    {student?.college && (
                      <Tag color="#6b7a99">{student.college}</Tag>
                    )}
                  </div>
                </div>
                <div
                  className="text-center rounded-2xl px-5 py-3 flex-shrink-0"
                  style={{ background: "#131825", border: "1px solid #1e2330" }}
                >
                  <div
                    className="font-mono text-[8px] uppercase tracking-widest mb-0.5"
                    style={{ color: "#6b7a99" }}
                  >
                    Global Rank
                  </div>
                  <div
                    className="font-display font-extrabold"
                    style={{ fontSize: 28, color: "#fbbf24" }}
                  >
                    #{ranking?.myRank ?? "—"}
                  </div>
                  <div
                    className="font-mono text-[9px] mt-0.5"
                    style={{ color: "#6b7a99" }}
                  >
                    of {ranking?.totalStudents ?? "—"}
                  </div>
                </div>
              </div>

              {/* Stats strip */}
              <div className="grid gap-2.5 grid-cols-4 sm:grid-cols-7">
                {[
                  { l: "Score", v: stats?.totalScore, c: "#fbbf24", i: "⬡" },
                  { l: "Points", v: stats?.totalPoints, c: "#e85d3a", i: "◈" },
                  {
                    l: "Projects",
                    v: stats?.totalProjects,
                    c: "#3a9de8",
                    i: "◉",
                  },
                  {
                    l: "Total Logs",
                    v: stats?.totalLogs,
                    c: "#9c3ae8",
                    i: "◌",
                  },
                  {
                    l: "Completed",
                    v: stats?.completedLogs,
                    c: "#4ade80",
                    i: "✓",
                  },
                  {
                    l: "Active",
                    v: stats?.assignedLogs,
                    c: "#fbbf24",
                    i: "⏳",
                  },
                  {
                    l: "Rate",
                    v: `${stats?.completionRate ?? 0}%`,
                    c: "#3a9de8",
                    i: "%",
                  },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="text-center rounded-xl py-2.5"
                    style={{
                      background: "#0c0f18",
                      border: "1px solid #1a2030",
                    }}
                  >
                    <div
                      className="font-mono text-[12px] mb-0.5"
                      style={{ color: s.c }}
                    >
                      {s.i}
                    </div>
                    <div
                      className="font-display font-extrabold text-base leading-none"
                      style={{ color: s.c }}
                    >
                      {s.v}
                    </div>
                    <div
                      className="font-mono text-[8px] uppercase tracking-widest mt-0.5"
                      style={{ color: "#6b7a99" }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>

              {student?.githubLink && (
                <div className="mt-4">
                  <a
                    href={student.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[12px] no-underline hover:opacity-75 transition-opacity"
                    style={{ color: "#3a9de8" }}
                  >
                    ⌥ GitHub Profile ↗
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* TAB BAR */}
          <div
            className="flex gap-0.5 mb-6 overflow-x-auto"
            style={{ borderBottom: "1px solid #1e2330" }}
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 font-mono font-bold text-[11px] uppercase tracking-widest cursor-pointer whitespace-nowrap border-b-2 bg-transparent transition-colors"
                style={{
                  color: tab === t.id ? "#3a9de8" : "#6b7a99",
                  borderColor: tab === t.id ? "#3a9de8" : "transparent",
                  marginBottom: -1,
                }}
              >
                {t.label}
                {t.badge !== undefined && (
                  <span
                    className="font-mono text-[9px] px-1.5 py-px rounded-full"
                    style={{
                      background: tab === t.id ? "#3a9de818" : "#1e2330",
                      color: tab === t.id ? "#3a9de8" : "#6b7a99",
                    }}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-5">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Brick
                    icon="⬡"
                    label="Total Score"
                    value={stats?.totalScore}
                    accent="#fbbf24"
                  />
                  <Brick
                    icon="◈"
                    label="Points Earned"
                    value={stats?.totalPoints}
                    accent="#e85d3a"
                  />
                  <Brick
                    icon="✓"
                    label="Tasks Done"
                    value={stats?.completedLogs}
                    accent="#4ade80"
                  />
                  <Brick
                    icon="⏳"
                    label="Active Tasks"
                    value={stats?.assignedLogs}
                    accent="#fb923c"
                    sub={stats?.assignedLogs > 0 ? "In progress" : "All clear"}
                  />
                </div>
                <div>
                  <SH
                    title="My Projects"
                    accent="#3a9de8"
                    count={projects?.length}
                    action={() => setTab("projects")}
                    actionLabel="All projects →"
                  />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(projects || []).slice(0, 4).map((p) => (
                      <ProjCard
                        key={p._id}
                        p={p}
                        onClick={() => setDrawer(p)}
                      />
                    ))}
                    {!projects?.length && (
                      <div
                        className="col-span-2 text-center py-12 rounded-xl"
                        style={{ border: "1px dashed #1e2330" }}
                      >
                        <div className="text-4xl opacity-10 mb-2">◉</div>
                        <p
                          className="font-mono text-[12px]"
                          style={{ color: "#4a5568" }}
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
                      accent="#fbbf24"
                      count={LC.assigned}
                      action={() => {
                        setTab("tasks");
                        setLFilter("assigned");
                      }}
                      actionLabel="View all →"
                    />
                    <div className="space-y-2.5">
                      {logs
                        .filter((l) => l.task_status === "assigned")
                        .slice(0, 3)
                        .map((l) => (
                          <LogCard key={l._id} log={l} />
                        ))}
                    </div>
                  </div>
                )}
                {LC.completed > 0 && (
                  <div>
                    <SH
                      title="Recently Completed"
                      accent="#4ade80"
                      count={LC.completed}
                      action={() => {
                        setTab("tasks");
                        setLFilter("completed");
                      }}
                      actionLabel="View all →"
                    />
                    <div className="space-y-2.5">
                      {logs
                        .filter((l) => l.task_status === "completed")
                        .slice(0, 3)
                        .map((l) => (
                          <LogCard key={l._id} log={l} />
                        ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
                >
                  <div className="px-5 pt-4 pb-2">
                    <SH title="Leaderboard" accent="#fbbf24" />
                  </div>
                  <div className="px-3 pb-3 space-y-0.5">
                    {(ranking?.top10 || []).slice(0, 5).map((s, i) => (
                      <RRow
                        key={s._id}
                        rank={i + 1}
                        name={s.name}
                        score={s.totalScore}
                        dept={s.department}
                        isMe={s._id === student?._id?.toString()}
                      />
                    ))}
                    {ranking?.myRank > 5 && (
                      <>
                        <div
                          className="text-center font-mono text-[10px] py-1"
                          style={{ color: "#4a5568" }}
                        >
                          · · ·
                        </div>
                        <RRow
                          rank={ranking.myRank}
                          name={student?.name}
                          score={stats?.totalScore}
                          isMe
                        />
                      </>
                    )}
                  </div>
                  <div
                    className="px-5 py-3"
                    style={{ borderTop: "1px solid #1e2330" }}
                  >
                    <button
                      onClick={() => setTab("ranking")}
                      className="w-full py-2 rounded-lg font-mono font-bold text-[11px] cursor-pointer"
                      style={{
                        background: "#fbbf2410",
                        border: "1px solid #fbbf2428",
                        color: "#fbbf24",
                      }}
                    >
                      Full Leaderboard →
                    </button>
                  </div>
                </div>

                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
                >
                  <div className="px-5 pt-4 pb-2">
                    <SH
                      title="Available Tasks"
                      accent="#4ade80"
                      count={openLogs?.length}
                    />
                  </div>
                  <div className="px-4 pb-4 space-y-2.5">
                    {(openLogs || []).slice(0, 3).map((l) => (
                      <LogCard
                        key={l._id}
                        log={l}
                        showClaim
                        onClaim={handleClaim}
                        claiming={claiming === l._id}
                      />
                    ))}
                    {!openLogs?.length && (
                      <div className="text-center py-8">
                        <p
                          className="font-mono text-[11px]"
                          style={{ color: "#4a5568" }}
                        >
                          No open tasks available.
                        </p>
                      </div>
                    )}
                  </div>
                  {openLogs?.length > 3 && (
                    <div
                      className="px-5 py-3"
                      style={{ borderTop: "1px solid #1e2330" }}
                    >
                      <button
                        onClick={() => setTab("open")}
                        className="w-full py-2 rounded-lg font-mono font-bold text-[11px] cursor-pointer"
                        style={{
                          background: "#4ade8010",
                          border: "1px solid #4ade8028",
                          color: "#4ade80",
                        }}
                      >
                        See all {openLogs.length} tasks →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PROJECTS */}
          {tab === "projects" && (
            <div>
              <SH
                title="All Joined Projects"
                accent="#3a9de8"
                count={projects?.length}
              />
              {!projects?.length ? (
                <div
                  className="text-center py-20 rounded-2xl"
                  style={{ border: "1px dashed #1e2330" }}
                >
                  <div className="text-5xl opacity-10 mb-4">◉</div>
                  <p
                    className="font-mono text-[13px]"
                    style={{ color: "#4a5568" }}
                  >
                    You haven't joined any projects yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(projects || []).map((p) => (
                    <ProjCard key={p._id} p={p} onClick={() => setDrawer(p)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* MY TASKS */}
          {tab === "tasks" && (
            <div>
              <div className="flex items-center gap-2 mb-5 flex-wrap">
                {Object.entries(LC).map(([k, c]) => (
                  <button
                    key={k}
                    onClick={() => setLFilter(k)}
                    className="px-3 py-1.5 rounded-lg font-mono font-bold text-[10px] uppercase tracking-widest cursor-pointer transition-all"
                    style={{
                      background: lFilter === k ? "#3a9de8" : "#0c0f18",
                      color: lFilter === k ? "#fff" : "#6b7a99",
                      border: `1px solid ${lFilter === k ? "#3a9de8" : "#1e2330"}`,
                    }}
                  >
                    {k} ({c})
                  </button>
                ))}
              </div>
              {fLogs.length === 0 ? (
                <div
                  className="text-center py-20 rounded-2xl"
                  style={{ border: "1px dashed #1e2330" }}
                >
                  <div className="text-4xl opacity-10 mb-3">◌</div>
                  <p
                    className="font-mono text-[12px]"
                    style={{ color: "#4a5568" }}
                  >
                    No logs in this category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {fLogs.map((l) => (
                    <LogCard key={l._id} log={l} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* AVAILABLE TASKS */}
          {tab === "open" && (
            <div>
              <SH
                title="Available Tasks to Claim"
                accent="#4ade80"
                count={openLogs?.length}
              />
              <p
                className="font-mono text-[12px] mb-5"
                style={{ color: "#6b7a99" }}
              >
                Published tasks from your joined projects. Claim one to start
                the deadline clock.
                <span className="ml-2 font-bold" style={{ color: "#fbbf24" }}>
                  Max 5 active at a time.
                </span>
              </p>
              {!openLogs?.length ? (
                <div
                  className="text-center py-20 rounded-2xl"
                  style={{ border: "1px dashed #1e2330" }}
                >
                  <div className="text-4xl opacity-10 mb-3">◌</div>
                  <p
                    className="font-mono text-[12px]"
                    style={{ color: "#4a5568" }}
                  >
                    No open tasks right now.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(openLogs || []).map((l) => (
                    <LogCard
                      key={l._id}
                      log={l}
                      showClaim
                      onClaim={handleClaim}
                      claiming={claiming === l._id}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* RANKINGS */}
          {tab === "ranking" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              <div className="lg:col-span-1">
                <div
                  className="rounded-2xl overflow-hidden sticky top-20"
                  style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
                >
                  <div
                    className="h-[3px]"
                    style={{
                      background: "linear-gradient(90deg,#fbbf24,#e85d3a)",
                    }}
                  />
                  <div className="p-5 text-center">
                    <div
                      className="font-mono text-[8px] uppercase tracking-widest mb-2"
                      style={{ color: "#6b7a99" }}
                    >
                      Your Ranking
                    </div>
                    <div
                      className="font-display font-extrabold mb-1"
                      style={{ fontSize: 46, color: "#fbbf24" }}
                    >
                      #{ranking?.myRank ?? "—"}
                    </div>
                    <div
                      className="font-mono text-[11px] mb-4"
                      style={{ color: "#6b7a99" }}
                    >
                      of {ranking?.totalStudents} students
                    </div>
                    <div className="grid grid-cols-2 gap-2.5 mb-4">
                      {[
                        ["Total Score", stats?.totalScore, "#fbbf24"],
                        ["Tasks Done", stats?.completedLogs, "#4ade80"],
                      ].map(([l, v, c]) => (
                        <div
                          key={l}
                          className="py-3 rounded-xl"
                          style={{ background: "#131825" }}
                        >
                          <div
                            className="font-display font-extrabold text-xl"
                            style={{ color: c }}
                          >
                            {v}
                          </div>
                          <div
                            className="font-mono text-[9px] uppercase"
                            style={{ color: "#6b7a99" }}
                          >
                            {l}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-left">
                      <div
                        className="flex justify-between font-mono text-[10px] mb-1"
                        style={{ color: "#6b7a99" }}
                      >
                        <span>Completion rate</span>
                        <span style={{ color: "#3a9de8" }}>
                          {stats?.completionRate ?? 0}%
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "#1e2330" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${stats?.completionRate ?? 0}%`,
                            background: "#3a9de8",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="px-5 pb-5">
                    <div
                      className="font-mono text-[9px] uppercase tracking-widest font-bold mb-2.5"
                      style={{ color: "#e85d3a" }}
                    >
                      ◆ Project Scores
                    </div>
                    {!student?.projectWiseContribution?.length ? (
                      <p
                        className="font-mono text-[11px]"
                        style={{ color: "#4a5568" }}
                      >
                        No contributions yet.
                      </p>
                    ) : (
                      (student.projectWiseContribution || []).map((c, i) => {
                        const proj = projects?.find(
                          (p) => p._id === c.project?.toString(),
                        );
                        return (
                          <div
                            key={i}
                            className="flex items-center justify-between py-2.5"
                            style={{ borderBottom: "1px solid #1a2030" }}
                          >
                            <div className="min-w-0 mr-3">
                              <div
                                className="font-mono text-[11px] truncate"
                                style={{ color: "#c4cedf" }}
                              >
                                {proj?.problem?.title?.slice(0, 26) ||
                                  "Project"}
                              </div>
                              {c.role && (
                                <div
                                  className="font-mono text-[9px]"
                                  style={{ color: "#9c3ae8" }}
                                >
                                  {c.role}
                                </div>
                              )}
                            </div>
                            <div
                              className="font-display font-extrabold text-[13px] flex-shrink-0"
                              style={{ color: "#fbbf24" }}
                            >
                              {c.contributionScore}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <SH title="Global Leaderboard" accent="#fbbf24" />
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
                >
                  <div
                    className="grid px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest"
                    style={{
                      gridTemplateColumns: "1fr auto",
                      borderBottom: "1px solid #1e2330",
                      color: "#6b7a99",
                    }}
                  >
                    <span>Rank · Student</span>
                    <span>Score</span>
                  </div>
                  <div className="divide-y divide-[#1a203020]">
                    {(ranking?.top10 || []).map((s, i) => {
                      const isMe =
                        s._id === student?._id?.toString() ||
                        s._id === student?._id;
                      return (
                        <div
                          key={s._id}
                          className="flex items-center gap-3 px-4 py-3 transition-colors"
                          style={{
                            background: isMe ? "#18110a" : "transparent",
                          }}
                        >
                          <span
                            className="font-mono text-[11px] w-6 text-center flex-shrink-0"
                            style={{ color: isMe ? "#fbbf24" : "#6b7a99" }}
                          >
                            {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}
                          </span>
                          <Av name={s.name} size={26} />
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-display font-bold text-[12px] truncate"
                              style={{ color: isMe ? "#fbbf24" : "#f0f4ff" }}
                            >
                              {s.name}
                              {isMe && (
                                <span
                                  className="font-mono text-[8px] ml-1"
                                  style={{ color: "#e85d3a" }}
                                >
                                  (you)
                                </span>
                              )}
                            </div>
                            {s.department && (
                              <div
                                className="font-mono text-[9px]"
                                style={{ color: "#6b7a99" }}
                              >
                                {s.department}
                              </div>
                            )}
                          </div>
                          <div
                            className="font-display font-extrabold text-[14px] flex-shrink-0"
                            style={{ color: isMe ? "#fbbf24" : "#c4cedf" }}
                          >
                            {s.totalScore}
                          </div>
                        </div>
                      );
                    })}
                    {ranking?.myRank > 10 && (
                      <>
                        <div
                          className="text-center py-2 font-mono text-[10px]"
                          style={{ color: "#4a5568" }}
                        >
                          · · · {ranking.myRank - 10} more · · ·
                        </div>
                        <div
                          className="flex items-center gap-3 px-4 py-3"
                          style={{ background: "#18110a" }}
                        >
                          <span
                            className="font-mono text-[11px] w-6 text-center"
                            style={{ color: "#fbbf24" }}
                          >
                            #{ranking.myRank}
                          </span>
                          <Av name={student?.name} size={26} />
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-display font-bold text-[12px]"
                              style={{ color: "#fbbf24" }}
                            >
                              {student?.name}
                              <span
                                className="font-mono text-[8px] ml-1"
                                style={{ color: "#e85d3a" }}
                              >
                                (you)
                              </span>
                            </div>
                            {student?.department && (
                              <div
                                className="font-mono text-[9px]"
                                style={{ color: "#6b7a99" }}
                              >
                                {student.department}
                              </div>
                            )}
                          </div>
                          <div
                            className="font-display font-extrabold text-[14px]"
                            style={{ color: "#fbbf24" }}
                          >
                            {stats?.totalScore}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PROJECT DRAWER */}
        <AnimatePresence>
          {drawer && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setDrawer(null)}
                className="fixed inset-0 z-[400]"
                style={{
                  background: "rgba(0,0,0,.65)",
                  backdropFilter: "blur(5px)",
                }}
              />
              <Drawer
                proj={drawer}
                myLogs={logs.filter(
                  (l) =>
                    l.projectId?._id?.toString() === drawer._id?.toString() ||
                    l.projectId?.toString() === drawer._id?.toString(),
                )}
                openLogs={(openLogs || []).filter(
                  (l) =>
                    l.projectId?._id?.toString() === drawer._id?.toString() ||
                    l.projectId?.toString() === drawer._id?.toString(),
                )}
                onClaim={handleClaim}
                claiming={claiming}
                onClose={() => setDrawer(null)}
              />
            </>
          )}
        </AnimatePresence>

        {toast && <ToastBar {...toast} onDone={() => setToast(null)} />}
      </div>
    </>
  );
};

export default Dashboard;
