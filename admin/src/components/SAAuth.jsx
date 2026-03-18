import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SAAuth = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [passF, setPassF] = useState(false);
  const [emailF, setEmailF] = useState(false);

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/admin/sa/login`,
        form,
      );
      if (data.success) {
        localStorage.setItem("saToken", data.token);
        localStorage.setItem("saAdmin", JSON.stringify(data.superAdmin));
        navigate("/super-admin");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const inputBase = (focused) => ({
    width: "100%",
    background: "#060810",
    border: `1px solid ${focused ? "#9c3ae860" : "#1e2330"}`,
    borderRadius: 10,
    padding: "12px 14px 12px 42px",
    color: "#f0f4ff",
    fontFamily: "'DM Mono', monospace",
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
    boxShadow: focused ? "0 0 0 3px #9c3ae810" : "none",
  });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.94)} }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes scanline { 0%{top:-8px} 100%{top:100%} }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#06080f",
          display: "flex",
          fontFamily: "'DM Mono', monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── Deep purple ambient ── */}
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              top: "-20%",
              left: "-10%",
              width: "60%",
              height: "60%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #9c3ae812 0%, transparent 65%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "-15%",
              right: "-5%",
              width: "50%",
              height: "50%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #3a9de808 0%, transparent 65%)",
            }}
          />
          {/* Grid */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.03,
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          {/* Scanline effect */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 2,
              background:
                "linear-gradient(transparent, #9c3ae820, transparent)",
              animation: "scanline 4s linear infinite",
              pointerEvents: "none",
            }}
          />
        </div>

        {/* ── Left brand panel ── */}
        <div
          style={{
            width: "45%",
            display: "none",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 52px",
            borderRight: "1px solid #1e2330",
            position: "relative",
          }}
          className="brand-panel"
        >
          <style>{`@media(min-width:1024px){.brand-panel{display:flex !important;}}`}</style>

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 56,
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 13,
                  background: "linear-gradient(135deg, #9c3ae8, #7c2abf)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#fff",
                  boxShadow: "0 0 24px #9c3ae840",
                }}
              >
                SA
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 17,
                    fontWeight: 800,
                    color: "#f0f4ff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Super Admin
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#6b7a99",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  InteConnect Control
                </div>
              </div>
            </div>

            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 40,
                fontWeight: 800,
                color: "#f0f4ff",
                lineHeight: 1.08,
                letterSpacing: "-0.025em",
                marginBottom: 20,
              }}
            >
              Elevated
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #9c3ae8, #b65aff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Access Level
              </span>
            </h2>

            <p
              style={{
                fontSize: 13,
                color: "#6b7a99",
                lineHeight: 1.85,
                maxWidth: 340,
                marginBottom: 48,
              }}
            >
              This portal is restricted to authorized Super Administrators only.
              All sessions are logged and monitored.
            </p>

            {/* Capability list */}
            {[
              {
                icon: "⬡",
                label: "Platform-wide statistics & audit",
                color: "#9c3ae8",
              },
              {
                icon: "◈",
                label: "Approve / reject problem statements",
                color: "#3a9de8",
              },
              {
                icon: "⊞",
                label: "Admin & student account management",
                color: "#fbbf24",
              },
              {
                icon: "◎",
                label: "Initiate projects & assign coordinators",
                color: "#4ade80",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 + 0.2 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: `${f.color}14`,
                    border: `1px solid ${f.color}25`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    flexShrink: 0,
                    color: f.color,
                  }}
                >
                  {f.icon}
                </div>
                <span style={{ fontSize: 12, color: "#8892a4" }}>
                  {f.label}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Floating SA badge */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            style={{
              alignSelf: "flex-start",
              background: "#9c3ae814",
              border: "1px solid #9c3ae830",
              borderRadius: 12,
              padding: "14px 20px",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontSize: 10,
                color: "#9c3ae8",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              Clearance Level
            </div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: "#f0f4ff",
              }}
            >
              ALPHA
            </div>
          </motion.div>

          <div style={{ fontSize: 11, color: "#4a5568" }}>
            © {new Date().getFullYear()} GMIT · Team-Falcon
          </div>
        </div>

        {/* ── Right: form ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
          }}
        >
          <div style={{ width: "100%", maxWidth: 420 }}>
            {/* Mobile logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                marginBottom: 36,
              }}
              className="mobile-logo"
            >
              <style>{`@media(min-width:1024px){.mobile-logo{display:none !important;}}`}</style>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: "linear-gradient(135deg, #9c3ae8, #7c2abf)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#fff",
                }}
              >
                SA
              </div>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#f0f4ff",
                }}
              >
                Super Admin
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Card */}
              <div
                style={{
                  background: "#0c0f18",
                  border: "1px solid #2a1a4a",
                  borderRadius: 18,
                  padding: "36px 36px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px #9c3ae810",
                }}
              >
                {/* Header */}
                <div style={{ marginBottom: 28 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "5px 12px",
                      background: "#9c3ae814",
                      border: "1px solid #9c3ae830",
                      borderRadius: 8,
                      marginBottom: 16,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 9,
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#9c3ae8",
                        display: "inline-block",
                        boxShadow: "0 0 6px #9c3ae8",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#9c3ae8",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      Restricted Access
                    </span>
                  </div>
                  <h2
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 24,
                      fontWeight: 800,
                      color: "#f0f4ff",
                      marginBottom: 6,
                    }}
                  >
                    Super Admin Login
                  </h2>
                  <p style={{ fontSize: 12, color: "#6b7a99" }}>
                    Enter your elevated credentials to proceed.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: "#3a1a1a",
                      border: "1px solid #f8717140",
                      borderRadius: 8,
                      padding: "10px 14px",
                      marginBottom: 20,
                      fontSize: 12,
                      color: "#f87171",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    ✕ {error}
                  </motion.div>
                )}

                <form
                  onSubmit={handleSubmit}
                  style={{ display: "flex", flexDirection: "column", gap: 16 }}
                >
                  {/* Email */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#6b7a99",
                        marginBottom: 6,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      SA Email <span style={{ color: "#9c3ae8" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: 13,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: 13,
                          color: "#4a5568",
                          pointerEvents: "none",
                        }}
                      >
                        ✉
                      </span>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handle}
                        placeholder="superadmin@inteconnect.io"
                        required
                        onFocus={() => setEmailF(true)}
                        onBlur={() => setEmailF(false)}
                        style={inputBase(emailF)}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      style={{
                        display: "block",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#6b7a99",
                        marginBottom: 6,
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      SA Password <span style={{ color: "#9c3ae8" }}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <span
                        style={{
                          position: "absolute",
                          left: 13,
                          top: "50%",
                          transform: "translateY(-50%)",
                          fontSize: 13,
                          color: "#4a5568",
                          pointerEvents: "none",
                        }}
                      >
                        ◉
                      </span>
                      <input
                        name="password"
                        type={showPass ? "text" : "password"}
                        value={form.password}
                        onChange={handle}
                        placeholder="•••••••••••"
                        required
                        onFocus={() => setPassF(true)}
                        onBlur={() => setPassF(false)}
                        style={{ ...inputBase(passF), paddingRight: 44 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        style={{
                          position: "absolute",
                          right: 12,
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#4a5568",
                          fontSize: 14,
                        }}
                      >
                        {showPass ? "⊘" : "◉"}
                      </button>
                    </div>
                  </div>

                  {/* Warning notice */}
                  <div
                    style={{
                      background: "#1a1428",
                      border: "1px solid #9c3ae830",
                      borderRadius: 8,
                      padding: "10px 14px",
                      fontSize: 11,
                      color: "#8892a4",
                    }}
                  >
                    ⚠ All Super Admin sessions are logged for security purposes.
                  </div>

                  {/* Submit */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    style={{
                      width: "100%",
                      background: loading
                        ? "#2a1a4a"
                        : "linear-gradient(135deg, #9c3ae8, #7c2abf)",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      padding: "13px 20px",
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: loading ? "not-allowed" : "pointer",
                      fontFamily: "'Syne', sans-serif",
                      letterSpacing: "0.04em",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                      boxShadow: loading ? "none" : "0 4px 20px #9c3ae830",
                      marginTop: 4,
                    }}
                  >
                    {loading ? (
                      <span
                        style={{
                          display: "inline-block",
                          animation: "spin 0.7s linear infinite",
                        }}
                      >
                        ◌
                      </span>
                    ) : null}
                    {loading ? "Authenticating…" : "Authenticate Super Admin →"}
                  </motion.button>
                </form>

                <div style={{ marginTop: 20, textAlign: "center" }}>
                  <button
                    onClick={() => navigate("/login")}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 12,
                      color: "#6b7a99",
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    ← Back to Admin Login
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SAAuth;
