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

const totalPoints = (logs) =>
  logs
    .filter((l) => l.task_status === "completed")
    .reduce((a, l) => a + l.assignedTaskPoints, 0);

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

// ─── Atoms ────────────────────────────────────────────────────────────────────
const Avatar = ({ name = "", size = 36 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: avatarColor(name),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size * 0.35,
      fontWeight: 700,
      color: "#fff",
      fontFamily: "'DM Mono', monospace",
      flexShrink: 0,
    }}
  >
    {initials(name)}
  </div>
);

const Badge = ({ children, color = "#3a9de8" }) => (
  <span
    style={{
      padding: "2px 10px",
      borderRadius: 4,
      fontSize: 11,
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

const ProgressBar = ({ value, color = "#e85d3a" }) => (
  <div>
    <div
      style={{
        height: 6,
        background: "#1e2330",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${value}%`,
          background: color,
          borderRadius: 3,
          transition: "width 0.6s cubic-bezier(.4,0,.2,1)",
          boxShadow: `0 0 8px ${color}80`,
        }}
      />
    </div>
    <span
      style={{
        fontSize: 11,
        color: "#8892a4",
        fontFamily: "'DM Mono', monospace",
        marginTop: 4,
        display: "block",
      }}
    >
      {value}% complete
    </span>
  </div>
);

const Pill = ({ children, type = "default" }) => {
  const map = {
    completed: { bg: "#1a3a2a", color: "#4ade80", border: "#4ade8040" },
    pending: { bg: "#3a2e1a", color: "#fbbf24", border: "#fbbf2440" },
    blocked: { bg: "#3a1a1a", color: "#f87171", border: "#f8717140" },
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
      }}
    >
      {children}
    </span>
  );
};

const Btn = ({
  children,
  onClick,
  variant = "primary",
  small,
  disabled,
  loading,
}) => {
  const map = {
    primary: { bg: "#e85d3a", color: "#fff", border: "none" },
    secondary: { bg: "#1e2330", color: "#c4cedf", border: "1px solid #2a3045" },
    ghost: {
      bg: "transparent",
      color: "#e85d3a",
      border: "1px solid #e85d3a40",
    },
    danger: { bg: "#3a1a1a", color: "#f87171", border: "1px solid #f8717140" },
    success: { bg: "#1a3a2a", color: "#4ade80", border: "1px solid #4ade8040" },
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
        fontSize: small ? 12 : 13,
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

const Spinner = ({ size = 20, color = "#e85d3a" }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: "50%",
      border: `2px solid ${color}30`,
      borderTopColor: color,
      animation: "spin 0.7s linear infinite",
      flexShrink: 0,
    }}
  />
);

// ─── Toast ────────────────────────────────────────────────────────────────────
const ToastBar = ({ message, type = "success", onDone }) => {
  useEffect(() => {
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
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
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

// ─── Modal Shell ──────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }) => (
  <div
    onClick={onClose}
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.78)",
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
        background: "#0f1219",
        border: "1px solid #2a3045",
        borderRadius: 16,
        padding: "32px 36px",
        width: "100%",
        maxWidth: 640,
        maxHeight: "85vh",
        overflowY: "auto",
        boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px #ffffff08",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
        }}
      >
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 20,
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
            width: 32,
            height: 32,
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 16,
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

// ─── Form Helpers ─────────────────────────────────────────────────────────────
const Field = ({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
}) => (
  <div style={{ marginBottom: 18 }}>
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 600,
        color: "#8892a4",
        marginBottom: 6,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {label} {required && <span style={{ color: "#e85d3a" }}>*</span>}
    </label>
    {type === "textarea" ? (
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        style={{
          width: "100%",
          background: "#131825",
          border: "1px solid #2a3045",
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
          background: "#131825",
          border: "1px solid #2a3045",
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
  <div style={{ marginBottom: 18 }}>
    <label
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 600,
        color: "#8892a4",
        marginBottom: 6,
        fontFamily: "'DM Mono', monospace",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
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
      style={{ width: "100%", accentColor: accent }}
    />
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: 11,
        color: "#8892a4",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      <span>
        {min}
        {unit}
      </span>
      <span style={{ color: accent, fontWeight: 700 }}>
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

// ─── Edit Project Modal ───────────────────────────────────────────────────────
const EditProjectModal = ({ project, onClose, onSave }) => {
  const [form, setForm] = useState({
    projectDescription: project.projectDescription,
    githubRepoLink: project.githubRepoLink,
    liveHostedLink: project.liveHostedLink || "",
    projectProgressRate: project.projectProgressRate,
    is_blocked: project.is_blocked,
    title: project.problem.title,
    category: project.problem.category,
    theme: project.problem.theme,
    description: project.problem.description,
    ownerName: project.problem.ownerName,
    organization: project.problem.organization,
    contactInfo: project.problem.contactInfo || "",
    problem_coordinator: project.problem.problem_coordinator,
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
    <Modal title={`Edit · ${project.projectID}`} onClose={onClose}>
      <div
        style={{
          fontSize: 12,
          color: "#e85d3a",
          fontFamily: "'DM Mono', monospace",
          marginBottom: 20,
          letterSpacing: "0.06em",
        }}
      >
        ◆ PROJECT DATA
      </div>
      <Field
        label="Project Description"
        value={form.projectDescription}
        onChange={set("projectDescription")}
        type="textarea"
        required
      />
      <Field
        label="GitHub Repo"
        value={form.githubRepoLink}
        onChange={set("githubRepoLink")}
        required
        placeholder="https://github.com/..."
      />
      <Field
        label="Live URL"
        value={form.liveHostedLink}
        onChange={set("liveHostedLink")}
        placeholder="https://..."
      />
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
          padding: "12px 16px",
          background: "#131825",
          borderRadius: 8,
          border: "1px solid #2a3045",
        }}
      >
        <input
          type="checkbox"
          id="blocked"
          checked={form.is_blocked}
          onChange={(e) =>
            setForm((f) => ({ ...f, is_blocked: e.target.checked }))
          }
          style={{ accentColor: "#f87171" }}
        />
        <label
          htmlFor="blocked"
          style={{
            fontSize: 13,
            color: "#c4cedf",
            fontFamily: "'DM Mono', monospace",
            cursor: "pointer",
          }}
        >
          Block this project (disable student access)
        </label>
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#3a9de8",
          fontFamily: "'DM Mono', monospace",
          marginBottom: 20,
          letterSpacing: "0.06em",
        }}
      >
        ◆ PROBLEM DATA
      </div>
      <Field
        label="Problem Title"
        value={form.title}
        onChange={set("title")}
        required
      />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
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
      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "flex-end",
          marginTop: 8,
        }}
      >
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

// ─── Student Modal ────────────────────────────────────────────────────────────
const StudentModal = ({ student, projectLogs, onClose }) => {
  const studentLogs = projectLogs.filter(
    (l) => l.task_contributor === student.name,
  );
  const contrib = student.projectWiseContribution?.[0];
  return (
    <Modal title={`Student · ${student.name}`} onClose={onClose}>
      <div
        style={{
          display: "flex",
          gap: 16,
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <Avatar name={student.name} size={56} />
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color: "#f0f4ff",
            }}
          >
            {student.name}
          </div>
          <div
            style={{
              fontSize: 13,
              color: "#8892a4",
              fontFamily: "'DM Mono', monospace",
              marginTop: 2,
            }}
          >
            {student.email}
          </div>
          <div
            style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}
          >
            {student.isBlocked ? (
              <Pill type="blocked">Blocked</Pill>
            ) : (
              <Pill type="completed">Active</Pill>
            )}
            {contrib && <Badge color="#9c3ae8">{contrib.role}</Badge>}
            <Badge color="#3a9de8">{student.branch}</Badge>
          </div>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
          marginBottom: 24,
        }}
      >
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
            style={{
              background: "#131825",
              border: "1px solid #2a3045",
              borderRadius: 10,
              padding: "14px 16px",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                fontFamily: "'Syne', sans-serif",
                color: s.color,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#8892a4",
                fontFamily: "'DM Mono', monospace",
                marginTop: 2,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          ["Department", student.department],
          ["Program", student.program],
          ["College", student.college],
          ["Phone", student.phone],
        ].map(([k, v]) => (
          <div
            key={k}
            style={{
              background: "#131825",
              border: "1px solid #2a3045",
              borderRadius: 8,
              padding: "10px 14px",
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: "#8892a4",
                fontFamily: "'DM Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {k}
            </div>
            <div
              style={{
                fontSize: 13,
                color: "#c4cedf",
                fontFamily: "'DM Mono', monospace",
                marginTop: 4,
              }}
            >
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
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            color: "#3a9de8",
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            textDecoration: "none",
            marginBottom: 20,
          }}
        >
          ⌥ GitHub Profile ↗
        </a>
      )}
      {studentLogs.length > 0 && (
        <>
          <div
            style={{
              fontSize: 12,
              color: "#e85d3a",
              fontFamily: "'DM Mono', monospace",
              marginBottom: 14,
              letterSpacing: "0.06em",
            }}
          >
            ◆ ASSIGNED LOGS
          </div>
          {studentLogs.map((log) => (
            <div
              key={log._id}
              style={{
                background: "#131825",
                border: "1px solid #2a3045",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#f0f4ff",
                    fontFamily: "'Syne', sans-serif",
                  }}
                >
                  {log.taskTitle}
                </span>
                <Pill type={log.task_status}>{log.task_status}</Pill>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#8892a4",
                  fontFamily: "'DM Mono', monospace",
                  marginTop: 6,
                }}
              >
                {log.description}
              </div>
              <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                <span
                  style={{
                    fontSize: 11,
                    color: "#fbbf24",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  ⬡ {log.assignedTaskPoints} pts
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "#8892a4",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {fmtDate(log.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </>
      )}
    </Modal>
  );
};

// ─── Create Log Modal ─────────────────────────────────────────────────────────
const CreateLogModal = ({ project, onClose, onCreate }) => {
  const [form, setForm] = useState({
    taskTitle: "",
    description: "",
    githubIssueLink: "",
    assignedTaskPoints: 10,
    contributorID: "",
    task_contributor: "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isValid = form.taskTitle && form.githubIssueLink && form.contributorID;

  const handleCreate = async () => {
    setSaving(true);
    await onCreate(form);
    setSaving(false);
    onClose();
  };

  return (
    <Modal title={`Open Log · ${project.projectID}`} onClose={onClose}>
      <div
        style={{
          fontSize: 12,
          color: "#4ade80",
          fontFamily: "'DM Mono', monospace",
          marginBottom: 20,
          letterSpacing: "0.06em",
        }}
      >
        ◆ CREATE TASK LOG
      </div>
      <Field
        label="Task Title"
        value={form.taskTitle}
        onChange={set("taskTitle")}
        required
        placeholder="e.g. Implement login with JWT"
      />
      <Field
        label="Description"
        value={form.description}
        onChange={set("description")}
        type="textarea"
        required
        placeholder="Detailed task requirements..."
      />
      <Field
        label="GitHub Issue Link"
        value={form.githubIssueLink}
        onChange={set("githubIssueLink")}
        required
        placeholder="https://github.com/.../issues/X"
      />
      <div style={{ marginBottom: 18 }}>
        <label
          style={{
            display: "block",
            fontSize: 12,
            fontWeight: 600,
            color: "#8892a4",
            marginBottom: 6,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Assign To <span style={{ color: "#e85d3a" }}>*</span>
        </label>
        <select
          value={form.contributorID}
          onChange={(e) => {
            const c = project.contributors.find(
              (x) => x._id === e.target.value,
            );
            setForm((f) => ({
              ...f,
              contributorID: e.target.value,
              task_contributor: c?.name || "",
            }));
          }}
          style={{
            width: "100%",
            background: "#131825",
            border: "1px solid #2a3045",
            borderRadius: 8,
            padding: "10px 14px",
            color: form.contributorID ? "#f0f4ff" : "#8892a4",
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            outline: "none",
          }}
        >
          <option value="">— Select Contributor —</option>
          {project.contributors.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <RangeField
        label="Task Points"
        value={form.assignedTaskPoints}
        min={5}
        max={100}
        step={5}
        onChange={(e) =>
          setForm((f) => ({ ...f, assignedTaskPoints: Number(e.target.value) }))
        }
        accent="#4ade80"
        unit=" pts"
      />
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn
          variant="success"
          onClick={handleCreate}
          disabled={!isValid}
          loading={saving}
        >
          Open Log
        </Btn>
      </div>
    </Modal>
  );
};

// ─── Close Log Modal ──────────────────────────────────────────────────────────
const CloseLogModal = ({ log, onClose, onCloseLog }) => {
  const [form, setForm] = useState({
    githubPrLink: "",
    contributionScore: log.assignedTaskPoints,
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleClose = async () => {
    setSaving(true);
    await onCloseLog(form);
    setSaving(false);
    onClose();
  };

  return (
    <Modal title="Close Task Log" onClose={onClose}>
      <div
        style={{
          background: "#131825",
          border: "1px solid #2a3045",
          borderRadius: 10,
          padding: "14px 16px",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#f0f4ff",
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {log.taskTitle}
        </div>
        <div
          style={{
            fontSize: 12,
            color: "#8892a4",
            fontFamily: "'DM Mono', monospace",
            marginTop: 4,
          }}
        >
          Contributor:{" "}
          <span style={{ color: "#c4cedf" }}>{log.task_contributor}</span>
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          color: "#4ade80",
          fontFamily: "'DM Mono', monospace",
          marginBottom: 20,
          letterSpacing: "0.06em",
        }}
      >
        ◆ COMPLETION CREDENTIALS
      </div>
      <Field
        label="GitHub PR / Commit Link"
        value={form.githubPrLink}
        onChange={set("githubPrLink")}
        placeholder="https://github.com/.../pull/X"
        required
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
        value={form.note}
        onChange={set("note")}
        type="textarea"
        placeholder="What was achieved? Any remarks for the contributor..."
      />
      <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <Btn variant="secondary" onClick={onClose}>
          Cancel
        </Btn>
        <Btn variant="success" onClick={handleClose} loading={saving}>
          ✓ Mark Complete
        </Btn>
      </div>
    </Modal>
  );
};

// ─── Workflow Insight ─────────────────────────────────────────────────────────
const WorkflowInsight = ({ project }) => {
  const allLogs = project.logs ?? [];
  const completed = allLogs.filter((l) => l.task_status === "completed");
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

  return (
    <div style={{ marginTop: 32 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            width: 4,
            height: 28,
            background: "#e85d3a",
            borderRadius: 2,
          }}
        />
        <h2
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 18,
            fontWeight: 800,
            color: "#f0f4ff",
            margin: 0,
          }}
        >
          Workflow Insight
        </h2>
        <div style={{ flex: 1, height: 1, background: "#2a3045" }} />
        <Badge color="#e85d3a">
          {completed.length}/{allLogs.length} done
        </Badge>
      </div>

      {/* Contributor Lanes */}
      <div
        style={{
          background: "#0c0f18",
          border: "1px solid #2a3045",
          borderRadius: 14,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#e85d3a",
            fontFamily: "'DM Mono', monospace",
            marginBottom: 18,
            letterSpacing: "0.06em",
          }}
        >
          ◆ CONTRIBUTOR LANES
        </div>
        {Object.values(lanes).map((stu) => {
          const contrib = stu.projectWiseContribution?.[0];
          const pts = stu.logs
            .filter((l) => l.task_status === "completed")
            .reduce((a, l) => a + l.assignedTaskPoints, 0);
          return (
            <div key={stu._id} style={{ marginBottom: 20 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 10,
                }}
              >
                <Avatar name={stu.name} size={28} />
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#f0f4ff",
                  }}
                >
                  {stu.name}
                </span>
                {contrib && <Badge color="#9c3ae8">{contrib.role}</Badge>}
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: 12,
                    color: "#fbbf24",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  ⬡ {pts} pts
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  paddingLeft: 38,
                }}
              >
                {stu.logs.length === 0 ? (
                  <span
                    style={{
                      fontSize: 11,
                      color: "#4a5568",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    No tasks assigned
                  </span>
                ) : (
                  stu.logs.map((log, i) => (
                    <div
                      key={log._id}
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <div
                        style={{
                          background:
                            log.task_status === "completed"
                              ? "#1a3a2a"
                              : "#2a2a1a",
                          border: `1px solid ${log.task_status === "completed" ? "#4ade8050" : "#fbbf2450"}`,
                          borderRadius: 8,
                          padding: "8px 14px",
                          fontSize: 12,
                          color:
                            log.task_status === "completed"
                              ? "#4ade80"
                              : "#fbbf24",
                          fontFamily: "'DM Mono', monospace",
                          maxWidth: 200,
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            marginBottom: 2,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {log.task_status === "completed" ? "✓ " : "◌ "}
                          {log.taskTitle.slice(0, 24)}
                          {log.taskTitle.length > 24 ? "…" : ""}
                        </div>
                        <div style={{ fontSize: 10, opacity: 0.7 }}>
                          {log.assignedTaskPoints} pts ·{" "}
                          {fmtDate(log.createdAt)}
                        </div>
                      </div>
                      {i < stu.logs.length - 1 && (
                        <div
                          style={{
                            width: 20,
                            height: 1,
                            background: "#2a3045",
                          }}
                        />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div
        style={{
          background: "#0c0f18",
          border: "1px solid #2a3045",
          borderRadius: 14,
          padding: 24,
        }}
      >
        <div
          style={{
            fontSize: 12,
            color: "#3a9de8",
            fontFamily: "'DM Mono', monospace",
            marginBottom: 18,
            letterSpacing: "0.06em",
          }}
        >
          ◆ CHRONOLOGICAL TIMELINE
        </div>
        <div style={{ position: "relative", paddingLeft: 28 }}>
          <div
            style={{
              position: "absolute",
              left: 9,
              top: 0,
              bottom: 0,
              width: 2,
              background: "#1e2330",
              borderRadius: 2,
            }}
          />
          {timeline.length === 0 && (
            <p
              style={{
                color: "#4a5568",
                fontFamily: "'DM Mono', monospace",
                fontSize: 12,
              }}
            >
              No logs yet.
            </p>
          )}
          {timeline.map((log, i) => (
            <div
              key={log._id}
              style={{
                position: "relative",
                marginBottom: i < timeline.length - 1 ? 20 : 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: -28,
                  top: 4,
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background:
                    log.task_status === "completed" ? "#4ade80" : "#fbbf24",
                  border: "2px solid #0c0f18",
                  boxShadow: `0 0 8px ${log.task_status === "completed" ? "#4ade8060" : "#fbbf2460"}`,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#f0f4ff",
                    }}
                  >
                    {log.taskTitle}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#8892a4",
                      fontFamily: "'DM Mono', monospace",
                      marginTop: 2,
                    }}
                  >
                    {log.task_contributor} · {fmtDate(log.createdAt)}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: "#fbbf24",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    ⬡ {log.assignedTaskPoints}pt
                  </span>
                  <Pill type={log.task_status}>{log.task_status}</Pill>
                </div>
              </div>
            </div>
          ))}
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
  onCloseLog,
  onViewStudent,
}) => {
  const [tab, setTab] = useState("overview");
  const [selectedLog, setSelectedLog] = useState(null);
  const TABS = ["overview", "problem", "students", "logs", "workflow"];

  return (
    <div
      style={{
        background: "#0f1219",
        border: "1px solid #2a3045",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "24px 28px",
          background: "linear-gradient(135deg, #131825 0%, #0f1219 100%)",
          borderBottom: "1px solid #2a3045",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -20,
            top: -20,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "#e85d3a08",
            border: "1px solid #e85d3a15",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "#e85d3a12",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            position: "relative",
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  color: "#e85d3a",
                  background: "#e85d3a15",
                  padding: "3px 10px",
                  borderRadius: 4,
                  border: "1px solid #e85d3a30",
                }}
              >
                {project.projectID}
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  color: "#8892a4",
                }}
              >
                ↔
              </span>
              <span
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 12,
                  color: "#3a9de8",
                  background: "#3a9de815",
                  padding: "3px 10px",
                  borderRadius: 4,
                  border: "1px solid #3a9de830",
                }}
              >
                {project.problem?.problemID}
              </span>
              {project.is_blocked && <Pill type="blocked">Blocked</Pill>}
            </div>
            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 20,
                fontWeight: 800,
                color: "#f0f4ff",
                margin: "0 0 10px",
              }}
            >
              {project.problem?.title}
            </h2>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                marginBottom: 14,
              }}
            >
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
          <div style={{ display: "flex", gap: 10, marginLeft: 20 }}>
            <Btn variant="secondary" small onClick={() => onCreateLog(project)}>
              + Log
            </Btn>
            <Btn small onClick={() => onEdit(project)}>
              Edit
            </Btn>
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, marginTop: 20 }}>
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
              label: "Completed",
              value:
                project.logs?.filter((l) => l.task_status === "completed")
                  .length ?? 0,
              color: "#4ade80",
            },
            {
              label: "Points",
              value: totalPoints(project.logs ?? []),
              color: "#fbbf24",
            },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 22,
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
                  color: "#8892a4",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          borderBottom: "1px solid #2a3045",
          padding: "0 28px",
          overflowX: "auto",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "14px 16px",
              fontSize: 12,
              fontWeight: 700,
              fontFamily: "'DM Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: tab === t ? "#e85d3a" : "#8892a4",
              borderBottom:
                tab === t ? "2px solid #e85d3a" : "2px solid transparent",
              marginBottom: -1,
              whiteSpace: "nowrap",
              transition: "color 0.2s",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div style={{ padding: "28px" }}>
        {/* Overview */}
        {tab === "overview" && (
          <div>
            <p
              style={{
                fontSize: 14,
                color: "#c4cedf",
                fontFamily: "'DM Mono', monospace",
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              {project.projectDescription}
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                marginBottom: 20,
              }}
            >
              <a
                href={project.githubRepoLink}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#131825",
                  border: "1px solid #2a3045",
                  borderRadius: 10,
                  padding: "14px 16px",
                  textDecoration: "none",
                }}
              >
                <span style={{ fontSize: 20 }}>⌥</span>
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#8892a4",
                      fontFamily: "'DM Mono', monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    GitHub Repo
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "#3a9de8",
                      fontFamily: "'DM Mono', monospace",
                      marginTop: 2,
                    }}
                  >
                    View Repository ↗
                  </div>
                </div>
              </a>
              {project.liveHostedLink ? (
                <a
                  href={project.liveHostedLink}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "#131825",
                    border: "1px solid #2a3045",
                    borderRadius: 10,
                    padding: "14px 16px",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: 20 }}>◉</span>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#8892a4",
                        fontFamily: "'DM Mono', monospace",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Live Demo
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#4ade80",
                        fontFamily: "'DM Mono', monospace",
                        marginTop: 2,
                      }}
                    >
                      Open Live ↗
                    </div>
                  </div>
                </a>
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    background: "#131825",
                    border: "1px dashed #2a3045",
                    borderRadius: 10,
                    padding: "14px 16px",
                    opacity: 0.5,
                  }}
                >
                  <span style={{ fontSize: 20 }}>◌</span>
                  <div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#8892a4",
                        fontFamily: "'DM Mono', monospace",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Live Demo
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#4a5568",
                        fontFamily: "'DM Mono', monospace",
                        marginTop: 2,
                      }}
                    >
                      Not deployed yet
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#8892a4",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Created {fmtDate(project.createdAt)} ·{" "}
              {project.contributors?.length} contributors ·{" "}
              {project.logs?.length} task logs
            </div>
          </div>
        )}

        {/* Problem */}
        {tab === "problem" && (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 14,
                marginBottom: 20,
              }}
            >
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
                  "Coordinator",
                  project.problem?.problem_coordinator,
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
                  style={{
                    background: "#0c0f18",
                    border: "1px solid #2a3045",
                    borderRadius: 8,
                    padding: "12px 16px",
                  }}
                >
                  <div
                    style={{
                      fontSize: 10,
                      color: "#8892a4",
                      fontFamily: "'DM Mono', monospace",
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {k}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: c,
                      fontFamily: "'DM Mono', monospace",
                      marginTop: 4,
                      fontWeight: 600,
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                background: "#0c0f18",
                border: "1px solid #2a3045",
                borderRadius: 10,
                padding: "16px 20px",
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  color: "#8892a4",
                  fontFamily: "'DM Mono', monospace",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginBottom: 8,
                }}
              >
                Description
              </div>
              <p
                style={{
                  fontSize: 13,
                  color: "#c4cedf",
                  fontFamily: "'DM Mono', monospace",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {project.problem?.description}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {project.problem?.tags?.map((t) => (
                <Badge key={t} color="#3a9de8">
                  {t}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Students */}
        {tab === "students" && (
          <div>
            <p
              style={{
                fontSize: 12,
                color: "#8892a4",
                fontFamily: "'DM Mono', monospace",
                marginBottom: 20,
              }}
            >
              {project.contributors?.length} contributor
              {project.contributors?.length !== 1 ? "s" : ""} on this project
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {project.contributors?.map((stu) => {
                const contrib = stu.projectWiseContribution?.[0];
                const stuLogs =
                  project.logs?.filter(
                    (l) => l.task_contributor === stu.name,
                  ) ?? [];
                const doneCt = stuLogs.filter(
                  (l) => l.task_status === "completed",
                ).length;
                return (
                  <div
                    key={stu._id}
                    onClick={() => onViewStudent(stu, project.logs ?? [])}
                    style={{
                      background: "#0c0f18",
                      border: "1px solid #2a3045",
                      borderRadius: 12,
                      padding: "18px 20px",
                      cursor: "pointer",
                      transition: "border-color 0.2s, transform 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#e85d3a50";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#2a3045";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        alignItems: "center",
                        marginBottom: 14,
                      }}
                    >
                      <Avatar name={stu.name} size={40} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontFamily: "'Syne', sans-serif",
                            fontSize: 14,
                            fontWeight: 700,
                            color: "#f0f4ff",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {stu.name}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: "#8892a4",
                            fontFamily: "'DM Mono', monospace",
                            marginTop: 2,
                          }}
                        >
                          {stu.email}
                        </div>
                      </div>
                      {stu.isBlocked ? (
                        <Pill type="blocked">Blocked</Pill>
                      ) : (
                        <Pill type="completed">Active</Pill>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                        marginBottom: 14,
                      }}
                    >
                      {contrib && <Badge color="#9c3ae8">{contrib.role}</Badge>}
                      <Badge color="#3a9de8">{stu.branch}</Badge>
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: 8,
                      }}
                    >
                      {[
                        ["Score", contrib?.contributionScore ?? 0, "#e85d3a"],
                        ["Tasks", stuLogs.length, "#3a9de8"],
                        ["Done", doneCt, "#4ade80"],
                      ].map(([l, v, c]) => (
                        <div
                          key={l}
                          style={{
                            textAlign: "center",
                            background: "#131825",
                            borderRadius: 6,
                            padding: "8px 4px",
                          }}
                        >
                          <div
                            style={{
                              fontFamily: "'Syne', sans-serif",
                              fontSize: 16,
                              fontWeight: 800,
                              color: c,
                            }}
                          >
                            {v}
                          </div>
                          <div
                            style={{
                              fontFamily: "'DM Mono', monospace",
                              fontSize: 9,
                              color: "#8892a4",
                              textTransform: "uppercase",
                            }}
                          >
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

        {/* Logs */}
        {tab === "logs" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#8892a4",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {project.logs?.length} log
                {project.logs?.length !== 1 ? "s" : ""} ·{" "}
                {
                  project.logs?.filter((l) => l.task_status === "completed")
                    .length
                }{" "}
                completed
              </div>
              <Btn variant="success" small onClick={() => onCreateLog(project)}>
                + Open New Log
              </Btn>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {project.logs?.map((log) => (
                <div
                  key={log._id}
                  style={{
                    background: "#0c0f18",
                    border: `1px solid ${log.task_status === "completed" ? "#4ade8030" : "#fbbf2430"}`,
                    borderRadius: 12,
                    padding: "18px 20px",
                    borderLeft: `3px solid ${log.task_status === "completed" ? "#4ade80" : "#fbbf24"}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "#f0f4ff",
                        }}
                      >
                        {log.taskTitle}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "#8892a4",
                          fontFamily: "'DM Mono', monospace",
                          marginTop: 4,
                        }}
                      >
                        Assigned to{" "}
                        <span style={{ color: "#c4cedf" }}>
                          {log.task_contributor}
                        </span>{" "}
                        · {fmtDate(log.createdAt)}
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        flexShrink: 0,
                      }}
                    >
                      <Pill type={log.task_status}>{log.task_status}</Pill>
                      {log.task_status === "pending" && (
                        <Btn
                          variant="success"
                          small
                          onClick={() => setSelectedLog(log)}
                        >
                          Close
                        </Btn>
                      )}
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#8892a4",
                      fontFamily: "'DM Mono', monospace",
                      lineHeight: 1.6,
                      marginBottom: 12,
                    }}
                  >
                    {log.description}
                  </p>
                  <div
                    style={{ display: "flex", gap: 16, alignItems: "center" }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        color: "#fbbf24",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      ⬡ {log.assignedTaskPoints} pts
                    </span>
                    <a
                      href={log.githubIssueLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        fontSize: 12,
                        color: "#3a9de8",
                        fontFamily: "'DM Mono', monospace",
                        textDecoration: "none",
                      }}
                    >
                      ⌥ GitHub Issue ↗
                    </a>
                    {log.isPublished ? (
                      <Badge color="#4ade80">Published</Badge>
                    ) : (
                      <Badge color="#8892a4">Draft</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {selectedLog && (
              <CloseLogModal
                log={selectedLog}
                onClose={() => setSelectedLog(null)}
                onCloseLog={(form) =>
                  onCloseLog(project._id, selectedLog._id, form)
                }
              />
            )}
          </div>
        )}

        {tab === "workflow" && <WorkflowInsight project={project} />}
      </div>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const SkeletonCard = () => (
  <div
    style={{
      borderRadius: 10,
      padding: 14,
      background: "#0c0f18",
      border: "1px solid #1e2330",
      marginBottom: 8,
    }}
  >
    {[80, 140, 60].map((w, i) => (
      <div
        key={i}
        style={{
          height: i === 1 ? 14 : 10,
          width: w,
          background: "#1e2330",
          borderRadius: 4,
          marginBottom: 8,
          animation: "pulse 1.5s ease-in-out infinite",
        }}
      />
    ))}
    <div
      style={{
        height: 4,
        background: "#1e2330",
        borderRadius: 2,
        marginTop: 10,
      }}
    />
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const ManageProjects = () => {
  const { axios, adminToken } = useAppContext();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState(null);

  const [editingProject, setEditingProject] = useState(null);
  const [creatingLog, setCreatingLog] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [viewingStudentLogs, setViewingStudentLogs] = useState([]);

  const showToast = (message, type = "success") => setToast({ message, type });

  // ── Fetch all assigned projects ─────────────────────────────────────────────
  const fetchProjects = useCallback(
    async (silent = false) => {
      silent ? setRefreshing(true) : setLoading(true);
      try {
        const { data } = await axios.get("/api/admin/projects", {
          headers: { Authorization: `Bearer ${adminToken}` },
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

  // ── Refresh single project helper ───────────────────────────────────────────
  const refreshProject = async (projectId) => {
    try {
      const { data } = await axios.get(`/api/admin/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (data.success)
        setProjects((prev) =>
          prev.map((p) => (p._id === data.project._id ? data.project : p)),
        );
    } catch (_) {}
  };

  // ── Handlers ────────────────────────────────────────────────────────────────
  const handleSaveProject = async (form) => {
    try {
      const { data } = await axios.put(
        `/api/admin/projects/${editingProject._id}`,
        form,
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );
      if (data.success) {
        setProjects((prev) =>
          prev.map((p) => (p._id === data.project._id ? data.project : p)),
        );
        showToast("Project updated successfully.");
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
        {
          headers: { Authorization: `Bearer ${adminToken}` },
        },
      );
      if (data.success) {
        await refreshProject(project._id);
        showToast("Task log opened.");
      }
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to create log.",
        "error",
      );
    }
  };

  const handleCloseLog = async (projectId, logId, form) => {
    try {
      const { data } = await axios.put(`/api/admin/logs/${logId}/close`, form, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (data.success) {
        await refreshProject(projectId);
        showToast(data.message || "Log closed and points awarded.");
      }
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to close log.",
        "error",
      );
    }
  };

  const currentProject = projects.find((p) => p._id === activeId);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0c0f18; }
        ::-webkit-scrollbar-thumb { background: #2a3045; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #e85d3a; }
        input[type=range] { -webkit-appearance: none; height: 4px; border-radius: 2px; background: #1e2330; outline: none; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 14px; height: 14px; border-radius: 50%; cursor: pointer; border: 2px solid #0c0f18; }
        @keyframes spin    { to { transform: rotate(360deg); } }
        @keyframes pulse   { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes slideIn { from { transform: translateY(12px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#080c14",
          color: "#f0f4ff",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {/* ── Top Header ── */}
        <div
          style={{
            padding: "0 32px",
            height: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #1e2330",
            background: "#0c0f18",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                background: "#e85d3a",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 800,
                fontFamily: "'Syne', sans-serif",
              }}
            >
              I
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
                  fontSize: 10,
                  color: "#8892a4",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                }}
              >
                Admin Portal
              </div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                background: "none",
                border: "1px solid #1e2330",
                borderRadius: 8,
                padding: "7px 14px",
                color: "#8892a4",
                fontSize: 12,
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer",
              }}
            >
              ← Dashboard
            </button>
            <button
              onClick={() => fetchProjects(true)}
              disabled={refreshing}
              style={{
                background: "#1e2330",
                border: "1px solid #2a3045",
                borderRadius: 8,
                padding: "7px 14px",
                color: "#8892a4",
                fontSize: 12,
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {refreshing ? <Spinner size={12} /> : "↻"}{" "}
              {refreshing ? "Syncing…" : "Sync"}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Avatar name="Admin User" size={32} />
              <div>
                <div
                  style={{ fontSize: 12, fontWeight: 700, color: "#f0f4ff" }}
                >
                  Admin
                </div>
                <div style={{ fontSize: 10, color: "#8892a4" }}>
                  admin@inteconnect.io
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", height: "calc(100vh - 64px)" }}>
          {/* ── Sidebar ── */}
          <div
            style={{
              width: 280,
              background: "#0c0f18",
              borderRight: "1px solid #1e2330",
              padding: "24px 16px",
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#8892a4",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 16,
                paddingLeft: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Assigned ({projects.length})</span>
              {refreshing && <Spinner size={11} />}
            </div>

            {loading ? (
              [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            ) : projects.length === 0 ? (
              <div
                style={{
                  padding: "20px 8px",
                  fontSize: 12,
                  color: "#4a5568",
                  fontFamily: "'DM Mono', monospace",
                  textAlign: "center",
                }}
              >
                No projects assigned yet.
              </div>
            ) : (
              projects.map((p) => {
                const isActive = p._id === activeId;
                const done =
                  p.logs?.filter((l) => l.task_status === "completed").length ??
                  0;
                return (
                  <div
                    key={p._id}
                    onClick={() => setActiveId(p._id)}
                    style={{
                      borderRadius: 10,
                      padding: "14px",
                      background: isActive ? "#131825" : "transparent",
                      border: isActive
                        ? "1px solid #e85d3a40"
                        : "1px solid transparent",
                      borderLeft: isActive
                        ? "3px solid #e85d3a"
                        : "3px solid transparent",
                      cursor: "pointer",
                      marginBottom: 8,
                      transition: "all 0.2s",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: isActive ? "#e85d3a" : "#8892a4",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {p.projectID}
                      </span>
                      {p.is_blocked && <Pill type="blocked">Blocked</Pill>}
                    </div>
                    <div
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 13,
                        fontWeight: 700,
                        color: isActive ? "#f0f4ff" : "#c4cedf",
                        lineHeight: 1.3,
                        marginBottom: 10,
                      }}
                    >
                      {p.problem?.title}
                    </div>
                    <div
                      style={{
                        height: 3,
                        background: "#1e2330",
                        borderRadius: 2,
                        marginBottom: 6,
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${p.projectProgressRate}%`,
                          background: isActive ? "#e85d3a" : "#3a9de8",
                          borderRadius: 2,
                          transition: "width 0.5s",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 10,
                        color: "#8892a4",
                      }}
                    >
                      <span>{p.projectProgressRate}%</span>
                      <span>
                        {done}/{p.logs?.length ?? 0} tasks
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ── Main Content ── */}
          <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "60%",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <Spinner size={36} />
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 12,
                    color: "#8892a4",
                    letterSpacing: "0.1em",
                  }}
                >
                  Loading projects…
                </p>
              </div>
            ) : !currentProject ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "60%",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <div style={{ fontSize: 48, opacity: 0.3 }}>◌</div>
                <p
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 13,
                    color: "#8892a4",
                  }}
                >
                  No project selected.
                </p>
              </div>
            ) : (
              <ProjectView
                project={currentProject}
                onEdit={setEditingProject}
                onCreateLog={setCreatingLog}
                onCloseLog={handleCloseLog}
                onViewStudent={(s, logs) => {
                  setViewingStudent(s);
                  setViewingStudentLogs(logs);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
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

      {/* ── Toast ── */}
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
