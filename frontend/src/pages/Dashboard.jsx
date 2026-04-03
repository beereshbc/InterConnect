import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { Link as LinkIcon, Loader2 } from "lucide-react";

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
  pending: {
    bg: "#1e1b4b",
    txt: "#818cf8",
    border: "#818cf835",
    dot: "#818cf8",
    label: "Pending Review",
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
  }, [onDone]);
  const c =
    { success: "#4ade80", error: "#f87171", warn: "#fbbf24" }[type] ||
    "#4ade80";
  return (
    <div
      className="fixed z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl font-mono text-[12px]"
      style={{
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 32px)",
        maxWidth: 420,
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
      <span className="flex-1 truncate">{message}</span>
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
      className="font-display font-extrabold text-[13px] sm:text-[14px]"
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
        className="font-mono text-[10px] cursor-pointer bg-transparent border-none whitespace-nowrap"
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
      padding: "14px 16px",
    }}
  >
    <div
      className="absolute -top-6 -right-6 w-16 h-16 rounded-full pointer-events-none"
      style={{ background: `${accent}0c`, filter: "blur(16px)" }}
    />
    <div className="relative z-10">
      <div className="text-base mb-2" style={{ color: accent }}>
        {icon}
      </div>
      <div
        className="font-display font-extrabold leading-none mb-1"
        style={{ fontSize: 22, color: "#f0f4ff" }}
      >
        {value}
      </div>
      <div
        className="font-mono text-[9px] uppercase tracking-widest"
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

// ─── Modal Component ─────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-5"
    style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(6px)" }}
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="relative bg-[#0f1219] border border-slate-700/60 rounded-2xl w-full max-w-lg overflow-y-auto shadow-2xl"
    >
      <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#1e2330]">
        <h2 className="text-lg font-extrabold text-slate-100 font-display">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer border-none bg-transparent hover:bg-[#1e2330]"
          style={{ color: "#8892a4" }}
        >
          ✕
        </button>
      </div>
      <div className="px-6 py-6">{children}</div>
    </motion.div>
  </div>
);

