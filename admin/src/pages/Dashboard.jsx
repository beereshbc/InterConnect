import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FolderKanban,
  CheckCircle,
  Award,
  User,
  Mail,
  Building,
  Hash,
  BookOpen,
  Shield,
  Activity,
  Github,
  Loader2,
  ArrowLeft,
  TrendingUp,
  ExternalLink,
  RefreshCcw,
  Phone,
  Zap,
  BarChart3,
  Clock,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

// ─── Animation Variants ───────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const cardVariant = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, accent, suffix, badge }) => (
  <motion.div
    variants={cardVariant}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    style={{
      background: "#0c0f18",
      border: `1px solid #1e2330`,
      borderRadius: 16,
      padding: "24px",
      position: "relative",
      overflow: "hidden",
      cursor: "default",
    }}
    className="stat-card"
  >
    {/* Background glow */}
    <div
      style={{
        position: "absolute",
        top: -40,
        right: -40,
        width: 120,
        height: 120,
        borderRadius: "50%",
        background: `${accent}10`,
        filter: "blur(30px)",
        pointerEvents: "none",
      }}
    />
    {/* Faint icon watermark */}
    <div
      style={{
        position: "absolute",
        bottom: -10,
        right: -10,
        opacity: 0.04,
        pointerEvents: "none",
      }}
    >
      <Icon size={90} color={accent} />
    </div>

    <div style={{ position: "relative", zIndex: 1 }}>
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: `${accent}14`,
          border: `1px solid ${accent}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
          boxShadow: `0 0 20px ${accent}20`,
        }}
      >
        <Icon size={20} color={accent} />
      </div>
      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#6b7a99",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontFamily: "'DM Mono', monospace",
          marginBottom: 8,
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 36,
            fontWeight: 800,
            color: "#f0f4ff",
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        {suffix && (
          <span
            style={{
              fontSize: 12,
              color: "#6b7a99",
              fontFamily: "'DM Mono', monospace",
              paddingBottom: 4,
            }}
          >
            {suffix}
          </span>
        )}
      </div>
      {badge && (
        <div
          style={{
            marginTop: 12,
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            background: `${accent}14`,
            border: `1px solid ${accent}30`,
            borderRadius: 6,
            padding: "4px 10px",
            fontSize: 10,
            fontWeight: 700,
            color: accent,
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {badge.icon && <badge.icon size={10} />}
          {badge.text}
        </div>
      )}
    </div>
  </motion.div>
);

// ─── Profile Field ────────────────────────────────────────────────────────────
const ProfileField = ({
  icon: Icon,
  label,
  value,
  isLink,
  href,
  accent = "#e85d3a",
}) => (
  <motion.div
    variants={cardVariant}
    whileHover={{ borderColor: `${accent}40`, transition: { duration: 0.15 } }}
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      padding: "16px 18px",
      background: "#0c0f18",
      border: "1px solid #1e2330",
      borderRadius: 12,
    }}
  >
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        flexShrink: 0,
        background: `${accent}10`,
        border: `1px solid ${accent}20`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon size={16} color={accent} />
    </div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          color: "#6b7a99",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          fontFamily: "'DM Mono', monospace",
          marginBottom: 5,
        }}
      >
        {label}
      </p>
      {isLink ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            color: accent,
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'DM Mono', monospace",
            textDecoration: "none",
          }}
        >
          {value} <ExternalLink size={12} />
        </a>
      ) : (
        <p
          style={{
            fontSize: 13,
            color: "#c4cedf",
            fontFamily: "'DM Mono', monospace",
            fontWeight: 500,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {value || "—"}
        </p>
      )}
    </div>
  </motion.div>
);

// ─── Status Node ──────────────────────────────────────────────────────────────
const StatusNode = ({ isBlocked }) => {
  const color = isBlocked ? "#f87171" : "#4ade80";
  const label = isBlocked ? "RESTRICTED" : "OPERATIONAL";
  return (
    <motion.div
      variants={cardVariant}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      style={{
        background: "#0c0f18",
        border: "1px solid #1e2330",
        borderRadius: 16,
        padding: "24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: `${color}0c`,
          filter: "blur(30px)",
        }}
      />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: `${color}14`,
            border: `1px solid ${color}30`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            boxShadow: `0 0 20px ${color}20`,
          }}
        >
          <CheckCircle size={20} color={color} />
        </div>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#6b7a99",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontFamily: "'DM Mono', monospace",
            marginBottom: 10,
          }}
        >
          Node Status
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ position: "relative", width: 10, height: 10 }}>
            {!isBlocked && (
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background: color,
                  opacity: 0.4,
                  animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
            )}
            <span
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: color,
              }}
            />
          </div>
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 18,
              fontWeight: 800,
              color,
            }}
          >
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Loading Screen ───────────────────────────────────────────────────────────
const LoadingScreen = () => (
  <div
    style={{
      minHeight: "100vh",
      background: "#080c14",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 20,
    }}
  >
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap');`}</style>
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 14,
        background: "#e85d3a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    >
      <Zap size={22} color="#fff" />
    </div>
    <p
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 11,
        color: "#6b7a99",
        letterSpacing: "0.18em",
        textTransform: "uppercase",
      }}
    >
      Decrypting profile…
    </p>
    <style>{`@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.7;transform:scale(0.95)} }`}</style>
  </div>
);

