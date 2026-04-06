import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  SALayout,
  SA_ACCENT,
  Pill,
  Badge,
  SABtn,
  SAModal,
  SAField,
  SAToast,
  Spinner,
  fmtDate,
  Avatar,
} from "./SALayout";

const saAxios = () =>
  axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: { Authorization: `Bearer ${localStorage.getItem("saToken")}` },
  });

// ─── Approve Modal ─────────────────────────────────────────────────────────────
const ApproveModal = ({ problem, admins, onClose, onApprove }) => {
  const [form, setForm] = useState({
    coordinatorId: "",
    githubRepoLink: "",
    projectDescription: problem.description || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <SAModal title={`Approve · ${problem.problemID}`} onClose={onClose}>
      <div
        className="rounded-xl p-3.5 mb-5"
        style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
      >
        <div
          className="font-display text-sm font-bold"
          style={{ color: "#f0f4ff" }}
        >
          {problem.title}
        </div>
        <div
          className="font-mono text-[12px] mt-1"
          style={{ color: "#6b7a99" }}
        >
          {problem.ownerName} · {problem.organization}
        </div>
      </div>

      <div
        className="font-mono text-[11px] uppercase tracking-widest font-bold mb-4"
        style={{ color: "#4ade80" }}
      >
        ◆ Assign Coordinator *
      </div>

      <div className="mb-4">
        <select
          value={form.coordinatorId}
          onChange={set("coordinatorId")}
          className="w-full rounded-lg font-mono text-[13px] outline-none"
          style={{
            background: "#060810",
            border: "1px solid #1e2330",
            padding: "10px 14px",
            color: form.coordinatorId ? "#f0f4ff" : "#6b7a99",
          }}
        >
          <option value="">— Select Admin Coordinator —</option>
          {admins.map((a) => (
            <option key={a._id} value={a._id}>
              {a.name} · {a.email}
            </option>
          ))}
        </select>
      </div>

      <SAField
        label="GitHub Repo Link"
        value={form.githubRepoLink}
        onChange={set("githubRepoLink")}
        placeholder="https://github.com/org/repo"
      />
      <SAField
        label="Project Description (optional)"
        value={form.projectDescription}
        onChange={set("projectDescription")}
        type="textarea"
        placeholder="Describe the initiated project…"
      />

      <div
        className="rounded-lg p-3 font-mono text-[12px] mb-5"
        style={{
          background: "#1a3a2a",
          border: "1px solid #4ade8030",
          color: "#4ade80",
        }}
      >
        ✓ This will publish the problem, create a new project, and notify the
        problem owner via email.
      </div>

      <div className="flex gap-2.5 justify-end">
        <SABtn variant="secondary" onClick={onClose}>
          Cancel
        </SABtn>
        <SABtn
          variant="success"
          loading={saving}
          disabled={!form.coordinatorId}
          onClick={async () => {
            setSaving(true);
            await onApprove(problem._id, form);
            setSaving(false);
            onClose();
          }}
        >
          ✓ Approve & Initiate Project
        </SABtn>
      </div>
    </SAModal>
  );
};

// ─── Reject Modal ──────────────────────────────────────────────────────────────
const RejectModal = ({ problem, onClose, onReject }) => {
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <SAModal title="Reject Problem Statement" onClose={onClose}>
      <div
        className="rounded-xl p-3.5 mb-5"
        style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
      >
        <div
          className="font-display text-sm font-bold"
          style={{ color: "#f0f4ff" }}
        >
          {problem.title}
        </div>
        <div
          className="font-mono text-[12px] mt-1"
          style={{ color: "#6b7a99" }}
        >
          {problem.ownerName} · {problem.organization}
        </div>
      </div>
      <SAField
        label="Rejection Reason (shown in email)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        type="textarea"
        placeholder="Provide feedback to the problem owner…"
      />
      <div
        className="rounded-lg p-3 font-mono text-[12px] mb-5"
        style={{
          background: "#3a1a1a",
          border: "1px solid #f8717130",
          color: "#f87171",
        }}
      >
        ✕ The problem owner will be notified via email.
      </div>
      <div className="flex gap-2.5 justify-end">
        <SABtn variant="secondary" onClick={onClose}>
          Cancel
        </SABtn>
        <SABtn
          variant="danger"
          loading={saving}
          onClick={async () => {
            setSaving(true);
            await onReject(problem._id, reason);
            setSaving(false);
            onClose();
          }}
        >
          ✕ Reject
        </SABtn>
      </div>
    </SAModal>
  );
};