// ─── Mark Complete Modal ──────────────────────────────────────────────────────
const MarkCompleteModal = ({ log, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    githubPrLink: "",
    closureNote: "",
  });
  const [saving, setSaving] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(log._id, form);
    setSaving(false);
  };

  return (
    <Modal title="Submit Task for Review" onClose={onClose}>
      <div className="mb-5">
        <p className="text-[#8892a4] text-sm font-mono mb-2 leading-relaxed">
          You are submitting{" "}
          <span className="text-white font-bold">{log.taskTitle}</span>. Provide
          the link to your work so the Admin can review and award your points.
        </p>
      </div>
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-[#6b7a99] mb-1.5 font-mono uppercase tracking-widest">
            GitHub PR / Commit Link <span className="text-[#4ade80]">*</span>
          </label>
          <div className="relative">
            <LinkIcon
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6b7a99]"
            />
            <input
              type="url"
              required
              placeholder="https://github.com/..."
              value={form.githubPrLink}
              onChange={(e) =>
                setForm({ ...form, githubPrLink: e.target.value })
              }
              className="w-full rounded-lg pl-9 p-2.5 text-[#f0f4ff] font-mono text-[13px] outline-none transition-colors"
              style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
              onFocus={(e) => (e.target.style.borderColor = "#4ade8050")}
              onBlur={(e) => (e.target.style.borderColor = "#1e2330")}
            />
          </div>
        </div>
        <div>
          <label className="block text-[10px] font-bold text-[#6b7a99] mb-1.5 font-mono uppercase tracking-widest">
            Completion Note (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Any details the reviewer should know..."
            value={form.closureNote}
            onChange={(e) => setForm({ ...form, closureNote: e.target.value })}
            className="w-full rounded-lg p-3 text-[#f0f4ff] font-mono text-[13px] outline-none transition-colors resize-none"
            style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
            onFocus={(e) => (e.target.style.borderColor = "#4ade8050")}
            onBlur={(e) => (e.target.style.borderColor = "#1e2330")}
          />
        </div>
        <div className="flex gap-3 justify-end pt-2 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-[12px] font-bold font-mono cursor-pointer transition-colors bg-transparent border-none hover:text-white"
            style={{ color: "#6b7a99" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !form.githubPrLink}
            className="px-5 py-2 rounded-lg text-[12px] font-bold font-mono text-white transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 border-none"
            style={{
              background: "#08271a",
              color: "#4ade80",
              border: "1px solid #4ade8035",
            }}
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Submit Work
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Log Card ─────────────────────────────────────────────────────────────────
const LogCard = ({
  log,
  showClaim = false,
  onClaim,
  claiming = false,
  onMarkComplete,
}) => {
  const days = daysLeft(log.deadlineAt);
  const isPending = log.task_status === "pending";
  const overdue =
    (log.task_status === "assigned" || isPending) && days !== null && days <= 0;

  // Use terminated styles if overdue, else use mapped styles
  const st = ST[overdue ? "terminated" : log.task_status] || ST.open;
  const proj = log.projectId?.problem?.title || log.projectId?.projectID || "—";

  return (
    <div
      className="rounded-xl p-3.5 transition-all"
      style={{
        background: "#0c0f18",
        border: `1px solid ${st.border}`,
        borderLeft: `2.5px solid ${st.dot}`,
      }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0 flex-1">
          <div
            className="font-display font-bold text-[12px] sm:text-[13px] leading-tight truncate mb-0.5"
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

      <div className="flex flex-wrap gap-2 items-center text-[11px] font-mono mt-1.5">
        <span style={{ color: "#fbbf24" }}>
          ⬡ {log.assignedTaskPoints ?? 0} pts
        </span>
        {log.deadlineDays && (
          <span style={{ color: "#6b7a99" }}>⏱ {log.deadlineDays}d window</span>
        )}
        {(log.task_status === "assigned" || isPending) && log.deadlineAt && (
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

        <div className="flex gap-3 ml-auto items-center">
          {log.githubIssueLink && (
            <a
              href={log.githubIssueLink}
              target="_blank"
              rel="noreferrer"
              className="no-underline hover:opacity-75 transition-opacity"
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
          {log.task_status === "assigned" && onMarkComplete && (
            <button
              onClick={() => onMarkComplete(log)}
              className="no-underline hover:opacity-75 transition-opacity font-bold font-mono text-[11px] bg-transparent border-none cursor-pointer"
              style={{ color: "#4ade80" }}
            >
              ✓ Mark Complete
            </button>
          )}
        </div>
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
          className="mt-3 w-full py-2.5 rounded-lg font-display font-bold text-[12px] tracking-wide cursor-pointer disabled:opacity-50 transition-all flex justify-center items-center gap-2 active:scale-[0.98]"
          style={{
            background: "#08251a",
            border: "1px solid #4ade8038",
            color: "#4ade80",
            WebkitTapHighlightColor: "transparent",
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
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="rounded-2xl p-4 cursor-pointer transition-all active:opacity-90"
      style={{
        background: "#0c0f18",
        border: "1px solid #1e2330",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-[10px] flex-shrink-0"
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
            className="font-display font-bold text-[12px] sm:text-[13px] leading-tight truncate"
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
              className="font-display text-[14px] font-extrabold"
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
      className="flex items-center gap-3 px-3 sm:px-4 py-2.5 rounded-xl transition-all"
      style={{
        background: isMe ? "#18110a" : "transparent",
        border: isMe ? "1px solid #fbbf2428" : "1px solid transparent",
      }}
    >
      <div
        className="w-7 text-center font-mono text-[11px] font-bold flex-shrink-0"
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

const Drawer = ({
  proj,
  myLogs,
  openLogs,
  claiming,
  onClaim,
  onClose,
  onMarkComplete,
}) => (
  <motion.div
    initial={{ y: "100%", opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: "100%", opacity: 0 }}
    transition={{ type: "spring", stiffness: 280, damping: 30 }}
    className="proj-drawer fixed z-[500] shadow-2xl overflow-y-auto"
    style={{
      background: "#0a0d16",
      borderTop: "1px solid #252d3e",
      bottom: 0,
      left: 0,
      right: 0,
      maxHeight: "92dvh",
      borderRadius: "20px 20px 0 0",
    }}
  >
    <div className="flex justify-center pt-3 pb-1 sm:hidden">
      <div
        className="w-10 h-1 rounded-full"
        style={{ background: "#252d3e" }}
      />
    </div>

    <div
      className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5"
      style={{
        background: "#0a0d16ee",
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
          className="font-display font-extrabold text-[13px] leading-tight mt-0.5"
          style={{ color: "#f0f4ff" }}
        >
          {proj.problem?.title || "—"}
        </div>
      </div>
      <button
        onClick={onClose}
        className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer font-mono text-sm border-none"
        style={{
          background: "#1e2330",
          color: "#8892a4",
          WebkitTapHighlightColor: "transparent",
        }}
      >
        ✕
      </button>
    </div>
    <div
      className="p-4 sm:p-5 space-y-4 sm:space-y-5"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 24px)" }}
    >
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
                className="font-display text-[16px] font-extrabold"
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
                className="flex items-center gap-2 rounded-xl p-3 no-underline active:opacity-70 transition-opacity"
                style={{
                  background: "#101520",
                  border: "1px solid #1e2330",
                  WebkitTapHighlightColor: "transparent",
                }}
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
                onMarkComplete={onMarkComplete}
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
              <LogCard key={l._id} log={l} onMarkComplete={onMarkComplete} />
            ))}
          </div>
        </div>
      )}
    </div>
  </motion.div>
);

// ═════════════════════════════════════════════════════════════════════════════
// BOTTOM NAV (Mobile)
// ═════════════════════════════════════════════════════════════════════════════
const BottomNav = ({ tab, setTab, TABS }) => (
  <nav
    className="fixed bottom-0 left-0 right-0 z-[200] flex items-center justify-around sm:hidden"
    style={{
      background: "#0a0d16f0",
      backdropFilter: "blur(16px)",
      borderTop: "1px solid #1e2330",
      paddingBottom: "env(safe-area-inset-bottom, 0px)",
    }}
  >
    {TABS.map((t) => {
      const icons = {
        overview: "◎",
        projects: "◉",
        tasks: "◌",
        open: "✦",
        ranking: "⬡",
      };
      const active = tab === t.id;
      return (
        <button
          key={t.id}
          onClick={() => setTab(t.id)}
          className="flex flex-col items-center gap-0.5 py-2.5 px-3 relative cursor-pointer bg-transparent border-none"
          style={{
            color: active ? "#3a9de8" : "#4a5568",
            WebkitTapHighlightColor: "transparent",
            minWidth: 56,
          }}
        >
          {t.badge !== undefined && t.badge > 0 && (
            <span
              className="absolute top-1.5 right-2 w-4 h-4 rounded-full flex items-center justify-center font-mono text-[8px] font-bold"
              style={{ background: "#3a9de8", color: "#fff" }}
            >
              {t.badge > 99 ? "99+" : t.badge}
            </span>
          )}
          <span
            className="text-[18px] leading-none transition-transform duration-150"
            style={{ transform: active ? "scale(1.2)" : "scale(1)" }}
          >
            {icons[t.id]}
          </span>
          <span
            className="font-mono font-bold uppercase tracking-widest transition-all"
            style={{ fontSize: 8 }}
          >
            {t.label}
          </span>
          {active && (
            <motion.div
              layoutId="bottomNavActive"
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-[2px] rounded-full"
              style={{ background: "#3a9de8" }}
            />
          )}
        </button>
      );
    })}
  </nav>
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

  const authPatch = async (url, payload = {}) => {
    const token = resolveToken();
    const headers = token
      ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
      : {};

    if (axiosInst) {
      return await axiosInst.patch(url, payload, { headers });
    }

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

  const boom = (message, type = "success") => setToastData({ message, type });

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
  }, [load]);

  // Lock body scroll when drawer open on mobile
  useEffect(() => {
    if (drawer) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const handleClaim = async (logId) => {
    setClaiming(logId);
    try {
      const { data: r } = await authPatch(
        `/api/student/logs/${logId}/self-assign`,
      );
      if (r.success) {
        boom(r.message, "success");
        await load();
      } else {
        boom(r.message || "Failed to initiate task.", "error");
      }
    } catch (e) {
      boom(e?.response?.data?.message || "Failed to initiate task.", "error");
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
        boom("Task submitted for admin review!", "success");
        setCompletingLog(null);
        await load();
      } else {
        boom(r.message || "Failed to submit task.", "error");
      }
    } catch (e) {
      boom(e?.response?.data?.message || "Failed to submit task.", "error");
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

  const { student, stats, projects, openLogs, ranking } = data || {};

  const TABS = [
    { id: "overview", label: "Overview" },
    { id: "projects", label: "Projects", badge: stats?.totalProjects },
    { id: "tasks", label: "Tasks", badge: LC.all },
    { id: "open", label: "Available", badge: openLogs?.length },
    { id: "ranking", label: "Rankings" },
  ];

  const GLOBAL_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
    .font-display{font-family:'Syne',sans-serif!important}
    .font-mono{font-family:'DM Mono',monospace!important}
    *{box-sizing:border-box;-webkit-font-smoothing:antialiased}
    @keyframes spin   {to{transform:rotate(360deg)}}
    @keyframes slideUp{from{transform:translateX(-50%) translateY(14px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
    @keyframes pulse  {0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.94)}}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:#0c0f18}
    ::-webkit-scrollbar-thumb{background:#252d3e;border-radius:3px}
    details summary::-webkit-details-marker{display:none}
    html{scroll-behavior:smooth}
    /* Desktop drawer override */
    @media(min-width:640px){
      .proj-drawer{
        top:0 !important;
        bottom:auto !important;
        right:0 !important;
        left:auto !important;
        width:100% !important;
        max-width:420px !important;
        max-height:100dvh !important;
        height:100dvh !important;
        border-radius:0 !important;
        border-top:none !important;
        border-left:1px solid #252d3e !important;
      }
    }
  `;

  if (loading)
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-5"
        style={{ background: "#070a12" }}
      >
        <style>{GLOBAL_STYLES}</style>
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center font-display font-extrabold text-white text-2xl"
          style={{
            background: "#1e2330",
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
        className="min-h-screen flex flex-col items-center justify-center gap-5 px-4"
        style={{ background: "#070a12" }}
      >
        <style>{GLOBAL_STYLES}</style>
        <div className="text-5xl opacity-20">◎</div>
        <p
          className="font-display font-bold text-xl text-center"
          style={{ color: "#f0f4ff" }}
        >
          Not Logged In
        </p>
        <p
          className="font-mono text-[12px] text-center"
          style={{ color: "#6b7a99" }}
        >
          Please log in to access your dashboard.
        </p>
        {navigate && (
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2.5 rounded-xl font-display font-bold text-[13px] cursor-pointer mt-2"
            style={{ background: "#3a9de8", color: "#fff", border: "none" }}
          >
            Go to Login →
          </button>
        )}
      </div>
    );

  return (
    <>
      <style>{GLOBAL_STYLES}</style>

      <div
        className="min-h-screen font-mono"
        style={{ background: "#070a12", color: "#f0f4ff" }}
      >
        {/* Ambient BG */}
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

        {/* ── TOP NAV ── */}
        <nav
          className="sticky top-0 z-[100] flex items-center justify-between px-4 h-14"
          style={{
            background: "#070a12cc",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #1e233060",
          }}
        >
          {/* Left: branding + status */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-display font-extrabold text-white text-sm flex-shrink-0"
              style={{ background: "#1e2330", border: "1px solid #252d3e" }}
            >
              ◎
            </div>
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
          </div>

          {/* Right: sync + user */}
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="px-3 py-1.5 rounded-lg font-mono text-[11px] cursor-pointer transition-colors active:scale-95"
              style={{
                background: "#1e2330",
                border: "1px solid #252d3e",
                color: "#8892a4",
                WebkitTapHighlightColor: "transparent",
              }}
            >
              ↻ Sync
            </button>
            {student && (
              <div className="flex items-center gap-2">
                <Av name={student.name} size={30} />
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

        {/* ── DESKTOP TAB BAR ── (hidden on mobile — replaced by BottomNav) */}
        <div
          className="hidden sm:flex sticky z-[90] gap-0.5 overflow-x-auto px-4"
          style={{
            top: 56,
            borderBottom: "1px solid #1e2330",
            background: "#070a12e8",
            backdropFilter: "blur(10px)",
          }}
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

        {/* ── MAIN CONTENT ── */}
        <div
          className="relative z-10 max-w-[1200px] mx-auto px-3 sm:px-4 py-4 sm:py-6"
          style={{
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 80px)",
          }}
        >
          {/* HERO CARD */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl overflow-hidden mb-5 sm:mb-6"
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
            <div className="px-4 sm:px-6 py-4 sm:py-5">
              {/* Profile row */}
              <div className="flex items-start gap-3 sm:gap-4 flex-wrap mb-4 sm:mb-5">
                <Av name={student?.name || ""} size={52} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1
                      className="font-display font-extrabold leading-tight"
                      style={{
                        fontSize: "clamp(16px, 4vw, 22px)",
                        color: "#f0f4ff",
                      }}
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
                    className="font-mono text-[11px] mb-2"
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
                {/* Rank badge */}
                <div
                  className="text-center rounded-2xl px-4 py-3 flex-shrink-0 ml-auto sm:ml-0"
                  style={{ border: "1px solid #1e2330" }}
                >
                  <div
                    className="font-mono text-[8px] uppercase tracking-widest mb-0.5"
                    style={{ color: "#6b7a99" }}
                  >
                    Global Rank
                  </div>
                  <div
                    className="font-display font-extrabold"
                    style={{ fontSize: 24, color: "#fbbf24" }}
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

              {/* Stats strip — 4 cols on mobile, 7 on sm+ */}
              <div className="grid gap-2 grid-cols-4 sm:grid-cols-7">
                {[
                  { l: "Score", v: stats?.totalScore, c: "#fbbf24", i: "⬡" },
                  { l: "Points", v: stats?.totalPoints, c: "#e85d3a", i: "◈" },
                  {
                    l: "Projects",
                    v: stats?.totalProjects,
                    c: "#3a9de8",
                    i: "◉",
                  },
                  { l: "Logs", v: stats?.totalLogs, c: "#9c3ae8", i: "◌" },
                  {
                    l: "Done",
                    v: stats?.completedLogs,
                    c: "#4ade80",
                    i: "✓",
                    hideXs: true,
                  },
                  {
                    l: "Active",
                    v: stats?.assignedLogs,
                    c: "#fbbf24",
                    i: "⏳",
                    hideXs: true,
                  },
                  {
                    l: "Rate",
                    v: `${stats?.completionRate ?? 0}%`,
                    c: "#3a9de8",
                    i: "%",
                    hideXs: true,
                  },
                ].map((s) => (
                  <div
                    key={s.l}
                    className={`text-center rounded-xl py-2${s.hideXs ? " hidden sm:block" : ""}`}
                    style={{
                      background: "#0c0f18",
                      border: "1px solid #1a2030",
                    }}
                  >
                    <div
                      className="font-mono text-[11px] mb-0.5"
                      style={{ color: s.c }}
                    >
                      {s.i}
                    </div>
                    <div
                      className="font-display font-extrabold leading-none"
                      style={{ fontSize: 14, color: s.c }}
                    >
                      {s.v}
                    </div>
                    <div
                      className="font-mono uppercase tracking-widest mt-0.5"
                      style={{ fontSize: 7, color: "#6b7a99" }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile: show hidden stats as small chips below */}
              <div className="flex gap-2 mt-2 sm:hidden flex-wrap">
                {[
                  { l: "Done", v: stats?.completedLogs, c: "#4ade80" },
                  { l: "Active", v: stats?.assignedLogs, c: "#fbbf24" },
                  {
                    l: "Rate",
                    v: `${stats?.completionRate ?? 0}%`,
                    c: "#3a9de8",
                  },
                ].map((s) => (
                  <div
                    key={s.l}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{
                      background: "#0c0f18",
                      border: `1px solid ${s.c}20`,
                    }}
                  >
                    <span
                      className="font-display font-extrabold text-[11px]"
                      style={{ color: s.c }}
                    >
                      {s.v}
                    </span>
                    <span
                      className="font-mono text-[9px] uppercase tracking-widest"
                      style={{ color: "#6b7a99" }}
                    >
                      {s.l}
                    </span>
                  </div>
                ))}
              </div>

              {student?.githubLink && (
                <div className="mt-3">
                  <a
                    href={student.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 font-mono text-[12px] no-underline hover:opacity-75 active:opacity-60 transition-opacity"
                    style={{ color: "#3a9de8" }}
                  >
                    ⌥ GitHub Profile ↗
                  </a>
                </div>
              )}
            </div>
          </motion.div>

          {/* ────────────── OVERVIEW ────────────── */}
          {tab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                {/* Bricks */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
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

                {/* Projects preview */}
                <div>
                  <SH
                    title="My Projects"
                    accent="#3a9de8"
                    count={projects?.length}
                    action={() => setTab("projects")}
                    actionLabel="All →"
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
                        <div className="text-3xl opacity-10 mb-2">◉</div>
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

                {/* Active tasks */}
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
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* Completed tasks */}
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
                          <LogCard
                            key={l._id}
                            log={l}
                            onMarkComplete={setCompletingLog}
                          />
                        ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-4 sm:space-y-5">
                {/* Leaderboard */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
                >
                  <div className="px-4 sm:px-5 pt-4 pb-2">
                    <SH title="Leaderboard" accent="#fbbf24" />
                  </div>
                  <div className="px-2 sm:px-3 pb-3 space-y-0.5">
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
                    className="px-4 sm:px-5 py-3"
                    style={{ borderTop: "1px solid #1e2330" }}
                  >
                    <button
                      onClick={() => setTab("ranking")}
                      className="w-full py-2 rounded-lg font-mono font-bold text-[11px] cursor-pointer active:scale-[0.98] transition-transform"
                      style={{
                        background: "#fbbf2410",
                        border: "1px solid #fbbf2428",
                        color: "#fbbf24",
                        WebkitTapHighlightColor: "transparent",
                      }}
                    >
                      Full Leaderboard →
                    </button>
                  </div>
                </div>

                {/* Available tasks */}
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
                >
                  <div className="px-4 sm:px-5 pt-4 pb-2">
                    <SH
                      title="Available Tasks"
                      accent="#4ade80"
                      count={openLogs?.length}
                    />
                  </div>
                  <div className="px-3 sm:px-4 pb-4 space-y-2.5">
                    {(openLogs || []).slice(0, 3).map((l) => (
                      <LogCard
                        key={l._id}
                        log={l}
                        showClaim
                        onClaim={handleClaim}
                        claiming={claiming === l._id}
                        onMarkComplete={setCompletingLog}
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
                      className="px-4 sm:px-5 py-3"
                      style={{ borderTop: "1px solid #1e2330" }}
                    >
                      <button
                        onClick={() => setTab("open")}
                        className="w-full py-2 rounded-lg font-mono font-bold text-[11px] cursor-pointer active:scale-[0.98] transition-transform"
                        style={{
                          background: "#4ade8010",
                          border: "1px solid #4ade8028",
                          color: "#4ade80",
                          WebkitTapHighlightColor: "transparent",
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

          {/* ────────────── PROJECTS ────────────── */}
          {tab === "projects" && (
            <div>
              <SH
                title="All Joined Projects"
                accent="#3a9de8"
                count={projects?.length}
              />
              {!projects?.length ? (
                <div
                  className="text-center py-16 sm:py-20 rounded-2xl"
                  style={{ border: "1px dashed #1e2330" }}
                >
                  <div className="text-4xl opacity-10 mb-4">◉</div>
                  <p
                    className="font-mono text-[13px]"
                    style={{ color: "#4a5568" }}
                  >
                    You haven't joined any projects yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {(projects || []).map((p) => (
                    <ProjCard key={p._id} p={p} onClick={() => setDrawer(p)} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ────────────── MY TASKS ────────────── */}
          {tab === "tasks" && (
            <div>
              {/* Filter pills — horizontal scroll on mobile */}
              <div
                className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1"
                style={{ scrollbarWidth: "none" }}
              >
                {Object.entries(LC).map(([k, c]) => (
                  <button
                    key={k}
                    onClick={() => setLFilter(k)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg font-mono font-bold text-[10px] uppercase tracking-widest cursor-pointer transition-all active:scale-[0.97]"
                    style={{
                      background: lFilter === k ? "#3a9de8" : "#0c0f18",
                      color: lFilter === k ? "#fff" : "#6b7a99",
                      border: `1px solid ${lFilter === k ? "#3a9de8" : "#1e2330"}`,
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    {k} ({c})
                  </button>
                ))}
              </div>
              {fLogs.length === 0 ? (
                <div
                  className="text-center py-16 sm:py-20 rounded-2xl"
                  style={{ border: "1px dashed #1e2330" }}
                >
                  <div className="text-3xl opacity-10 mb-3">◌</div>
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
                    <LogCard
                      key={l._id}
                      log={l}
                      onMarkComplete={setCompletingLog}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ────────────── AVAILABLE TASKS ────────────── */}
          {tab === "open" && (
            <div>
              <SH
                title="Available Tasks to Claim"
                accent="#4ade80"
                count={openLogs?.length}
              />
              <p
                className="font-mono text-[11px] sm:text-[12px] mb-5"
                style={{ color: "#6b7a99" }}
              >
                Published tasks from your joined projects. Claim one to start
                the deadline clock.
                <span className="ml-1.5 font-bold" style={{ color: "#fbbf24" }}>
                  Max 5 active at a time.
                </span>
              </p>
              {!openLogs?.length ? (
                <div
                  className="text-center py-16 sm:py-20 rounded-2xl"
                  style={{ border: "1px dashed #1e2330" }}
                >
                  <div className="text-3xl opacity-10 mb-3">◌</div>
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
                      onMarkComplete={setCompletingLog}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ────────────── RANKINGS ────────────── */}
          {tab === "ranking" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              {/* My rank card */}
              <div className="lg:col-span-1">
                <div
                  className="rounded-2xl overflow-hidden lg:sticky lg:top-28"
                  style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
                >
                  <div
                    className="h-[3px]"
                    style={{
                      background: "linear-gradient(90deg,#fbbf24,#e85d3a)",
                    }}
                  />
                  <div className="p-4 sm:p-5 text-center">
                    <div
                      className="font-mono text-[8px] uppercase tracking-widest mb-2"
                      style={{ color: "#6b7a99" }}
                    >
                      Your Ranking
                    </div>
                    <div
                      className="font-display font-extrabold mb-1"
                      style={{ fontSize: 40, color: "#fbbf24" }}
                    >
                      #{ranking?.myRank ?? "—"}
                    </div>
                    <div
                      className="font-mono text-[11px] mb-4"
                      style={{ color: "#6b7a99" }}
                    >
                      of {ranking?.totalStudents} students
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
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
                  <div className="px-4 sm:px-5 pb-5">
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

              {/* Leaderboard table */}
              <div className="lg:col-span-2">
                <SH title="Global Leaderboard" accent="#fbbf24" />
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
                >
                  <div
                    className="grid px-3 sm:px-4 py-2.5 font-mono text-[9px] uppercase tracking-widest"
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
                          className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 transition-colors"
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
                          className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3"
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

        {/* ── MOBILE BOTTOM NAV ── */}
        <BottomNav tab={tab} setTab={setTab} TABS={TABS} />

        {/* ── PROJECT DRAWER ── */}
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
                  background: "rgba(0,0,0,.7)",
                  backdropFilter: "blur(6px)",
                }}
              />
              {/* Responsive Drawer: bottom-sheet on mobile, side-panel on desktop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="proj-drawer fixed z-[500] shadow-2xl overflow-y-auto"
                style={{
                  background: "#0a0d16",
                  // Mobile defaults: bottom sheet
                  bottom: 0,
                  left: 0,
                  right: 0,
                  maxHeight: "92dvh",
                  borderRadius: "20px 20px 0 0",
                  borderTop: "1px solid #252d3e",
                }}
              >
                {/* Pull handle mobile */}
                <div className="flex justify-center pt-3 pb-1 sm:hidden">
                  <div
                    className="w-10 h-1 rounded-full"
                    style={{ background: "#252d3e" }}
                  />
                </div>

                <div
                  className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3.5"
                  style={{
                    background: "#0a0d16ee",
                    backdropFilter: "blur(10px)",
                    borderBottom: "1px solid #1e2330",
                  }}
                >
                  <div>
                    <div
                      className="font-mono text-[9px] uppercase tracking-widest"
                      style={{ color: "#3a9de8" }}
                    >
                      {drawer.projectID}
                    </div>
                    <div
                      className="font-display font-extrabold text-[13px] leading-tight mt-0.5"
                      style={{ color: "#f0f4ff" }}
                    >
                      {drawer.problem?.title || "—"}
                    </div>
                  </div>
                  <button
                    onClick={() => setDrawer(null)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer font-mono text-sm border-none"
                    style={{
                      background: "#1e2330",
                      color: "#8892a4",
                      WebkitTapHighlightColor: "transparent",
                    }}
                  >
                    ✕
                  </button>
                </div>

                <div
                  className="p-4 sm:p-5 space-y-4 sm:space-y-5"
                  style={{
                    paddingBottom:
                      "calc(env(safe-area-inset-bottom, 0px) + 24px)",
                  }}
                >
                  {/* Contribution */}
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "#101520",
                      border: "1px solid #1e2330",
                    }}
                  >
                    <div
                      className="font-mono text-[9px] uppercase tracking-widest font-bold mb-3"
                      style={{ color: "#3a9de8" }}
                    >
                      ◆ My Contribution
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {[
                        ["Score", drawer.myScore, "#fbbf24"],
                        ["Done", drawer.myTasksDone, "#4ade80"],
                        ["Active", drawer.myTasksActive, "#fb923c"],
                      ].map(([l, v, c]) => (
                        <div
                          key={l}
                          className="text-center py-2 rounded-lg"
                          style={{ background: "#0c0f18" }}
                        >
                          <div
                            className="font-display text-[16px] font-extrabold"
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
                    {drawer.myRole && (
                      <div
                        className="font-mono text-[11px]"
                        style={{ color: "#9c3ae8" }}
                      >
                        Role:{" "}
                        <span style={{ color: "#f0f4ff" }}>
                          {drawer.myRole}
                        </span>
                      </div>
                    )}
                    {drawer.myDescription && (
                      <p
                        className="font-mono text-[11px] mt-1 leading-relaxed"
                        style={{ color: "#8892a4" }}
                      >
                        {drawer.myDescription}
                      </p>
                    )}
                  </div>

                  {/* Progress */}
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "#101520",
                      border: "1px solid #1e2330",
                    }}
                  >
                    <div
                      className="flex justify-between font-mono text-[10px] mb-2"
                      style={{ color: "#6b7a99" }}
                    >
                      <span>Overall Progress</span>
                      <span style={{ color: "#3a9de8" }}>
                        {drawer.projectProgressRate ?? 0}%
                      </span>
                    </div>
                    <div
                      className="h-2 rounded-full overflow-hidden"
                      style={{ background: "#1e2330" }}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${drawer.projectProgressRate ?? 0}%`,
                          background: "#3a9de8",
                          boxShadow: "0 0 8px #3a9de860",
                        }}
                      />
                    </div>
                    <div
                      className="flex justify-between font-mono text-[10px] mt-2"
                      style={{ color: "#6b7a99" }}
                    >
                      <span>
                        {drawer.contributors?.length ?? 0} contributors
                      </span>
                      <span>
                        {drawer.is_blocked ? "🔒 Blocked" : "🟢 Active"}
                      </span>
                    </div>
                  </div>

                  {/* Links */}
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
                          href: drawer.githubRepoLink,
                          c: "#3a9de8",
                          i: "⌥",
                        },
                        {
                          l: "Live Demo",
                          href: drawer.liveHostedLink,
                          c: "#4ade80",
                          i: "◉",
                        },
                        {
                          l: "Resources",
                          href: drawer.resourcesLink,
                          c: "#fbbf24",
                          i: "📁",
                        },
                        {
                          l: "Community",
                          href: drawer.communityLink,
                          c: "#9c3ae8",
                          i: "💬",
                        },
                      ]
                        .filter((lnk) => lnk.href)
                        .map((lnk) => (
                          <a
                            key={lnk.l}
                            href={lnk.href}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-xl p-3 no-underline active:opacity-70 transition-opacity"
                            style={{
                              background: "#101520",
                              border: "1px solid #1e2330",
                              WebkitTapHighlightColor: "transparent",
                            }}
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

                  {drawer.problem?.tags?.length > 0 && (
                    <div className="flex gap-1.5 flex-wrap">
                      {drawer.problem.tags.map((t) => (
                        <Tag key={t} color="#6b7a99">
                          {t}
                        </Tag>
                      ))}
                    </div>
                  )}

                  {/* Open logs */}
                  {(openLogs || []).filter(
                    (l) =>
                      l.projectId?._id?.toString() === drawer._id?.toString() ||
                      l.projectId?.toString() === drawer._id?.toString(),
                  )?.length > 0 && (
                    <div>
                      <div
                        className="font-mono text-[9px] uppercase tracking-widest font-bold mb-3"
                        style={{ color: "#4ade80" }}
                      >
                        ◆ Available Tasks (
                        {
                          (openLogs || []).filter(
                            (l) =>
                              l.projectId?._id?.toString() ===
                                drawer._id?.toString() ||
                              l.projectId?.toString() ===
                                drawer._id?.toString(),
                          ).length
                        }
                        )
                      </div>
                      <div className="space-y-2.5">
                        {(openLogs || [])
                          .filter(
                            (l) =>
                              l.projectId?._id?.toString() ===
                                drawer._id?.toString() ||
                              l.projectId?.toString() ===
                                drawer._id?.toString(),
                          )
                          .map((l) => (
                            <LogCard
                              key={l._id}
                              log={l}
                              showClaim
                              onClaim={handleClaim}
                              claiming={claiming === l._id}
                              onMarkComplete={setCompletingLog}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* My logs */}
                  {logs.filter(
                    (l) =>
                      l.projectId?._id?.toString() === drawer._id?.toString() ||
                      l.projectId?.toString() === drawer._id?.toString(),
                  )?.length > 0 && (
                    <div>
                      <div
                        className="font-mono text-[9px] uppercase tracking-widest font-bold mb-3"
                        style={{ color: "#e85d3a" }}
                      >
                        ◆ My Task Logs (
                        {
                          logs.filter(
                            (l) =>
                              l.projectId?._id?.toString() ===
                                drawer._id?.toString() ||
                              l.projectId?.toString() ===
                                drawer._id?.toString(),
                          ).length
                        }
                        )
                      </div>
                      <div className="space-y-2.5">
                        {logs
                          .filter(
                            (l) =>
                              l.projectId?._id?.toString() ===
                                drawer._id?.toString() ||
                              l.projectId?.toString() ===
                                drawer._id?.toString(),
                          )
                          .map((l) => (
                            <LogCard
                              key={l._id}
                              log={l}
                              onMarkComplete={setCompletingLog}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {toastData && (
          <ToastBar {...toastData} onDone={() => setToastData(null)} />
        )}

        {/* Mark Complete Modal */}
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
