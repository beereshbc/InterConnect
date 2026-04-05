import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

// ─── Utilities ────────────────────────────────────────────────────────────────
const fmtDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const fmtDatetime = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// Format hours into a human-readable string: 4 → "4h", 25 → "1d 1h", 48 → "2d"
const fmtHours = (h) => {
  if (h == null || h === 0) return "—";
  const n = Number(h);
  if (n < 24) return `${n}h`;
  const d = Math.floor(n / 24);
  const r = n % 24;
  return r > 0 ? `${d}d ${r}h` : `${d}d`;
};

// Resolve deadlineHours from a log (supports legacy deadlineDays)
const logHours = (log) =>
  log.deadlineHours != null ? log.deadlineHours : (log.deadlineDays || 7) * 24;

const daysLeft = (deadlineAt) => {
  if (!deadlineAt) return null;
  return Math.ceil((new Date(deadlineAt) - new Date()) / (1000 * 60 * 60 * 24));
};

const totalPoints = (logs = []) =>
  logs
    .filter((l) => l.task_status === "completed")
    .reduce((a, l) => a + (l.assignedTaskPoints || 0), 0);

const avatarColor = (name = "") => {
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

const initials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_MAP = {
  open: {
    label: "Open",
    cls: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    dot: "bg-blue-400",
  },
  assigned: {
    label: "Assigned",
    cls: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    dot: "bg-amber-400",
  },
  pending: {
    label: "Under Review",
    cls: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30",
    dot: "bg-indigo-400",
  },
  completed: {
    label: "Completed",
    cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  terminated: {
    label: "Terminated",
    cls: "bg-red-500/15 text-red-400 border border-red-500/30",
    dot: "bg-red-400",
  },
  blocked: {
    label: "Blocked",
    cls: "bg-red-500/15 text-red-400 border border-red-500/30",
    dot: "bg-red-400",
  },
  active: {
    label: "Active",
    cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    dot: "bg-emerald-400",
  },
};

// ─── Primitives ───────────────────────────────────────────────────────────────
const StatusPill = ({ status }) => {
  const s = STATUS_MAP[status] || STATUS_MAP.open;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase font-mono ${s.cls}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

const Avatar = ({ name = "", size = 36 }) => (
  <div
    className="rounded-full flex items-center justify-center font-bold text-white font-mono flex-shrink-0"
    style={{
      width: size,
      height: size,
      background: avatarColor(name),
      fontSize: size * 0.35,
    }}
  >
    {initials(name)}
  </div>
);

const Badge = ({ children, color = "#3a9de8" }) => (
  <span
    className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase font-mono"
    style={{ color, background: `${color}18`, border: `1px solid ${color}40` }}
  >
    {children}
  </span>
);

const ProgressBar = ({ value, color = "#e85d3a" }) => (
  <div>
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${value}%`,
          background: color,
          boxShadow: `0 0 8px ${color}80`,
        }}
      />
    </div>
    <span className="text-[10px] text-slate-500 font-mono mt-1 block">
      {value}% complete
    </span>
  </div>
);

const Spinner = ({ size = 20, color = "#e85d3a" }) => (
  <div
    className="rounded-full flex-shrink-0 animate-spin"
    style={{
      width: size,
      height: size,
      border: `2px solid ${color}30`,
      borderTopColor: color,
    }}
  />
);

const BTN_VARIANTS = {
  primary: "bg-[#e85d3a] text-white hover:bg-[#d14f2f]",
  secondary:
    "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700",
  ghost:
    "bg-transparent text-[#e85d3a] border border-[#e85d3a40] hover:border-[#e85d3a80]",
  danger: "bg-red-950 text-red-400 border border-red-500/30 hover:bg-red-900",
  success:
    "bg-emerald-950 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900",
  warn: "bg-amber-950 text-amber-400 border border-amber-500/30 hover:bg-amber-900",
  blue: "bg-blue-950 text-blue-400 border border-blue-500/30 hover:bg-blue-900",
  info: "bg-purple-950 text-purple-400 border border-purple-500/30 hover:bg-purple-900",
  indigo:
    "bg-indigo-950 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-900",
};

const Btn = ({
  children,
  onClick,
  variant = "primary",
  small,
  disabled,
  loading,
  className = "",
}) => (
  <button
    onClick={onClick}
    disabled={disabled || loading}
    className={`
      inline-flex items-center gap-1.5 rounded-lg font-bold font-display tracking-wide
      transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed
      ${small ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-[13px]"}
      ${BTN_VARIANTS[variant] || BTN_VARIANTS.primary}
      ${className}
    `}
  >
    {loading && <Spinner size={12} color="currentColor" />}
    {children}
  </button>
);

const ToastBar = ({ message, type = "success", onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 3200);
    return () => clearTimeout(t);
  }, []);
  const cfg = {
    success: { color: "#4ade80", icon: "✓" },
    error: { color: "#f87171", icon: "✕" },
    warn: { color: "#fbbf24", icon: "⚠" },
  }[type] || { color: "#4ade80", icon: "✓" };
  return (
    <div
      className="fixed bottom-7 right-7 z-[9999] flex items-center gap-3 px-5 py-3 rounded-xl font-mono text-sm text-slate-100 shadow-2xl"
      style={{
        background: "#0c0f18",
        border: `1px solid ${cfg.color}40`,
        borderLeft: `3px solid ${cfg.color}`,
        animation: "slideIn 0.25s ease",
      }}
    >
      <span style={{ color: cfg.color }}>{cfg.icon}</span>
      {message}
    </div>
  );
};

const Modal = ({ title, onClose, children, wide = false }) => (
  <div
    onClick={onClose}
    className="fixed inset-0 z-[1000] flex items-center justify-center p-5"
    style={{ background: "rgba(0,0,0,0.82)", backdropFilter: "blur(8px)" }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative bg-[#0f1219] border border-slate-700/60 rounded-2xl w-full overflow-y-auto shadow-2xl ${wide ? "max-w-3xl" : "max-w-2xl"}`}
      style={{
        maxHeight: "88vh",
        boxShadow: "0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px #ffffff08",
      }}
    >
      <div className="flex items-center justify-between px-8 pt-7 pb-5 border-b border-slate-800">
        <h2 className="text-lg font-extrabold text-slate-100 font-display tracking-tight">
          {title}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 flex items-center justify-center text-sm transition-colors"
        >
          ✕
        </button>
      </div>
      <div className="px-8 py-6">{children}</div>
    </div>
  </div>
);

const Field = ({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  hint,
}) => (
  <div className="mb-4">
    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 font-mono tracking-widest uppercase">
      {label} {required && <span className="text-[#e85d3a]">*</span>}
    </label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-200 font-mono text-[13px] outline-none focus:border-[#e85d3a60] resize-vertical transition-colors placeholder:text-slate-600"
      />
    ) : (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-200 font-mono text-[13px] outline-none focus:border-[#e85d3a60] transition-colors placeholder:text-slate-600"
      />
    )}
    {hint && (
      <p className="text-[10px] text-slate-600 font-mono mt-1">{hint}</p>
    )}
  </div>
);

const RangeField = ({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  accent = "#e85d3a",
  unit = "%",
}) => (
  <div className="mb-4">
    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 font-mono tracking-widest uppercase">
      {label}{" "}
      <span style={{ color: accent }}>
        ({value}
        {unit})
      </span>
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full h-1 rounded-full outline-none cursor-pointer"
      style={{ accentColor: accent }}
    />
    <div className="flex justify-between text-[10px] text-slate-600 font-mono mt-1">
      <span>
        {min}
        {unit}
      </span>
      <span style={{ color: accent }} className="font-bold">
        {value}
        {unit}
      </span>
      <span>
        {max}
        {unit}
      </span>
    </div>
  </div>
);

// ─── NEW: PointsField — custom number input 1–50 with quick presets ─────────
const POINT_PRESETS = [5, 10, 15, 20, 25, 30, 40, 50];

const PointsField = ({ value, onChange, accent = "#e85d3a" }) => {
  const handleInput = (e) => {
    const raw = Number(e.target.value);
    const clamped = Math.min(50, Math.max(1, isNaN(raw) ? 1 : raw));
    onChange(clamped);
  };
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 font-mono tracking-widest uppercase">
        Task Points <span style={{ color: accent }}>({value} pts)</span>
      </label>
      {/* Quick preset chips */}
      <div className="flex gap-1.5 flex-wrap mb-2">
        {POINT_PRESETS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono cursor-pointer transition-all duration-100"
            style={
              value === p
                ? {
                    background: accent,
                    color: "#fff",
                    border: `1px solid ${accent}`,
                  }
                : {
                    background: "#1e2330",
                    color: "#8892a4",
                    border: "1px solid #2a3045",
                  }
            }
          >
            {p}
          </button>
        ))}
      </div>
      {/* Custom typed input */}
      <div className="relative">
        <input
          type="number"
          value={value}
          min={1}
          max={50}
          onChange={handleInput}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-200 font-mono text-[13px] outline-none focus:border-[#e85d3a60] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="Enter 1 – 50"
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono pointer-events-none">
          / 50 pts
        </span>
      </div>
      <p className="text-[10px] text-slate-600 font-mono mt-1">
        Custom value between 1 and 50 — or pick a preset above
      </p>
    </div>
  );
};

// ─── NEW: DeadlineField — hours picker 1–96 (max 4 days) with presets ────────
const DEADLINE_PRESETS = [
  { label: "4h", hours: 4 },
  { label: "8h", hours: 8 },
  { label: "12h", hours: 12 },
  { label: "1d", hours: 24 },
  { label: "2d", hours: 48 },
  { label: "3d", hours: 72 },
  { label: "4d", hours: 96 },
];

const DeadlineField = ({ value, onChange, accent = "#3a9de8" }) => {
  const handleInput = (e) => {
    const raw = Number(e.target.value);
    const clamped = Math.min(96, Math.max(1, isNaN(raw) ? 1 : raw));
    onChange(clamped);
  };
  return (
    <div className="mb-4">
      <label className="block text-[10px] font-bold text-slate-500 mb-1.5 font-mono tracking-widest uppercase">
        Deadline Window{" "}
        <span style={{ color: accent }}>({fmtHours(value)})</span>
      </label>
      {/* Quick preset chips */}
      <div className="flex gap-1.5 flex-wrap mb-2">
        {DEADLINE_PRESETS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => onChange(p.hours)}
            className="px-2.5 py-1 rounded-lg text-[10px] font-bold font-mono cursor-pointer transition-all duration-100"
            style={
              value === p.hours
                ? {
                    background: accent,
                    color: "#fff",
                    border: `1px solid ${accent}`,
                  }
                : {
                    background: "#1e2330",
                    color: "#8892a4",
                    border: "1px solid #2a3045",
                  }
            }
          >
            {p.label}
          </button>
        ))}
      </div>
      {/* Custom typed input (in hours) */}
      <div className="relative">
        <input
          type="number"
          value={value}
          min={1}
          max={96}
          onChange={handleInput}
          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-200 font-mono text-[13px] outline-none focus:border-[#3a9de860] transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          placeholder="Enter hours (1 – 96)"
        />
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-600 font-mono pointer-events-none">
          hrs
        </span>
      </div>
      <p className="text-[10px] font-mono mt-1" style={{ color: accent }}>
        ⏱ {fmtHours(value)} from moment of assignment — max 4 days (96h)
      </p>
    </div>
  );
};