// ─── Reassign Coordinator Modal ───────────────────────────────────────────────
const ReassignModal = ({ problem, admins, onClose, onReassign }) => {
  const currentCoordinators = problem.project?.coordinators || [];
  const [oldCoordinatorId, setOldCoordinatorId] = useState(
    currentCoordinators.length === 1 ? currentCoordinators[0]._id : "",
  );
  const [newCoordinatorId, setNewCoordinatorId] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmStep, setConfirmStep] = useState(false);

  const selectedOld = currentCoordinators.find(
    (c) => c._id === oldCoordinatorId,
  );
  const selectedNew = admins.find((a) => a._id === newCoordinatorId);

  // Admins available as replacement: exclude all current coordinators
  const availableAdmins = admins.filter(
    (a) => !currentCoordinators.map((c) => c._id).includes(a._id),
  );

  const canProceed =
    oldCoordinatorId &&
    newCoordinatorId &&
    oldCoordinatorId !== newCoordinatorId;

  return (
    <SAModal
      title={`Reassign Coordinator · ${problem.project?.projectID || ""}`}
      onClose={onClose}
    >
      {/* Project info strip */}
      <div
        className="rounded-xl p-3.5 mb-5"
        style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
      >
        <div
          className="font-display text-sm font-bold"
          style={{ color: "#f0f4ff" }}
        >
          {problem.title}
        </div>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span
            className="font-mono text-[11px] px-2 py-0.5 rounded"
            style={{
              background: "#1a2a3a",
              color: "#3a9de8",
              border: "1px solid #3a9de820",
            }}
          >
            {problem.project?.projectID}
          </span>
          <span className="font-mono text-[12px]" style={{ color: "#6b7a99" }}>
            {problem.ownerName} · {problem.organization}
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!confirmStep ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
          >
            {/* Step indicator */}
            <div
              className="font-mono text-[11px] uppercase tracking-widest font-bold mb-5 flex items-center gap-2"
              style={{ color: "#fbbf24" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#fbbf2420",
                  border: "1px solid #fbbf2440",
                  fontSize: 10,
                }}
              >
                ⇄
              </span>
              Switch Project Coordinator
            </div>

            {/* Current coordinators */}
            <div className="mb-1">
              <div
                className="font-mono text-[10px] uppercase tracking-widest mb-2"
                style={{ color: "#6b7a99" }}
              >
                Current Coordinator(s) — select who to replace *
              </div>
              {currentCoordinators.length === 0 ? (
                <div
                  className="rounded-lg p-3 font-mono text-[12px]"
                  style={{
                    background: "#1a1a2a",
                    color: "#f87171",
                    border: "1px solid #f8717130",
                  }}
                >
                  No coordinators assigned to this project yet.
                </div>
              ) : (
                <div className="flex flex-col gap-2 mb-4">
                  {currentCoordinators.map((c) => (
                    <button
                      key={c._id}
                      onClick={() => setOldCoordinatorId(c._id)}
                      className="rounded-xl p-3 text-left cursor-pointer transition-all"
                      style={{
                        background:
                          oldCoordinatorId === c._id ? "#2a1a0a" : "#060810",
                        border: `1px solid ${oldCoordinatorId === c._id ? "#fbbf24" : "#1e2330"}`,
                        outline: "none",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div
                            className="font-mono text-[13px] font-semibold"
                            style={{
                              color:
                                oldCoordinatorId === c._id
                                  ? "#fbbf24"
                                  : "#f0f4ff",
                            }}
                          >
                            {c.name}
                          </div>
                          <div
                            className="font-mono text-[11px] mt-0.5"
                            style={{ color: "#6b7a99" }}
                          >
                            {c.email}
                          </div>
                        </div>
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0 transition-all"
                          style={{
                            background:
                              oldCoordinatorId === c._id
                                ? "#fbbf24"
                                : "transparent",
                            border: `2px solid ${oldCoordinatorId === c._id ? "#fbbf24" : "#2e3444"}`,
                          }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Replace with */}
            <div className="mb-4">
              <div
                className="font-mono text-[10px] uppercase tracking-widest mb-2"
                style={{ color: "#6b7a99" }}
              >
                Replace with — new coordinator *
              </div>
              <select
                value={newCoordinatorId}
                onChange={(e) => setNewCoordinatorId(e.target.value)}
                className="w-full rounded-lg font-mono text-[13px] outline-none"
                style={{
                  background: "#060810",
                  border: `1px solid ${newCoordinatorId ? "#3a9de8" : "#1e2330"}`,
                  padding: "10px 14px",
                  color: newCoordinatorId ? "#f0f4ff" : "#6b7a99",
                  cursor: "pointer",
                }}
              >
                <option value="">— Select replacement admin —</option>
                {availableAdmins.length === 0 ? (
                  <option disabled>No other admins available</option>
                ) : (
                  availableAdmins.map((a) => (
                    <option key={a._id} value={a._id}>
                      {a.name} · {a.email}
                    </option>
                  ))
                )}
              </select>
              {availableAdmins.length === 0 && (
                <p
                  className="font-mono text-[11px] mt-1.5"
                  style={{ color: "#f87171" }}
                >
                  All available admins are already coordinators on this project.
                </p>
              )}
            </div>

            {/* Reason */}
            <div className="mb-5">
              <div
                className="font-mono text-[10px] uppercase tracking-widest mb-2"
                style={{ color: "#6b7a99" }}
              >
                Reason / Note (optional — sent in email)
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={2}
                placeholder="e.g. Workload redistribution, unavailability…"
                className="w-full rounded-lg font-mono text-[12px] outline-none resize-none"
                style={{
                  background: "#060810",
                  border: "1px solid #1e2330",
                  padding: "10px 14px",
                  color: "#f0f4ff",
                }}
              />
            </div>

            {/* Info banner */}
            <div
              className="rounded-lg p-3 font-mono text-[12px] mb-5"
              style={{
                background: "#1a2a3a",
                border: "1px solid #3a9de830",
                color: "#3a9de8",
              }}
            >
              ⇄ Both admins will receive an email notification about this
              change.
            </div>

            <div className="flex gap-2.5 justify-end">
              <SABtn variant="secondary" onClick={onClose}>
                Cancel
              </SABtn>
              <SABtn
                variant="warning"
                disabled={!canProceed}
                onClick={() => setConfirmStep(true)}
              >
                Continue →
              </SABtn>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
          >
            {/* Confirm step */}
            <div
              className="font-mono text-[11px] uppercase tracking-widest font-bold mb-5 flex items-center gap-2"
              style={{ color: "#f87171" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  background: "#f8717120",
                  border: "1px solid #f8717140",
                  fontSize: 10,
                }}
              >
                !
              </span>
              Confirm Reassignment
            </div>

            {/* Swap visual */}
            <div
              className="rounded-xl p-4 mb-5"
              style={{ background: "#060810", border: "1px solid #1e2330" }}
            >
              {/* Old → New */}
              <div className="flex items-center gap-3">
                <div
                  className="flex-1 rounded-lg p-3"
                  style={{
                    background: "#2a1a0a",
                    border: "1px solid #fbbf2430",
                  }}
                >
                  <div
                    className="font-mono text-[9px] uppercase tracking-widest mb-1"
                    style={{ color: "#fbbf24" }}
                  >
                    Removing
                  </div>
                  <div
                    className="font-mono text-[13px] font-semibold"
                    style={{ color: "#f0f4ff" }}
                  >
                    {selectedOld?.name || "—"}
                  </div>
                  <div
                    className="font-mono text-[10px] mt-0.5"
                    style={{ color: "#6b7a99" }}
                  >
                    {selectedOld?.email || "—"}
                  </div>
                </div>

                <div
                  className="flex-shrink-0 font-mono text-[18px]"
                  style={{ color: "#3a9de8" }}
                >
                  →
                </div>

                <div
                  className="flex-1 rounded-lg p-3"
                  style={{
                    background: "#1a3a2a",
                    border: "1px solid #4ade8030",
                  }}
                >
                  <div
                    className="font-mono text-[9px] uppercase tracking-widest mb-1"
                    style={{ color: "#4ade80" }}
                  >
                    Assigning
                  </div>
                  <div
                    className="font-mono text-[13px] font-semibold"
                    style={{ color: "#f0f4ff" }}
                  >
                    {selectedNew?.name || "—"}
                  </div>
                  <div
                    className="font-mono text-[10px] mt-0.5"
                    style={{ color: "#6b7a99" }}
                  >
                    {selectedNew?.email || "—"}
                  </div>
                </div>
              </div>

              {reason && (
                <div
                  className="mt-3 pt-3"
                  style={{ borderTop: "1px solid #1e2330" }}
                >
                  <span
                    className="font-mono text-[10px]"
                    style={{ color: "#6b7a99" }}
                  >
                    Reason:{" "}
                  </span>
                  <span
                    className="font-mono text-[12px]"
                    style={{ color: "#c4cedf" }}
                  >
                    {reason}
                  </span>
                </div>
              )}
            </div>

            <div
              className="rounded-lg p-3 font-mono text-[12px] mb-5"
              style={{
                background: "#2a1a1a",
                border: "1px solid #f8717130",
                color: "#f87171",
              }}
            >
              ⚠ This action is immediate. The old coordinator will lose access
              to manage this project's tasks.
            </div>

            <div className="flex gap-2.5 justify-end">
              <SABtn variant="secondary" onClick={() => setConfirmStep(false)}>
                ← Back
              </SABtn>
              <SABtn
                variant="danger"
                loading={saving}
                onClick={async () => {
                  setSaving(true);
                  await onReassign(problem._id, {
                    oldCoordinatorId,
                    newCoordinatorId,
                    reason,
                  });
                  setSaving(false);
                  onClose();
                }}
              >
                ✓ Confirm Switch
              </SABtn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </SAModal>
  );
};

// ─── Detail Panel ──────────────────────────────────────────────────────────────
const ProblemDetail = ({ problem, onClose }) => (
  <SAModal title={problem.problemID} onClose={onClose}>
    <div className="grid grid-cols-2 gap-3 mb-4">
      {[
        ["Title", problem.title, "#f0f4ff"],
        ["Category", problem.category, "#3a9de8"],
        ["Theme", problem.theme, "#9c3ae8"],
        ["Owner", problem.ownerName, "#f0f4ff"],
        ["Organization", problem.organization, "#f0f4ff"],
        ["Department", problem.department || "—", "#c4cedf"],
        ["Coordinator", problem.problem_coordinator, "#4ade80"],
        ["Contact", problem.contactInfo || "—", "#3a9de8"],
      ].map(([k, v, c]) => (
        <div
          key={k}
          className="rounded-lg p-2.5"
          style={{ background: "#060810", border: "1px solid #1e2330" }}
        >
          <div
            className="font-mono text-[9px] uppercase tracking-widest"
            style={{ color: "#6b7a99" }}
          >
            {k}
          </div>
          <div
            className="font-mono text-[12px] font-semibold mt-1"
            style={{ color: c }}
          >
            {v}
          </div>
        </div>
      ))}
    </div>
    <div
      className="rounded-xl p-4 mb-4"
      style={{ background: "#060810", border: "1px solid #1e2330" }}
    >
      <div
        className="font-mono text-[9px] uppercase tracking-widest mb-2"
        style={{ color: "#6b7a99" }}
      >
        Description
      </div>
      <p
        className="font-mono text-[12px] leading-relaxed"
        style={{ color: "#c4cedf" }}
      >
        {problem.description}
      </p>
    </div>
    {problem.tags?.length > 0 && (
      <div className="flex gap-1.5 flex-wrap mb-4">
        {problem.tags.map((t) => (
          <Badge key={t} color="#3a9de8">
            {t}
          </Badge>
        ))}
      </div>
    )}
    {problem.project && (
      <div
        className="rounded-xl p-4 mt-4"
        style={{ background: "#1a2a1a", border: "1px solid #4ade8030" }}
      >
        <div
          className="font-mono text-[10px] uppercase tracking-widest mb-2"
          style={{ color: "#4ade80" }}
        >
          ◆ Initiated Project
        </div>
        <div
          className="font-display text-[13px] font-bold"
          style={{ color: "#f0f4ff" }}
        >
          {problem.project.projectID}
        </div>
        {problem.project.coordinators?.map((c) => (
          <div
            key={c._id}
            className="font-mono text-[12px] mt-1"
            style={{ color: "#6b7a99" }}
          >
            Coordinator: {c.name} · {c.email}
          </div>
        ))}
      </div>
    )}
  </SAModal>
);

// ─── Main ──────────────────────────────────────────────────────────────────────
const ProblemManagement = () => {
  const [problems, setProblems] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [approvingProblem, setApprovingProblem] = useState(null);
  const [rejectingProblem, setRejectingProblem] = useState(null);
  const [detailProblem, setDetailProblem] = useState(null);
  const [reassigningProblem, setReassigningProblem] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const api = saAxios();
      const [p, a] = await Promise.all([
        api.get("/api/admin/sa/problems"),
        api.get("/api/admin/sa/admins"),
      ]);
      setProblems(p.data.problems || []);
      setAdmins((a.data.admins || []).filter((ad) => !ad.isBlocked));
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed to load.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (problemId, form) => {
    try {
      const { data } = await saAxios().put(
        `/api/admin/sa/problems/${problemId}/approve`,
        form,
      );
      if (data.success) {
        showToast(data.message);
        await fetchData();
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed.", "error");
    }
  };

  const handleReject = async (problemId, reason) => {
    try {
      const { data } = await saAxios().put(
        `/api/admin/sa/problems/${problemId}/reject`,
        { reason },
      );
      if (data.success) {
        showToast(data.message, "warn");
        await fetchData();
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed.", "error");
    }
  };

  // ── NEW: reassign handler ──
  const handleReassign = async (
    problemId,
    { oldCoordinatorId, newCoordinatorId, reason },
  ) => {
    try {
      const { data } = await saAxios().put(
        `/api/admin/sa/problems/${problemId}/reassign-coordinator`,
        { oldCoordinatorId, newCoordinatorId, reason },
      );
      if (data.success) {
        showToast(data.message);
        await fetchData();
      }
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Reassignment failed.",
        "error",
      );
    }
  };

  const statusType = (p) => {
    if (p.project || p.is_published) return "approved";
    const last = p.actions?.[p.actions.length - 1]?.actionType;
    if (last === "rejected") return "rejected";
    return "pending";
  };

  const filtered = problems.filter((p) => {
    const m =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.organization?.toLowerCase().includes(search.toLowerCase());
    if (filter === "approved") return p.is_published && m;
    if (filter === "pending") return !p.is_published && !p.project && m;
    if (filter === "initiated") return p.project && m;
    return m;
  });

  const borderColor = {
    approved: "#4ade80",
    rejected: "#f87171",
    pending: "#fbbf24",
  };

  return (
    <SALayout
      title="Problem Management"
      subtitle="Approve, reject, reassign coordinators & manage projects"
    >
      {/* Controls */}
      <div className="flex gap-3 items-center mb-5 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problems…"
          className="rounded-xl font-mono text-[12px] outline-none"
          style={{
            background: "#0c0f18",
            border: "1px solid #1e2330",
            padding: "9px 14px",
            color: "#f0f4ff",
            width: 260,
          }}
        />
        <div className="flex gap-1.5">
          {["all", "pending", "approved", "initiated"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="rounded-lg font-mono text-[11px] font-bold cursor-pointer capitalize tracking-wide"
              style={{
                padding: "7px 14px",
                border: `1px solid ${filter === f ? `${SA_ACCENT}60` : "#1e2330"}`,
                background: filter === f ? `${SA_ACCENT}18` : "#0c0f18",
                color: filter === f ? SA_ACCENT : "#6b7a99",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={fetchData}
          className="ml-auto rounded-lg font-mono text-[12px] cursor-pointer"
          style={{
            padding: "7px 14px",
            border: "1px solid #1e2330",
            background: "#0c0f18",
            color: "#6b7a99",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <Spinner size={32} />
          <p className="font-mono text-[12px]" style={{ color: "#6b7a99" }}>
            Loading problems…
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center font-mono text-[13px] mt-16"
          style={{ color: "#4a5568" }}
        >
          No problems found.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((p, i) => {
            const st = statusType(p);
            const hasProject = !!p.project;
            return (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl p-5"
                style={{
                  background: "#0c0f18",
                  border: `1px solid ${borderColor[st]}25`,
                  borderLeft: `3px solid ${borderColor[st]}`,
                }}
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-2">
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: SA_ACCENT }}
                      >
                        {p.problemID}
                      </span>
                      <Pill type={st}>
                        {st === "approved"
                          ? p.project
                            ? "Project Initiated"
                            : "Published"
                          : st}
                      </Pill>
                    </div>
                    <div
                      className="font-display text-[15px] font-bold mb-1.5"
                      style={{ color: "#f0f4ff" }}
                    >
                      {p.title}
                    </div>
                    <div
                      className="font-mono text-[12px] mb-2.5"
                      style={{ color: "#6b7a99" }}
                    >
                      {p.ownerName} · {p.organization} · {fmtDate(p.createdAt)}
                    </div>

                    {/* Coordinators strip — shown only for initiated projects */}
                    {hasProject && p.project.coordinators?.length > 0 && (
                      <div className="flex items-center gap-1.5 mb-2.5 flex-wrap">
                        <span
                          className="font-mono text-[10px] uppercase tracking-wide"
                          style={{ color: "#6b7a99" }}
                        >
                          Coordinator
                          {p.project.coordinators.length > 1 ? "s" : ""}:
                        </span>
                        {p.project.coordinators.map((c) => (
                          <span
                            key={c._id}
                            className="font-mono text-[11px] px-2 py-0.5 rounded-md"
                            style={{
                              background: "#1a3a2a",
                              border: "1px solid #4ade8025",
                              color: "#4ade80",
                            }}
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-1.5 flex-wrap">
                      <Badge color="#3a9de8">{p.category}</Badge>
                      <Badge color="#9c3ae8">{p.theme}</Badge>
                      {p.tags?.map((t) => (
                        <Badge key={t} color="#6b7a99">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0 flex-wrap max-w-[240px] items-start">
                    <SABtn
                      small
                      variant="ghost"
                      onClick={() => setDetailProblem(p)}
                    >
                      View
                    </SABtn>

                    {/* Approve / Reject — only for non-initiated */}
                    {st !== "approved" && !hasProject && (
                      <>
                        <SABtn
                          small
                          variant="success"
                          onClick={() => setApprovingProblem(p)}
                        >
                          ✓ Approve
                        </SABtn>
                        <SABtn
                          small
                          variant="danger"
                          onClick={() => setRejectingProblem(p)}
                        >
                          ✕ Reject
                        </SABtn>
                      </>
                    )}

                    {/* Project ID badge + Reassign button — for initiated projects */}
                    {hasProject && (
                      <>
                        <div
                          className="font-mono text-[11px] px-2.5 py-1 rounded-lg"
                          style={{
                            background: "#1a3a2a",
                            border: "1px solid #4ade8030",
                            color: "#4ade80",
                          }}
                        >
                          {p.project.projectID}
                        </div>
                        <SABtn
                          small
                          variant="warning"
                          onClick={() => setReassigningProblem(p)}
                        >
                          ⇄ Reassign
                        </SABtn>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      {approvingProblem && (
        <ApproveModal
          problem={approvingProblem}
          admins={admins}
          onClose={() => setApprovingProblem(null)}
          onApprove={handleApprove}
        />
      )}
      {rejectingProblem && (
        <RejectModal
          problem={rejectingProblem}
          onClose={() => setRejectingProblem(null)}
          onReject={handleReject}
        />
      )}
      {detailProblem && (
        <ProblemDetail
          problem={detailProblem}
          onClose={() => setDetailProblem(null)}
        />
      )}
      {reassigningProblem && (
        <ReassignModal
          problem={reassigningProblem}
          admins={admins}
          onClose={() => setReassigningProblem(null)}
          onReassign={handleReassign}
        />
      )}
      {toast && (
        <SAToast
          message={toast.msg}
          type={toast.type}
          onDone={() => setToast(null)}
        />
      )}
    </SALayout>
  );
};

export default ProblemManagement;
