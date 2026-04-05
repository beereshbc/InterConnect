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
  Trophy,
  CheckCircle,
  Clock,
  AlertTriangle,
  ChevronRight,
  Star,
  Activity,
} from "lucide-react";

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
  "#3ae8d4",
  "#e8d43a",
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
    className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
    style={{
      width: size,
      height: size,
      background: avatarBg(name),
      fontSize: size * 0.34,
      fontFamily: "'DM Mono', monospace",
    }}
  >
    {initials(name)}
  </div>
);

const Chip = ({ status }) => {
  const s = ST[status] || ST.open;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-widest whitespace-nowrap"
      style={{
        background: s.bg,
        color: s.txt,
        border: `1px solid ${s.border}`,
        fontSize: 9,
        fontFamily: "'DM Mono', monospace",
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
    className="inline-block rounded px-2.5 py-px font-bold uppercase tracking-widest"
    style={{
      color,
      background: `${color}18`,
      border: `1px solid ${color}38`,
      fontSize: 9,
      fontFamily: "'DM Mono', monospace",
    }}
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
      className="fixed z-[9999] flex items-center gap-2.5 px-4 py-3 rounded-xl"
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
        fontSize: 12,
        fontFamily: "'DM Mono', monospace",
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
      className="font-extrabold"
      style={{
        color: "#f0f4ff",
        fontSize: 13,
        fontFamily: "'Syne', sans-serif",
      }}
    >
      {title}
    </span>
    {count !== undefined && (
      <span
        className="px-2 py-px rounded"
        style={{
          background: `${accent}18`,
          color: accent,
          border: `1px solid ${accent}28`,
          fontSize: 10,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {count}
      </span>
    )}
    <div className="flex-1 h-px" style={{ background: "#1e2330" }} />
    {action && (
      <button
        onClick={action}
        className="cursor-pointer bg-transparent border-none whitespace-nowrap"
        style={{
          color: accent,
          fontSize: 10,
          fontFamily: "'DM Mono', monospace",
        }}
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
        className="font-extrabold leading-none mb-1"
        style={{
          fontSize: 22,
          color: "#f0f4ff",
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {value}
      </div>
      <div
        className="uppercase tracking-widest"
        style={{
          fontSize: 9,
          color: "#6b7a99",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {label}
      </div>
      {sub && (
        <div
          className="mt-0.5"
          style={{
            fontSize: 9,
            color: accent,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  </motion.div>
);

// ─── Modal ────────────────────────────────────────────────────────────────────
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
      className="relative rounded-2xl w-full max-w-lg overflow-y-auto shadow-2xl"
      style={{
        background: "#0f1219",
        border: "1px solid #252d3e",
        maxHeight: "90dvh",
      }}
    >
      <div
        className="flex items-center justify-between px-6 pt-6 pb-4"
        style={{ borderBottom: "1px solid #1e2330" }}
      >
        <h2
          className="font-extrabold"
          style={{
            color: "#f0f4ff",
            fontSize: 17,
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {title}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer border-none transition-colors"
          style={{ background: "transparent", color: "#8892a4" }}
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
  const [form, setForm] = useState({ githubPrLink: "", closureNote: "" });
  const [saving, setSaving] = useState(false);
  const handle = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSubmit(log._id, form);
    setSaving(false);
  };
  return (
    <Modal title="Submit Task for Review" onClose={onClose}>
      <div
        className="mb-5 p-3 rounded-xl"
        style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
      >
        <p
          style={{
            color: "#8892a4",
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
            lineHeight: 1.6,
          }}
        >
          Submitting:{" "}
          <span style={{ color: "#f0f4ff", fontWeight: "bold" }}>
            {log.taskTitle}
          </span>
          <br />
          Provide your work link so the coordinator can review and award your
          points.
        </p>
      </div>
      <form onSubmit={handle} className="space-y-4">
        <div>
          <label
            className="block mb-1.5 font-bold uppercase tracking-widest"
            style={{
              fontSize: 10,
              color: "#6b7a99",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            GitHub PR / Commit Link <span style={{ color: "#4ade80" }}>*</span>
          </label>
          <div className="relative">
            <LinkIcon
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2"
              style={{ color: "#6b7a99" }}
            />
            <input
              type="url"
              required
              placeholder="https://github.com/..."
              value={form.githubPrLink}
              onChange={(e) =>
                setForm({ ...form, githubPrLink: e.target.value })
              }
              className="w-full rounded-lg pl-9 p-2.5 outline-none transition-colors"
              style={{
                background: "#0c0f18",
                border: "1px solid #1e2330",
                color: "#f0f4ff",
                fontSize: 13,
                fontFamily: "'DM Mono', monospace",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#4ade8050")}
              onBlur={(e) => (e.target.style.borderColor = "#1e2330")}
            />
          </div>
        </div>
        <div>
          <label
            className="block mb-1.5 font-bold uppercase tracking-widest"
            style={{
              fontSize: 10,
              color: "#6b7a99",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Completion Note (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Any details the reviewer should know..."
            value={form.closureNote}
            onChange={(e) => setForm({ ...form, closureNote: e.target.value })}
            className="w-full rounded-lg p-3 outline-none transition-colors resize-none"
            style={{
              background: "#0c0f18",
              border: "1px solid #1e2330",
              color: "#f0f4ff",
              fontSize: 13,
              fontFamily: "'DM Mono', monospace",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#4ade8050")}
            onBlur={(e) => (e.target.style.borderColor = "#1e2330")}
          />
        </div>
        <div className="flex gap-3 justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-bold cursor-pointer transition-colors bg-transparent border-none"
            style={{
              color: "#6b7a99",
              fontSize: 12,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !form.githubPrLink}
            className="px-5 py-2 rounded-lg font-bold text-white flex items-center gap-2 cursor-pointer disabled:opacity-50 border-none"
            style={{
              background: "#08271a",
              color: "#4ade80",
              border: "1px solid #4ade8035",
              fontSize: 12,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {saving && <Loader2 size={14} className="animate-spin" />} Submit
            Work
          </button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Community Join Banner ─────────────────────────────────────────────────────
const CommunityBanner = ({ link, projectTitle }) => {
  if (!link) return null;
  return (
    <motion.a
      href={link}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="block rounded-2xl p-4 no-underline relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg,#1a0a2e 0%,#0d1a2e 50%,#0a1a12 100%)",
        border: "1px solid #9c3ae830",
      }}
    >
      {/* Glow blobs */}
      <div
        className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle,#9c3ae820,transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle,#3a9de815,transparent 70%)",
        }}
      />
      <div className="relative z-10 flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#9c3ae820", border: "1px solid #9c3ae840" }}
        >
          <MessageSquare size={22} style={{ color: "#b565f5" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-extrabold mb-0.5"
            style={{
              color: "#f0f4ff",
              fontSize: 14,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            Join the Community
          </div>
          <div
            style={{
              color: "#8892a4",
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Connect with contributors of{" "}
            <span style={{ color: "#b565f5" }}>
              {projectTitle || "this project"}
            </span>
          </div>
        </div>
        <div
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl font-bold"
          style={{
            background: "#9c3ae825",
            border: "1px solid #9c3ae845",
            color: "#b565f5",
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Join Now <ExternalLink size={12} />
        </div>
      </div>
    </motion.a>
  );
};

// ─── Coordinator Card ──────────────────────────────────────────────────────────
const CoordinatorCard = ({ coordinator }) => {
  if (!coordinator)
    return (
      <div
        className="rounded-xl p-4 text-center"
        style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
      >
        <p
          style={{
            color: "#4a5568",
            fontSize: 11,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          No coordinator assigned yet.
        </p>
      </div>
    );
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "#0c0f18", border: "1px solid #3a9de820" }}
    >
      <div className="flex items-start gap-3">
        <Av name={coordinator.name} size={40} />
        <div className="flex-1 min-w-0">
          <div
            className="font-extrabold mb-0.5 truncate"
            style={{
              color: "#f0f4ff",
              fontSize: 13,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {coordinator.name}
          </div>
          <div
            className="mb-2"
            style={{
              color: "#3a9de8",
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
          >
            Project Coordinator
          </div>
          <div className="space-y-1.5">
            {coordinator.email && (
              <a
                href={`mailto:${coordinator.email}`}
                className="flex items-center gap-2 no-underline group"
                style={{ color: "#8892a4" }}
              >
                <Mail size={12} style={{ color: "#3a9de8", flexShrink: 0 }} />
                <span
                  className="truncate group-hover:text-white transition-colors"
                  style={{ fontSize: 11, fontFamily: "'DM Mono', monospace" }}
                >
                  {coordinator.email}
                </span>
              </a>
            )}
            {coordinator.phone && (
              <a
                href={`tel:${coordinator.phone}`}
                className="flex items-center gap-2 no-underline group"
                style={{ color: "#8892a4" }}
              >
                <Phone size={12} style={{ color: "#4ade80", flexShrink: 0 }} />
                <span
                  className="group-hover:text-white transition-colors"
                  style={{ fontSize: 11, fontFamily: "'DM Mono', monospace" }}
                >
                  {coordinator.phone}
                </span>
              </a>
            )}
            {coordinator.college && (
              <div
                className="flex items-center gap-2"
                style={{ color: "#6b7a99" }}
              >
                <BookOpen
                  size={12}
                  style={{ color: "#fbbf24", flexShrink: 0 }}
                />
                <span
                  className="truncate"
                  style={{ fontSize: 11, fontFamily: "'DM Mono', monospace" }}
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
            className="font-bold leading-tight truncate mb-0.5"
            style={{
              color: "#f0f4ff",
              fontSize: 13,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {log.taskTitle}
          </div>
          <div
            style={{
              color: "#6b7a99",
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {proj} · {fmtDate(log.createdAt)}
          </div>
        </div>
        <Chip status={overdue ? "terminated" : log.task_status} />
      </div>

      {log.description && (
        <p
          className="leading-relaxed mb-2.5"
          style={{
            color: "#8892a4",
            fontSize: 11,
            fontFamily: "'DM Mono', monospace",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {log.description}
        </p>
      )}

      <div
        className="flex flex-wrap gap-2 items-center mt-1.5"
        style={{ fontSize: 11, fontFamily: "'DM Mono', monospace" }}
      >
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
              className="no-underline hover:opacity-75 transition-opacity font-bold bg-transparent border-none cursor-pointer"
              style={{
                color: "#4ade80",
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              ✓ Mark Complete
            </button>
          )}
        </div>
      </div>

      {log.requirements && (
        <details className="mt-2.5 group">
          <summary
            className="cursor-pointer list-none flex items-center gap-1 select-none"
            style={{
              color: "#6b7a99",
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            <span className="group-open:rotate-90 transition-transform inline-block">
              ▶
            </span>{" "}
            Requirements
          </summary>
          <p
            className="leading-relaxed mt-1.5 pl-3"
            style={{
              color: "#8892a4",
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
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
          className="mt-3 w-full py-2.5 rounded-lg font-bold cursor-pointer disabled:opacity-50 transition-all flex justify-center items-center gap-2 active:scale-[0.98]"
          style={{
            background: "#08251a",
            border: "1px solid #4ade8038",
            color: "#4ade80",
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.05em",
            WebkitTapHighlightColor: "transparent",
          }}
        >
          {claiming ? <Loader2 size={14} className="animate-spin" /> : "✋"}{" "}
          {claiming ? "Initiating..." : "I'm Interested — Initiate Task"}
        </button>
      )}
    </div>
  );
};

// ─── Project Card ──────────────────────────────────────────────────────────────
const ProjCard = ({ p, onClick }) => {
  const done = p.myTasksDone ?? 0;
  const active = p.myTasksActive ?? 0;
  const hasCommunity = !!p.communityLink;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="rounded-2xl p-4 cursor-pointer transition-all active:opacity-90 relative overflow-hidden"
      style={{
        background: "#0c0f18",
        border: "1px solid #1e2330",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {hasCommunity && (
        <div className="absolute top-3 right-3">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: "#9c3ae8", boxShadow: "0 0 6px #9c3ae8" }}
          />
        </div>
      )}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold flex-shrink-0"
          style={{
            background: "#3a9de815",
            border: "1px solid #3a9de828",
            color: "#3a9de8",
            fontSize: 10,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {p.projectID?.slice(-3)}
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-bold leading-tight truncate"
            style={{
              color: "#f0f4ff",
              fontSize: 13,
              fontFamily: "'Syne', sans-serif",
            }}
          >
            {p.problem?.title || "—"}
          </div>
          <div
            className="mt-0.5"
            style={{
              color: "#6b7a99",
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
            }}
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

      {/* Quick links row */}
      <div className="flex gap-2 mb-3">
        {p.communityLink && (
          <a
            href={p.communityLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg no-underline transition-opacity hover:opacity-80"
            style={{
              background: "#9c3ae815",
              border: "1px solid #9c3ae830",
              color: "#b565f5",
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            <MessageSquare size={11} /> Community
          </a>
        )}
        {p.githubRepoLink && (
          <a
            href={p.githubRepoLink}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg no-underline transition-opacity hover:opacity-80"
            style={{
              background: "#3a9de815",
              border: "1px solid #3a9de830",
              color: "#3a9de8",
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            <Github size={11} /> Repo
          </a>
        )}
      </div>

      <div className="mb-3">
        <div
          className="flex justify-between mb-1"
          style={{
            fontSize: 10,
            color: "#6b7a99",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          <span>{p.projectProgressRate ?? 0}% overall</span>
          <span>
            {done}/{p.myLogs?.length ?? 0} my tasks
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
          ["Score", p.myScore, "#fbbf24"],
          ["Active", active, "#fb923c"],
          ["Done", done, "#4ade80"],
        ].map(([l, v, c]) => (
          <div
            key={l}
            className="text-center py-1.5 rounded-lg"
            style={{ background: "#131825" }}
          >
            <div
              className="font-extrabold"
              style={{
                fontSize: 13,
                color: c,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {v}
            </div>
            <div
              className="uppercase tracking-widest mt-0.5"
              style={{
                fontSize: 7,
                color: "#6b7a99",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {l}
            </div>
          </div>
        ))}
      </div>
      {/* Coordinator name row */}
      {p.coordinators?.length > 0 && (
        <div
          className="flex items-center gap-2 mt-2 px-2 py-1.5 rounded-lg"
          style={{ background: "#131825" }}
        >
          <Trophy size={10} style={{ color: "#9c3ae8", flexShrink: 0 }} />
          <span
            className="truncate font-bold"
            style={{
              color: "#9c3ae8",
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {p.coordinators[0].name}
            {p.coordinators.length > 1 && (
              <span style={{ color: "#6b7a99" }}>
                {" "}
                +{p.coordinators.length - 1}
              </span>
            )}
          </span>
          <span
            className="uppercase tracking-widest flex-shrink-0"
            style={{
              color: "#6b7a99",
              fontSize: 7,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            Coord
          </span>
        </div>
      )}
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
        className="w-7 text-center font-bold flex-shrink-0"
        style={{
          color: isMe ? "#fbbf24" : "#6b7a99",
          fontSize: 11,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {medal || `#${rank}`}
      </div>
      <Av name={name} size={26} />
      <div className="flex-1 min-w-0">
        <div
          className="font-bold truncate"
          style={{
            color: isMe ? "#fbbf24" : "#f0f4ff",
            fontSize: 12,
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {name}
          {isMe && (
            <span
              style={{
                color: "#e85d3a",
                fontSize: 8,
                marginLeft: 4,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              (you)
            </span>
          )}
        </div>
        {dept && (
          <div
            style={{
              color: "#6b7a99",
              fontSize: 9,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {dept}
          </div>
        )}
      </div>
      <div
        className="font-extrabold"
        style={{
          color: isMe ? "#fbbf24" : "#c4cedf",
          fontSize: 13,
          fontFamily: "'Syne', sans-serif",
        }}
      >
        {score}
      </div>
    </div>
  );
};

// ─── Enhanced Project Drawer ───────────────────────────────────────────────────
const ProjectDrawer = ({
  drawer,
  logs,
  openLogs,
  claiming,
  onClaim,
  onClose,
  onMarkComplete,
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="proj-drawer fixed z-[500] shadow-2xl overflow-y-auto"
      style={{
        background: "#0a0d16",
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

      {/* Header */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-3.5"
        style={{
          background: "#0a0d16ee",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid #1e2330",
        }}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold flex-shrink-0"
            style={{
              background: "#3a9de820",
              border: "1px solid #3a9de840",
              color: "#3a9de8",
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {drawer.projectID?.slice(-3)}
          </div>
          <div className="min-w-0">
            <div
              className="uppercase tracking-widest"
              style={{
                color: "#3a9de8",
                fontSize: 9,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {drawer.projectID}
            </div>
            <div
              className="font-extrabold leading-tight truncate"
              style={{
                color: "#f0f4ff",
                fontSize: 13,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {drawer.problem?.title || "—"}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className="px-2 py-1 rounded-lg"
            style={{
              background: drawer.is_blocked ? "#280a0a" : "#08271a",
              color: drawer.is_blocked ? "#f87171" : "#4ade80",
              border: `1px solid ${drawer.is_blocked ? "#f8717120" : "#4ade8020"}`,
              fontSize: 10,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {drawer.is_blocked ? "🔒 Blocked" : "🟢 Active"}
          </span>
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
      </div>

      <div
        className="p-4 sm:p-5 space-y-5"
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 32px)",
        }}
      >
        {/* 🔥 Community Join — PROMINENT FIRST */}
        {drawer.communityLink && (
          <CommunityBanner
            link={drawer.communityLink}
            projectTitle={drawer.problem?.title}
          />
        )}

        {/* My Contribution */}
        <div
          className="rounded-xl p-4"
          style={{ background: "#101520", border: "1px solid #1e2330" }}
        >
          <div
            className="font-bold uppercase tracking-widest mb-3"
            style={{
              color: "#3a9de8",
              fontSize: 9,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            ◆ My Contribution
          </div>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[
              ["Score", drawer.myScore, "#fbbf24"],
              ["Done", drawer.myTasksDone, "#4ade80"],
              ["Active", drawer.myTasksActive, "#fb923c"],
              ["Logs", myLogs.length, "#3a9de8"],
            ].map(([l, v, c]) => (
              <div
                key={l}
                className="text-center py-2 rounded-lg"
                style={{ background: "#0c0f18" }}
              >
                <div
                  className="font-extrabold"
                  style={{
                    fontSize: 16,
                    color: c,
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  {v}
                </div>
                <div
                  className="uppercase"
                  style={{
                    fontSize: 8,
                    color: "#6b7a99",
                    fontFamily: "'DM Mono', monospace",
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
                fontSize: 11,
                color: "#9c3ae8",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Role: <span style={{ color: "#f0f4ff" }}>{drawer.myRole}</span>
            </div>
          )}
          {drawer.myDescription && (
            <p
              className="mt-1 leading-relaxed"
              style={{
                color: "#8892a4",
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {drawer.myDescription}
            </p>
          )}
        </div>

        {/* Project Details */}
        <div
          className="rounded-xl p-4"
          style={{ background: "#101520", border: "1px solid #1e2330" }}
        >
          <div
            className="font-bold uppercase tracking-widest mb-3"
            style={{
              color: "#fbbf24",
              fontSize: 9,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            ◆ Project Details
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              {
                l: "Contributors",
                v: drawer.contributors?.length ?? 0,
                c: "#3a9de8",
                i: <Users size={12} />,
              },
              {
                l: "Progress",
                v: `${drawer.projectProgressRate ?? 0}%`,
                c: "#4ade80",
                i: <Activity size={12} />,
              },
              {
                l: "Tasks Done",
                v: drawer.totalTasksCompleted ?? 0,
                c: "#4ade80",
                i: <CheckCircle size={12} />,
              },
              {
                l: "Total Tasks",
                v: drawer.totalTasksCreated ?? 0,
                c: "#fbbf24",
                i: <Zap size={12} />,
              },
              {
                l: "Points Given",
                v: drawer.totalPointsDistributed ?? 0,
                c: "#e85d3a",
                i: <Star size={12} />,
              },
            ].map(({ l, v, c, i }) => (
              <div
                key={l}
                className="flex items-center gap-2.5 p-2.5 rounded-lg"
                style={{ background: "#0c0f18" }}
              >
                <div style={{ color: c }}>{i}</div>
                <div>
                  <div
                    className="font-extrabold"
                    style={{
                      fontSize: 14,
                      color: c,
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    {v}
                  </div>
                  <div
                    className="uppercase tracking-widest"
                    style={{
                      fontSize: 8,
                      color: "#6b7a99",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {l}
                  </div>
                </div>
              </div>
            ))}
            {/* Coordinator name cell — spans full width if only one, otherwise shows first + count */}
            <div
              className="col-span-2 flex items-center gap-2.5 p-2.5 rounded-lg"
              style={{ background: "#0c0f18", border: "1px solid #9c3ae820" }}
            >
              <Trophy size={12} style={{ color: "#9c3ae8", flexShrink: 0 }} />
              <div className="min-w-0 flex-1">
                <div
                  className="font-extrabold truncate"
                  style={{
                    fontSize: 13,
                    color: "#9c3ae8",
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  {coordinators.length === 0
                    ? "Unassigned"
                    : coordinators.length === 1
                      ? coordinators[0].name
                      : `${coordinators[0].name} +${coordinators.length - 1} more`}
                </div>
                <div
                  className="uppercase tracking-widest"
                  style={{
                    fontSize: 8,
                    color: "#6b7a99",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {coordinators.length <= 1 ? "Coordinator" : "Coordinators"}
                </div>
              </div>
              {coordinators.length > 0 && coordinators[0].email && (
                <a
                  href={`mailto:${coordinators[0].email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="flex-shrink-0 flex items-center gap-1 no-underline hover:opacity-80 px-2 py-1 rounded-lg"
                  style={{
                    background: "#9c3ae815",
                    color: "#b565f5",
                    fontSize: 10,
                    fontFamily: "'DM Mono', monospace",
                    border: "1px solid #9c3ae828",
                  }}
                >
                  <Mail size={10} /> Mail
                </a>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div>
            <div
              className="flex justify-between mb-1"
              style={{
                fontSize: 10,
                color: "#6b7a99",
                fontFamily: "'DM Mono', monospace",
              }}
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
                  background: "linear-gradient(90deg,#3a9de8,#9c3ae8)",
                  boxShadow: "0 0 8px #3a9de860",
                }}
              />
            </div>
          </div>
        </div>

        {/* Problem Description */}
        {drawer.problem?.description && (
          <div
            className="rounded-xl p-4"
            style={{ background: "#101520", border: "1px solid #1e2330" }}
          >
            <div
              className="font-bold uppercase tracking-widest mb-2"
              style={{
                color: "#6b7a99",
                fontSize: 9,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              ◆ Problem Statement
            </div>
            <p
              className="leading-relaxed"
              style={{
                color: "#8892a4",
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {drawer.problem.description}
            </p>
            <div className="flex gap-1.5 flex-wrap mt-3">
              {drawer.problem?.theme && (
                <Tag color="#9c3ae8">{drawer.problem.theme}</Tag>
              )}
              {drawer.problem?.category && (
                <Tag color="#3a9de8">{drawer.problem.category}</Tag>
              )}
              {(drawer.problem?.tags || []).map((t) => (
                <Tag key={t} color="#6b7a99">
                  {t}
                </Tag>
              ))}
            </div>
          </div>
        )}

        {/* Coordinators */}
        {coordinators.length > 0 && (
          <div>
            <div
              className="font-bold uppercase tracking-widest mb-3"
              style={{
                color: "#3a9de8",
                fontSize: 9,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              ◆ Coordinators ({coordinators.length})
            </div>
            <div className="space-y-2">
              {coordinators.map((coord, i) => (
                <CoordinatorCard key={coord._id || i} coordinator={coord} />
              ))}
            </div>
          </div>
        )}

        {/* Problem Owner / Organization */}
        {drawer.problem?.ownerName && (
          <div
            className="rounded-xl p-4"
            style={{ background: "#101520", border: "1px solid #fbbf2415" }}
          >
            <div
              className="font-bold uppercase tracking-widest mb-3"
              style={{
                color: "#fbbf24",
                fontSize: 9,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              ◆ Problem Sponsor
            </div>
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "#fbbf2415",
                  border: "1px solid #fbbf2428",
                }}
              >
                <BookOpen size={16} style={{ color: "#fbbf24" }} />
              </div>
              <div className="flex-1 min-w-0">
                <div
                  className="font-bold"
                  style={{
                    color: "#f0f4ff",
                    fontSize: 13,
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  {drawer.problem.ownerName}
                </div>
                {drawer.problem.organization && (
                  <div
                    style={{
                      color: "#fbbf24",
                      fontSize: 11,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {drawer.problem.organization}
                  </div>
                )}
                {drawer.problem.department && (
                  <div
                    style={{
                      color: "#6b7a99",
                      fontSize: 11,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {drawer.problem.department}
                  </div>
                )}
                <div className="flex gap-3 mt-2 flex-wrap">
                  {drawer.problem.contactInfo && (
                    <a
                      href={`mailto:${drawer.problem.contactInfo}`}
                      className="flex items-center gap-1.5 no-underline hover:opacity-80"
                      style={{
                        color: "#3a9de8",
                        fontSize: 11,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      <Mail size={11} /> {drawer.problem.contactInfo}
                    </a>
                  )}
                  {drawer.problem.Phone && (
                    <a
                      href={`tel:${drawer.problem.Phone}`}
                      className="flex items-center gap-1.5 no-underline hover:opacity-80"
                      style={{
                        color: "#4ade80",
                        fontSize: 11,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      <Phone size={11} /> {drawer.problem.Phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contributors List */}
        {drawer.contributors?.length > 0 && (
          <div>
            <div
              className="font-bold uppercase tracking-widest mb-3"
              style={{
                color: "#4ade80",
                fontSize: 9,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              ◆ Contributors ({drawer.contributors.length})
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {drawer.contributors.slice(0, 8).map((c, i) => (
                <div
                  key={c._id || i}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg"
                  style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
                >
                  <Av name={c.name || "?"} size={28} />
                  <div className="min-w-0 flex-1">
                    <div
                      className="font-bold truncate"
                      style={{
                        color: "#f0f4ff",
                        fontSize: 11,
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {c.name || "Unknown"}
                    </div>
                    {c.branch && (
                      <div
                        style={{
                          color: "#6b7a99",
                          fontSize: 9,
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {c.branch}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {drawer.contributors.length > 8 && (
                <div
                  className="flex items-center justify-center p-2.5 rounded-lg"
                  style={{
                    background: "#0c0f18",
                    border: "1px dashed #1e2330",
                  }}
                >
                  <span
                    style={{
                      color: "#6b7a99",
                      fontSize: 11,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    +{drawer.contributors.length - 8} more
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Project Links */}
        <div>
          <div
            className="font-bold uppercase tracking-widest mb-2.5"
            style={{
              color: "#6b7a99",
              fontSize: 9,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            ◆ Project Links
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              {
                l: "GitHub Repo",
                href: drawer.githubRepoLink,
                c: "#3a9de8",
                i: <Github size={14} />,
              },
              {
                l: "Live Demo",
                href: drawer.liveHostedLink,
                c: "#4ade80",
                i: <ExternalLink size={14} />,
              },
              {
                l: "Resources",
                href: drawer.resourcesLink,
                c: "#fbbf24",
                i: <BookOpen size={14} />,
              },
              {
                l: "Community",
                href: drawer.communityLink,
                c: "#9c3ae8",
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
                  className="flex items-center gap-2 rounded-xl p-3 no-underline active:opacity-70 transition-opacity"
                  style={{
                    background: lnk.highlight ? "#9c3ae812" : "#101520",
                    border: `1px solid ${lnk.highlight ? "#9c3ae830" : "#1e2330"}`,
                    WebkitTapHighlightColor: "transparent",
                  }}
                >
                  <span style={{ color: lnk.c }}>{lnk.i}</span>
                  <div>
                    <div
                      className="uppercase tracking-widest"
                      style={{
                        color: "#6b7a99",
                        fontSize: 9,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {lnk.l}
                    </div>
                    <div
                      className="mt-px"
                      style={{
                        color: lnk.c,
                        fontSize: 10,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      Open ↗
                    </div>
                  </div>
                </a>
              ))}
          </div>
        </div>

        {/* Available Tasks */}
        {drawerOpenLogs.length > 0 && (
          <div>
            <div
              className="font-bold uppercase tracking-widest mb-3"
              style={{
                color: "#4ade80",
                fontSize: 9,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              ◆ Available Tasks ({drawerOpenLogs.length})
            </div>
            <div className="space-y-2.5">
              {drawerOpenLogs.map((l) => (
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

        {/* My Logs */}
        {myLogs.length > 0 && (
          <div>
            <div
              className="font-bold uppercase tracking-widest mb-3"
              style={{
                color: "#e85d3a",
                fontSize: 9,
                fontFamily: "'DM Mono', monospace",
              }}
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
};

// ─── Bottom Nav ────────────────────────────────────────────────────────────────
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
              className="absolute top-1.5 right-2 w-4 h-4 rounded-full flex items-center justify-center font-bold"
              style={{
                background: "#3a9de8",
                color: "#fff",
                fontSize: 8,
                fontFamily: "'DM Mono', monospace",
              }}
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
            className="font-bold uppercase tracking-widest transition-all"
            style={{ fontSize: 8, fontFamily: "'DM Mono', monospace" }}
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
      } else boom(r.message || "Failed to initiate task.", "error");
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
      } else boom(r.message || "Failed to submit task.", "error");
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
    *{box-sizing:border-box;-webkit-font-smoothing:antialiased}
    @keyframes spin{to{transform:rotate(360deg)}}
    @keyframes slideUp{from{transform:translateX(-50%) translateY(14px);opacity:0}to{transform:translateX(-50%) translateY(0);opacity:1}}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.94)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    ::-webkit-scrollbar{width:4px;height:4px}
    ::-webkit-scrollbar-track{background:#0c0f18}
    ::-webkit-scrollbar-thumb{background:#252d3e;border-radius:3px}
    details summary::-webkit-details-marker{display:none}
    html{scroll-behavior:smooth}
    .animate-spin{animation:spin 1s linear infinite}
    @media(min-width:640px){
      .proj-drawer{
        top:0!important;bottom:auto!important;right:0!important;left:auto!important;
        width:100%!important;max-width:460px!important;max-height:100dvh!important;
        height:100dvh!important;border-radius:0!important;
        border-top:none!important;border-left:1px solid #252d3e!important;
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
          className="w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-white text-2xl"
          style={{
            background: "#1e2330",
            animation: "pulse 1.5s ease-in-out infinite",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          ◎
        </div>
        <p
          className="uppercase tracking-widest"
          style={{
            color: "#6b7a99",
            fontSize: 11,
            fontFamily: "'DM Mono', monospace",
          }}
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
          className="font-extrabold text-xl text-center"
          style={{ color: "#f0f4ff", fontFamily: "'Syne', sans-serif" }}
        >
          Not Logged In
        </p>
        <p
          className="text-center"
          style={{
            color: "#6b7a99",
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Please log in to access your dashboard.
        </p>
        {navigate && (
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-2.5 rounded-xl font-extrabold cursor-pointer mt-2 border-none"
            style={{
              background: "#3a9de8",
              color: "#fff",
              fontSize: 13,
              fontFamily: "'Syne', sans-serif",
            }}
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
        className="min-h-screen"
        style={{
          background: "#070a12",
          color: "#f0f4ff",
          fontFamily: "'DM Mono', monospace",
        }}
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
          <div
            className="absolute"
            style={{
              top: "40%",
              left: "60%",
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,#e85d3a04 0%,transparent 70%)",
            }}
          />
        </div>

        {/* TOP NAV */}
        <nav
          className="sticky top-0 z-[100] flex items-center justify-between px-4 h-14"
          style={{
            background: "#070a12cc",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid #1e233060",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-extrabold text-white text-sm flex-shrink-0"
              style={{
                background: "#1e2330",
                border: "1px solid #252d3e",
                fontFamily: "'Syne', sans-serif",
              }}
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
                className="font-bold uppercase tracking-widest"
                style={{
                  color: "#4ade80",
                  fontSize: 10,
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                Live
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="px-3 py-1.5 rounded-lg cursor-pointer transition-colors active:scale-95 border-none"
              style={{
                background: "#1e2330",
                border: "1px solid #252d3e",
                color: "#8892a4",
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
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
                    className="font-bold"
                    style={{
                      color: "#f0f4ff",
                      fontSize: 11,
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    {student.name?.split(" ")[0]}
                  </div>
                  <div
                    style={{
                      color: "#6b7a99",
                      fontSize: 9,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    #{ranking?.myRank ?? "—"} Global
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* DESKTOP TAB BAR */}
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
              className="flex items-center gap-1.5 px-4 py-2.5 font-bold uppercase tracking-widest cursor-pointer whitespace-nowrap border-b-2 bg-transparent transition-colors"
              style={{
                color: tab === t.id ? "#3a9de8" : "#6b7a99",
                borderColor: tab === t.id ? "#3a9de8" : "transparent",
                marginBottom: -1,
                fontSize: 11,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {t.label}
              {t.badge !== undefined && (
                <span
                  className="px-1.5 py-px rounded-full"
                  style={{
                    background: tab === t.id ? "#3a9de818" : "#1e2330",
                    color: tab === t.id ? "#3a9de8" : "#6b7a99",
                    fontSize: 9,
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
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
              <div className="flex items-start gap-3 sm:gap-4 flex-wrap mb-4 sm:mb-5">
                <Av name={student?.name || ""} size={52} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1
                      className="font-extrabold leading-tight"
                      style={{
                        fontSize: "clamp(16px, 4vw, 22px)",
                        color: "#f0f4ff",
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {student?.name}
                    </h1>
                    <span
                      className="px-2.5 py-0.5 rounded-full"
                      style={
                        student?.isBlocked
                          ? {
                              background: "#2d0a0a",
                              color: "#f87171",
                              border: "1px solid #f8717128",
                              fontSize: 10,
                              fontFamily: "'DM Mono', monospace",
                            }
                          : {
                              background: "#08221a",
                              color: "#4ade80",
                              border: "1px solid #4ade8028",
                              fontSize: 10,
                              fontFamily: "'DM Mono', monospace",
                            }
                      }
                    >
                      {student?.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </div>
                  <div
                    className="mb-2"
                    style={{
                      color: "#6b7a99",
                      fontSize: 11,
                      fontFamily: "'DM Mono', monospace",
                    }}
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
                  {student?.githubLink && (
                    <a
                      href={student.githubLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 no-underline hover:opacity-75"
                      style={{
                        color: "#3a9de8",
                        fontSize: 11,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      <Github size={12} /> GitHub Profile ↗
                    </a>
                  )}
                </div>
                {/* Rank badge */}
                <div
                  className="text-center rounded-2xl px-4 py-3 flex-shrink-0 ml-auto sm:ml-0"
                  style={{ border: "1px solid #1e2330" }}
                >
                  <div
                    className="uppercase tracking-widest mb-0.5"
                    style={{
                      color: "#6b7a99",
                      fontSize: 8,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    Global Rank
                  </div>
                  <div
                    className="font-extrabold"
                    style={{
                      fontSize: 24,
                      color: "#fbbf24",
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    #{ranking?.myRank ?? "—"}
                  </div>
                  <div
                    className="mt-0.5"
                    style={{
                      color: "#6b7a99",
                      fontSize: 9,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    of {ranking?.totalStudents ?? "—"}
                  </div>
                </div>
              </div>

              {/* Stats strip */}
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
                      style={{
                        color: s.c,
                        fontSize: 11,
                        fontFamily: "'DM Mono', monospace",
                        marginBottom: 2,
                      }}
                    >
                      {s.i}
                    </div>
                    <div
                      className="font-extrabold leading-none"
                      style={{
                        fontSize: 14,
                        color: s.c,
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {s.v}
                    </div>
                    <div
                      className="uppercase tracking-widest mt-0.5"
                      style={{
                        fontSize: 7,
                        color: "#6b7a99",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {s.l}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile extra stats */}
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
                      className="font-extrabold"
                      style={{
                        color: s.c,
                        fontSize: 11,
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {s.v}
                    </span>
                    <span
                      className="uppercase tracking-widest"
                      style={{
                        color: "#6b7a99",
                        fontSize: 9,
                        fontFamily: "'DM Mono', monospace",
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
              <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                {/* Community Links Strip — show if any project has community */}
                {(projects || []).filter((p) => p.communityLink).length > 0 && (
                  <div>
                    <SH
                      title="Community Spaces"
                      accent="#9c3ae8"
                      count={
                        (projects || []).filter((p) => p.communityLink).length
                      }
                    />
                    <div className="space-y-2">
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

                {/* Bricks */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  <Brick
                    icon={<Star size={16} />}
                    label="Total Score"
                    value={stats?.totalScore}
                    accent="#fbbf24"
                  />
                  <Brick
                    icon={<Zap size={16} />}
                    label="Points Earned"
                    value={stats?.totalPoints}
                    accent="#e85d3a"
                  />
                  <Brick
                    icon={<CheckCircle size={16} />}
                    label="Tasks Done"
                    value={stats?.completedLogs}
                    accent="#4ade80"
                  />
                  <Brick
                    icon={<Clock size={16} />}
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
                          style={{
                            color: "#4a5568",
                            fontSize: 12,
                            fontFamily: "'DM Mono', monospace",
                          }}
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
                          className="text-center py-1"
                          style={{
                            color: "#4a5568",
                            fontSize: 10,
                            fontFamily: "'DM Mono', monospace",
                          }}
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
                      className="w-full py-2 rounded-lg font-bold cursor-pointer active:scale-[0.98] transition-transform border-none"
                      style={{
                        background: "#fbbf2410",
                        border: "1px solid #fbbf2428",
                        color: "#fbbf24",
                        fontSize: 11,
                        fontFamily: "'DM Mono', monospace",
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
                          style={{
                            color: "#4a5568",
                            fontSize: 11,
                            fontFamily: "'DM Mono', monospace",
                          }}
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
                        className="w-full py-2 rounded-lg font-bold cursor-pointer active:scale-[0.98] transition-transform border-none"
                        style={{
                          background: "#4ade8010",
                          border: "1px solid #4ade8028",
                          color: "#4ade80",
                          fontSize: 11,
                          fontFamily: "'DM Mono', monospace",
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

          {/* ── PROJECTS ── */}
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
                    style={{
                      color: "#4a5568",
                      fontSize: 13,
                      fontFamily: "'DM Mono', monospace",
                    }}
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

          {/* ── MY TASKS ── */}
          {tab === "tasks" && (
            <div>
              <div
                className="flex gap-2 mb-5 overflow-x-auto pb-1 -mx-1 px-1"
                style={{ scrollbarWidth: "none" }}
              >
                {Object.entries(LC).map(([k, c]) => (
                  <button
                    key={k}
                    onClick={() => setLFilter(k)}
                    className="flex-shrink-0 px-3 py-1.5 rounded-lg font-bold uppercase tracking-widest cursor-pointer transition-all active:scale-[0.97] border-none"
                    style={{
                      background: lFilter === k ? "#3a9de8" : "#0c0f18",
                      color: lFilter === k ? "#fff" : "#6b7a99",
                      border: `1px solid ${lFilter === k ? "#3a9de8" : "#1e2330"}`,
                      fontSize: 10,
                      fontFamily: "'DM Mono', monospace",
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
                    style={{
                      color: "#4a5568",
                      fontSize: 12,
                      fontFamily: "'DM Mono', monospace",
                    }}
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

          {/* ── AVAILABLE TASKS ── */}
          {tab === "open" && (
            <div>
              <SH
                title="Available Tasks to Claim"
                accent="#4ade80"
                count={openLogs?.length}
              />
              <p
                className="mb-5"
                style={{
                  color: "#6b7a99",
                  fontSize: 11,
                  fontFamily: "'DM Mono', monospace",
                }}
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
                    style={{
                      color: "#4a5568",
                      fontSize: 12,
                      fontFamily: "'DM Mono', monospace",
                    }}
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

          {/* ── RANKINGS ── */}
          {tab === "ranking" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
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
                      className="uppercase tracking-widest mb-2"
                      style={{
                        color: "#6b7a99",
                        fontSize: 8,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      Your Ranking
                    </div>
                    <div
                      className="font-extrabold mb-1"
                      style={{
                        fontSize: 40,
                        color: "#fbbf24",
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      #{ranking?.myRank ?? "—"}
                    </div>
                    <div
                      className="mb-4"
                      style={{
                        color: "#6b7a99",
                        fontSize: 11,
                        fontFamily: "'DM Mono', monospace",
                      }}
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
                            className="font-extrabold text-xl"
                            style={{
                              color: c,
                              fontFamily: "'Syne', sans-serif",
                            }}
                          >
                            {v}
                          </div>
                          <div
                            className="uppercase"
                            style={{
                              color: "#6b7a99",
                              fontSize: 9,
                              fontFamily: "'DM Mono', monospace",
                            }}
                          >
                            {l}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-left">
                      <div
                        className="flex justify-between mb-1"
                        style={{
                          color: "#6b7a99",
                          fontSize: 10,
                          fontFamily: "'DM Mono', monospace",
                        }}
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
                      className="font-bold uppercase tracking-widest mb-2.5"
                      style={{
                        color: "#e85d3a",
                        fontSize: 9,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      ◆ Project Scores
                    </div>
                    {!student?.projectWiseContribution?.length ? (
                      <p
                        style={{
                          color: "#4a5568",
                          fontSize: 11,
                          fontFamily: "'DM Mono', monospace",
                        }}
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
                                className="truncate"
                                style={{
                                  color: "#c4cedf",
                                  fontSize: 11,
                                  fontFamily: "'DM Mono', monospace",
                                }}
                              >
                                {proj?.problem?.title?.slice(0, 26) ||
                                  "Project"}
                              </div>
                              {c.role && (
                                <div
                                  style={{
                                    color: "#9c3ae8",
                                    fontSize: 9,
                                    fontFamily: "'DM Mono', monospace",
                                  }}
                                >
                                  {c.role}
                                </div>
                              )}
                            </div>
                            <div
                              className="font-extrabold flex-shrink-0"
                              style={{
                                color: "#fbbf24",
                                fontSize: 13,
                                fontFamily: "'Syne', sans-serif",
                              }}
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
                    className="grid px-3 sm:px-4 py-2.5 uppercase tracking-widest"
                    style={{
                      gridTemplateColumns: "1fr auto",
                      borderBottom: "1px solid #1e2330",
                      color: "#6b7a99",
                      fontSize: 9,
                      fontFamily: "'DM Mono', monospace",
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
                            className="w-6 text-center flex-shrink-0"
                            style={{
                              color: isMe ? "#fbbf24" : "#6b7a99",
                              fontSize: 11,
                              fontFamily: "'DM Mono', monospace",
                            }}
                          >
                            {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${i + 1}`}
                          </span>
                          <Av name={s.name} size={26} />
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-bold truncate"
                              style={{
                                color: isMe ? "#fbbf24" : "#f0f4ff",
                                fontSize: 12,
                                fontFamily: "'Syne', sans-serif",
                              }}
                            >
                              {s.name}
                              {isMe && (
                                <span
                                  style={{
                                    color: "#e85d3a",
                                    fontSize: 8,
                                    marginLeft: 4,
                                    fontFamily: "'DM Mono', monospace",
                                  }}
                                >
                                  (you)
                                </span>
                              )}
                            </div>
                            {s.department && (
                              <div
                                style={{
                                  color: "#6b7a99",
                                  fontSize: 9,
                                  fontFamily: "'DM Mono', monospace",
                                }}
                              >
                                {s.department}
                              </div>
                            )}
                          </div>
                          <div
                            className="font-extrabold flex-shrink-0"
                            style={{
                              color: isMe ? "#fbbf24" : "#c4cedf",
                              fontSize: 14,
                              fontFamily: "'Syne', sans-serif",
                            }}
                          >
                            {s.totalScore}
                          </div>
                        </div>
                      );
                    })}
                    {ranking?.myRank > 10 && (
                      <>
                        <div
                          className="text-center py-2"
                          style={{
                            color: "#4a5568",
                            fontSize: 10,
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          · · · {ranking.myRank - 10} more · · ·
                        </div>
                        <div
                          className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3"
                          style={{ background: "#18110a" }}
                        >
                          <span
                            className="w-6 text-center"
                            style={{
                              color: "#fbbf24",
                              fontSize: 11,
                              fontFamily: "'DM Mono', monospace",
                            }}
                          >
                            #{ranking.myRank}
                          </span>
                          <Av name={student?.name} size={26} />
                          <div className="flex-1 min-w-0">
                            <div
                              className="font-bold"
                              style={{
                                color: "#fbbf24",
                                fontSize: 12,
                                fontFamily: "'Syne', sans-serif",
                              }}
                            >
                              {student?.name}
                              <span
                                style={{
                                  color: "#e85d3a",
                                  fontSize: 8,
                                  marginLeft: 4,
                                  fontFamily: "'DM Mono', monospace",
                                }}
                              >
                                (you)
                              </span>
                            </div>
                            {student?.department && (
                              <div
                                style={{
                                  color: "#6b7a99",
                                  fontSize: 9,
                                  fontFamily: "'DM Mono', monospace",
                                }}
                              >
                                {student.department}
                              </div>
                            )}
                          </div>
                          <div
                            className="font-extrabold"
                            style={{
                              color: "#fbbf24",
                              fontSize: 14,
                              fontFamily: "'Syne', sans-serif",
                            }}
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

        {/* MOBILE BOTTOM NAV */}
        <BottomNav tab={tab} setTab={setTab} TABS={TABS} />

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
                  background: "rgba(0,0,0,.7)",
                  backdropFilter: "blur(6px)",
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