const SectionLabel = ({ children, color = "#e85d3a" }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="w-1 h-4 rounded-sm block" style={{ background: color }} />
    <span
      className="text-[10px] font-bold tracking-widest uppercase font-mono"
      style={{ color }}
    >
      {children}
    </span>
  </div>
);

const InfoRow = ({ label, value, color = "#c4cedf" }) => (
  <div className="bg-[#0c0f18] border border-slate-800 rounded-lg p-3">
    <div className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">
      {label}
    </div>
    <div className="text-[12px] font-semibold font-mono mt-1" style={{ color }}>
      {value || "—"}
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="rounded-xl p-4 bg-[#0c0f18] border border-slate-800/50 mb-2.5">
    <div className="h-2.5 w-20 bg-slate-800 rounded mb-3 animate-pulse" />
    <div className="h-3.5 w-36 bg-slate-800 rounded mb-2 animate-pulse" />
    <div className="h-2 w-14 bg-slate-800 rounded mb-3 animate-pulse" />
    <div className="h-1 bg-slate-800 rounded animate-pulse" />
  </div>
);

// ─── Contributor Info Modal ────────────────────────────────────────────────────
// Find contributor accurately by contributorID (ObjectId string) first, then fallback to name
const ContributorInfoModal = ({ log, contributors, projectId, onClose }) => {
  const student = (contributors || []).find(
    (c) =>
      (log.contributorID &&
        (c._id === log.contributorID ||
          c._id?.toString() === log.contributorID?.toString())) ||
      (log.task_contributor && c.name === log.task_contributor),
  );

  // Accurately resolve THIS project's contribution record
  const contrib = student?.projectWiseContribution?.find(
    (c) =>
      c.project &&
      (c.project === projectId ||
        c.project?.toString() === projectId?.toString()),
  );

  return (
    <Modal title="Contributor Info" onClose={onClose}>
      {!student ? (
        <div className="text-center py-8">
          <div className="text-3xl opacity-20 mb-2">◌</div>
          <p className="text-[11px] text-slate-600 font-mono">
            {log.task_status === "open"
              ? "No contributor has claimed this task yet."
              : "Contributor details not found."}
          </p>
        </div>
      ) : (
        <div>
          <div className="flex gap-4 items-start mb-6">
            <Avatar name={student.name} size={48} />
            <div className="flex-1">
              <div className="text-[16px] font-extrabold text-slate-100 font-display">
                {student.name}
              </div>
              <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                {student.email}
              </div>
              <div className="flex gap-2 mt-2 flex-wrap">
                <StatusPill status={student.isBlocked ? "blocked" : "active"} />
                {contrib?.role && <Badge color="#9c3ae8">{contrib.role}</Badge>}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <InfoRow label="Phone" value={student.phone} color="#3a9de8" />
            <InfoRow label="USN" value={student.usn} color="#fbbf24" />
            <InfoRow label="Department" value={student.department} />

            <InfoRow label="Program" value={student.program} />
            <InfoRow label="Semester" value={student.semester} />
            <InfoRow label="College" value={student.college} />
            <InfoRow
              label="Total Score"
              value={student.totalScore ? `${student.totalScore} pts` : "0 pts"}
              color="#e85d3a"
            />
          </div>
          {/* Project-specific contribution */}
          {contrib && (
            <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 mb-4">
              <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">
                Contribution on this project
              </div>
              <div className="flex gap-5">
                <div>
                  <div className="text-lg font-extrabold text-[#e85d3a] font-display">
                    {contrib.contributionScore || 0}
                  </div>
                  <div className="text-[9px] text-slate-600 font-mono uppercase">
                    pts earned
                  </div>
                </div>
                <div>
                  <div className="text-lg font-extrabold text-[#4ade80] font-display">
                    {contrib.tasksCompleted || 0}
                  </div>
                  <div className="text-[9px] text-slate-600 font-mono uppercase">
                    tasks done
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-4 mb-4">
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-2">
              Claimed Task
            </div>
            <div className="text-[13px] font-bold text-slate-100 font-display mb-1">
              {log.taskTitle}
            </div>
            <div className="flex gap-3 flex-wrap">
              <span className="text-[10px] text-amber-400 font-mono">
                ⬡ {log.assignedTaskPoints} pts
              </span>
              {log.assignedAt && (
                <span className="text-[10px] text-slate-500 font-mono">
                  Claimed {fmtDate(log.assignedAt)}
                </span>
              )}
              {log.deadlineAt && (
                <span
                  className={`text-[10px] font-mono ${daysLeft(log.deadlineAt) <= 0 ? "text-red-400" : "text-slate-500"}`}
                >
                  {daysLeft(log.deadlineAt) <= 0
                    ? "⚠ Overdue"
                    : `⏳ ${daysLeft(log.deadlineAt)}d remaining`}
                </span>
              )}
            </div>
          </div>
          {student.githubLink && (
            <a
              href={student.githubLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-blue-400 font-mono text-[12px] no-underline hover:text-blue-300 transition-colors"
            >
              ⌥ GitHub Profile ↗
            </a>
          )}
        </div>
      )}
    </Modal>
  );
};

// ─── Edit Project Modal ───────────────────────────────────────────────────────
const EditProjectModal = ({ project, onClose, onSave }) => {
  const [form, setForm] = useState({
    projectDescription: project.projectDescription || "",
    githubRepoLink: project.githubRepoLink || "",
    liveHostedLink: project.liveHostedLink || "",
    resourcesLink: project.resourcesLink || "",
    communityLink: project.communityLink || "",
    projectProgressRate: project.projectProgressRate || 0,
    is_blocked: project.is_blocked || false,
    title: project.problem?.title || "",
    category: project.problem?.category || "",
    theme: project.problem?.theme || "",
    description: project.problem?.description || "",
    ownerName: project.problem?.ownerName || "",
    organization: project.problem?.organization || "",
    contactInfo: project.problem?.contactInfo || "",
    problem_coordinator: project.problem?.problem_coordinator || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Modal title={`Edit · ${project.projectID}`} onClose={onClose} wide>
      <SectionLabel color="#e85d3a">Project Data</SectionLabel>
      <Field
        label="Project Description"
        value={form.projectDescription}
        onChange={set("projectDescription")}
        type="textarea"
        required
      />
      <Field
        label="GitHub Repository"
        value={form.githubRepoLink}
        onChange={set("githubRepoLink")}
        required
        placeholder="https://github.com/..."
      />
      <Field
        label="Live Hosted URL"
        value={form.liveHostedLink}
        onChange={set("liveHostedLink")}
        placeholder="https://..."
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Resources Link"
          value={form.resourcesLink}
          onChange={set("resourcesLink")}
          placeholder="Drive / Notion / Figma..."
          hint="External docs, design files"
        />
        <Field
          label="Community Link"
          value={form.communityLink}
          onChange={set("communityLink")}
          placeholder="WhatsApp / Discord..."
          hint="Team communication"
        />
      </div>
      <RangeField
        label="Progress Rate"
        value={form.projectProgressRate}
        onChange={(e) =>
          setForm((f) => ({
            ...f,
            projectProgressRate: Number(e.target.value),
          }))
        }
      />
      <div className="flex items-center gap-3 mb-5 p-3.5 bg-red-950/40 rounded-xl border border-red-500/20">
        <input
          type="checkbox"
          id="blocked"
          checked={form.is_blocked}
          onChange={(e) =>
            setForm((f) => ({ ...f, is_blocked: e.target.checked }))
          }
          className="accent-red-500 w-4 h-4 cursor-pointer"
        />
        <label
          htmlFor="blocked"
          className="text-[13px] text-slate-300 font-mono cursor-pointer"
        >
          Block this project — disables contributor access
        </label>
      </div>
      <SectionLabel color="#3a9de8">Problem Data</SectionLabel>
      <Field
        label="Problem Title"
        value={form.title}
        onChange={set("title")}
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Category"
          value={form.category}
          onChange={set("category")}
          required
        />
        <Field
          label="Theme"
          value={form.theme}
          onChange={set("theme")}
          required
        />
      </div>
      <Field
        label="Description"
        value={form.description}
        onChange={set("description")}
        type="textarea"
        required
      />
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Owner Name"
          value={form.ownerName}
          onChange={set("ownerName")}
          required
        />
        <Field
          label="Organization"
          value={form.organization}
          onChange={set("organization")}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field
          label="Contact Info"
          value={form.contactInfo}
          onChange={set("contactInfo")}
          placeholder="email or phone"
        />
        <Field
          label="Coordinator"
          value={form.problem_coordinator}
          onChange={set("problem_coordinator")}
          required
        />
      </div>
      <div className="flex gap-3 justify-end mt-2 pt-4 border-t border-slate-800">
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn
          loading={saving}
          onClick={async () => {
            setSaving(true);
            await onSave(form);
            setSaving(false);
            onClose();
          }}
        >
          Save Changes
        </Btn>
      </div>
    </Modal>
  );
};

// ─── Create Log Modal ─────────────────────────────────────────────────────────
const CreateLogModal = ({ project, onClose, onCreate }) => {
  const [form, setForm] = useState({
    taskTitle: "",
    description: "",
    requirements: "",
    githubIssueLink: "",
    assignedTaskPoints: 10, // 1–50
    deadlineHours: 24, // 1–96
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isValid = form.taskTitle && form.description && form.githubIssueLink;

  return (
    <Modal title={`Create Log · ${project.projectID}`} onClose={onClose} wide>
      <SectionLabel color="#4ade80">Task Details</SectionLabel>
      <Field
        label="Task Title"
        value={form.taskTitle}
        onChange={set("taskTitle")}
        required
        placeholder="e.g. Implement JWT auth"
      />
      <Field
        label="Description"
        value={form.description}
        onChange={set("description")}
        type="textarea"
        required
        placeholder="What needs to be done..."
      />
      <Field
        label="Requirements / Acceptance Criteria"
        value={form.requirements}
        onChange={set("requirements")}
        type="textarea"
        placeholder="- Must handle edge case X&#10;- Tests required&#10;- PR must link to issue"
        hint="Detailed checklist"
      />
      <Field
        label="GitHub Issue Link"
        value={form.githubIssueLink}
        onChange={set("githubIssueLink")}
        required
        placeholder="https://github.com/.../issues/X"
      />

      <div className="grid grid-cols-2 gap-6">
        {/* Points 1–50 */}
        <PointsField
          value={form.assignedTaskPoints}
          onChange={(v) => setForm((f) => ({ ...f, assignedTaskPoints: v }))}
          accent="#4ade80"
        />
        {/* Deadline in hours */}
        <DeadlineField
          value={form.deadlineHours}
          onChange={(v) => setForm((f) => ({ ...f, deadlineHours: v }))}
          accent="#3a9de8"
        />
      </div>

      <div className="p-3.5 bg-blue-950/30 border border-blue-500/20 rounded-xl mb-4">
        <p className="text-[11px] text-blue-400 font-mono">
          ℹ The log will be created as a <strong>draft</strong>. Publish it for
          contributors to see and self-assign.
        </p>
      </div>
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn
          variant="success"
          disabled={!isValid}
          loading={saving}
          onClick={async () => {
            setSaving(true);
            await onCreate(form);
            setSaving(false);
            onClose();
          }}
        >
          Create Log
        </Btn>
      </div>
    </Modal>
  );
};

// ─── Edit Log Modal ───────────────────────────────────────────────────────────
const EditLogModal = ({ log, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    taskTitle: log.taskTitle || "",
    description: log.description || "",
    requirements: log.requirements || "",
    githubIssueLink: log.githubIssueLink || "",
    assignedTaskPoints: log.assignedTaskPoints || 10,
    deadlineHours: logHours(log),
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Modal
      title={`Edit Log · ${log.taskTitle?.slice(0, 28)}…`}
      onClose={onClose}
      wide
    >
      <SectionLabel color="#fbbf24">Update Task</SectionLabel>
      <Field
        label="Task Title"
        value={form.taskTitle}
        onChange={set("taskTitle")}
        required
      />
      <Field
        label="Description"
        value={form.description}
        onChange={set("description")}
        type="textarea"
        required
      />
      <Field
        label="Requirements"
        value={form.requirements}
        onChange={set("requirements")}
        type="textarea"
        placeholder="Checklist / criteria..."
      />
      <Field
        label="GitHub Issue Link"
        value={form.githubIssueLink}
        onChange={set("githubIssueLink")}
        required
      />

      <div className="grid grid-cols-2 gap-6">
        <PointsField
          value={form.assignedTaskPoints}
          onChange={(v) => setForm((f) => ({ ...f, assignedTaskPoints: v }))}
          accent="#fbbf24"
        />
        <DeadlineField
          value={form.deadlineHours}
          onChange={(v) => setForm((f) => ({ ...f, deadlineHours: v }))}
          accent="#3a9de8"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn
          variant="warn"
          loading={saving}
          onClick={async () => {
            setSaving(true);
            await onUpdate(form);
            setSaving(false);
            onClose();
          }}
        >
          Update Log
        </Btn>
      </div>
    </Modal>
  );
};

// ─── Close Log Modal ──────────────────────────────────────────────────────────
const CloseLogModal = ({ log, onClose, onCloseLog }) => {
  const isPendingReview = log.task_status === "pending";
  const [form, setForm] = useState({
    githubPrLink: log.githubPrLink || "",
    pointsAwarded: log.assignedTaskPoints || 10,
    closureNote: log.closureNote || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isValid = !!form.githubPrLink;

  return (
    <Modal title="Close Task Log" onClose={onClose}>
      {/* Task summary */}
      <div className="p-4 bg-slate-900 border border-slate-700 rounded-xl mb-5">
        <div className="text-[13px] font-bold text-slate-100 font-display mb-1">
          {log.taskTitle}
        </div>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <StatusPill status={log.task_status} />
          <span className="text-[11px] text-slate-500 font-mono">
            Contributor:{" "}
            <span className="text-slate-300">
              {log.task_contributor || "—"}
            </span>
          </span>
        </div>
        {log.deadlineAt && (
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            Deadline:{" "}
            <span className="text-amber-400">
              {fmtDatetime(log.deadlineAt)}
            </span>
          </div>
        )}
      </div>

      {isPendingReview ? (
        <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/25 rounded-xl mb-5">
          <div className="text-[11px] text-indigo-300 font-mono font-bold mb-1">
            🔍 Student Submitted for Review
          </div>
          <p className="text-[11px] text-indigo-400/80 font-mono leading-relaxed">
            The contributor has marked this task as complete. Review the work,
            adjust points if needed, and close to award points.
          </p>
        </div>
      ) : (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-5">
          <p className="text-[11px] text-amber-400 font-mono">
            ⚠ This task is currently <strong>assigned</strong>. You are closing
            it manually — make sure the work is complete.
          </p>
        </div>
      )}

      <SectionLabel color="#4ade80">Completion Credentials</SectionLabel>
      <Field
        label="GitHub PR / Commit Link"
        value={form.githubPrLink}
        onChange={set("githubPrLink")}
        placeholder="https://github.com/.../pull/X"
        required
        hint={
          isPendingReview
            ? "Pre-filled from student submission — verify before closing."
            : undefined
        }
      />

      {/* Points awarded — 0 to 50 */}
      <PointsField
        value={form.pointsAwarded}
        onChange={(v) => setForm((f) => ({ ...f, pointsAwarded: v }))}
        accent="#4ade80"
      />

      <Field
        label="Closure Note"
        value={form.closureNote}
        onChange={set("closureNote")}
        type="textarea"
        placeholder="What was achieved? Any remarks for the contributor..."
      />

      <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn
          variant="success"
          onClick={async () => {
            setSaving(true);
            await onCloseLog(form);
            setSaving(false);
            onClose();
          }}
          disabled={!isValid}
          loading={saving}
        >
          ✓ Mark Complete & Award {form.pointsAwarded} pts
        </Btn>
      </div>
    </Modal>
  );
};

// ─── Terminate Log Modal ──────────────────────────────────────────────────────
const TerminateLogModal = ({ log, onClose, onTerminate }) => {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <Modal title="Terminate Log" onClose={onClose}>
      <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-xl mb-5">
        <div className="text-[13px] font-bold text-red-300 font-display mb-1">
          {log.taskTitle}
        </div>
        <p className="text-[11px] text-red-400/70 font-mono">
          Terminating removes the contributor assignment and hides the log. You
          can reopen it later.
        </p>
      </div>
      <Field
        label="Reason / Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        type="textarea"
        placeholder="Deadline exceeded, scope changed..."
      />
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn
          variant="danger"
          loading={saving}
          onClick={async () => {
            setSaving(true);
            await onTerminate({ closureNote: note });
            setSaving(false);
            onClose();
          }}
        >
          Terminate
        </Btn>
      </div>
    </Modal>
  );
};

// ─── Reopen Log Modal ─────────────────────────────────────────────────────────
const ReopenLogModal = ({ log, onClose, onReopen }) => {
  const [deadlineHours, setDeadlineHours] = useState(logHours(log));
  const [saving, setSaving] = useState(false);

  return (
    <Modal title="Reopen Log" onClose={onClose}>
      <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl mb-5">
        <div className="text-[13px] font-bold text-emerald-300 font-display mb-1">
          {log.taskTitle}
        </div>
        <p className="text-[11px] text-emerald-400/70 font-mono">
          Log will be published and open for contributors to self-assign.
          Reopened {log.reopenCount || 0} time{log.reopenCount !== 1 ? "s" : ""}{" "}
          before.
        </p>
      </div>
      <DeadlineField
        value={deadlineHours}
        onChange={setDeadlineHours}
        accent="#4ade80"
      />
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn
          variant="success"
          loading={saving}
          onClick={async () => {
            setSaving(true);
            await onReopen({ deadlineHours });
            setSaving(false);
            onClose();
          }}
        >
          ↺ Reopen & Publish
        </Btn>
      </div>
    </Modal>
  );
};

// ─── Student Detail Modal ─────────────────────────────────────────────────────
const StudentModal = ({ student, projectLogs, projectId, onClose }) => {
  // Accurate lookup using contributorID or name match
  const studentLogs = (projectLogs || []).filter(
    (l) =>
      (l.contributorID &&
        l.contributorID?.toString() === student._id?.toString()) ||
      l.task_contributor === student.name,
  );

  // Accurate project-specific contribution
  const contrib = student.projectWiseContribution?.find(
    (c) =>
      c.project &&
      (c.project === projectId ||
        c.project?.toString() === projectId?.toString()),
  );

  return (
    <Modal title={`Student · ${student.name}`} onClose={onClose} wide>
      <div className="flex gap-4 items-start mb-6">
        <Avatar name={student.name} size={52} />
        <div className="flex-1">
          <div className="text-lg font-extrabold text-slate-100 font-display">
            {student.name}
          </div>
          <div className="text-[12px] text-slate-500 font-mono mt-0.5">
            {student.email}
          </div>
          <div className="flex gap-2 mt-2.5 flex-wrap">
            <StatusPill status={student.isBlocked ? "blocked" : "active"} />
            {contrib?.role && <Badge color="#9c3ae8">{contrib.role}</Badge>}
          </div>
        </div>
      </div>

      {/* Per-project stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {
            label: "Project Score",
            value: contrib?.contributionScore ?? 0,
            color: "#e85d3a",
          },
          {
            label: "Tasks Assigned",
            value: studentLogs.length,
            color: "#3a9de8",
          },
          {
            label: "Tasks Done",
            value: studentLogs.filter((l) => l.task_status === "completed")
              .length,
            color: "#4ade80",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-center"
          >
            <div
              className="text-xl font-extrabold font-display"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-0.5">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Full profile grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          ["Department", student.department],
          ["Program", student.program],

          ["Semester", student.semester],
          ["USN", student.usn],
          ["Phone", student.phone],
          ["College", student.college],
          ["Overall Score", `${student.totalScore || 0} pts`],
          ["Overall Tasks Done", student.totalTasksCompleted || 0],
        ].map(([k, v]) => (
          <div
            key={k}
            className="bg-slate-900 border border-slate-800 rounded-lg p-3"
          >
            <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
              {k}
            </div>
            <div className="text-[12px] text-slate-300 font-mono mt-1">
              {v || "—"}
            </div>
          </div>
        ))}
      </div>

      {student.githubLink && (
        <a
          href={student.githubLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-blue-400 font-mono text-[12px] no-underline hover:text-blue-300 mb-5 transition-colors"
        >
          ⌥ GitHub Profile ↗
        </a>
      )}

      {studentLogs.length > 0 && (
        <>
          <SectionLabel color="#e85d3a">Task Logs on this Project</SectionLabel>
          <div className="flex flex-col gap-2.5">
            {studentLogs.map((log) => (
              <div
                key={log._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4"
              >
                <div className="flex justify-between items-start gap-2 mb-2">
                  <span className="text-[13px] font-bold text-slate-100 font-display">
                    {log.taskTitle}
                  </span>
                  <StatusPill status={log.task_status} />
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-[10px] text-amber-400 font-mono">
                    ⬡ {log.assignedTaskPoints} pts
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">
                    ⏱ {fmtHours(logHours(log))} window
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">
                    {fmtDate(log.createdAt)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
};

// ─── Log Card ─────────────────────────────────────────────────────────────────
const LogCard = ({
  log,
  contributors,
  projectId,
  onPublish,
  onEdit,
  onClose,
  onTerminate,
  onReopen,
}) => {
  const [showStudentInfo, setShowStudentInfo] = useState(false);
  const days = daysLeft(log.deadlineAt);
  const isPending = log.task_status === "pending";
  const isActive = log.task_status === "assigned" || isPending;
  const isOverdue = isActive && days !== null && days <= 0;

  const statusBorder =
    {
      open: "border-l-blue-500",
      assigned: isOverdue ? "border-l-red-500" : "border-l-amber-500",
      pending: "border-l-indigo-500",
      completed: "border-l-emerald-500",
      terminated: "border-l-red-800",
    }[log.task_status] || "border-l-slate-700";

  return (
    <>
      <div
        className={`bg-[#0c0f18] border border-slate-800 border-l-2 ${statusBorder} rounded-xl p-5 transition-all duration-200`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <div
              className="font-display font-bold text-[13px] leading-tight truncate mb-1"
              style={{ color: "#f0f4ff" }}
            >
              {log.taskTitle}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {log.task_contributor ? (
                <div className="flex items-center gap-1.5 bg-[#131825] border border-slate-700/60 px-1.5 py-0.5 rounded-md">
                  <Avatar name={log.task_contributor} size={14} />
                  <span className="text-[10px] text-slate-300 font-mono truncate max-w-[120px]">
                    {log.task_contributor}
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                  Unassigned
                </span>
              )}
              <span className="text-[10px] text-slate-600 font-mono">
                · {fmtDate(log.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <StatusPill status={isOverdue ? "terminated" : log.task_status} />
            {!log.isPublished &&
              !["completed", "terminated"].includes(log.task_status) && (
                <span className="text-[9px] font-bold tracking-widest uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  Draft
                </span>
              )}
          </div>
        </div>

        <p className="text-[11px] text-slate-500 font-mono leading-relaxed mb-3 line-clamp-2 mt-2">
          {log.description}
        </p>

        {log.requirements && (
          <details className="mb-3 group">
            <summary className="text-[10px] text-slate-600 font-mono cursor-pointer hover:text-slate-400 transition-colors list-none flex items-center gap-1">
              <span className="group-open:rotate-90 transition-transform inline-block">
                ▶
              </span>{" "}
              Requirements
            </summary>
            <p className="text-[11px] text-slate-500 font-mono leading-relaxed mt-1.5 pl-3 border-l border-slate-700">
              {log.requirements}
            </p>
          </details>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-3 items-center mb-3">
          <span className="text-[11px] text-amber-400 font-mono">
            ⬡ {log.assignedTaskPoints} pts
          </span>
          <span className="text-[11px] text-blue-400 font-mono">
            ⏱ {fmtHours(logHours(log))} window
          </span>
          {log.assignedAt && (
            <span className="text-[10px] text-slate-600 font-mono">
              Claimed {fmtDate(log.assignedAt)}
            </span>
          )}
          {isActive && log.deadlineAt && (
            <span
              className={`text-[11px] font-bold font-mono ${days <= 0 ? "text-red-400" : days <= 1 ? "text-orange-400" : "text-slate-400"}`}
            >
              {days <= 0 ? "⚠ Overdue" : `⏳ ${days}d remaining`}
            </span>
          )}
          {log.task_status === "completed" && log.closedAt && (
            <span className="text-[10px] text-emerald-500 font-mono">
              ✓ Closed {fmtDate(log.closedAt)}
            </span>
          )}
          {log.task_status === "terminated" && log.closedAt && (
            <span className="text-[10px] text-red-400 font-mono">
              ✕ Terminated {fmtDate(log.closedAt)}
            </span>
          )}
        </div>

        {/* Links */}
        <div className="flex gap-4 items-center mb-4">
          {log.githubIssueLink && (
            <a
              href={log.githubIssueLink}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-blue-400 font-mono hover:text-blue-300 transition-colors no-underline"
            >
              ⌥ Issue ↗
            </a>
          )}
          {log.githubPrLink && (
            <a
              href={log.githubPrLink}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-400 font-mono hover:text-emerald-300 transition-colors no-underline"
            >
              ⌥ PR ↗
            </a>
          )}
          {log.closureNote && (
            <span
              className="text-[10px] text-slate-600 font-mono truncate max-w-[200px]"
              title={log.closureNote}
            >
              Note: {log.closureNote}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap pt-3 border-t border-slate-800/60">
          <Btn variant="info" small onClick={() => setShowStudentInfo(true)}>
            👤{" "}
            {log.task_status === "open"
              ? "Unassigned"
              : log.task_contributor || "Student Info"}
          </Btn>

          {log.task_status === "open" && (
            <Btn
              variant={log.isPublished ? "warn" : "blue"}
              small
              onClick={() => onPublish(log._id, log.isPublished)}
            >
              {log.isPublished ? "Unpublish" : "↑ Publish"}
            </Btn>
          )}

          {log.task_status === "open" && (
            <Btn variant="secondary" small onClick={() => onEdit(log)}>
              Edit
            </Btn>
          )}

          {isActive && (
            <Btn variant="success" small onClick={() => onClose(log)}>
              {isPending ? "✓ Review & Close" : "✓ Close"}
            </Btn>
          )}

          {(log.task_status === "open" || isActive) && (
            <Btn variant="danger" small onClick={() => onTerminate(log)}>
              Terminate
            </Btn>
          )}

          {log.task_status === "terminated" && (
            <Btn variant="success" small onClick={() => onReopen(log)}>
              ↺ Reopen
            </Btn>
          )}
        </div>
      </div>

      {showStudentInfo && (
        <ContributorInfoModal
          log={log}
          contributors={contributors}
          projectId={projectId}
          onClose={() => setShowStudentInfo(false)}
        />
      )}
    </>
  );
};

// ─── Workflow Insight ─────────────────────────────────────────────────────────
const WorkflowInsight = ({ project }) => {
  const allLogs = project.logs ?? [];
  const completed = allLogs.filter((l) => l.task_status === "completed");
  const assigned = allLogs.filter(
    (l) => l.task_status === "assigned" || l.task_status === "pending",
  );
  const terminated = allLogs.filter((l) => l.task_status === "terminated");

  const lanes = {};
  project.contributors?.forEach((c) => {
    lanes[c._id] = { ...c, logs: [] };
  });
  allLogs.forEach((l) => {
    // Match by contributorID first, then by name
    const key = Object.keys(lanes).find(
      (id) =>
        l.contributorID?.toString() === id ||
        lanes[id].name === l.task_contributor,
    );
    if (key) lanes[key].logs.push(l);
  });
  const timeline = [...allLogs].sort(
    (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
  );

  const statusColor = {
    open: "#3a9de8",
    assigned: "#fbbf24",
    pending: "#818cf8",
    completed: "#4ade80",
    terminated: "#f87171",
  };

  return (
    <div className="space-y-6 mt-2">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: allLogs.length, color: "#8892a4" },
          { label: "Active", value: assigned.length, color: "#fbbf24" },
          { label: "Completed", value: completed.length, color: "#4ade80" },
          { label: "Terminated", value: terminated.length, color: "#f87171" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[#0c0f18] border border-slate-800 rounded-xl p-4 text-center"
          >
            <div
              className="text-2xl font-extrabold font-display"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="text-[9px] text-slate-500 font-mono uppercase tracking-widest mt-1">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Contributor lanes — keyed by _id for accuracy */}
      <div className="bg-[#0c0f18] border border-slate-800 rounded-2xl p-6">
        <SectionLabel color="#e85d3a">Contributor Lanes</SectionLabel>
        <div className="space-y-5">
          {Object.values(lanes).map((stu) => {
            const pts = stu.logs
              .filter((l) => l.task_status === "completed")
              .reduce((a, l) => a + l.assignedTaskPoints, 0);
            return (
              <div key={stu._id}>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <Avatar name={stu.name} size={26} />
                  <span className="text-[12px] font-bold text-slate-200 font-display">
                    {stu.name}
                  </span>
                  {stu.phone && (
                    <span className="text-[10px] text-slate-500 font-mono ml-1">
                      · {stu.phone}
                    </span>
                  )}
                  <span className="ml-auto text-[11px] text-amber-400 font-mono">
                    ⬡ {pts} pts
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap pl-9">
                  {stu.logs.length === 0 ? (
                    <span className="text-[10px] text-slate-700 font-mono">
                      No tasks assigned
                    </span>
                  ) : (
                    stu.logs.map((log, i) => (
                      <div key={log._id} className="flex items-center">
                        <div
                          className="rounded-lg px-3 py-2 text-[11px] font-mono max-w-[200px]"
                          style={{
                            background: `${statusColor[log.task_status]}18`,
                            border: `1px solid ${statusColor[log.task_status]}30`,
                            color: statusColor[log.task_status],
                          }}
                        >
                          <div className="font-bold truncate">
                            {log.task_status === "completed"
                              ? "✓ "
                              : log.task_status === "pending"
                                ? "◈ "
                                : log.task_status === "terminated"
                                  ? "✕ "
                                  : "◌ "}
                            {log.taskTitle.slice(0, 22)}
                            {log.taskTitle.length > 22 ? "…" : ""}
                          </div>
                          <div className="text-[9px] opacity-60 mt-0.5">
                            {log.assignedTaskPoints}pts ·{" "}
                            {fmtHours(logHours(log))} · {fmtDate(log.createdAt)}
                          </div>
                        </div>
                        {i < stu.logs.length - 1 && (
                          <div className="w-4 h-px bg-slate-700 mx-1" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-[#0c0f18] border border-slate-800 rounded-2xl p-6">
        <SectionLabel color="#3a9de8">Chronological Timeline</SectionLabel>
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-slate-800 rounded-full" />
          {timeline.length === 0 ? (
            <p className="text-[11px] text-slate-700 font-mono">No logs yet.</p>
          ) : (
            timeline.map((log, i) => (
              <div
                key={log._id}
                className={`relative ${i < timeline.length - 1 ? "mb-5" : ""}`}
              >
                <div
                  className="absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-[#0c0f18]"
                  style={{
                    background: statusColor[log.task_status],
                    boxShadow: `0 0 8px ${statusColor[log.task_status]}60`,
                  }}
                />
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <div className="text-[12px] font-bold text-slate-100 font-display mb-1 flex items-center gap-2">
                      {log.taskTitle}
                      <span className="text-[10px] font-normal text-slate-500 font-mono border border-slate-800 px-1.5 py-0.5 rounded">
                        {log.task_contributor
                          ? `→ ${log.task_contributor}`
                          : "Unassigned"}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono">
                      · {fmtDate(log.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-amber-400 font-mono">
                      ⬡ {log.assignedTaskPoints}pt
                    </span>
                    <span className="text-[10px] text-blue-400 font-mono">
                      ⏱ {fmtHours(logHours(log))}
                    </span>
                    <StatusPill status={log.task_status} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Project View ─────────────────────────────────────────────────────────────
const ProjectView = ({
  project,
  onEdit,
  onCreateLog,
  onViewStudent,
  onLogAction,
}) => {
  const [tab, setTab] = useState("overview");
  const [logFilter, setLogFilter] = useState("all");
  const [editingLog, setEditingLog] = useState(null);
  const [closingLog, setClosingLog] = useState(null);
  const [terminatingLog, setTerminatingLog] = useState(null);
  const [reopeningLog, setReopeningLog] = useState(null);

  const TABS = ["overview", "problem", "students", "logs", "workflow"];

  const filteredLogs = (project.logs || []).filter((l) => {
    if (logFilter === "all") return true;
    if (logFilter === "active")
      return l.task_status === "assigned" || l.task_status === "pending";
    return l.task_status === logFilter;
  });

  const logCounts = {
    all: (project.logs || []).length,
    open: (project.logs || []).filter((l) => l.task_status === "open").length,
    active: (project.logs || []).filter(
      (l) => l.task_status === "assigned" || l.task_status === "pending",
    ).length,
    pending: (project.logs || []).filter((l) => l.task_status === "pending")
      .length,
    completed: (project.logs || []).filter((l) => l.task_status === "completed")
      .length,
    terminated: (project.logs || []).filter(
      (l) => l.task_status === "terminated",
    ).length,
  };

  return (
    <div className="bg-[#0f1219] border border-slate-800 rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className="px-7 pt-6 pb-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg,#131825 0%,#0f1219 100%)",
          borderBottom: "1px solid #1e2330",
        }}
      >
        <div
          className="absolute -right-5 -top-5 w-40 h-40 rounded-full"
          style={{ background: "#e85d3a08", border: "1px solid #e85d3a15" }}
        />
        <div className="relative flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-2.5">
              <span className="text-[11px] font-mono text-[#e85d3a] bg-[#e85d3a15] px-2.5 py-0.5 rounded border border-[#e85d3a30]">
                {project.projectID}
              </span>
              <span className="text-slate-600 font-mono text-xs">↔</span>
              <span className="text-[11px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded border border-blue-500/20">
                {project.problem?.problemID}
              </span>
              {project.is_blocked && <StatusPill status="blocked" />}
              {logCounts.pending > 0 && (
                <span
                  className="text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full animate-pulse"
                  style={{
                    background: "#818cf815",
                    color: "#818cf8",
                    border: "1px solid #818cf830",
                  }}
                >
                  ◈ {logCounts.pending} awaiting review
                </span>
              )}
            </div>
            <h2 className="text-[18px] font-extrabold text-slate-100 font-display mb-2.5 leading-tight">
              {project.problem?.title}
            </h2>
            <div className="flex gap-2 flex-wrap mb-4">
              <Badge color="#9c3ae8">{project.problem?.theme}</Badge>
              <Badge color="#3a9de8">{project.problem?.category}</Badge>
              {project.problem?.tags?.map((t) => (
                <Badge key={t} color="#8892a4">
                  {t}
                </Badge>
              ))}
            </div>
            <ProgressBar value={project.projectProgressRate} />
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Btn variant="secondary" small onClick={() => onCreateLog(project)}>
              + Log
            </Btn>
            <Btn small onClick={() => onEdit(project)}>
              Edit
            </Btn>
          </div>
        </div>
        {/* Stats strip */}
        <div className="flex gap-6 mt-5">
          {[
            {
              label: "Contributors",
              value: project.contributors?.length ?? 0,
              color: "#3a9de8",
            },
            {
              label: "Total Logs",
              value: project.logs?.length ?? 0,
              color: "#9c3ae8",
            },
            { label: "Active", value: logCounts.active, color: "#fbbf24" },
            { label: "Review", value: logCounts.pending, color: "#818cf8" },
            {
              label: "Completed",
              value: logCounts.completed,
              color: "#4ade80",
            },
            {
              label: "Points",
              value: totalPoints(project.logs ?? []),
              color: "#e85d3a",
            },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div
                className="text-xl font-extrabold font-display"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div className="text-[9px] text-slate-600 font-mono uppercase tracking-widest mt-0.5">
                {s.label}
              </div>
            </div>
          ))}
        </div>
        {(project.resourcesLink || project.communityLink) && (
          <div className="flex gap-3 mt-4 flex-wrap">
            {project.resourcesLink && (
              <a
                href={project.resourcesLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-950/40 border border-amber-500/20 rounded-lg text-[11px] text-amber-400 font-mono hover:bg-amber-950/60 transition-colors no-underline"
              >
                📁 Resources ↗
              </a>
            )}
            {project.communityLink && (
              <a
                href={project.communityLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-400 font-mono hover:bg-emerald-950/60 transition-colors no-underline"
              >
                💬 Community ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-7 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3.5 text-[11px] font-bold font-mono uppercase tracking-widest cursor-pointer border-b-2 transition-colors whitespace-nowrap bg-transparent ${tab === t ? "text-[#e85d3a] border-[#e85d3a]" : "text-slate-600 border-transparent hover:text-slate-400"}`}
            style={{ marginBottom: -1 }}
          >
            {t}
            {t === "logs" && (
              <span className="ml-1.5 text-[9px] opacity-60">
                ({logCounts.all})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-7">
        {/* OVERVIEW */}
        {tab === "overview" && (
          <div>
            <p className="text-[13px] text-slate-400 font-mono leading-relaxed mb-6">
              {project.projectDescription}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                {
                  label: "GitHub Repo",
                  href: project.githubRepoLink,
                  icon: "⌥",
                  sub: "View Repository ↗",
                  color: "#3a9de8",
                  active: true,
                },
                {
                  label: "Live Demo",
                  href: project.liveHostedLink,
                  icon: "◉",
                  sub: project.liveHostedLink
                    ? "Open Live ↗"
                    : "Not deployed yet",
                  color: "#4ade80",
                  active: !!project.liveHostedLink,
                },
              ].map((lnk) =>
                lnk.active ? (
                  <a
                    key={lnk.label}
                    href={lnk.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 no-underline hover:border-slate-700 transition-colors"
                  >
                    <span className="text-lg">{lnk.icon}</span>
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        {lnk.label}
                      </div>
                      <div
                        className="text-[11px] font-mono mt-0.5"
                        style={{ color: lnk.color }}
                      >
                        {lnk.sub}
                      </div>
                    </div>
                  </a>
                ) : (
                  <div
                    key={lnk.label}
                    className="flex items-center gap-3 bg-slate-900 border border-dashed border-slate-800 rounded-xl p-4 opacity-40"
                  >
                    <span className="text-lg">{lnk.icon}</span>
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        {lnk.label}
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                        {lnk.sub}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
            <p className="text-[10px] text-slate-700 font-mono">
              Created {fmtDate(project.createdAt)} ·{" "}
              {project.contributors?.length} contributors ·{" "}
              {project.logs?.length} task logs
            </p>
          </div>
        )}

        {/* PROBLEM */}
        {tab === "problem" && (
          <div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                ["Problem ID", project.problem?.problemID, "#e85d3a"],
                ["Title", project.problem?.title, "#f0f4ff"],
                ["Category", project.problem?.category, "#3a9de8"],
                ["Theme", project.problem?.theme, "#9c3ae8"],
                ["Owner", project.problem?.ownerName, "#f0f4ff"],
                ["Organization", project.problem?.organization, "#f0f4ff"],
                ["Department", project.problem?.department || "—", "#c4cedf"],
                ["Contact", project.problem?.contactInfo || "—", "#3a9de8"],
                [
                  "Coordinators",
                  project.coordinators
                    ?.map((c) => `${c.name} (${c.phone || "N/A"})`)
                    .join(", ") || project.problem?.problem_coordinator,
                  "#4ade80",
                ],
                [
                  "Published",
                  project.problem?.is_published ? "Yes" : "No",
                  project.problem?.is_published ? "#4ade80" : "#f87171",
                ],
              ].map(([k, v, c]) => (
                <div
                  key={k}
                  className="bg-[#0c0f18] border border-slate-800 rounded-xl p-3.5"
                >
                  <div className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">
                    {k}
                  </div>
                  <div
                    className="text-[12px] font-semibold font-mono mt-1"
                    style={{ color: c }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#0c0f18] border border-slate-800 rounded-xl p-5 mb-4">
              <div className="text-[10px] text-slate-600 font-mono uppercase tracking-widest mb-2">
                Description
              </div>
              <p className="text-[12px] text-slate-400 font-mono leading-relaxed">
                {project.problem?.description}
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {project.problem?.tags?.map((t) => (
                <Badge key={t} color="#3a9de8">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* STUDENTS */}
        {tab === "students" && (
          <div>
            <p className="text-[11px] text-slate-600 font-mono mb-4">
              {project.contributors?.length} contributor
              {project.contributors?.length !== 1 ? "s" : ""} on this project
            </p>
            <div
              className="grid grid-cols-1 gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
              }}
            >
              {project.contributors?.map((stu) => {
                // Accurate per-project contribution lookup
                const contrib = stu.projectWiseContribution?.find(
                  (c) =>
                    c.project &&
                    (c.project === project._id ||
                      c.project?.toString() === project._id?.toString()),
                );
                // Accurate log match using contributorID or name
                const stuLogs = (project.logs || []).filter(
                  (l) =>
                    (l.contributorID &&
                      l.contributorID?.toString() === stu._id?.toString()) ||
                    l.task_contributor === stu.name,
                );
                const doneCt = stuLogs.filter(
                  (l) => l.task_status === "completed",
                ).length;

                return (
                  <div
                    key={stu._id}
                    onClick={() =>
                      onViewStudent(stu, project.logs ?? [], project._id)
                    }
                    className="bg-[#0c0f18] border border-slate-800 rounded-xl p-5 cursor-pointer transition-all duration-150 hover:border-[#e85d3a40] hover:-translate-y-0.5"
                  >
                    <div className="flex gap-3 items-center mb-3.5">
                      <Avatar name={stu.name} size={40} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-bold text-slate-100 font-display truncate">
                          {stu.name}
                        </div>
                        <div className="text-[10px] text-slate-600 font-mono mt-0.5 truncate">
                          {stu.email}
                        </div>
                      </div>
                      <StatusPill
                        status={stu.isBlocked ? "blocked" : "active"}
                      />
                    </div>
                    <div className="flex gap-2 flex-wrap mb-3">
                      {contrib?.role && (
                        <Badge color="#9c3ae8">{contrib.role}</Badge>
                      )}

                      {stu.department && (
                        <Badge color="#8892a4">{stu.department}</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 border-t border-slate-800/60 pt-3 mb-3">
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        Dept: {stu.department || "—"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        Sem: {stu.semester || "—"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        Phone: {stu.phone || "—"}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        USN: {stu.usn || "—"}
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono truncate">
                        College: {stu.college || "—"}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        ["Score", contrib?.contributionScore ?? 0, "#e85d3a"],
                        ["Tasks", stuLogs.length, "#3a9de8"],
                        ["Done", doneCt, "#4ade80"],
                      ].map(([l, v, c]) => (
                        <div
                          key={l}
                          className="text-center bg-slate-900 rounded-lg py-2"
                        >
                          <div
                            className="text-base font-extrabold font-display"
                            style={{ color: c }}
                          >
                            {v}
                          </div>
                          <div className="text-[9px] text-slate-600 font-mono uppercase">
                            {l}
                          </div>
                        </div>
                      ))}
                    </div>
                    {stu.githubLink && (
                      <a
                        href={stu.githubLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3 inline-flex items-center gap-1.5 text-blue-400 font-mono text-[10px] no-underline hover:text-blue-300 transition-colors"
                      >
                        ⌥ GitHub ↗
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LOGS */}
        {tab === "logs" && (
          <div>
            {/* Filter bar */}
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex gap-1 flex-wrap">
                {Object.entries(logCounts).map(([key, count]) => (
                  <button
                    key={key}
                    onClick={() => setLogFilter(key)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest cursor-pointer transition-all ${logFilter === key ? "bg-[#e85d3a] text-white" : "bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300"}`}
                  >
                    {key} <span className="opacity-60">({count})</span>
                  </button>
                ))}
              </div>
              <Btn variant="success" small onClick={() => onCreateLog(project)}>
                + New Log
              </Btn>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl opacity-20 mb-3">◌</div>
                <p className="text-[12px] text-slate-700 font-mono">
                  No logs in this category.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filteredLogs.map((log) => (
                  <LogCard
                    key={log._id}
                    log={log}
                    contributors={project.contributors || []}
                    projectId={project._id}
                    onPublish={(logId, isPublished) =>
                      onLogAction("publish", project._id, logId, {
                        isPublished,
                      })
                    }
                    onEdit={(l) => setEditingLog(l)}
                    onClose={(l) => setClosingLog(l)}
                    onTerminate={(l) => setTerminatingLog(l)}
                    onReopen={(l) => setReopeningLog(l)}
                  />
                ))}
              </div>
            )}

            {/* Sub-modals */}
            {editingLog && (
              <EditLogModal
                log={editingLog}
                onClose={() => setEditingLog(null)}
                onUpdate={(form) =>
                  onLogAction("update", project._id, editingLog._id, form).then(
                    () => setEditingLog(null),
                  )
                }
              />
            )}
            {closingLog && (
              <CloseLogModal
                log={closingLog}
                onClose={() => setClosingLog(null)}
                onCloseLog={(form) =>
                  onLogAction("close", project._id, closingLog._id, form).then(
                    () => setClosingLog(null),
                  )
                }
              />
            )}
            {terminatingLog && (
              <TerminateLogModal
                log={terminatingLog}
                onClose={() => setTerminatingLog(null)}
                onTerminate={(form) =>
                  onLogAction(
                    "terminate",
                    project._id,
                    terminatingLog._id,
                    form,
                  ).then(() => setTerminatingLog(null))
                }
              />
            )}
            {reopeningLog && (
              <ReopenLogModal
                log={reopeningLog}
                onClose={() => setReopeningLog(null)}
                onReopen={(form) =>
                  onLogAction(
                    "reopen",
                    project._id,
                    reopeningLog._id,
                    form,
                  ).then(() => setReopeningLog(null))
                }
              />
            )}
          </div>
        )}

        {/* WORKFLOW */}
        {tab === "workflow" && <WorkflowInsight project={project} />}
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────────
const ManageProjects = () => {
  const { axios, adminToken } = useAppContext();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);
  const [adminProfile, setAdminProfile] = useState({ name: "", email: "" });
  const [editingProject, setEditingProject] = useState(null);
  const [creatingLog, setCreatingLog] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [viewingStudentLogs, setViewingStudentLogs] = useState([]);
  const [viewingStudentProjectId, setViewingStudentProjectId] = useState(null);

  const showToast = (message, type = "success") => setToast({ message, type });
  const authHeader = { Authorization: `Bearer ${adminToken}` };

  // Fetch admin profile
  useEffect(() => {
    if (!adminToken) return;
    axios
      .get("/api/admin/profile", { headers: authHeader })
      .then(({ data }) => {
        if (data.success)
          setAdminProfile({ name: data.admin.name, email: data.admin.email });
      })
      .catch(() => {});
  }, [adminToken]);

  // Fetch projects
  const fetchProjects = useCallback(
    async (silent = false) => {
      silent ? setRefreshing(true) : setLoading(true);
      try {
        const { data } = await axios.get("/api/admin/projects", {
          headers: authHeader,
        });
        if (data.success) {
          setProjects(data.projects);
          setActiveId((prev) => prev || data.projects[0]?._id || null);
        }
      } catch (err) {
        showToast(
          err?.response?.data?.message || "Failed to load projects.",
          "error",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [axios, adminToken],
  );

  useEffect(() => {
    if (adminToken) fetchProjects();
  }, [adminToken]);

  // Refresh a single project after mutation
  const refreshProject = async (projectId) => {
    try {
      const { data } = await axios.get(`/api/admin/projects/${projectId}`, {
        headers: authHeader,
      });
      if (data.success)
        setProjects((prev) =>
          prev.map((p) => (p._id === data.project._id ? data.project : p)),
        );
    } catch (_) {}
  };

  const handleSaveProject = async (form) => {
    try {
      const { data } = await axios.put(
        `/api/admin/projects/${editingProject._id}`,
        form,
        { headers: authHeader },
      );
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p._id === data.project._id ? data.project : p)),
        );
        showToast("Project updated.");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Update failed.", "error");
    }
  };

  const handleCreateLog = async (project, form) => {
    try {
      const { data } = await axios.post(
        `/api/admin/projects/${project._id}/logs`,
        form,
        { headers: authHeader },
      );
      if (data.success) {
        await refreshProject(project._id);
        showToast("Log created as draft.");
      }
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to create log.",
        "error",
      );
    }
  };

  const handleLogAction = async (action, projectId, logId, payload = {}) => {
    const routes = {
      publish: () =>
        axios.patch(
          `/api/admin/projects/${projectId}/logs/${logId}/publish`,
          {},
          { headers: authHeader },
        ),
      update: () =>
        axios.patch(`/api/admin/logs/${logId}/update`, payload, {
          headers: authHeader,
        }),
      close: () =>
        axios.put(`/api/admin/logs/${logId}/close`, payload, {
          headers: authHeader,
        }),
      terminate: () =>
        axios.patch(`/api/admin/logs/${logId}/terminate`, payload, {
          headers: authHeader,
        }),
      reopen: () =>
        axios.patch(`/api/admin/logs/${logId}/reopen`, payload, {
          headers: authHeader,
        }),
    };
    const messages = {
      publish: "Publish state toggled.",
      update: "Log updated.",
      close: "Task closed and points awarded! ✓",
      terminate: "Log terminated.",
      reopen: "Log reopened and published.",
    };
    try {
      const { data } = await routes[action]();
      if (data.success) {
        await refreshProject(projectId);
        showToast(data.message || messages[action]);
      }
    } catch (err) {
      showToast(
        err?.response?.data?.message || `Action '${action}' failed.`,
        "error",
      );
    }
  };

  const currentProject = projects.find((p) => p._id === activeId);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono    { font-family: 'DM Mono', monospace; }
        @keyframes slideIn { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track  { background: #0c0f18; }
        ::-webkit-scrollbar-thumb  { background: #2a3045; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #e85d3a; }
        details summary::-webkit-details-marker { display: none; }
      `}</style>

      <div
        className="min-h-screen font-mono"
        style={{ background: "#080c14", color: "#f0f4ff" }}
      >
        {/* Top Nav */}
        <div
          className="sticky top-0 z-[100] flex items-center justify-between px-8 h-16 border-b border-slate-800/80"
          style={{ background: "#0c0f18" }}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#e85d3a] rounded-lg flex items-center justify-center text-sm font-extrabold font-display text-white">
              I
            </div>
            <div>
              <div className="text-[15px] font-extrabold text-slate-100 font-display tracking-tight">
                InterConnect
              </div>
              <div className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">
                Admin Portal
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/")}
              className="px-3.5 py-1.5 rounded-lg text-[11px] font-mono text-slate-500 border border-slate-800 hover:text-slate-300 hover:border-slate-700 transition-colors bg-transparent cursor-pointer"
            >
              ← Dashboard
            </button>
            <button
              onClick={() => fetchProjects(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[11px] font-mono text-slate-500 bg-slate-900 border border-slate-800 hover:text-slate-300 transition-colors cursor-pointer disabled:opacity-50"
            >
              {refreshing ? <Spinner size={11} /> : "↻"}{" "}
              {refreshing ? "Syncing…" : "Sync"}
            </button>
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
              <Avatar name={adminProfile.name || "Admin"} size={32} />
              <div>
                <div className="text-[12px] font-bold text-slate-200 font-display leading-tight">
                  {adminProfile.name || "Admin"}
                </div>
                <div className="text-[9px] text-slate-600 font-mono leading-tight">
                  {adminProfile.email || "—"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex" style={{ height: "calc(100vh - 64px)" }}>
          {/* Sidebar */}
          <div
            className="w-72 flex-shrink-0 border-r border-slate-800/60 overflow-y-auto py-5 px-4"
            style={{ background: "#0c0f18" }}
          >
            <div className="flex items-center justify-between px-2 mb-4">
              <span className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">
                Assigned ({projects.length})
              </span>
              {refreshing && <Spinner size={11} />}
            </div>
            {loading ? (
              [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            ) : projects.length === 0 ? (
              <div className="text-center py-10 px-4">
                <div className="text-3xl opacity-10 mb-2">◌</div>
                <p className="text-[11px] text-slate-700 font-mono">
                  No projects assigned.
                </p>
              </div>
            ) : (
              projects.map((p) => {
                const isActive = p._id === activeId;
                const done = (p.logs || []).filter(
                  (l) => l.task_status === "completed",
                ).length;
                const active = (p.logs || []).filter(
                  (l) =>
                    l.task_status === "assigned" || l.task_status === "pending",
                ).length;
                const pending = (p.logs || []).filter(
                  (l) => l.task_status === "pending",
                ).length;
                return (
                  <div
                    key={p._id}
                    onClick={() => setActiveId(p._id)}
                    className={`rounded-xl p-3.5 mb-2 cursor-pointer transition-all duration-150 border-l-2 ${isActive ? "bg-[#131825] border border-[#e85d3a30] border-l-[#e85d3a]" : "bg-transparent border border-transparent border-l-transparent hover:bg-slate-900/40"}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-[10px] font-mono ${isActive ? "text-[#e85d3a]" : "text-slate-600"}`}
                      >
                        {p.projectID}
                      </span>
                      <div className="flex gap-1">
                        {pending > 0 && (
                          <span
                            className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
                            style={{
                              background: "#818cf815",
                              color: "#818cf8",
                              border: "1px solid #818cf830",
                            }}
                          >
                            ◈{pending}
                          </span>
                        )}
                        {p.is_blocked && <StatusPill status="blocked" />}
                      </div>
                    </div>
                    <div
                      className={`text-[12px] font-bold font-display mb-2.5 leading-tight ${isActive ? "text-slate-100" : "text-slate-400"}`}
                    >
                      {p.problem?.title}
                    </div>
                    <div className="h-1 bg-slate-800 rounded-full mb-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${p.projectProgressRate}%`,
                          background: isActive ? "#e85d3a" : "#3a9de8",
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] text-slate-700 font-mono">
                      <span>{p.projectProgressRate}%</span>
                      <span>
                        {done}/{(p.logs || []).length} done{" "}
                        {active > 0 && `· ${active} active`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Main */}
          <div className="flex-1 overflow-y-auto p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-3/4 gap-4">
                <Spinner size={36} />
                <p className="text-[11px] text-slate-600 font-mono tracking-widest">
                  Loading projects…
                </p>
              </div>
            ) : !currentProject ? (
              <div className="flex flex-col items-center justify-center h-3/4 gap-3">
                <div className="text-5xl opacity-10">◌</div>
                <p className="text-[12px] text-slate-700 font-mono">
                  No project selected.
                </p>
              </div>
            ) : (
              <ProjectView
                project={currentProject}
                onEdit={setEditingProject}
                onCreateLog={setCreatingLog}
                onViewStudent={(s, logs, projectId) => {
                  setViewingStudent(s);
                  setViewingStudentLogs(logs);
                  setViewingStudentProjectId(projectId);
                }}
                onLogAction={handleLogAction}
              />
            )}
          </div>
        </div>
      </div>

      {/* Top-level modals */}
      {editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onSave={handleSaveProject}
        />
      )}
      {creatingLog && (
        <CreateLogModal
          project={creatingLog}
          onClose={() => setCreatingLog(null)}
          onCreate={(form) => handleCreateLog(creatingLog, form)}
        />
      )}
      {viewingStudent && (
        <StudentModal
          student={viewingStudent}
          projectLogs={viewingStudentLogs}
          projectId={viewingStudentProjectId}
          onClose={() => {
            setViewingStudent(null);
            setViewingStudentProjectId(null);
          }}
        />
      )}

      {toast && (
        <ToastBar
          message={toast.message}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ManageProjects;
