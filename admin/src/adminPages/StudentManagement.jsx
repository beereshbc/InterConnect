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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          marginBottom: 20,
        }}
      >
        <Avatar name={student.name} size={52} />
        <div>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 17,
              fontWeight: 800,
              color: "#f0f4ff",
            }}
          >
            {student.name}
          </div>
          <div style={{ fontSize: 12, color: "#6b7a99", marginTop: 2 }}>
            {student.email}
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
            <Pill type={student.isBlocked ? "blocked" : "active"}>
              {student.isBlocked ? "Blocked" : "Active"}
            </Pill>
            {student.branch && <Badge color="#3a9de8">{student.branch}</Badge>}
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 10,
          marginBottom: 16,
        }}
      >
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
            style={{
              background: "#060810",
              border: "1px solid #1e2330",
              borderRadius: 10,
              padding: "12px 14px",
              textAlign: "center",
            }}
          >
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
                fontSize: 10,
                color: "#6b7a99",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginTop: 4,
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
          gap: 10,
          marginBottom: 16,
        }}
      >
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
                color: "#c4cedf",
                fontFamily: "'DM Mono', monospace",
                marginTop: 4,
              }}
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
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: "#3a9de8",
            fontSize: 12,
            fontFamily: "'DM Mono', monospace",
            textDecoration: "none",
            marginBottom: 16,
          }}
        >
          ⌥ GitHub Profile ↗
        </a>
      )}

      {student.projectWiseContribution?.length > 0 && (
        <>
          <div
            style={{
              fontSize: 10,
              color: "#e85d3a",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 700,
              marginBottom: 10,
            }}
          >
            ◆ Project Contributions
          </div>
          {student.projectWiseContribution.map((c, i) => (
            <div
              key={i}
              style={{
                background: "#060810",
                border: "1px solid #1e2330",
                borderRadius: 8,
                padding: "10px 14px",
                marginBottom: 8,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#f0f4ff",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {c.role || "Contributor"}
                </div>
                <div style={{ fontSize: 11, color: "#6b7a99", marginTop: 2 }}>
                  {c.description || "—"}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 16,
                    fontWeight: 800,
                    color: "#fbbf24",
                  }}
                >
                  {c.contributionScore}
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#6b7a99",
                    textTransform: "uppercase",
                  }}
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
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.college?.toLowerCase().includes(search.toLowerCase()) ||
      s.department?.toLowerCase().includes(search.toLowerCase());
    if (filter === "active") return !s.isBlocked && matchSearch;
    if (filter === "blocked") return s.isBlocked && matchSearch;
    return matchSearch;
  });

  return (
    <SALayout
      title="Student Management"
      subtitle="View, block & track all student accounts"
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
          placeholder="Search students…"
          style={{
            background: "#0c0f18",
            border: "1px solid #1e2330",
            borderRadius: 9,
            padding: "9px 14px",
            color: "#f0f4ff",
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
            outline: "none",
            width: 280,
          }}
        />
        <div style={{ display: "flex", gap: 6 }}>
          {["all", "active", "blocked"].map((f) => (
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
              }}
            >
              {f}{" "}
              {f !== "all" &&
                `(${students.filter((s) => (f === "active" ? !s.isBlocked : s.isBlocked)).length})`}
            </button>
          ))}
        </div>
        <div
          style={{
            marginLeft: "auto",
            fontSize: 12,
            color: "#6b7a99",
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {filtered.length} student{filtered.length !== 1 ? "s" : ""}
        </div>
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
          <p style={{ color: "#6b7a99", fontSize: 12 }}>Loading students…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            color: "#4a5568",
            fontSize: 13,
            marginTop: 60,
          }}
        >
          No students found.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: 14,
          }}
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
                style={{
                  background: "#0c0f18",
                  border: `1px solid ${student.isBlocked ? "#f8717120" : "#1e2330"}`,
                  borderRadius: 13,
                  padding: "18px 20px",
                  borderLeft: `3px solid ${student.isBlocked ? "#f87171" : "#4ade80"}`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    marginBottom: 14,
                  }}
                >
                  <Avatar name={student.name} size={42} />
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
                      {student.name}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "#6b7a99",
                        marginTop: 2,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {student.email}
                    </div>
                  </div>
                  <Pill type={student.isBlocked ? "blocked" : "active"}>
                    {student.isBlocked ? "Blocked" : "Active"}
                  </Pill>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 8,
                    marginBottom: 14,
                  }}
                >
                  {[
                    ["Score", totalScore, "#e85d3a"],
                    ["Projects", student.projects?.length ?? 0, "#3a9de8"],
                    ["Logs", student.logs?.length ?? 0, "#4ade80"],
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
                          fontSize: 9,
                          color: "#6b7a99",
                          textTransform: "uppercase",
                        }}
                      >
                        {l}
                      </div>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 6,
                    flexWrap: "wrap",
                    marginBottom: 12,
                  }}
                >
                  {student.branch && (
                    <Badge color="#3a9de8">{student.branch}</Badge>
                  )}
                  {student.program && (
                    <Badge color="#9c3ae8">{student.program}</Badge>
                  )}
                  {student.college && (
                    <span
                      style={{
                        fontSize: 10,
                        color: "#6b7a99",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {student.college}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", gap: 8 }}>
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
