import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Nav ──────────────────────────────────────────────────────────────────────
const Navbar = ({ onLogout }) => (
  <nav
    style={{
      position: "sticky",
      top: 0,
      zIndex: 100,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 40px",
      height: 64,
      background: "#0c0f18cc",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #1e2330",
    }}
  >
    {/* Logo */}
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          background: "#e85d3a",
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 16,
          color: "#fff",
          boxShadow: "0 0 16px #e85d3a40",
        }}
      >
        I
      </div>
      <div>
        <div
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 17,
            fontWeight: 800,
            color: "#f0f4ff",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          InterConnect
        </div>
        <div
          style={{
            fontSize: 9,
            color: "#8892a4",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            lineHeight: 1,
            marginTop: 2,
          }}
        >
          Admin Portal
        </div>
      </div>
    </div>

    {/* Right */}
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "5px 12px",
          background: "#4ade8014",
          border: "1px solid #4ade8030",
          borderRadius: 8,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 6px #4ade80",
            display: "inline-block",
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#4ade80",
            fontFamily: "'DM Mono', monospace",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          System Live
        </span>
      </div>

      <button
        onClick={onLogout}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 7,
          padding: "8px 16px",
          borderRadius: 8,
          background: "#3a1a1a",
          border: "1px solid #f8717140",
          color: "#f87171",
          fontSize: 12,
          fontWeight: 700,
          fontFamily: "'DM Mono', monospace",
          cursor: "pointer",
          letterSpacing: "0.04em",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#4a1a1a")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#3a1a1a")}
      >
        ⊗ Logout
      </button>
    </div>
  </nav>
);

// ─── Action Button ─────────────────────────────────────────────────────────────
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
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 24px",
      borderRadius: 12,
      cursor: "pointer",
      background: secondary ? "#0c0f18" : `${accent}18`,
      border: `1px solid ${secondary ? "#1e2330" : `${accent}40`}`,
      transition: "border-color 0.2s, box-shadow 0.2s",
      minWidth: 220,
      textAlign: "left",
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
      style={{
        width: 42,
        height: 42,
        borderRadius: 10,
        flexShrink: 0,
        background: `${accent}18`,
        border: `1px solid ${accent}30`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
      }}
    >
      {icon}
    </div>
    <div>
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: "#f0f4ff",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: "#8892a4",
          marginTop: 2,
        }}
      >
        {sublabel}
      </div>
    </div>
  </motion.button>
);

// ─── Feature Card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, body, accent, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    style={{
      background: "#0c0f18",
      border: "1px solid #1e2330",
      borderRadius: 14,
      padding: "22px 24px",
      position: "relative",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        position: "absolute",
        top: -30,
        right: -30,
        width: 90,
        height: 90,
        borderRadius: "50%",
        background: `${accent}0a`,
        filter: "blur(20px)",
      }}
    />
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 10,
        background: `${accent}14`,
        border: `1px solid ${accent}25`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 18,
        marginBottom: 16,
      }}
    >
      {icon}
    </div>
    <div
      style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 14,
        fontWeight: 700,
        color: "#f0f4ff",
        marginBottom: 8,
      }}
    >
      {title}
    </div>
    <div
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 12,
        color: "#6b7a99",
        lineHeight: 1.7,
      }}
    >
      {body}
    </div>
  </motion.div>
);

// ─── Stat ─────────────────────────────────────────────────────────────────────
const StatPill = ({ value, label, color }) => (
  <div style={{ textAlign: "center" }}>
    <div
      style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 28,
        fontWeight: 800,
        color,
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    <div
      style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: 10,
        color: "#6b7a99",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        marginTop: 4,
      }}
    >
      {label}
    </div>
  </div>
);

