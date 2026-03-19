import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const Navbar = ({ onLogout }) => (
  <nav
    className="sticky top-0 z-[100] flex items-center justify-between px-10 h-16 font-mono"
    style={{
      background: "#0c0f18cc",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #1e2330",
    }}
  >
    <div className="flex items-center gap-2.5">
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-extrabold text-base text-white"
        style={{ background: "#e85d3a", boxShadow: "0 0 16px #e85d3a40" }}
      >
        I
      </div>
      <div>
        <div
          className="font-display text-[17px] font-extrabold leading-none"
          style={{ color: "#f0f4ff", letterSpacing: "-0.02em" }}
        >
          InterConnect
        </div>
        <div
          className="font-mono text-[9px] uppercase tracking-widest mt-0.5"
          style={{ color: "#8892a4" }}
        >
          Admin Portal
        </div>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <div
        className="flex items-center gap-1.5 px-3 py-1 rounded-lg"
        style={{ background: "#4ade8014", border: "1px solid #4ade8030" }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full inline-block"
          style={{ background: "#4ade80", boxShadow: "0 0 6px #4ade80" }}
        />
        <span
          className="font-mono text-[11px] font-bold uppercase tracking-widest"
          style={{ color: "#4ade80" }}
        >
          System Live
        </span>
      </div>
      <button
        onClick={onLogout}
        className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-[12px] font-bold cursor-pointer transition-all duration-200"
        style={{
          background: "#3a1a1a",
          border: "1px solid #f8717140",
          color: "#f87171",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#4a1a1a")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#3a1a1a")}
      >
        ⊗ Logout
      </button>
    </div>
  </nav>
);

const ActionBtn = ({
  icon,
  label,
  sublabel,
  onClick,
  accent = "#e85d3a",
  secondary = false,
}) => (
  <motion.button
    whileHover={{ y: -3, transition: { duration: 0.18 } }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className="flex items-center gap-3.5 rounded-xl cursor-pointer transition-all duration-200 min-w-[220px] text-left"
    style={{
      padding: "16px 24px",
      background: secondary ? "#0c0f18" : `${accent}18`,
      border: `1px solid ${secondary ? "#1e2330" : `${accent}40`}`,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = `${accent}70`;
      e.currentTarget.style.boxShadow = `0 8px 24px ${accent}20`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = secondary ? "#1e2330" : `${accent}40`;
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <div
      className="w-[42px] h-[42px] rounded-xl flex-shrink-0 flex items-center justify-center text-lg"
      style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
    >
      {icon}
    </div>
    <div>
      <div
        className="font-display text-sm font-bold"
        style={{ color: "#f0f4ff" }}
      >
        {label}
      </div>
      <div
        className="font-mono text-[11px] mt-0.5"
        style={{ color: "#8892a4" }}
      >
        {sublabel}
      </div>
    </div>
  </motion.button>
);

const FeatureCard = ({ icon, title, body, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.45 }}
    className="relative rounded-2xl overflow-hidden"
    style={{
      background: "#0c0f18",
      border: "1px solid #1e2330",
      padding: "22px 24px",
    }}
  >
    <div
      className="absolute -top-8 -right-8 w-[90px] h-[90px] rounded-full pointer-events-none"
      style={{ background: `${accent}0a`, filter: "blur(20px)" }}
    />
    <div
      className="w-[42px] h-[42px] rounded-xl flex items-center justify-center text-lg mb-4"
      style={{ background: `${accent}14`, border: `1px solid ${accent}25` }}
    >
      {icon}
    </div>
    <div
      className="font-display text-sm font-bold mb-2"
      style={{ color: "#f0f4ff" }}
    >
      {title}
    </div>
    <div
      className="font-mono text-[12px] leading-relaxed"
      style={{ color: "#6b7a99" }}
    >
      {body}
    </div>
  </motion.div>
);

const StatPill = ({ value, label, color }) => (
  <div className="text-center">
    <div
      className="font-display font-extrabold leading-none"
      style={{ fontSize: 28, color }}
    >
      {value}
    </div>
    <div
      className="font-mono text-[10px] uppercase tracking-widest mt-1"
      style={{ color: "#6b7a99" }}
    >
      {label}
    </div>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAppContext();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Syne', sans-serif !important; }
        .font-mono    { font-family: 'DM Mono', monospace !important; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080c14; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track  { background: #0c0f18; }
        ::-webkit-scrollbar-thumb  { background: #1e2330; border-radius: 3px; }
      `}</style>

      <div
        className="min-h-screen font-mono"
        style={{ background: "#080c14", color: "#f0f4ff" }}
      >
        {/* Ambient glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div
            className="absolute"
            style={{
              top: -200,
              left: "20%",
              width: 700,
              height: 700,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,#e85d3a06 0%,transparent 70%)",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: -300,
              right: "5%",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle,#3a9de808 0%,transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(#ffffff11 1px,transparent 1px),linear-gradient(90deg,#ffffff11 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10">
          <Navbar onLogout={logout} />

          {/* Hero */}
          <section className="max-w-4xl mx-auto px-10 py-20 pb-16 text-center">
            <motion.div
              {...fadeUp(0)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-7"
              style={{ background: "#e85d3a14", border: "1px solid #e85d3a30" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ background: "#e85d3a" }}
              />
              <span
                className="font-mono text-[11px] font-bold uppercase tracking-widest"
                style={{ color: "#e85d3a" }}
              >
                System v2.0 · Operational
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.06)}
              className="font-display font-extrabold leading-tight mb-5"
              style={{
                fontSize: "clamp(32px,5.5vw,58px)",
                letterSpacing: "-0.025em",
                color: "#f0f4ff",
              }}
            >
              Orchestrate the Future of
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg,#e85d3a 0%,#f0944d 50%,#fbbf24 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                InterConnect 26.0
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.12)}
              className="font-mono text-[15px] leading-loose max-w-[580px] mx-auto mb-10"
              style={{ color: "#6b7a99" }}
            >
              Empower collaboration across domains. Use the{" "}
              <span style={{ color: "#4ade80", fontWeight: 600 }}>
                central command center
              </span>{" "}
              to oversee student innovations and monitor platform activity.
            </motion.p>

            <motion.div
              {...fadeUp(0.18)}
              className="flex flex-wrap justify-center gap-3.5 mb-14"
            >
              <ActionBtn
                icon="◈"
                label="Enter Dashboard"
                sublabel="Profile & metrics"
                onClick={() => navigate("/dashboard")}
                accent="#e85d3a"
              />
              <ActionBtn
                icon="⊞"
                label="Manage Projects"
                sublabel="Tasks, logs & teams"
                onClick={() => navigate("/my-projects")}
                accent="#3a9de8"
                secondary
              />
              <ActionBtn
                icon="⬡"
                label="Super Admin Panel"
                sublabel="Elevated privileges"
                onClick={() => navigate("/super-admin")}
                accent="#9c3ae8"
                secondary
              />
            </motion.div>

            <motion.div
              {...fadeUp(0.24)}
              className="inline-flex items-center rounded-2xl overflow-hidden"
              style={{
                background: "#0c0f18",
                border: "1px solid #1e2330",
                padding: "20px 32px",
                gap: 0,
              }}
            >
              {[
                { value: "26.0", label: "Edition", color: "#e85d3a" },
                { value: "6+", label: "Disciplines", color: "#3a9de8" },
                { value: "200+", label: "Students", color: "#4ade80" },
                { value: "40+", label: "Problem Stmts", color: "#fbbf24" },
                { value: "GMIT", label: "Institution", color: "#9c3ae8" },
              ].map((s, i, arr) => (
                <React.Fragment key={s.label}>
                  <div className="px-7">
                    <StatPill {...s} />
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      className="w-px h-10"
                      style={{ background: "#1e2330" }}
                    />
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </section>

          {/* About */}
          <section className="max-w-4xl mx-auto px-10 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden p-9"
              style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
            >
              <div
                className="absolute -top-14 -right-14 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: "#e85d3a05", filter: "blur(40px)" }}
              />
              <div
                className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full pointer-events-none"
                style={{ background: "#3a9de806", filter: "blur(40px)" }}
              />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-1 h-6 rounded-sm"
                    style={{ background: "#e85d3a" }}
                  />
                  <h2
                    className="font-display text-xl font-extrabold"
                    style={{ color: "#f0f4ff" }}
                  >
                    About the Event Administration
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p
                      className="font-mono text-[13px] leading-loose mb-5"
                      style={{ color: "#8892a4" }}
                    >
                      Welcome to the official administration panel for{" "}
                      <span style={{ color: "#e85d3a", fontWeight: 600 }}>
                        InterConnect 26.0
                      </span>{" "}
                      — an Interdisciplinary Innovation Challenge by{" "}
                      <span style={{ color: "#f0f4ff", fontWeight: 600 }}>
                        The Falcon Forum
                      </span>{" "}
                      and{" "}
                      <span style={{ color: "#f0f4ff", fontWeight: 600 }}>
                        Team-Falcon (CSE)
                      </span>{" "}
                      at GM Institute of Technology, Davanagere.
                    </p>
                    <div
                      className="rounded-r-lg"
                      style={{
                        background: "#131825",
                        borderLeft: "3px solid #e85d3a",
                        padding: "14px 18px",
                      }}
                    >
                      <div
                        className="font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5"
                        style={{ color: "#e85d3a" }}
                      >
                        Core Mission
                      </div>
                      <p
                        className="font-mono text-[12px] italic"
                        style={{ color: "#8892a4" }}
                      >
                        "Connecting Minds · Sharing Knowledge · Solving Real
                        Problems"
                      </p>
                    </div>
                  </div>
                  <div>
                    <p
                      className="font-mono text-[13px] leading-loose mb-4"
                      style={{ color: "#8892a4" }}
                    >
                      As an administrator, you bridge the gap between students
                      from diverse backgrounds — Engineering, Law, Pharmacy,
                      MBA, BCA, B.Com, BBA, MCA, M.Tech, and Science.
                    </p>
                    <p
                      className="font-mono text-[13px] leading-loose"
                      style={{ color: "#8892a4" }}
                    >
                      Oversee real-world challenge submissions, coordinate
                      interdisciplinary teams, and help every problem statement
                      become the starting point of the next innovation.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Feature Grid */}
          <section className="max-w-4xl mx-auto px-10 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-1 h-6 rounded-sm bg-[#3a9de8]" />
              <h2
                className="font-display text-xl font-extrabold"
                style={{ color: "#f0f4ff" }}
              >
                Admin Capabilities
              </h2>
              <div className="flex-1 h-px" style={{ background: "#1e2330" }} />
            </motion.div>
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
              }}
            >
              {[
                {
                  icon: "◈",
                  title: "Dashboard Analytics",
                  body: "Track task counts, distributed points, project health scores and account status in real time.",
                  accent: "#e85d3a",
                  delay: 0.05,
                },
                {
                  icon: "⊞",
                  title: "Project Management",
                  body: "Edit project descriptions, update problem data, manage GitHub repos and control progress rates.",
                  accent: "#3a9de8",
                  delay: 0.1,
                },
                {
                  icon: "◎",
                  title: "Task Log System",
                  body: "Open granular task logs, link GitHub issues, and close with earned point awards.",
                  accent: "#4ade80",
                  delay: 0.15,
                },
                {
                  icon: "⬡",
                  title: "Contributor Tracking",
                  body: "View student profiles, per-project scores, role assignments and individual task histories.",
                  accent: "#fbbf24",
                  delay: 0.2,
                },
                {
                  icon: "↯",
                  title: "Workflow Insights",
                  body: "Visualize contributor lanes and chronological task timelines for end-to-end roadmaps.",
                  accent: "#9c3ae8",
                  delay: 0.25,
                },
                {
                  icon: "⊗",
                  title: "Super Admin Access",
                  body: "Elevated control panel for platform-wide configurations, admin management, and audit logs.",
                  accent: "#f87171",
                  delay: 0.3,
                },
              ].map((f) => (
                <FeatureCard key={f.title} {...f} />
              ))}
            </div>
          </section>

          {/* Footer */}
          <footer
            className="p-10 text-center"
            style={{ borderTop: "1px solid #1e2330", background: "#0c0f18" }}
          >
            <div className="max-w-4xl mx-auto">
              <h3
                className="font-display text-xl font-extrabold mb-5"
                style={{ color: "#f0f4ff" }}
              >
                Ready to manage the network?
              </h3>
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {[
                  {
                    label: "Dashboard",
                    onClick: () => navigate("/dashboard"),
                    accent: "#e85d3a",
                  },
                  {
                    label: "Manage Projects",
                    onClick: () => navigate("/my-projects"),
                    accent: "#3a9de8",
                  },
                  {
                    label: "Super Admin",
                    onClick: () => navigate("/super-admin"),
                    accent: "#9c3ae8",
                  },
                ].map((b) => (
                  <motion.button
                    key={b.label}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={b.onClick}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-mono text-[12px] font-bold uppercase tracking-wide cursor-pointer"
                    style={{
                      background: `${b.accent}14`,
                      border: `1px solid ${b.accent}30`,
                      color: b.accent,
                    }}
                  >
                    {b.label} →
                  </motion.button>
                ))}
              </div>
              <div
                className="w-full h-px mb-6"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,#1e2840,transparent)",
                }}
              />
              <div className="flex items-center justify-center gap-2.5 mb-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-display font-extrabold text-xs text-white"
                  style={{ background: "#e85d3a" }}
                >
                  I
                </div>
                <span
                  className="font-display text-sm font-bold"
                  style={{ color: "#f0f4ff" }}
                >
                  InteConnect Admin
                </span>
              </div>
              <p className="font-mono text-[11px]" style={{ color: "#4a5568" }}>
                © {new Date().getFullYear()} GMIT · Team-Falcon. All rights
                reserved.
              </p>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default Home;
