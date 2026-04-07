import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { Crown, Target, Activity, Building } from "lucide-react";
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
    className="relative rounded-2xl overflow-hidden flex-shrink-0"
    style={{
      background: "#0c0f18",
      border: `1px solid ${accent}20`,
      padding: "16px 20px",
    }}
  >
    <div
      className="absolute -top-8 -right-8 w-24 h-24 rounded-full pointer-events-none"
      style={{ background: `${accent}0a`, filter: "blur(20px)" }}
    />
    <div className="relative z-10 flex items-center justify-between">
      <div>
        <div
          className="font-mono text-[10px] uppercase tracking-widest mb-2"
          style={{ color: "#6b7a99" }}
        >
          {label}
        </div>
        <div className="flex items-center gap-4">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k}>
              <div
                className="font-display text-[20px] font-extrabold leading-none"
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
                className="font-mono text-[9px] uppercase tracking-wide mt-1"
                style={{ color: "#6b7a99" }}
              >
                {k}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
        style={{
          background: `${accent}14`,
          border: `1px solid ${accent}25`,
          color: accent,
        }}
      >
        {icon}
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

  const { stats, recentProblems, topAdmins, dailyHighlights } = data;

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
      <style>{`
        /* Scrollbar styles to keep UI clean */
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #3a9de8; }
      `}</style>

      {/* ── STRICT HEIGHT WRAPPER ── */}
      {/* Subtracting approximate layout header/padding margins from total 100vh */}
      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* ── TOP SECTION (Static) ── */}
        <div className="flex-shrink-0">
          {/* Daily Highlights */}
          {(dailyHighlights.topProject || dailyHighlights.topCoordinator) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              {/* Project of the Day */}
              <div
                className="rounded-xl p-4 border border-indigo-500/30 flex items-start justify-between gap-4"
                style={{
                  background:
                    "linear-gradient(135deg, #4f46e510 0%, #0c0f18 100%)",
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-indigo-400 font-mono uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Target size={12} /> Top Project Today
                  </div>
                  {/* Full Title Display */}
                  <div className="text-[14px] sm:text-[15px] font-extrabold text-slate-100 font-display leading-snug break-words whitespace-normal">
                    {dailyHighlights.topProject
                      ? dailyHighlights.topProject.problemTitle
                      : "No Project Data"}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    {dailyHighlights.topProject
                      ? dailyHighlights.topProject.projectID
                      : "—"}
                  </div>
                </div>
                {dailyHighlights.topProject && (
                  <div className="text-right flex-shrink-0">
                    <div className="font-display font-extrabold text-emerald-400 text-lg">
                      +{dailyHighlights.topProject.dayPoints}{" "}
                      <span className="text-[10px] font-mono">pts</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {dailyHighlights.topProject.dayTasks} tasks
                    </div>
                  </div>
                )}
              </div>

              {/* Coordinator of the Day */}
              <div
                className="rounded-xl p-4 border border-emerald-500/30 flex items-start justify-between gap-4"
                style={{
                  background:
                    "linear-gradient(135deg, #10b98110 0%, #0c0f18 100%)",
                }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] text-emerald-400 font-mono uppercase tracking-widest mb-1 flex items-center gap-1">
                    <Crown size={12} /> Top Admin Today
                  </div>
                  <div className="text-[14px] sm:text-[15px] font-extrabold text-slate-100 font-display leading-snug break-words whitespace-normal">
                    {dailyHighlights.topCoordinator
                      ? dailyHighlights.topCoordinator.name
                      : "No Admin Data"}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1 truncate">
                    {dailyHighlights.topCoordinator
                      ? dailyHighlights.topCoordinator.college
                      : "—"}
                  </div>
                </div>
                {dailyHighlights.topCoordinator && (
                  <div className="text-right flex-shrink-0">
                    <div className="font-display font-extrabold text-blue-400 text-lg">
                      +{dailyHighlights.topCoordinator.dayPoints}{" "}
                      <span className="text-[10px] font-mono">pts</span>
                    </div>
                    <div className="text-[10px] font-mono text-slate-500">
                      {dailyHighlights.topCoordinator.dayTasks} tasks
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div
            className="grid gap-3.5 mb-5"
            style={{
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
            }}
          >
            {STAT_CARDS.map((c) => (
              <StatCard key={c.label} {...c} />
            ))}
          </div>
        </div>

        {/* ── BOTTOM SECTION (Flexible/Scrollable) ── */}
        {/* flex-1 min-h-0 prevents the container from expanding past the window height */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-5 pb-4">
          {/* Recent Problems Column */}
          <div className="flex flex-col h-full bg-[#0c0f18] border border-slate-800/80 rounded-2xl overflow-hidden p-4">
            <div className="flex items-center gap-2.5 mb-4 flex-shrink-0">
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

            <div className="flex-1 overflow-y-auto pr-2 custom-scroll flex flex-col gap-2.5">
              {recentProblems.length === 0 ? (
                <p
                  className="font-mono text-[12px] text-center my-auto"
                  style={{ color: "#4a5568" }}
                >
                  No problems yet.
                </p>
              ) : (
                recentProblems.map((p) => (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="rounded-xl p-3 flex-shrink-0"
                    style={{
                      background: "#0a0c13",
                      border: "1px solid #1e2330",
                    }}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Break words for long problem titles */}
                        <div
                          className="font-display text-[13px] font-bold leading-snug break-words whitespace-normal"
                          style={{ color: "#f0f4ff" }}
                        >
                          {p.title}
                        </div>
                        <div
                          className="font-mono text-[10px] mt-1 truncate"
                          style={{ color: "#6b7a99" }}
                        >
                          {p.organization} · {fmtDate(p.createdAt)}
                        </div>
                      </div>
                      <Pill type={p.is_published ? "approved" : "pending"}>
                        {p.is_published ? "Published" : "Pending"}
                      </Pill>
                    </div>
                    <div className="flex gap-1.5 mt-2.5">
                      <Badge color="#3a9de8">{p.category}</Badge>
                      <Badge color="#9c3ae8">{p.theme}</Badge>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Admin Leaderboard Column */}
          <div className="flex flex-col h-full bg-[#0c0f18] border border-slate-800/80 rounded-2xl overflow-hidden p-4">
            <div className="flex items-center gap-2.5 mb-4 flex-shrink-0">
              <div className="w-1 h-5 rounded-sm bg-[#fbbf24]" />
              <h3
                className="font-display text-sm font-extrabold m-0"
                style={{ color: "#f0f4ff" }}
              >
                Global Admin Leaderboard
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scroll flex flex-col gap-2.5">
              {!topAdmins || topAdmins.length === 0 ? (
                <p
                  className="font-mono text-[12px] text-center my-auto"
                  style={{ color: "#4a5568" }}
                >
                  No admins yet.
                </p>
              ) : (
                topAdmins.map((admin, idx) => {
                  const rank = idx + 1;
                  let rowStyle = {
                    background: "#0a0c13",
                    border: "1px solid #1e2330",
                    borderLeft: "3px solid transparent",
                  };
                  let rankColor = "#6b7a99";

                  if (rank === 1) {
                    rowStyle.background = "#fbbf2410";
                    rowStyle.borderLeft = "3px solid #fbbf24";
                    rankColor = "#fbbf24";
                  } else if (rank === 2) {
                    rowStyle.background = "#9ca3af10";
                    rowStyle.borderLeft = "3px solid #9ca3af";
                    rankColor = "#9ca3af";
                  } else if (rank === 3) {
                    rowStyle.background = "#b4530910";
                    rowStyle.borderLeft = "3px solid #b45309";
                    rankColor = "#b45309";
                  }

                  return (
                    <motion.div
                      key={admin._id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-3 sm:gap-4 rounded-xl p-3 flex-shrink-0"
                      style={rowStyle}
                    >
                      <div className="w-6 sm:w-8 flex-shrink-0 text-center">
                        {rank <= 3 ? (
                          <span className="text-lg sm:text-xl drop-shadow-lg">
                            {["🥇", "🥈", "🥉"][rank - 1]}
                          </span>
                        ) : (
                          <span
                            className="font-display font-extrabold text-[12px] sm:text-[14px]"
                            style={{ color: rankColor }}
                          >
                            #{rank}
                          </span>
                        )}
                      </div>

                      <Avatar name={admin.name} size={36} />

                      <div className="flex-1 min-w-0">
                        <div
                          className="font-display font-bold text-[13px] sm:text-[14px] truncate"
                          style={{ color: "#f0f4ff" }}
                        >
                          {admin.name}
                        </div>
                        <div
                          className="font-mono text-[10px] mt-0.5 truncate"
                          style={{ color: "#6b7a99" }}
                        >
                          {admin.college || "Org Admin"}{" "}
                          {admin.branch ? `· ${admin.branch}` : ""}
                        </div>
                      </div>

                      <div className="flex gap-4 text-right">
                        <div>
                          <div
                            className="font-display text-[13px] sm:text-[15px] font-extrabold"
                            style={{ color: "#4ade80" }}
                          >
                            {admin.totalTaskCreated || 0}
                          </div>
                          <div
                            className="font-mono text-[8px] uppercase tracking-widest"
                            style={{ color: "#6b7a99" }}
                          >
                            Tasks
                          </div>
                        </div>
                        <div>
                          <div
                            className="font-display text-[13px] sm:text-[15px] font-extrabold"
                            style={{ color: "#fbbf24" }}
                          >
                            {admin.totalPoints || 0}
                          </div>
                          <div
                            className="font-mono text-[8px] uppercase tracking-widest"
                            style={{ color: "#6b7a99" }}
                          >
                            Pts
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </SALayout>
  );
};

export default SADashboard;
