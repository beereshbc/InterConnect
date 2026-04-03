import React, { useState, useEffect, useCallback } from "react";
import { useAppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

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

const daysLeft = (deadlineAt) => {
  if (!deadlineAt) return null;
  const diff = new Date(deadlineAt) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const totalPoints = (logs) =>
  (logs || [])
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

// ─── Status helpers ───────────────────────────────────────────────────────────
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
  // ✅ "pending" = student submitted for review — distinct visual
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

// ─── Avatar ───────────────────────────────────────────────────────────────────
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

// ─── Badge ────────────────────────────────────────────────────────────────────
const Badge = ({ children, color = "#3a9de8" }) => (
  <span
    className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase font-mono"
    style={{ color, background: `${color}18`, border: `1px solid ${color}40` }}
  >
    {children}
  </span>
);

// ─── Progress Bar ─────────────────────────────────────────────────────────────
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

// ─── Spinner ──────────────────────────────────────────────────────────────────
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

// ─── Button ───────────────────────────────────────────────────────────────────
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
  // ✅ New variant for "pending review" close action
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

// ─── Toast ────────────────────────────────────────────────────────────────────
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

// ─── Modal Shell ──────────────────────────────────────────────────────────────
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

// ─── Form Field ───────────────────────────────────────────────────────────────
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

const SelectField = ({ label, value, onChange, children, required }) => (
  <div className="mb-4">
    <label className="block text-[10px] font-bold text-slate-500 mb-1.5 font-mono tracking-widest uppercase">
      {label} {required && <span className="text-[#e85d3a]">*</span>}
    </label>
    <select
      value={value}
      onChange={onChange}
      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3.5 py-2.5 text-slate-200 font-mono text-[13px] outline-none focus:border-[#e85d3a60] transition-colors"
    >
      {children}
    </select>
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

// ─── Contributor Info Modal ───────────────────────────────────────────────────
const ContributorInfoModal = ({ log, contributors, onClose }) => {
  const student = (contributors || []).find(
    (c) => c._id === log.contributorID || c.name === log.task_contributor,
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
                {student.projectWiseContribution?.[0] && (
                  <Badge color="#9c3ae8">
                    {student.projectWiseContribution[0].role}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <InfoRow label="Phone" value={student.phone} color="#3a9de8" />
            <InfoRow label="USN" value={student.usn} color="#fbbf24" />
            <InfoRow label="Department" value={student.department} />
            <InfoRow label="Branch" value={student.branch} />
            <InfoRow label="Program" value={student.program} />
            <InfoRow label="Semester" value={student.semester} />
            <InfoRow label="College" value={student.college} />
            <InfoRow
              label="Total Score"
              value={`${student.totalScore || 0} pts`}
              color="#e85d3a"
            />
          </div>
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

// ─── MODAL: Edit Project ──────────────────────────────────────────────────────
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

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
    onClose();
  };

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
          hint="External docs, design files, data resources"
        />
        <Field
          label="Community Link"
          value={form.communityLink}
          onChange={set("communityLink")}
          placeholder="WhatsApp / Discord / Slack..."
          hint="Team communication platform link"
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
        <Btn onClick={handleSave} loading={saving}>
          Save Changes
        </Btn>
      </div>
    </Modal>
  );
};

// ─── MODAL: Create Log ────────────────────────────────────────────────────────
const CreateLogModal = ({ project, onClose, onCreate }) => {
  const [form, setForm] = useState({
    taskTitle: "",
    description: "",
    requirements: "",
    githubIssueLink: "",
    assignedTaskPoints: 10,
    deadlineDays: 7,
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isValid = form.taskTitle && form.description && form.githubIssueLink;

  const handleCreate = async () => {
    setSaving(true);
    await onCreate(form);
    setSaving(false);
    onClose();
  };

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
        hint="Detailed checklist contributors need to follow"
      />
      <Field
        label="GitHub Issue Link"
        value={form.githubIssueLink}
        onChange={set("githubIssueLink")}
        required
        placeholder="https://github.com/.../issues/X"
      />
      <div className="grid grid-cols-2 gap-4">
        <RangeField
          label="Task Points"
          value={form.assignedTaskPoints}
          min={5}
          max={100}
          step={5}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              assignedTaskPoints: Number(e.target.value),
            }))
          }
          accent="#4ade80"
          unit=" pts"
        />
        <RangeField
          label="Deadline Window"
          value={form.deadlineDays}
          min={1}
          max={30}
          step={1}
          onChange={(e) =>
            setForm((f) => ({ ...f, deadlineDays: Number(e.target.value) }))
          }
          accent="#3a9de8"
          unit=" days"
        />
      </div>
      <div className="p-3.5 bg-blue-950/30 border border-blue-500/20 rounded-xl mb-4">
        <p className="text-[11px] text-blue-400 font-mono">
          ℹ The log will be created as a <strong>draft</strong>. You must
          publish it for contributors to see and self-assign. The deadline clock
          starts only after a contributor claims the task.
        </p>
      </div>
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn
          variant="success"
          onClick={handleCreate}
          disabled={!isValid}
          loading={saving}
        >
          Create Log
        </Btn>
      </div>
    </Modal>
  );
};

// ─── MODAL: Edit Log ──────────────────────────────────────────────────────────
const EditLogModal = ({ log, onClose, onUpdate }) => {
  const [form, setForm] = useState({
    taskTitle: log.taskTitle || "",
    description: log.description || "",
    requirements: log.requirements || "",
    githubIssueLink: log.githubIssueLink || "",
    assignedTaskPoints: log.assignedTaskPoints || 10,
    deadlineDays: log.deadlineDays || 7,
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleUpdate = async () => {
    setSaving(true);
    await onUpdate(form);
    setSaving(false);
    onClose();
  };

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
        label="Requirements / Acceptance Criteria"
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
      <div className="grid grid-cols-2 gap-4">
        <RangeField
          label="Task Points"
          value={form.assignedTaskPoints}
          min={5}
          max={100}
          step={5}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              assignedTaskPoints: Number(e.target.value),
            }))
          }
          accent="#fbbf24"
          unit=" pts"
        />
        <RangeField
          label="Deadline Window"
          value={form.deadlineDays}
          min={1}
          max={30}
          step={1}
          onChange={(e) =>
            setForm((f) => ({ ...f, deadlineDays: Number(e.target.value) }))
          }
          accent="#3a9de8"
          unit=" days"
        />
      </div>
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn variant="warn" onClick={handleUpdate} loading={saving}>
          Update Log
        </Btn>
      </div>
    </Modal>
  );
};