// ─── Home ─────────────────────────────────────────────────────────────────────
const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAppContext();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #080c14; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: #0c0f18; }
        ::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 3px; }
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
        @keyframes floatB { 0%,100%{transform:translateY(-10px)} 50%{transform:translateY(10px)} }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#080c14",
          color: "#f0f4ff",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {/* Ambient glows */}
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
              left: "20%",
              width: 700,
              height: 700,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #e85d3a06 0%, transparent 70%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -300,
              right: "5%",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #3a9de808 0%, transparent 70%)",
            }}
          />
          {/* Grid overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.04,
              backgroundImage:
                "linear-gradient(#ffffff11 1px,transparent 1px),linear-gradient(90deg,#ffffff11 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <Navbar onLogout={logout} />

          {/* ── Hero ── */}
          <section
            style={{
              maxWidth: 900,
              margin: "0 auto",
              padding: "80px 40px 60px",
              textAlign: "center",
            }}
          >
            {/* System badge */}
            <motion.div
              {...fadeUp(0)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 18px",
                background: "#e85d3a14",
                border: "1px solid #e85d3a30",
                borderRadius: 100,
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#e85d3a",
                  display: "inline-block",
                }}
              />
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
                System v2.0 · Operational
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...fadeUp(0.06)}
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(32px, 5.5vw, 58px)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                color: "#f0f4ff",
                marginBottom: 22,
              }}
            >
              Orchestrate the Future of
              <br />
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #e85d3a 0%, #f0944d 50%, #fbbf24 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                InterConnect 26.0
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              {...fadeUp(0.12)}
              style={{
                fontSize: 15,
                color: "#6b7a99",
                lineHeight: 1.8,
                maxWidth: 580,
                margin: "0 auto 40px",
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Empower collaboration across domains. Use the{" "}
              <span style={{ color: "#4ade80", fontWeight: 600 }}>
                central command center
              </span>{" "}
              to oversee student innovations, manage problem statements, and
              monitor platform activity in real-time.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              {...fadeUp(0.18)}
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 14,
                marginBottom: 56,
              }}
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

            {/* Stats strip */}
            <motion.div
              {...fadeUp(0.24)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 0,
                background: "#0c0f18",
                border: "1px solid #1e2330",
                borderRadius: 14,
                overflow: "hidden",
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
                  <div style={{ padding: "0 28px" }}>
                    <StatPill {...s} />
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      style={{ width: 1, height: 40, background: "#1e2330" }}
                    />
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          </section>

          {/* ── About ── */}
          <section
            style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px 60px" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{
                background: "#0c0f18",
                border: "1px solid #1e2330",
                borderRadius: 18,
                padding: "36px 40px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -60,
                  right: -60,
                  width: 200,
                  height: 200,
                  borderRadius: "50%",
                  background: "#e85d3a05",
                  filter: "blur(40px)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: -40,
                  left: -40,
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  background: "#3a9de806",
                  filter: "blur(40px)",
                }}
              />

              <div style={{ position: "relative", zIndex: 1 }}>
                {/* Section label */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 24,
                  }}
                >
                  <div
                    style={{
                      width: 4,
                      height: 24,
                      background: "#e85d3a",
                      borderRadius: 2,
                    }}
                  />
                  <h2
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#f0f4ff",
                    }}
                  >
                    About the Event Administration
                  </h2>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 24,
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#8892a4",
                        lineHeight: 1.85,
                        fontFamily: "'DM Mono', monospace",
                        marginBottom: 20,
                      }}
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
                      style={{
                        background: "#131825",
                        border: "1px solid #2a3045",
                        borderLeft: "3px solid #e85d3a",
                        borderRadius: "0 8px 8px 0",
                        padding: "14px 18px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          color: "#e85d3a",
                          fontFamily: "'DM Mono', monospace",
                          textTransform: "uppercase",
                          letterSpacing: "0.1em",
                          marginBottom: 6,
                        }}
                      >
                        Core Mission
                      </div>
                      <p
                        style={{
                          fontSize: 12,
                          color: "#8892a4",
                          fontFamily: "'DM Mono', monospace",
                          fontStyle: "italic",
                        }}
                      >
                        "Connecting Minds · Sharing Knowledge · Solving Real
                        Problems"
                      </p>
                    </div>
                  </div>

                  <div>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#8892a4",
                        lineHeight: 1.85,
                        fontFamily: "'DM Mono', monospace",
                        marginBottom: 16,
                      }}
                    >
                      As an administrator, you bridge the gap between students
                      from diverse backgrounds — Engineering, Law, Pharmacy,
                      MBA, BCA, B.Com, BBA, MCA, M.Tech, and Science.
                    </p>
                    <p
                      style={{
                        fontSize: 13,
                        color: "#8892a4",
                        lineHeight: 1.85,
                        fontFamily: "'DM Mono', monospace",
                      }}
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

          {/* ── Feature Grid ── */}
          <section
            style={{ maxWidth: 900, margin: "0 auto", padding: "0 40px 60px" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 24,
                  background: "#3a9de8",
                  borderRadius: 2,
                }}
              />
              <h2
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#f0f4ff",
                }}
              >
                Admin Capabilities
              </h2>
              <div style={{ flex: 1, height: 1, background: "#1e2330" }} />
            </motion.div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                gap: 16,
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
                  body: "Open granular task logs per contributor, link GitHub issues, and close with earned point awards.",
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
                  body: "Visualize contributor lanes and chronological task timelines for end-to-end project roadmaps.",
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

          {/* ── Footer ── */}
          <footer
            style={{
              borderTop: "1px solid #1e2330",
              background: "#0c0f18",
              padding: "40px",
              textAlign: "center",
            }}
          >
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <h3
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#f0f4ff",
                  marginBottom: 20,
                }}
              >
                Ready to manage the network?
              </h3>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: 12,
                  marginBottom: 32,
                }}
              >
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "10px 22px",
                      borderRadius: 10,
                      background: `${b.accent}14`,
                      border: `1px solid ${b.accent}30`,
                      color: b.accent,
                      fontSize: 12,
                      fontWeight: 700,
                      fontFamily: "'DM Mono', monospace",
                      cursor: "pointer",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {b.label} →
                  </motion.button>
                ))}
              </div>

              <div
                style={{
                  width: "100%",
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent, #1e2840, transparent)",
                  marginBottom: 24,
                }}
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    background: "#e85d3a",
                    borderRadius: 7,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: 800,
                    fontSize: 12,
                    color: "#fff",
                  }}
                >
                  I
                </div>
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#f0f4ff",
                  }}
                >
                  InteConnect Admin
                </span>
              </div>
              <p
                style={{
                  fontSize: 11,
                  color: "#4a5568",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
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
