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

  const handleApprove = async () => {
    if (!form.coordinatorId) return;
    setSaving(true);
    await onApprove(problem._id, form);
    setSaving(false);
    onClose();
  };

  return (
    <SAModal title={`Approve · ${problem.problemID}`} onClose={onClose}>
      <div
        style={{
          background: "#0c0f18",
          border: "1px solid #1e2330",
          borderRadius: 10,
          padding: "14px 16px",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#f0f4ff",
          }}
        >
          {problem.title}
        </div>
        <div style={{ fontSize: 12, color: "#6b7a99", marginTop: 4 }}>
          {problem.ownerName} · {problem.organization}
        </div>
      </div>

      <div
        style={{
          fontSize: 11,
          color: "#4ade80",
          letterSpacing: "0.08em",
          marginBottom: 16,
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        ◆ Assign Coordinator *
      </div>

      <div style={{ marginBottom: 16 }}>
        <select
          value={form.coordinatorId}
          onChange={set("coordinatorId")}
          style={{
            width: "100%",
            background: "#060810",
            border: "1px solid #1e2330",
            borderRadius: 8,
            padding: "10px 14px",
            color: form.coordinatorId ? "#f0f4ff" : "#6b7a99",
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            outline: "none",
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
        style={{
          background: "#1a3a2a",
          border: "1px solid #4ade8030",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 12,
          color: "#4ade80",
          marginBottom: 20,
        }}
      >
        ✓ This will publish the problem, create a new project, and notify the
        problem owner via email.
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <SABtn variant="secondary" onClick={onClose}>
          Cancel
        </SABtn>
        <SABtn
          variant="success"
          onClick={handleApprove}
          loading={saving}
          disabled={!form.coordinatorId}
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

  const handleReject = async () => {
    setSaving(true);
    await onReject(problem._id, reason);
    setSaving(false);
    onClose();
  };

  return (
    <SAModal title="Reject Problem Statement" onClose={onClose}>
      <div
        style={{
          background: "#0c0f18",
          border: "1px solid #1e2330",
          borderRadius: 10,
          padding: "14px 16px",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#f0f4ff",
          }}
        >
          {problem.title}
        </div>
        <div style={{ fontSize: 12, color: "#6b7a99", marginTop: 4 }}>
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
        style={{
          background: "#3a1a1a",
          border: "1px solid #f8717130",
          borderRadius: 8,
          padding: "10px 14px",
          fontSize: 12,
          color: "#f87171",
          marginBottom: 20,
        }}
      >
        ✕ The problem owner will be notified via email.
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <SABtn variant="secondary" onClick={onClose}>
          Cancel
        </SABtn>
        <SABtn variant="danger" onClick={handleReject} loading={saving}>
          ✕ Reject
        </SABtn>
      </div>
    </SAModal>
  );
};

// ─── Detail Panel ──────────────────────────────────────────────────────────────
const ProblemDetail = ({ problem, onClose }) => (
  <SAModal title={problem.problemID} onClose={onClose}>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 12,
        marginBottom: 16,
      }}
    >
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
          style={{
            background: "#060810",
            border: "1px solid #1e2330",
            borderRadius: 8,
            padding: "10px 14px",
          }}
        >
          <div
            style={{
              fontSize: 9,
              color: "#6b7a99",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            {k}
          </div>
          <div
            style={{
              fontSize: 12,
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
        background: "#060810",
        border: "1px solid #1e2330",
        borderRadius: 10,
        padding: "14px 16px",
        marginBottom: 16,
      }}
    >
      <div
        style={{
          fontSize: 9,
          color: "#6b7a99",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          marginBottom: 8,
        }}
      >
        Description
      </div>
      <p
        style={{
          fontSize: 12,
          color: "#c4cedf",
          fontFamily: "'DM Mono', monospace",
          lineHeight: 1.7,
        }}
      >
        {problem.description}
      </p>
    </div>
    {problem.tags?.length > 0 && (
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {problem.tags.map((t) => (
          <Badge key={t} color="#3a9de8">
            {t}
          </Badge>
        ))}
      </div>
    )}
    {problem.project && (
      <div
        style={{
          marginTop: 16,
          background: "#1a2a1a",
          border: "1px solid #4ade8030",
          borderRadius: 10,
          padding: "14px 16px",
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: "#4ade80",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 8,
          }}
        >
          ◆ Initiated Project
        </div>
        <div
          style={{
            fontSize: 13,
            color: "#f0f4ff",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
          }}
        >
          {problem.project.projectID}
        </div>
        {problem.project.coordinators?.map((c) => (
          <div
            key={c._id}
            style={{ fontSize: 12, color: "#6b7a99", marginTop: 4 }}
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
  const [filter, setFilter] = useState("all"); // all | pending | approved | rejected
  const [search, setSearch] = useState("");

  const [approvingProblem, setApprovingProblem] = useState(null);
  const [rejectingProblem, setRejectingProblem] = useState(null);
  const [detailProblem, setDetailProblem] = useState(null);

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

  const filtered = problems.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.organization?.toLowerCase().includes(search.toLowerCase());
    if (filter === "approved") return p.is_published && matchSearch;
    if (filter === "pending")
      return !p.is_published && !p.project && matchSearch;
    if (filter === "initiated") return p.project && matchSearch;
    return matchSearch;
  });

  const statusType = (p) => {
    if (p.project) return "approved";
    if (p.is_published) return "approved";
    const lastAction = p.actions?.[p.actions.length - 1]?.actionType;
    if (lastAction === "rejected") return "rejected";
    return "pending";
  };

  return (
    <SALayout
      title="Problem Management"
      subtitle="Approve, reject & assign coordinators"
    >
      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search problems…"
          style={{
            background: "#0c0f18",
            border: "1px solid #1e2330",
            borderRadius: 9,
            padding: "9px 14px",
            color: "#f0f4ff",
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            outline: "none",
            width: 260,
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "pending", "approved", "initiated"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: "7px 14px",
                borderRadius: 8,
                border: `1px solid ${filter === f ? `${SA_ACCENT}60` : "#1e2330"}`,
                background: filter === f ? `${SA_ACCENT}18` : "#0c0f18",
                color: filter === f ? SA_ACCENT : "#6b7a99",
                fontSize: 11,
                fontWeight: 700,
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer",
                textTransform: "capitalize",
                letterSpacing: "0.04em",
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={fetchData}
          style={{
            marginLeft: "auto",
            padding: "7px 14px",
            borderRadius: 8,
            border: "1px solid #1e2330",
            background: "#0c0f18",
            color: "#6b7a99",
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
            cursor: "pointer",
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {loading ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "50vh",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <Spinner size={32} />
          <p style={{ color: "#6b7a99", fontSize: 12 }}>Loading problems…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#4a5568",
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
            marginTop: 60,
          }}
        >
          No problems found.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map((p, i) => {
            const st = statusType(p);
            return (
              <motion.div
                key={p._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                style={{
                  background: "#0c0f18",
                  border: `1px solid ${st === "approved" ? "#4ade8025" : st === "rejected" ? "#f8717125" : "#1e2330"}`,
                  borderRadius: 12,
                  padding: "18px 20px",
                  borderLeft: `3px solid ${st === "approved" ? "#4ade80" : st === "rejected" ? "#f87171" : "#fbbf24"}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 12,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: 11,
                          color: SA_ACCENT,
                        }}
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
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "#f0f4ff",
                        marginBottom: 6,
                      }}
                    >
                      {p.title}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7a99",
                        marginBottom: 10,
                      }}
                    >
                      {p.ownerName} · {p.organization} · {fmtDate(p.createdAt)}
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      <Badge color="#3a9de8">{p.category}</Badge>
                      <Badge color="#9c3ae8">{p.theme}</Badge>
                      {p.tags?.map((t) => (
                        <Badge key={t} color="#6b7a99">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexShrink: 0,
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      maxWidth: 220,
                    }}
                  >
                    <SABtn
                      small
                      variant="ghost"
                      onClick={() => setDetailProblem(p)}
                    >
                      View
                    </SABtn>
                    {st !== "approved" && !p.project && (
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
                    {p.project && (
                      <div
                        style={{
                          fontSize: 11,
                          color: "#4ade80",
                          fontFamily: "'DM Mono', monospace",
                          padding: "5px 10px",
                          background: "#1a3a2a",
                          borderRadius: 6,
                          border: "1px solid #4ade8030",
                        }}
                      >
                        {p.project.projectID}
                      </div>
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
