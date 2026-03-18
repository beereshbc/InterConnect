import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  SALayout,
  SA_ACCENT,
  Pill,
  Badge,
  Spinner,
  fmtDate,
  avatarColor,
  Avatar,
} from "./SALayout";

const saAxios = () =>
  axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    headers: { Authorization: `Bearer ${localStorage.getItem("saToken")}` },
  });

const StatCard = ({ icon, label, stats, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    style={{
      background: "#0c0f18",
      border: `1px solid ${accent}20`,
      borderRadius: 14,
      padding: "20px 22px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -30,
        right: -30,
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: `${accent}0a`,
        filter: "blur(20px)",
      }}
    />
    <div style={{ position: "relative", zIndex: 1 }}>
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          background: `${accent}14`,
          border: `1px solid ${accent}25`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          marginBottom: 14,
          color: accent,
        }}
      >
        {icon}
      </div>
      <div
        style={{
          fontSize: 10,
          color: "#6b7a99",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          marginBottom: 12,
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 10,
        }}
      >
        {Object.entries(stats).map(([k, v]) => (
          <div key={k}>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color:
                  k === "total"
                    ? "#f0f4ff"
                    : k === "blocked" || k === "pending"
                      ? "#fbbf24"
                      : "#4ade80",
              }}
            >
              {v}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "#6b7a99",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginTop: 2,
              }}
            >
              {k}
            </div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const SADashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data: res } = await saAxios().get("/api/admin/sa/dashboard");
        if (res.success) setData(res);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <SALayout title="SA Dashboard" subtitle="Platform-wide statistics">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "60vh",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <Spinner size={36} />
          <p style={{ color: "#6b7a99", fontSize: 12 }}>
            Loading platform data…
          </p>
        </div>
      </SALayout>
    );

  if (error)
    return (
      <SALayout title="SA Dashboard">
        <div
          style={{
            color: "#f87171",
            fontFamily: "'DM Mono', monospace",
            fontSize: 13,
          }}
        >
          ✕ {error}
        </div>
      </SALayout>
    );

  const { stats, recentProblems, topStudents } = data;

  const STAT_CARDS = [
    {
      icon: "⊞",
      label: "Admins",
      stats: stats.admins,
      accent: "#e85d3a",
      delay: 0.05,
    },
    {
      icon: "◎",
      label: "Students",
      stats: stats.students,
      accent: "#3a9de8",
      delay: 0.1,
    },
    {
      icon: "⬡",
      label: "Problems",
      stats: stats.problems,
      accent: "#9c3ae8",
      delay: 0.15,
    },
    {
      icon: "◈",
      label: "Projects",
      stats: stats.projects,
      accent: "#fbbf24",
      delay: 0.2,
    },
    {
      icon: "◌",
      label: "Logs",
      stats: stats.logs,
      accent: "#4ade80",
      delay: 0.25,
    },
  ];

  return (
    <SALayout title="SA Dashboard" subtitle="Real-time platform overview">
      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 14,
          marginBottom: 32,
        }}
      >
        {STAT_CARDS.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Recent Problems */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 4,
                height: 20,
                background: SA_ACCENT,
                borderRadius: 2,
              }}
            />
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 14,
                fontWeight: 800,
                color: "#f0f4ff",
              }}
            >
              Recent Problems
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentProblems.length === 0 ? (
              <p style={{ color: "#4a5568", fontSize: 12 }}>No problems yet.</p>
            ) : (
              recentProblems.map((p) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  style={{
                    background: "#0c0f18",
                    border: "1px solid #1e2330",
                    borderRadius: 10,
                    padding: "12px 16px",
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
                    <div>
                      <div
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#f0f4ff",
                        }}
                      >
                        {p.title}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#6b7a99", marginTop: 3 }}
                      >
                        {p.organization} · {fmtDate(p.createdAt)}
                      </div>
                    </div>
                    <Pill type={p.is_published ? "approved" : "pending"}>
                      {p.is_published ? "Published" : "Pending"}
                    </Pill>
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                    <Badge color="#3a9de8">{p.category}</Badge>
                    <Badge color="#9c3ae8">{p.theme}</Badge>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Top Students */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 4,
                height: 20,
                background: "#3a9de8",
                borderRadius: 2,
              }}
            />
            <h3
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 14,
                fontWeight: 800,
                color: "#f0f4ff",
              }}
            >
              Recent Students
            </h3>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {topStudents.length === 0 ? (
              <p style={{ color: "#4a5568", fontSize: 12 }}>No students yet.</p>
            ) : (
              topStudents.map((s) => {
                const totalScore =
                  s.projectWiseContribution?.reduce(
                    (a, c) => a + (c.contributionScore || 0),
                    0,
                  ) ?? 0;
                return (
                  <motion.div
                    key={s._id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      background: "#0c0f18",
                      border: "1px solid #1e2330",
                      borderRadius: 10,
                      padding: "12px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    <Avatar name={s.name} size={36} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#f0f4ff",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {s.name}
                      </div>
                      <div
                        style={{ fontSize: 11, color: "#6b7a99", marginTop: 2 }}
                      >
                        {s.department} · {s.college}
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
                        {totalScore}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          color: "#6b7a99",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        pts
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </SALayout>
  );
};

export default SADashboard;