// ─── MODAL: Close Log ─────────────────────────────────────────────────────────
// ✅ FIX: Now clearly handles both "assigned" and "pending" statuses with
//    appropriate UI messaging and pre-fills student-submitted PR link/note.
const CloseLogModal = ({ log, onClose, onCloseLog }) => {
  const isPendingReview = log.task_status === "pending";

  const [form, setForm] = useState({
    // Pre-fill with whatever the student submitted (if pending)
    githubPrLink: log.githubPrLink || "",
    contributionScore: log.assignedTaskPoints || 10,
    closureNote: log.closureNote || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isValid = !!form.githubPrLink;

  const handleClose = async () => {
    setSaving(true);
    await onCloseLog(form);
    setSaving(false);
    onClose();
  };

  return (
    <Modal title="Close Task Log" onClose={onClose}>
      {/* Task summary card */}
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

      {/* ✅ Contextual banner depending on status */}
      {isPendingReview ? (
        <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/25 rounded-xl mb-5">
          <div className="text-[11px] text-indigo-300 font-mono font-bold mb-1">
            🔍 Student Submitted for Review
          </div>
          <p className="text-[11px] text-indigo-400/80 font-mono leading-relaxed">
            The contributor has marked this task as complete and submitted their
            PR link. Review the work, adjust points if needed, and close the
            task to award points.
          </p>
        </div>
      ) : (
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-5">
          <p className="text-[11px] text-amber-400 font-mono">
            ⚠ This task is currently <strong>assigned</strong>. You are closing
            it manually — make sure the work is complete before proceeding.
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
      <RangeField
        label="Awarded Points"
        value={form.contributionScore}
        min={0}
        max={100}
        step={5}
        onChange={(e) =>
          setForm((f) => ({ ...f, contributionScore: Number(e.target.value) }))
        }
        accent="#4ade80"
        unit=" pts"
      />
      <Field
        label="Closure Note"
        value={form.closureNote}
        onChange={set("closureNote")}
        type="textarea"
        placeholder="What was achieved? Any remarks for the contributor..."
        hint={
          isPendingReview
            ? "Student's note shown above is pre-filled — update if needed."
            : undefined
        }
      />

      <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn
          variant="success"
          onClick={handleClose}
          disabled={!isValid}
          loading={saving}
        >
          ✓ Mark Complete & Award {form.contributionScore} pts
        </Btn>
      </div>
    </Modal>
  );
};

// ─── MODAL: Terminate Log ─────────────────────────────────────────────────────
const TerminateLogModal = ({ log, onClose, onTerminate }) => {
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const handle = async () => {
    setSaving(true);
    await onTerminate({ closureNote: note });
    setSaving(false);
    onClose();
  };

  return (
    <Modal title="Terminate Log" onClose={onClose}>
      <div className="p-4 bg-red-950/40 border border-red-500/20 rounded-xl mb-5">
        <div className="text-[13px] font-bold text-red-300 font-display mb-1">
          {log.taskTitle}
        </div>
        <p className="text-[11px] text-red-400/70 font-mono">
          Terminating removes the current contributor assignment and hides the
          log. You can reopen it later.
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
        <Btn variant="danger" onClick={handle} loading={saving}>
          Terminate
        </Btn>
      </div>
    </Modal>
  );
};

// ─── MODAL: Reopen Log ────────────────────────────────────────────────────────
const ReopenLogModal = ({ log, onClose, onReopen }) => {
  const [deadlineDays, setDeadlineDays] = useState(log.deadlineDays || 7);
  const [saving, setSaving] = useState(false);

  const handle = async () => {
    setSaving(true);
    await onReopen({ deadlineDays });
    setSaving(false);
    onClose();
  };

  return (
    <Modal title="Reopen Log" onClose={onClose}>
      <div className="p-4 bg-emerald-950/30 border border-emerald-500/20 rounded-xl mb-5">
        <div className="text-[13px] font-bold text-emerald-300 font-display mb-1">
          {log.taskTitle}
        </div>
        <p className="text-[11px] text-emerald-400/70 font-mono">
          Log will be published and open for contributors to self-assign again.
          Reopened {log.reopenCount || 0} time{log.reopenCount !== 1 ? "s" : ""}{" "}
          before.
        </p>
      </div>
      <RangeField
        label="New Deadline Window (days after assignment)"
        value={deadlineDays}
        min={1}
        max={30}
        step={1}
        onChange={(e) => setDeadlineDays(Number(e.target.value))}
        accent="#4ade80"
        unit=" days"
      />
      <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn variant="success" onClick={handle} loading={saving}>
          ↺ Reopen & Publish
        </Btn>
      </div>
    </Modal>
  );
};

// ─── MODAL: Student Detail ────────────────────────────────────────────────────
const StudentModal = ({ student, projectLogs, onClose }) => {
  const studentLogs = (projectLogs || []).filter(
    (l) => l.task_contributor === student.name,
  );
  const contrib = student.projectWiseContribution?.[0];

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
            {contrib && <Badge color="#9c3ae8">{contrib.role}</Badge>}
            <Badge color="#3a9de8">{student.branch}</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {
            label: "Score",
            value: contrib?.contributionScore ?? 0,
            color: "#e85d3a",
          },
          { label: "Tasks", value: studentLogs.length, color: "#3a9de8" },
          {
            label: "Done",
            value: studentLogs.filter((l) => l.task_status === "completed")
              .length,
            color: "#4ade80",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-slate-900 border border-slate-800 rounded-xl p-3.5"
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

      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          ["Department", student.department],
          ["Program", student.program],
          ["Branch", student.branch],
          ["Semester", student.semester],
          ["USN", student.usn],
          ["Phone", student.phone],
          ["College", student.college],
          ["Total Score", `${student.totalScore || 0} pts`],
          ["Tasks Done", student.totalTasksCompleted || 0],
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
          <SectionLabel color="#e85d3a">Task Logs</SectionLabel>
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
                <p className="text-[11px] text-slate-500 font-mono line-clamp-2 mb-2">
                  {log.description}
                </p>
                <div className="flex gap-4 items-center">
                  <span className="text-[10px] text-amber-400 font-mono">
                    ⬡ {log.assignedTaskPoints} pts
                  </span>
                  <span className="text-[10px] text-slate-600 font-mono">
                    {fmtDate(log.createdAt)}
                  </span>
                  {log.deadlineAt && (
                    <span
                      className={`text-[10px] font-mono ${daysLeft(log.deadlineAt) <= 2 ? "text-red-400" : "text-slate-500"}`}
                    >
                      ⏱{" "}
                      {daysLeft(log.deadlineAt) > 0
                        ? `${daysLeft(log.deadlineAt)}d left`
                        : "Overdue"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Modal>
  );
};

// ─── LOG CARD ─────────────────────────────────────────────────────────────────
const LogCard = ({
  log,
  projectId,
  contributors,
  onPublish,
  onEdit,
  onClose,
  onTerminate,
  onReopen,
}) => {
  const [showStudentInfo, setShowStudentInfo] = useState(false);
  const days = daysLeft(log.deadlineAt);

  // ✅ FIX: "closeable" = assigned OR pending (student submitted for review)
  const isPending = log.task_status === "pending";
  const isAssigned = log.task_status === "assigned";
  const isCloseable = isAssigned || isPending;
  const isOverdue = isCloseable && days !== null && days <= 0;

  const statusBorder =
    {
      open: "border-l-blue-500",
      assigned: isOverdue ? "border-l-red-500" : "border-l-amber-500",
      // ✅ Pending gets a distinct indigo left border to draw admin's attention
      pending: "border-l-indigo-400",
      completed: "border-l-emerald-500",
      terminated: "border-l-red-800",
    }[log.task_status] || "border-l-slate-700";

  return (
    <>
      <div
        className={`bg-[#0c0f18] border border-slate-800 border-l-2 ${statusBorder} rounded-xl p-5 transition-all duration-200`}
      >
        {/* Header row */}
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
            {/* ✅ Prominent badge when student has submitted for review */}
            {isPending && (
              <span className="text-[9px] font-bold tracking-widest uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Needs Review
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-[11px] text-slate-500 font-mono leading-relaxed mb-3 line-clamp-2 mt-2">
          {log.description}
        </p>

        {/* Requirements */}
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

        {/* Meta row */}
        <div className="flex flex-wrap gap-3 items-center mb-3">
          <span className="text-[11px] text-amber-400 font-mono">
            ⬡ {log.assignedTaskPoints} pts
          </span>
          <span className="text-[11px] text-blue-400 font-mono">
            ⏱ {log.deadlineDays}d window
          </span>
          {log.assignedAt && (
            <span className="text-[10px] text-slate-600 font-mono">
              Claimed {fmtDate(log.assignedAt)}
            </span>
          )}
          {isCloseable && log.deadlineAt && (
            <span
              className={`text-[11px] font-bold font-mono ${
                daysLeft(log.deadlineAt) <= 0
                  ? "text-red-400"
                  : daysLeft(log.deadlineAt) <= 2
                    ? "text-orange-400"
                    : "text-slate-400"
              }`}
            >
              {daysLeft(log.deadlineAt) <= 0
                ? "⚠ Overdue"
                : `⏳ ${daysLeft(log.deadlineAt)}d remaining`}
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

        {/* Actions */}
        <div className="flex gap-2 flex-wrap pt-3 border-t border-slate-800/60">
          {/* Student Info */}
          <Btn variant="info" small onClick={() => setShowStudentInfo(true)}>
            👤{" "}
            {log.task_status === "open"
              ? "Unassigned"
              : log.task_contributor || "Student Info"}
          </Btn>

          {/* Publish / Unpublish — only for open logs */}
          {log.task_status === "open" && (
            <Btn
              variant={log.isPublished ? "warn" : "blue"}
              small
              onClick={() => onPublish(log._id, log.isPublished)}
            >
              {log.isPublished ? "Unpublish" : "↑ Publish"}
            </Btn>
          )}

          {/* Edit — only open/draft logs */}
          {log.task_status === "open" && (
            <Btn variant="secondary" small onClick={() => onEdit(log)}>
              Edit
            </Btn>
          )}

          {/* ✅ FIX: Close button appears for BOTH "assigned" AND "pending" logs.
              Pending gets a more prominent indigo variant to hint admin action needed. */}
          {isCloseable && (
            <Btn
              variant={isPending ? "indigo" : "success"}
              small
              onClick={() => onClose(log)}
            >
              {isPending ? "🔍 Review & Close" : "✓ Close"}
            </Btn>
          )}

          {/* Terminate — open or closeable */}
          {(log.task_status === "open" || isCloseable) && (
            <Btn variant="danger" small onClick={() => onTerminate(log)}>
              Terminate
            </Btn>
          )}

          {/* Reopen — terminated only */}
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
          onClose={() => setShowStudentInfo(false)}
        />
      )}
    </>
  );
};

// ─── WORKFLOW INSIGHT ─────────────────────────────────────────────────────────
const WorkflowInsight = ({ project }) => {
  const allLogs = project.logs ?? [];
  const completed = allLogs.filter((l) => l.task_status === "completed");
  // ✅ Count "pending" in assigned bucket for the workflow view
  const assigned = allLogs.filter(
    (l) => l.task_status === "assigned" || l.task_status === "pending",
  );
  const terminated = allLogs.filter((l) => l.task_status === "terminated");

  const lanes = {};
  project.contributors?.forEach((c) => {
    lanes[c.name] = { ...c, logs: [] };
  });
  allLogs.forEach((l) => {
    if (lanes[l.task_contributor]) lanes[l.task_contributor].logs.push(l);
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

      <div className="bg-[#0c0f18] border border-slate-800 rounded-2xl p-6">
        <SectionLabel color="#e85d3a">Contributor Lanes</SectionLabel>
        <div className="space-y-5">
          {Object.values(lanes).map((stu) => {
            const contrib = stu.projectWiseContribution?.[0];
            const pts = stu.logs
              .filter((l) => l.task_status === "completed")
              .reduce((a, l) => a + l.assignedTaskPoints, 0);
            return (
              <div key={stu._id}>
                <div className="flex items-center gap-2.5 mb-2.5">
                  <Avatar name={stu.name} size={26} />
                  <div>
                    <span className="text-[12px] font-bold text-slate-200 font-display">
                      {stu.name}
                    </span>
                    {stu.phone && (
                      <span className="text-[10px] text-slate-500 font-mono ml-2">
                        · {stu.phone}
                      </span>
                    )}
                  </div>
                  {contrib && <Badge color="#9c3ae8">{contrib.role}</Badge>}
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
                              : log.task_status === "terminated"
                                ? "✕ "
                                : log.task_status === "pending"
                                  ? "🔍 "
                                  : "◌ "}
                            {log.taskTitle.slice(0, 22)}
                            {log.taskTitle.length > 22 ? "…" : ""}
                          </div>
                          <div className="text-[9px] opacity-60 mt-0.5">
                            {log.assignedTaskPoints}pts ·{" "}
                            {fmtDate(log.createdAt)}
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
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-600 font-mono">
                        · {fmtDate(log.createdAt)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] text-amber-400 font-mono">
                      ⬡ {log.assignedTaskPoints}pt
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

// ─── PROJECT VIEW ─────────────────────────────────────────────────────────────
const ProjectView = ({
  project,
  onEdit,
  onCreateLog,
  onCloseLog,
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
    // ✅ "assigned" filter bucket includes pending as well
    if (logFilter === "assigned")
      return l.task_status === "assigned" || l.task_status === "pending";
    return l.task_status === logFilter;
  });

  const logCounts = {
    all: (project.logs || []).length,
    open: (project.logs || []).filter((l) => l.task_status === "open").length,
    // ✅ Assigned count includes pending
    assigned: (project.logs || []).filter(
      (l) => l.task_status === "assigned" || l.task_status === "pending",
    ).length,
    completed: (project.logs || []).filter((l) => l.task_status === "completed")
      .length,
    terminated: (project.logs || []).filter(
      (l) => l.task_status === "terminated",
    ).length,
  };

  // ✅ Highlight how many need review specifically
  const pendingReviewCount = (project.logs || []).filter(
    (l) => l.task_status === "pending",
  ).length;

  return (
    <div className="bg-[#0f1219] border border-slate-800 rounded-2xl overflow-hidden">
      {/* ── Header ── */}
      <div
        className="px-7 pt-6 pb-5 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #131825 0%, #0f1219 100%)",
          borderBottom: "1px solid #1e2330",
        }}
      >
        <div
          className="absolute -right-5 -top-5 w-40 h-40 rounded-full"
          style={{ background: "#e85d3a08", border: "1px solid #e85d3a15" }}
        />
        <div
          className="absolute right-5 top-5 w-20 h-20 rounded-full"
          style={{ background: "#e85d3a10" }}
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
              {/* ✅ Alert badge if any logs need review */}
              {pendingReviewCount > 0 && (
                <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/15 px-2 py-0.5 rounded border border-indigo-500/30 animate-pulse">
                  🔍 {pendingReviewCount} need
                  {pendingReviewCount === 1 ? "s" : ""} review
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
            {
              label: "Active",
              value: (project.logs || []).filter(
                (l) =>
                  l.task_status === "assigned" || l.task_status === "pending",
              ).length,
              color: "#fbbf24",
            },
            {
              label: "Completed",
              value: (project.logs || []).filter(
                (l) => l.task_status === "completed",
              ).length,
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

      {/* ── Tabs ── */}
      <div className="flex border-b border-slate-800 px-7 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`
              px-4 py-3.5 text-[11px] font-bold font-mono uppercase tracking-widest cursor-pointer
              border-b-2 transition-colors whitespace-nowrap bg-transparent
              ${tab === t ? "text-[#e85d3a] border-[#e85d3a]" : "text-slate-600 border-transparent hover:text-slate-400"}
            `}
            style={{ marginBottom: -1 }}
          >
            {t}
            {t === "logs" && (
              <span className="ml-1.5 text-[9px] opacity-60">
                ({logCounts.all})
              </span>
            )}
            {/* ✅ Show pending review dot on logs tab */}
            {t === "logs" && pendingReviewCount > 0 && (
              <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            )}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
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
                  subLabel: "View Repository ↗",
                  color: "#3a9de8",
                  active: true,
                },
                {
                  label: "Live Demo",
                  href: project.liveHostedLink,
                  icon: "◉",
                  subLabel: project.liveHostedLink
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
                        {lnk.subLabel}
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
                        {lnk.subLabel}
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 mb-5">
              {[
                {
                  label: "Resources",
                  href: project.resourcesLink,
                  icon: "📁",
                  color: "#fbbf24",
                },
                {
                  label: "Community",
                  href: project.communityLink,
                  icon: "💬",
                  color: "#4ade80",
                },
              ].map((lnk) =>
                lnk.href ? (
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
                        Open ↗
                      </div>
                    </div>
                  </a>
                ) : (
                  <div
                    key={lnk.label}
                    className="flex items-center gap-3 bg-slate-900 border border-dashed border-slate-800 rounded-xl p-4 opacity-30"
                  >
                    <span className="text-lg">{lnk.icon}</span>
                    <div>
                      <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                        {lnk.label}
                      </div>
                      <div className="text-[11px] text-slate-600 font-mono mt-0.5">
                        Not set
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
                const contrib = stu.projectWiseContribution?.[0];
                const stuLogs = (project.logs || []).filter(
                  (l) =>
                    l.contributorID?._id === stu._id ||
                    l.task_contributor === stu.name,
                );
                const doneCt = stuLogs.filter(
                  (l) => l.task_status === "completed",
                ).length;
                return (
                  <div
                    key={stu._id}
                    onClick={() => onViewStudent(stu, project.logs ?? [])}
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
                    <div className="flex gap-2 flex-wrap mb-3.5">
                      {contrib && <Badge color="#9c3ae8">{contrib.role}</Badge>}
                      <Badge color="#3a9de8">{stu.branch}</Badge>
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
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* LOGS */}
        {tab === "logs" && (
          <div>
            <div className="flex items-center justify-between gap-4 mb-5">
              <div className="flex gap-1 flex-wrap">
                {Object.entries(logCounts).map(([key, count]) => (
                  <button
                    key={key}
                    onClick={() => setLogFilter(key)}
                    className={`
                      px-3 py-1.5 rounded-lg text-[10px] font-bold font-mono uppercase tracking-widest cursor-pointer transition-all
                      ${logFilter === key ? "bg-[#e85d3a] text-white" : "bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300"}
                    `}
                  >
                    {key} <span className="opacity-60">({count})</span>
                    {/* ✅ Dot on "assigned" filter if any are pending */}
                    {key === "assigned" && pendingReviewCount > 0 && (
                      <span className="ml-1 inline-block w-1.5 h-1.5 rounded-full bg-indigo-400 align-middle" />
                    )}
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
                    projectId={project._id}
                    contributors={project.contributors || []}
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

// ─── SKELETON ─────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="rounded-xl p-4 bg-[#0c0f18] border border-slate-800/50 mb-2.5">
    <div className="h-2.5 w-20 bg-slate-800 rounded mb-3 animate-pulse" />
    <div className="h-3.5 w-36 bg-slate-800 rounded mb-2 animate-pulse" />
    <div className="h-2 w-14 bg-slate-800 rounded mb-3 animate-pulse" />
    <div className="h-1 bg-slate-800 rounded animate-pulse" />
  </div>
);

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
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

  const showToast = (message, type = "success") => setToast({ message, type });
  const authHeader = { Authorization: `Bearer ${adminToken}` };

  useEffect(() => {
    if (!adminToken) return;
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get("/api/admin/profile", {
          headers: authHeader,
        });
        if (data.success)
          setAdminProfile({ name: data.admin.name, email: data.admin.email });
      } catch (_) {}
    };
    fetchProfile();
  }, [adminToken]);

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
      close: "Log closed and points awarded.",
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
        ::-webkit-scrollbar-track { background: #0c0f18; }
        ::-webkit-scrollbar-thumb { background: #2a3045; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #e85d3a; }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: #1e2330; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; cursor: pointer; border: 2px solid #0c0f18; }
        details summary::-webkit-details-marker { display: none; }
      `}</style>

      <div
        className="min-h-screen font-mono"
        style={{ background: "#080c14", color: "#f0f4ff" }}
      >
        {/* ── Top Nav ── */}
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
          {/* ── Sidebar ── */}
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
                const assigned = (p.logs || []).filter(
                  (l) =>
                    l.task_status === "assigned" || l.task_status === "pending",
                ).length;
                // ✅ Count pending reviews for sidebar indicator
                const pendingCount = (p.logs || []).filter(
                  (l) => l.task_status === "pending",
                ).length;
                return (
                  <div
                    key={p._id}
                    onClick={() => setActiveId(p._id)}
                    className={`
                      rounded-xl p-3.5 mb-2 cursor-pointer transition-all duration-150 border-l-2
                      ${
                        isActive
                          ? "bg-[#131825] border border-[#e85d3a30] border-l-[#e85d3a]"
                          : "bg-transparent border border-transparent border-l-transparent hover:bg-slate-900/40"
                      }
                    `}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-[10px] font-mono ${isActive ? "text-[#e85d3a]" : "text-slate-600"}`}
                      >
                        {p.projectID}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* ✅ Show review needed badge in sidebar */}
                        {pendingCount > 0 && (
                          <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                            {pendingCount} review
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
                        {assigned > 0 && `· ${assigned} active`}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Main ── */}
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
                onCloseLog={(pid, lid, form) =>
                  handleLogAction("close", pid, lid, form)
                }
                onViewStudent={(s, logs) => {
                  setViewingStudent(s);
                  setViewingStudentLogs(logs);
                }}
                onLogAction={handleLogAction}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Top-level modals ── */}
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
          onClose={() => setViewingStudent(null)}
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
