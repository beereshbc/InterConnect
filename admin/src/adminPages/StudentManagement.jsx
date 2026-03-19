import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  SALayout,
  SA_ACCENT,
  Pill,
  Badge,
  SABtn,
  SAModal,
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

const StudentDetailModal = ({ student, onClose }) => {
  const totalScore =
    student.projectWiseContribution?.reduce(
      (a, c) => a + (c.contributionScore || 0),
      0,
    ) ?? 0;
  return (
    <SAModal title={`Student · ${student.name}`} onClose={onClose}>
      <div className="flex items-center gap-3.5 mb-5">
        <Avatar name={student.name} size={52} />
        <div>
          <div
            className="font-display text-[17px] font-extrabold"
            style={{ color: "#f0f4ff" }}
          >
            {student.name}
          </div>
          <div
            className="font-mono text-[12px] mt-0.5"
            style={{ color: "#6b7a99" }}
          >
            {student.email}
          </div>
          <div className="flex gap-1.5 mt-2">
            <Pill type={student.isBlocked ? "blocked" : "active"}>
              {student.isBlocked ? "Blocked" : "Active"}
            </Pill>
            {student.branch && <Badge color="#3a9de8">{student.branch}</Badge>}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {[
          { label: "Total Score", value: totalScore, color: "#e85d3a" },
          {
            label: "Projects",
            value: student.projects?.length ?? 0,
            color: "#3a9de8",
          },
          { label: "Logs", value: student.logs?.length ?? 0, color: "#4ade80" },
        ].map((s) => (
          <div
            key={s.label}
            className="text-center rounded-xl p-3"
            style={{ background: "#060810", border: "1px solid #1e2330" }}
          >
            <div
              className="font-display text-[22px] font-extrabold"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div
              className="font-mono text-[10px] uppercase tracking-widest mt-1"
              style={{ color: "#6b7a99" }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          ["Phone", student.phone || "—"],
          ["Department", student.department || "—"],
          ["Program", student.program || "—"],
          ["Branch", student.branch || "—"],
          ["College", student.college || "—"],
          ["Joined", fmtDate(student.createdAt)],
        ].map(([k, v]) => (
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
              className="font-mono text-[12px] mt-1"
              style={{ color: "#c4cedf" }}
            >
              {v}
            </div>
          </div>
        ))}
      </div>

      {student.githubLink && (
        <a
          href={student.githubLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[12px] no-underline mb-4 hover:opacity-80 transition-opacity"
          style={{ color: "#3a9de8" }}
        >
          ⌥ GitHub Profile ↗
        </a>
      )}

      {student.projectWiseContribution?.length > 0 && (
        <>
          <div
            className="font-mono text-[10px] uppercase tracking-widest font-bold mb-2.5"
            style={{ color: "#e85d3a" }}
          >
            ◆ Project Contributions
          </div>
          {student.projectWiseContribution.map((c, i) => (
            <div
              key={i}
              className="flex justify-between rounded-lg p-2.5 mb-2"
              style={{ background: "#060810", border: "1px solid #1e2330" }}
            >
              <div>
                <div
                  className="font-mono text-[12px]"
                  style={{ color: "#f0f4ff" }}
                >
                  {c.role || "Contributor"}
                </div>
                <div
                  className="font-mono text-[11px] mt-0.5"
                  style={{ color: "#6b7a99" }}
                >
                  {c.description || "—"}
                </div>
              </div>
              <div className="text-right">
                <div
                  className="font-display text-base font-extrabold"
                  style={{ color: "#fbbf24" }}
                >
                  {c.contributionScore}
                </div>
                <div
                  className="font-mono text-[9px] uppercase"
                  style={{ color: "#6b7a99" }}
                >
                  pts
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </SAModal>
  );
};

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [detailStudent, setDetailStudent] = useState(null);

  const showToast = (msg, type = "success") => setToast({ msg, type });

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await saAxios().get("/api/admin/sa/students");
      setStudents(data.students || []);
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Failed to load students.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleToggleBlock = async (studentId) => {
    try {
      const { data } = await saAxios().patch(
        `/api/admin/sa/students/${studentId}/toggle-block`,
      );
      if (data.success) {
        setStudents((prev) =>
          prev.map((s) =>
            s._id === studentId ? { ...s, isBlocked: data.isBlocked } : s,
          ),
        );
        showToast(data.message, data.isBlocked ? "warn" : "success");
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Failed.", "error");
    }
  };

  const filtered = students.filter((s) => {
    const m =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.college?.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase());
    if (filter === "active") return !s.isBlocked && m;
    if (filter === "blocked") return s.isBlocked && m;
    return m;
  });

  return (
    <SALayout
      title="Student Management"
      subtitle="View, block & track all student accounts"
    >
      {/* Controls */}
      <div className="flex gap-3 items-center mb-5 flex-wrap">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search students…"
          className="rounded-xl font-mono text-[12px] outline-none"
          style={{
            background: "#0c0f18",
            border: "1px solid #1e2330",
            padding: "9px 14px",
            color: "#f0f4ff",
            width: 280,
          }}
        />
        <div className="flex gap-1.5">
          {["all", "active", "blocked"].map((f) => (
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
              {f}{" "}
              {f !== "all" &&
                `(${students.filter((s) => (f === "active" ? !s.isBlocked : s.isBlocked)).length})`}
            </button>
          ))}
        </div>
        <div
          className="ml-auto font-mono text-[12px]"
          style={{ color: "#6b7a99" }}
        >
          {filtered.length} student{filtered.length !== 1 ? "s" : ""}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <Spinner size={32} />
          <p className="font-mono text-[12px]" style={{ color: "#6b7a99" }}>
            Loading students…
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="text-center font-mono text-[13px] mt-16"
          style={{ color: "#4a5568" }}
        >
          No students found.
        </div>
      ) : (
        <div
          className="grid gap-3.5"
          style={{ gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))" }}
        >
          {filtered.map((student, i) => {
            const totalScore =
              student.projectWiseContribution?.reduce(
                (a, c) => a + (c.contributionScore || 0),
                0,
              ) ?? 0;
            return (
              <motion.div
                key={student._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl p-5"
                style={{
                  background: "#0c0f18",
                  border: `1px solid ${student.isBlocked ? "#f8717120" : "#1e2330"}`,
                  borderLeft: `3px solid ${student.isBlocked ? "#f87171" : "#4ade80"}`,
                }}
              >
                <div className="flex items-start gap-3 mb-3.5">
                  <Avatar name={student.name} size={42} />
                  <div className="flex-1 min-w-0">
                    <div
                      className="font-display text-sm font-bold truncate"
                      style={{ color: "#f0f4ff" }}
                    >
                      {student.name}
                    </div>
                    <div
                      className="font-mono text-[11px] mt-0.5 truncate"
                      style={{ color: "#6b7a99" }}
                    >
                      {student.email}
                    </div>
                  </div>
                  <Pill type={student.isBlocked ? "blocked" : "active"}>
                    {student.isBlocked ? "Blocked" : "Active"}
                  </Pill>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-3.5">
                  {[
                    ["Score", totalScore, "#e85d3a"],
                    ["Projects", student.projects?.length ?? 0, "#3a9de8"],
                    ["Logs", student.logs?.length ?? 0, "#4ade80"],
                  ].map(([l, v, c]) => (
                    <div
                      key={l}
                      className="text-center rounded-lg py-2"
                      style={{ background: "#131825" }}
                    >
                      <div
                        className="font-display text-base font-extrabold"
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

                <div className="flex gap-1.5 flex-wrap mb-3">
                  {student.branch && (
                    <Badge color="#3a9de8">{student.branch}</Badge>
                  )}
                  {student.program && (
                    <Badge color="#9c3ae8">{student.program}</Badge>
                  )}
                  {student.college && (
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: "#6b7a99" }}
                    >
                      {student.college}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <SABtn
                    small
                    variant="ghost"
                    onClick={() => setDetailStudent(student)}
                  >
                    View
                  </SABtn>
                  <SABtn
                    small
                    variant={student.isBlocked ? "success" : "danger"}
                    onClick={() => handleToggleBlock(student._id)}
                  >
                    {student.isBlocked ? "↑ Unblock" : "⊗ Block"}
                  </SABtn>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {detailStudent && (
        <StudentDetailModal
          student={detailStudent}
          onClose={() => setDetailStudent(null)}
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

export default StudentManagement;
