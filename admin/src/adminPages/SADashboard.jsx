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
    className="relative rounded-2xl overflow-hidden"
    style={{
      background: "#0c0f18",
      border: `1px solid ${accent}20`,
      padding: "20px 22px",
    }}
  >
    {/* Glow */}
    <div
      className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
      style={{ background: `${accent}0a`, filter: "blur(20px)" }}
    />
    <div className="relative z-10">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-base mb-3.5"
        style={{
          background: `${accent}14`,
          border: `1px solid ${accent}25`,
          color: accent,
        }}
      >
        {icon}
      </div>
      <div
        className="font-mono text-[10px] uppercase tracking-widest mb-3"
        style={{ color: "#6b7a99" }}
      >
        {label}
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {Object.entries(stats).map(([k, v]) => (
          <div key={k}>
            <div
              className="font-display text-[22px] font-extrabold leading-none"
              style={{
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
              className="font-mono text-[10px] uppercase tracking-wide mt-0.5"
              style={{ color: "#6b7a99" }}
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
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <Spinner size={36} />
          <p className="font-mono text-[12px]" style={{ color: "#6b7a99" }}>
            Loading platform data…
          </p>
        </div>
      </SALayout>
    );

  if (error)
    return (
      <SALayout title="SA Dashboard">
        <div className="font-mono text-[13px]" style={{ color: "#f87171" }}>
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
        className="grid gap-3.5 mb-8"
        style={{ gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))" }}
      >
        {STAT_CARDS.map((c) => (
          <StatCard key={c.label} {...c} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-5">
        {/* Recent Problems */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div
              className="w-1 h-5 rounded-sm"
              style={{ background: SA_ACCENT }}
            />
            <h3
              className="font-display text-sm font-extrabold m-0"
              style={{ color: "#f0f4ff" }}
            >
              Recent Problems
            </h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {recentProblems.length === 0 ? (
              <p className="font-mono text-[12px]" style={{ color: "#4a5568" }}>
                No problems yet.
              </p>
            ) : (
              recentProblems.map((p) => (
                <motion.div
                  key={p._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="rounded-xl p-3.5"
                  style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <div
                        className="font-display text-[13px] font-bold"
                        style={{ color: "#f0f4ff" }}
                      >
                        {p.title}
                      </div>
                      <div
                        className="font-mono text-[11px] mt-0.5"
                        style={{ color: "#6b7a99" }}
                      >
                        {p.organization} · {fmtDate(p.createdAt)}
                      </div>
                    </div>
                    <Pill type={p.is_published ? "approved" : "pending"}>
                      {p.is_published ? "Published" : "Pending"}
                    </Pill>
                  </div>
                  <div className="flex gap-1.5 mt-2">
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
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-1 h-5 rounded-sm bg-[#3a9de8]" />
            <h3
              className="font-display text-sm font-extrabold m-0"
              style={{ color: "#f0f4ff" }}
            >
              Recent Students
            </h3>
          </div>
          <div className="flex flex-col gap-2.5">
            {topStudents.length === 0 ? (
              <p className="font-mono text-[12px]" style={{ color: "#4a5568" }}>
                No students yet.
              </p>
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
                    className="flex items-center gap-3 rounded-xl p-3.5"
                    style={{
                      background: "#0c0f18",
                      border: "1px solid #1e2330",
                    }}
                  >
                    <Avatar name={s.name} size={36} />
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-display text-[13px] font-bold truncate"
                        style={{ color: "#f0f4ff" }}
                      >
                        {s.name}
                      </div>
                      <div
                        className="font-mono text-[11px] mt-0.5"
                        style={{ color: "#6b7a99" }}
                      >
                        {s.department} · {s.college}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className="font-display text-base font-extrabold"
                        style={{ color: "#fbbf24" }}
                      >
                        {totalScore}
                      </div>
                      <div
                        className="font-mono text-[9px] uppercase tracking-widest"
                        style={{ color: "#6b7a99" }}
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