// ─── Main Dashboard ───────────────────────────────────────────────────────────
const Dashboard = () => {
  const { axios, adminToken } = useAppContext();
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAdminProfile = async () => {
    setIsRefreshing(true);
    try {
      const { data } = await axios.get("/api/admin/profile", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (data.success) setAdminData(data.admin);
    } catch (error) {
      console.error("Failed to fetch admin data:", error);
      setAdminData({
        name: "Admin User",
        email: "admin@inteconnect.io",
        role: "admin",
        college: "GM Institute of Technology",
        branch: "CSE",
        program: "Professor",
        phone: "+91 98765 43210",
        totalTaskCreated: 12,
        totalPoints: 450,
        managedProjects: [1, 2, 3],
        isBlocked: false,
        githubLink: "https://github.com/admin",
        createdAt: "2024-08-15T08:00:00Z",
      });
      toast.error(
        "Using offline preview data. Connect API to see live stats.",
        {
          id: "mock-warning",
          style: {
            background: "#0c0f18",
            color: "#f0f4ff",
            border: "1px solid #e85d3a40",
            fontFamily: "'DM Mono', monospace",
            fontSize: 12,
          },
        },
      );
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  useEffect(() => {
    if (adminToken) fetchAdminProfile();
  }, [axios, adminToken]);

  if (isLoading) return <LoadingScreen />;
  if (!adminData) return null;

  const joinDate = adminData.createdAt
    ? new Date(adminData.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

  const firstName = adminData.name?.split(" ")[0] || "Admin";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes ping { 75%,100% { transform: scale(1.8); opacity: 0; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        body { background: #080c14; }
        .stat-card:hover { border-color: #2a3045 !important; box-shadow: 0 12px 40px rgba(0,0,0,0.5); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0c0f18; }
        ::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 3px; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#080c14",
          color: "#f0f4ff",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {/* ── Ambient background ── */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            pointerEvents: "none",
            zIndex: 0,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -200,
              left: "30%",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #e85d3a06 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -200,
              right: "10%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #3a9de808 0%, transparent 70%)",
            }}
          />
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 28px 60px",
          }}
        >
          {/* ── Top Nav ── */}
          <motion.div
            {...fadeUp(0)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 32,
              marginBottom: 40,
            }}
          >
            <button
              onClick={() => navigate("/")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#0c0f18",
                border: "1px solid #1e2330",
                borderRadius: 10,
                padding: "9px 16px",
                color: "#8892a4",
                fontSize: 12,
                fontWeight: 700,
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer",
                letterSpacing: "0.04em",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#e85d3a40";
                e.currentTarget.style.color = "#f0f4ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#1e2330";
                e.currentTarget.style.color = "#8892a4";
              }}
            >
              <ArrowLeft size={14} /> Command Center
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  background: "#4ade8014",
                  border: "1px solid #4ade8030",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 11,
                  color: "#4ade80",
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#4ade80",
                    boxShadow: "0 0 6px #4ade80",
                  }}
                />
                LIVE
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={fetchAdminProfile}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#0c0f18",
                  border: "1px solid #e85d3a40",
                  borderRadius: 10,
                  padding: "9px 16px",
                  color: "#e85d3a",
                  fontSize: 12,
                  fontWeight: 700,
                  fontFamily: "'DM Mono', monospace",
                  cursor: "pointer",
                  letterSpacing: "0.04em",
                }}
              >
                <RefreshCcw
                  size={12}
                  style={{
                    animation: isRefreshing
                      ? "spin 0.6s linear infinite"
                      : "none",
                  }}
                />
                {isRefreshing ? "Syncing…" : "Sync"}
              </motion.button>
            </div>
          </motion.div>

          {/* ── Header ── */}
          <motion.div {...fadeUp(0.05)} style={{ marginBottom: 44 }}>
            {/* Role badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#e85d3a14",
                border: "1px solid #e85d3a30",
                borderRadius: 8,
                padding: "5px 14px",
                marginBottom: 20,
              }}
            >
              <Shield size={13} color="#e85d3a" />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#e85d3a",
                  fontFamily: "'DM Mono', monospace",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {adminData.role} · Access Level
              </span>
            </div>

            <h1
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(28px, 5vw, 48px)",
                fontWeight: 800,
                color: "#f0f4ff",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: 14,
              }}
            >
              Welcome back,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg, #e85d3a, #f0944d)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {firstName}
              </span>
            </h1>

            <p
              style={{
                fontSize: 14,
                color: "#6b7a99",
                lineHeight: 1.75,
                maxWidth: 560,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Centralized overview of your administrative metrics, active
              projects, and network activity within the InteConnect ecosystem.
            </p>

            {/* Joined date strip */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                marginTop: 16,
                padding: "6px 14px",
                background: "#0c0f18",
                border: "1px solid #1e2330",
                borderRadius: 8,
                fontSize: 11,
                color: "#6b7a99",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              <Clock size={11} color="#6b7a99" />
              Member since {joinDate}
            </div>
          </motion.div>

          {/* ── Stats Grid ── */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 16,
              marginBottom: 36,
            }}
          >
            <StatCard
              icon={FolderKanban}
              label="Active Projects"
              value={adminData.managedProjects?.length || 0}
              accent="#3a9de8"
              badge={{ icon: Activity, text: "Live" }}
            />
            <StatCard
              icon={Activity}
              label="Tasks Initialized"
              value={adminData.totalTaskCreated || 0}
              accent="#4ade80"
              badge={{ icon: TrendingUp, text: "Lifetime" }}
            />
            <StatCard
              icon={Award}
              label="Points Distributed"
              value={adminData.totalPoints || 0}
              accent="#fbbf24"
              suffix="pts"
            />
            <StatusNode isBlocked={adminData.isBlocked} />
          </motion.div>

          {/* ── Analytics Bar ── */}
          <motion.div {...fadeUp(0.2)} style={{ marginBottom: 36 }}>
            <div
              style={{
                background: "#0c0f18",
                border: "1px solid #1e2330",
                borderRadius: 16,
                padding: "20px 24px",
                display: "flex",
                gap: 0,
                overflow: "hidden",
              }}
            >
              {[
                {
                  label: "Completion Rate",
                  value: adminData.totalTaskCreated
                    ? Math.round(
                        (adminData.totalPoints /
                          (adminData.totalTaskCreated * 50)) *
                          100,
                      )
                    : 0,
                  suffix: "%",
                  color: "#e85d3a",
                  icon: BarChart3,
                },
                {
                  label: "Avg Points / Task",
                  value: adminData.totalTaskCreated
                    ? Math.round(
                        adminData.totalPoints / adminData.totalTaskCreated,
                      )
                    : 0,
                  suffix: "pt",
                  color: "#3a9de8",
                  icon: TrendingUp,
                },
                {
                  label: "Projects Managed",
                  value: adminData.managedProjects?.length || 0,
                  suffix: "total",
                  color: "#9c3ae8",
                  icon: FolderKanban,
                },
                {
                  label: "Account Health",
                  value: adminData.isBlocked ? "0" : "100",
                  suffix: "%",
                  color: "#4ade80",
                  icon: Zap,
                },
              ].map((item, i, arr) => (
                <div
                  key={item.label}
                  style={{
                    flex: 1,
                    padding: "0 24px",
                    borderRight:
                      i < arr.length - 1 ? "1px solid #1e2330" : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      flexShrink: 0,
                      background: `${item.color}14`,
                      border: `1px solid ${item.color}25`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <item.icon size={16} color={item.color} />
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 4,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'Syne', sans-serif",
                          fontSize: 22,
                          fontWeight: 800,
                          color: item.color,
                        }}
                      >
                        {item.value}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "#6b7a99",
                          fontFamily: "'DM Mono', monospace",
                        }}
                      >
                        {item.suffix}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 10,
                        color: "#6b7a99",
                        fontFamily: "'DM Mono', monospace",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginTop: 2,
                      }}
                    >
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── Identity Matrix ── */}
          <motion.div {...fadeUp(0.25)}>
            {/* Section header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
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
                }}
              >
                Identity Matrix
              </h2>
              <div style={{ flex: 1, height: 1, background: "#1e2330" }} />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "5px 12px",
                  background: "#0c0f18",
                  border: "1px solid #1e2330",
                  borderRadius: 8,
                  fontSize: 11,
                  color: "#6b7a99",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                <Shield size={11} color="#4ade80" />
                Verified Node
              </div>
            </div>

            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              <ProfileField
                icon={User}
                label="Full Name"
                value={adminData.name}
                accent="#e85d3a"
              />
              <ProfileField
                icon={Mail}
                label="Email Address"
                value={adminData.email}
                accent="#3a9de8"
              />
              <ProfileField
                icon={Building}
                label="Organization"
                value={adminData.college}
                accent="#9c3ae8"
              />
              <ProfileField
                icon={Hash}
                label="Department"
                value={adminData.branch}
                accent="#fbbf24"
              />
              <ProfileField
                icon={BookOpen}
                label="Program / Role"
                value={adminData.program}
                accent="#4ade80"
              />
              {adminData.phone && (
                <ProfileField
                  icon={Phone}
                  label="Phone"
                  value={adminData.phone}
                  accent="#f87171"
                />
              )}
              <ProfileField
                icon={Github}
                label="GitHub Portfolio"
                value={
                  adminData.githubLink
                    ? "View External Profile"
                    : "Not Provided"
                }
                isLink={!!adminData.githubLink}
                href={adminData.githubLink}
                accent="#e85d3a"
              />
              <ProfileField
                icon={Shield}
                label="Account Role"
                value={adminData.role?.toUpperCase()}
                accent="#3a9de8"
              />
            </motion.div>
          </motion.div>

          {/* ── Managed Projects Preview ── */}
          {adminData.managedProjects?.length > 0 && (
            <motion.div {...fadeUp(0.3)} style={{ marginTop: 36 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 28,
                    background: "#3a9de8",
                    borderRadius: 2,
                  }}
                />
                <h2
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#f0f4ff",
                  }}
                >
                  Assigned Projects
                </h2>
                <div style={{ flex: 1, height: 1, background: "#1e2330" }} />
                <button
                  onClick={() => navigate("/manage-projects")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "7px 14px",
                    background: "#3a9de814",
                    border: "1px solid #3a9de830",
                    borderRadius: 8,
                    color: "#3a9de8",
                    fontSize: 11,
                    fontWeight: 700,
                    fontFamily: "'DM Mono', monospace",
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                  }}
                >
                  View All <ExternalLink size={11} />
                </button>
              </div>

              <div
                style={{
                  background: "#0c0f18",
                  border: "1px solid #1e2330",
                  borderRadius: 16,
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 14,
                      background: "#3a9de814",
                      border: "1px solid #3a9de830",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <FolderKanban size={22} color="#3a9de8" />
                  </div>
                  <div>
                    <p
                      style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 16,
                        fontWeight: 700,
                        color: "#f0f4ff",
                      }}
                    >
                      {adminData.managedProjects.length} Project
                      {adminData.managedProjects.length !== 1 ? "s" : ""}{" "}
                      Assigned
                    </p>
                    <p
                      style={{
                        fontSize: 12,
                        color: "#6b7a99",
                        fontFamily: "'DM Mono', monospace",
                        marginTop: 3,
                      }}
                    >
                      Assigned by Super Admin · Manage tasks, logs &
                      contributors
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/manage-projects")}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    background: "#e85d3a",
                    border: "none",
                    borderRadius: 10,
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: 700,
                    fontFamily: "'Syne', sans-serif",
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    flexShrink: 0,
                    boxShadow: "0 4px 16px #e85d3a30",
                  }}
                >
                  Open Projects →
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
