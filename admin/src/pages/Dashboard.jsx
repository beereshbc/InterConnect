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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});
const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const cardVar = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
};

const StatCard = ({ icon: Icon, label, value, accent, suffix, badge }) => (
  <motion.div
    variants={cardVar}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="relative rounded-2xl overflow-hidden cursor-default transition-all duration-200 hover:border-slate-700"
    style={{
      background: "#0c0f18",
      border: "1px solid #1e2330",
      padding: "24px",
    }}
  >
    <div
      className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none"
      style={{ background: `${accent}10`, filter: "blur(30px)" }}
    />
    <div className="absolute -bottom-2.5 -right-2.5 opacity-[0.04] pointer-events-none">
      <Icon size={90} color={accent} />
    </div>
    <div className="relative z-10">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{
          background: `${accent}14`,
          border: `1px solid ${accent}30`,
          boxShadow: `0 0 20px ${accent}20`,
        }}
      >
        <Icon size={20} color={accent} />
      </div>
      <p
        className="font-mono text-[11px] font-bold uppercase tracking-widest mb-2"
        style={{ color: "#6b7a99" }}
      >
        {label}
      </p>
      <div className="flex items-end gap-2.5">
        <span
          className="font-display font-extrabold leading-none"
          style={{ fontSize: 36, color: "#f0f4ff" }}
        >
          {value}
        </span>
        {suffix && (
          <span
            className="font-mono text-[12px] pb-1"
            style={{ color: "#6b7a99" }}
          >
            {suffix}
          </span>
        )}
      </div>
      {badge && (
        <div
          className="mt-3 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide"
          style={{
            background: `${accent}14`,
            border: `1px solid ${accent}30`,
            color: accent,
          }}
        >
          {badge.icon && <badge.icon size={10} />} {badge.text}
        </div>
      )}
    </div>
  </motion.div>
);

const ProfileField = ({
  icon: Icon,
  label,
  value,
  isLink,
  href,
  accent = "#e85d3a",
}) => (
  <motion.div
    variants={cardVar}
    className="flex items-start gap-3.5 rounded-xl transition-all duration-150"
    style={{
      padding: "16px 18px",
      background: "#0c0f18",
      border: "1px solid #1e2330",
    }}
  >
    <div
      className="w-[38px] h-[38px] rounded-xl flex-shrink-0 flex items-center justify-center"
      style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}
    >
      <Icon size={16} color={accent} />
    </div>
    <div className="flex-1 min-w-0">
      <p
        className="font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5"
        style={{ color: "#6b7a99" }}
      >
        {label}
      </p>
      {isLink ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-mono text-[13px] font-semibold no-underline hover:opacity-80 transition-opacity"
          style={{ color: accent }}
        >
          {value} <ExternalLink size={12} />
        </a>
      ) : (
        <p
          className="font-mono text-[13px] font-medium truncate"
          style={{ color: "#c4cedf" }}
        >
          {value || "—"}
        </p>
      )}
    </div>
  </motion.div>
);

const StatusNode = ({ isBlocked }) => {
  const color = isBlocked ? "#f87171" : "#4ade80";
  const label = isBlocked ? "RESTRICTED" : "OPERATIONAL";
  return (
    <motion.div
      variants={cardVar}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative rounded-2xl overflow-hidden"
      style={{
        background: "#0c0f18",
        border: "1px solid #1e2330",
        padding: "24px",
      }}
    >
      <div
        className="absolute -top-10 -right-10 w-28 h-28 rounded-full pointer-events-none"
        style={{ background: `${color}0c`, filter: "blur(30px)" }}
      />
      <div className="relative z-10">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{
            background: `${color}14`,
            border: `1px solid ${color}30`,
            boxShadow: `0 0 20px ${color}20`,
          }}
        >
          <CheckCircle size={20} color={color} />
        </div>
        <p
          className="font-mono text-[11px] font-bold uppercase tracking-widest mb-2.5"
          style={{ color: "#6b7a99" }}
        >
          Node Status
        </p>
        <div className="flex items-center gap-2.5">
          <div className="relative w-2.5 h-2.5">
            {!isBlocked && (
              <span
                className="absolute inset-0 rounded-full opacity-40"
                style={{
                  background: color,
                  animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                }}
              />
            )}
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: color }}
            />
          </div>
          <span
            className="font-display text-lg font-extrabold"
            style={{ color }}
          >
            {label}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const LoadingScreen = () => (
  <div
    className="min-h-screen flex flex-col items-center justify-center gap-5"
    style={{ background: "#080c14" }}
  >
    <style>{`@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Mono:wght@400;500&display=swap'); @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.95)}}`}</style>
    <div
      className="w-12 h-12 rounded-2xl flex items-center justify-center"
      style={{
        background: "#e85d3a",
        animation: "pulse 1.5s ease-in-out infinite",
      }}
    >
      <Zap size={22} color="#fff" />
    </div>
    <p
      className="font-mono text-[11px] uppercase tracking-widest"
      style={{ color: "#6b7a99" }}
    >
      Decrypting profile…
    </p>
  </div>
);

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
    } catch {
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
        .font-display { font-family: 'Syne', sans-serif !important; }
        .font-mono    { font-family: 'DM Mono', monospace !important; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes ping { 75%,100%{transform:scale(1.8);opacity:0} }
        @keyframes spin { to{transform:rotate(360deg)} }
        body { background: #080c14; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0c0f18; }
        ::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 3px; }
      `}</style>

      <div
        className="min-h-screen font-mono"
        style={{ background: "#080c14", color: "#f0f4ff" }}
      >
        {/* Ambient BG */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute"
            style={{
              top: -200,
              left: "30%",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,#e85d3a06 0%,transparent 70%)",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: -200,
              right: "10%",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,#3a9de808 0%,transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1100px] mx-auto px-7 pb-16">
          {/* Top Nav */}
          <motion.div
            {...fadeUp(0)}
            className="flex items-center justify-between pt-8 mb-10"
          >
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-[12px] font-bold tracking-wide cursor-pointer transition-all duration-200 hover:border-[#e85d3a40] hover:text-slate-100"
              style={{
                background: "#0c0f18",
                border: "1px solid #1e2330",
                color: "#8892a4",
              }}
            >
              <ArrowLeft size={14} /> Command Center
            </button>
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase tracking-wide"
                style={{
                  background: "#4ade8014",
                  border: "1px solid #4ade8030",
                  color: "#4ade80",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block"
                  style={{
                    background: "#4ade80",
                    boxShadow: "0 0 6px #4ade80",
                  }}
                />
                LIVE
              </div>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={fetchAdminProfile}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 font-mono text-[12px] font-bold tracking-wide cursor-pointer"
                style={{
                  background: "#0c0f18",
                  border: "1px solid #e85d3a40",
                  color: "#e85d3a",
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

          {/* Header */}
          <motion.div {...fadeUp(0.05)} className="mb-11">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg mb-5"
              style={{ background: "#e85d3a14", border: "1px solid #e85d3a30" }}
            >
              <Shield size={13} color="#e85d3a" />
              <span
                className="font-mono text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "#e85d3a" }}
              >
                {adminData.role} · Access Level
              </span>
            </div>
            <h1
              className="font-display font-extrabold leading-tight mb-3.5"
              style={{
                fontSize: "clamp(28px,5vw,48px)",
                color: "#f0f4ff",
                letterSpacing: "-0.02em",
              }}
            >
              Welcome back,{" "}
              <span
                style={{
                  background: "linear-gradient(135deg,#e85d3a,#f0944d)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {firstName}
              </span>
            </h1>
            <p
              className="font-mono text-sm leading-relaxed max-w-[560px]"
              style={{ color: "#6b7a99" }}
            >
              Centralized overview of your administrative metrics, active
              projects, and network activity.
            </p>
            <div
              className="inline-flex items-center gap-2 mt-4 px-3.5 py-1.5 rounded-lg font-mono text-[11px]"
              style={{
                background: "#0c0f18",
                border: "1px solid #1e2330",
                color: "#6b7a99",
              }}
            >
              <Clock size={11} color="#6b7a99" /> Member since {joinDate}
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            variants={stagger}
            initial="initial"
            animate="animate"
            className="grid gap-4 mb-9"
            style={{
              gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
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

          {/* Analytics Bar */}
          <motion.div {...fadeUp(0.2)} className="mb-9">
            <div
              className="rounded-2xl flex overflow-hidden"
              style={{
                background: "#0c0f18",
                border: "1px solid #1e2330",
                padding: "20px 24px",
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
                  className="flex-1 flex items-center gap-3.5 px-6"
                  style={{
                    borderRight:
                      i < arr.length - 1 ? "1px solid #1e2330" : "none",
                  }}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: `${item.color}14`,
                      border: `1px solid ${item.color}25`,
                    }}
                  >
                    <item.icon size={16} color={item.color} />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span
                        className="font-display text-[22px] font-extrabold"
                        style={{ color: item.color }}
                      >
                        {item.value}
                      </span>
                      <span
                        className="font-mono text-[11px]"
                        style={{ color: "#6b7a99" }}
                      >
                        {item.suffix}
                      </span>
                    </div>
                    <p
                      className="font-mono text-[10px] uppercase tracking-widest mt-0.5"
                      style={{ color: "#6b7a99" }}
                    >
                      {item.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Identity Matrix */}
          <motion.div {...fadeUp(0.25)}>
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-1 h-7 rounded-sm"
                style={{ background: "#e85d3a" }}
              />
              <h2
                className="font-display text-lg font-extrabold"
                style={{ color: "#f0f4ff" }}
              >
                Identity Matrix
              </h2>
              <div className="flex-1 h-px" style={{ background: "#1e2330" }} />
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px]"
                style={{
                  background: "#0c0f18",
                  border: "1px solid #1e2330",
                  color: "#6b7a99",
                }}
              >
                <Shield size={11} color="#4ade80" /> Verified Node
              </div>
            </div>
            <motion.div
              variants={stagger}
              initial="initial"
              animate="animate"
              className="grid gap-3"
              style={{
                gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
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

          {/* Managed Projects Preview */}
          {adminData.managedProjects?.length > 0 && (
            <motion.div {...fadeUp(0.3)} className="mt-9">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-7 rounded-sm bg-[#3a9de8]" />
                <h2
                  className="font-display text-lg font-extrabold"
                  style={{ color: "#f0f4ff" }}
                >
                  Assigned Projects
                </h2>
                <div
                  className="flex-1 h-px"
                  style={{ background: "#1e2330" }}
                />
                <button
                  onClick={() => navigate("/manage-projects")}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-mono text-[11px] font-bold uppercase tracking-wide cursor-pointer"
                  style={{
                    background: "#3a9de814",
                    border: "1px solid #3a9de830",
                    color: "#3a9de8",
                  }}
                >
                  View All <ExternalLink size={11} />
                </button>
              </div>
              <div
                className="flex items-center justify-between gap-4 rounded-2xl p-5 pl-6"
                style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "#3a9de814",
                      border: "1px solid #3a9de830",
                    }}
                  >
                    <FolderKanban size={22} color="#3a9de8" />
                  </div>
                  <div>
                    <p
                      className="font-display text-base font-bold"
                      style={{ color: "#f0f4ff" }}
                    >
                      {adminData.managedProjects.length} Project
                      {adminData.managedProjects.length !== 1 ? "s" : ""}{" "}
                      Assigned
                    </p>
                    <p
                      className="font-mono text-[12px] mt-0.5"
                      style={{ color: "#6b7a99" }}
                    >
                      Assigned by Super Admin · Manage tasks, logs &
                      contributors
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/manage-projects")}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-display font-bold text-[12px] tracking-wide cursor-pointer flex-shrink-0"
                  style={{
                    background: "#e85d3a",
                    color: "#fff",
                    border: "none",
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
