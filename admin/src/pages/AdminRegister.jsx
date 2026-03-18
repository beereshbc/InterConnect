import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const PROGRAMS = [
  "B.Tech",
  "M.Tech",
  "BCA",
  "MCA",
  "Staff Development",
  "Professor",
  "HOD",
  "Other",
];

// ─── Tiny atoms ───────────────────────────────────────────────────────────────
const Label = ({ children, required }) => (
  <label
    style={{
      display: "block",
      fontSize: 10,
      fontWeight: 700,
      color: "#6b7a99",
      marginBottom: 6,
      fontFamily: "'DM Mono', monospace",
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    }}
  >
    {children} {required && <span style={{ color: "#e85d3a" }}>*</span>}
  </label>
);

const inputStyle = (focused) => ({
  width: "100%",
  background: "#080c14",
  border: `1px solid ${focused ? "#e85d3a60" : "#1e2330"}`,
  borderRadius: 10,
  padding: "11px 14px 11px 40px",
  color: "#f0f4ff",
  fontFamily: "'DM Mono', monospace",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
  boxShadow: focused ? "0 0 0 3px #e85d3a10" : "none",
});

const IconWrap = ({ children }) => (
  <div
    style={{
      position: "absolute",
      left: 12,
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: 14,
      color: "#4a5568",
      pointerEvents: "none",
    }}
  >
    {children}
  </div>
);

const FormField = ({ icon, label, required, children }) => (
  <div>
    {label && <Label required={required}>{label}</Label>}
    <div style={{ position: "relative" }}>
      <IconWrap>{icon}</IconWrap>
      {children}
    </div>
  </div>
);

const FocusInput = ({
  icon,
  label,
  required,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  autoComplete,
  maxLength,
  style: extraStyle,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <FormField icon={icon} label={label} required={required}>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{ ...inputStyle(focused), ...extraStyle }}
      />
    </FormField>
  );
};

const Btn = ({
  children,
  loading,
  type = "button",
  onClick,
  variant = "primary",
}) => {
  const map = {
    primary: {
      bg: "#e85d3a",
      color: "#fff",
      border: "none",
      shadow: "0 4px 20px #e85d3a30",
    },
    ghost: {
      bg: "#0c0f18",
      color: "#e85d3a",
      border: "1px solid #e85d3a30",
      shadow: "none",
    },
  };
  const s = map[variant];
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      type={type}
      onClick={onClick}
      disabled={loading}
      style={{
        width: "100%",
        background: s.bg,
        color: s.color,
        border: s.border,
        borderRadius: 12,
        padding: "13px 20px",
        fontSize: 13,
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        fontFamily: "'Syne', sans-serif",
        letterSpacing: "0.04em",
        opacity: loading ? 0.65 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        boxShadow: s.shadow,
        transition: "all 0.2s",
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
      ) : (
        children
      )}
    </motion.button>
  );
};

const TabSwitch = ({ isLogin, onChange }) => (
  <div
    style={{
      display: "flex",
      background: "#080c14",
      border: "1px solid #1e2330",
      borderRadius: 12,
      padding: 4,
      marginBottom: 32,
    }}
  >
    {[
      { key: false, label: "Register" },
      { key: true, label: "Login" },
    ].map((t) => (
      <button
        key={String(t.key)}
        type="button"
        onClick={() => onChange(t.key)}
        style={{
          flex: 1,
          padding: "10px",
          borderRadius: 9,
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          fontFamily: "'Syne', sans-serif",
          letterSpacing: "0.06em",
          transition: "all 0.2s",
          background: isLogin === t.key ? "#e85d3a" : "transparent",
          color: isLogin === t.key ? "#fff" : "#6b7a99",
          border: "none",
          boxShadow: isLogin === t.key ? "0 2px 12px #e85d3a30" : "none",
        }}
      >
        {t.label}
      </button>
    ))}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
const AdminRegister = () => {
  const navigate = useNavigate();
  const { axios, setAdminToken } = useAppContext();

  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    program: "",
    githubLink: "",
    password: "",
  });
  const [forgotForm, setForgotForm] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const handle = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleForgot = (e) =>
    setForgotForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  // ── Submit (login / register) ────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const { data } = await axios.post("/api/admin/login", {
          email: form.email,
          password: form.password,
        });
        if (data.success) {
          setAdminToken(data.token);
          toast.success("Admin Authorization Granted!");
          navigate("/");
        }
      } else {
        const { data } = await axios.post("/api/admin/register", form);
        if (data.success) {
          setAdminToken(data.token);
          toast.success("Admin profile initialized!");
          navigate("/");
        }
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Connection failed. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotForm.email) return toast.error("Enter your admin email.");
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/admin/forgot-password/send-otp", {
        email: forgotForm.email,
      });
      if (data.success) {
        toast.success(data.message);
        setOtpSent(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotForm.otp || !forgotForm.newPassword)
      return toast.error("Fill all fields.");
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "/api/admin/forgot-password/reset",
        forgotForm,
      );
      if (data.success) {
        toast.success(data.message);
        setIsForgot(false);
        setOtpSent(false);
        setIsLogin(true);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Reset failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const [passF, setPassF] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 2px; }
        select option { background: #0c0f18; color: #f0f4ff; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#080c14",
          display: "flex",
          alignItems: "stretch",
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {/* ── Left panel (branding) ── */}
        <div
          style={{
            flex: 1,
            display: "none",
            position: "relative",
            overflow: "hidden",
            borderRight: "1px solid #1e2330",
            padding: "60px 52px",
            flexDirection: "column",
            justifyContent: "space-between",
            background: "#0c0f18",
          }}
          className="left-panel"
        >
          <style>{`@media(min-width:1024px){.left-panel{display:flex !important;}}`}</style>

          {/* BG effects */}
          <div
            style={{
              position: "absolute",
              top: -100,
              left: -100,
              width: 400,
              height: 400,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #e85d3a06 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -100,
              right: -60,
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, #3a9de808 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          {/* Decorative grid lines */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.03,
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "40px 40px",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative", zIndex: 1 }}>
            {/* Logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 52,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#e85d3a",
                  borderRadius: 11,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 18,
                  color: "#fff",
                  boxShadow: "0 0 20px #e85d3a40",
                }}
              >
                I
              </div>
              <div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 18,
                    fontWeight: 800,
                    color: "#f0f4ff",
                    letterSpacing: "-0.02em",
                  }}
                >
                  InteConnect
                </div>
                <div
                  style={{
                    fontSize: 9,
                    color: "#6b7a99",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  Admin Portal
                </div>
              </div>
            </div>

            <h2
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 36,
                fontWeight: 800,
                color: "#f0f4ff",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                marginBottom: 20,
              }}
            >
              {isForgot
                ? "Reset\nProtocol."
                : isLogin
                  ? "Authorize\nAccess."
                  : "Initialize\nCoordinator."}
            </h2>

            <p
              style={{
                fontSize: 13,
                color: "#6b7a99",
                lineHeight: 1.85,
                maxWidth: 320,
                marginBottom: 44,
              }}
            >
              {isLogin
                ? "Access the control panel, manage problem statements, and oversee student progress across InteConnect."
                : "Create an admin node to issue challenges, assign tasks, and coordinate network activities in real-time."}
            </p>

            {/* Feature list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  icon: "◈",
                  label: "Full administrative control over project pipelines",
                  accent: "#e85d3a",
                },
                {
                  icon: "⊞",
                  label: "Issue and manage real-world problem statements",
                  accent: "#3a9de8",
                },
                {
                  icon: "⬡",
                  label: "Monitor student metrics and distributed points",
                  accent: "#fbbf24",
                },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 9,
                      background: `${f.accent}14`,
                      border: `1px solid ${f.accent}25`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      flexShrink: 0,
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
          </div>

          <div
            style={{
              fontSize: 11,
              color: "#4a5568",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            © {new Date().getFullYear()} GMIT · Team-Falcon
          </div>
        </div>

        {/* ── Right panel (form) ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            overflowY: "auto",
          }}
        >
          <div style={{ width: "100%", maxWidth: 480 }}>
            {/* Mobile logo */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 36,
                justifyContent: "center",
              }}
              className="mobile-logo"
            >
              <style>{`@media(min-width:1024px){.mobile-logo{display:none !important;}}`}</style>
              <div
                style={{
                  width: 36,
                  height: 36,
                  background: "#e85d3a",
                  borderRadius: 9,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 800,
                  fontSize: 15,
                  color: "#fff",
                }}
              >
                I
              </div>
              <span
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 16,
                  fontWeight: 800,
                  color: "#f0f4ff",
                }}
              >
                InteConnect
              </span>
            </div>

            <AnimatePresence mode="wait">
              {/* ── Forgot Password ── */}
              {isForgot ? (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.28 }}
                >
                  <button
                    onClick={() => {
                      setIsForgot(false);
                      setOtpSent(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      color: "#6b7a99",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "'DM Mono', monospace",
                      marginBottom: 28,
                    }}
                  >
                    ← Back
                  </button>

                  <h2
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#f0f4ff",
                      marginBottom: 8,
                    }}
                  >
                    Reset Protocol
                  </h2>
                  <p
                    style={{ fontSize: 12, color: "#6b7a99", marginBottom: 32 }}
                  >
                    {otpSent
                      ? "Enter the OTP sent to your admin email and set a new password."
                      : "Enter your admin email to receive an override OTP."}
                  </p>

                  {!otpSent ? (
                    <form
                      onSubmit={handleSendOtp}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 18,
                      }}
                    >
                      <FocusInput
                        icon="✉"
                        label="Admin Email"
                        name="email"
                        type="email"
                        value={forgotForm.email}
                        onChange={handleForgot}
                        placeholder="admin@inteconnect.io"
                        required
                      />
                      <Btn type="submit" loading={isLoading}>
                        Send Override OTP →
                      </Btn>
                    </form>
                  ) : (
                    <form
                      onSubmit={handleResetPassword}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 18,
                      }}
                    >
                      <FocusInput
                        icon="⬡"
                        label="6-digit OTP"
                        name="otp"
                        type="text"
                        maxLength={6}
                        value={forgotForm.otp}
                        onChange={handleForgot}
                        placeholder="000000"
                        required
                      />
                      <FocusInput
                        icon="◉"
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={forgotForm.newPassword}
                        onChange={handleForgot}
                        placeholder="New authorization key"
                        required
                      />
                      <Btn type="submit" loading={isLoading}>
                        Confirm New Authorization →
                      </Btn>
                    </form>
                  )}
                </motion.div>
              ) : (
                /* ── Login / Register ── */
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.28 }}
                >
                  <TabSwitch isLogin={isLogin} onChange={setIsLogin} />

                  <h2
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 26,
                      fontWeight: 800,
                      color: "#f0f4ff",
                      marginBottom: 6,
                    }}
                  >
                    {isLogin ? "Admin Authorization" : "Coordinator Setup"}
                  </h2>
                  <p
                    style={{ fontSize: 12, color: "#6b7a99", marginBottom: 28 }}
                  >
                    {isLogin
                      ? "Enter your credentials to access the control panel."
                      : "Fill in the details to establish your admin account."}
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    {/* Register-only fields */}
                    <AnimatePresence>
                      {!isLogin && (
                        <motion.div
                          key="reg-fields"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          style={{
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            gap: 16,
                          }}
                        >
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 14,
                            }}
                          >
                            <FocusInput
                              icon="◉"
                              label="Full Name"
                              name="name"
                              value={form.name}
                              onChange={handle}
                              placeholder="Your name"
                              required
                            />
                            <FocusInput
                              icon="◌"
                              label="Phone"
                              name="phone"
                              type="tel"
                              value={form.phone}
                              onChange={handle}
                              placeholder="+91 XXXXX XXXXX"
                              required
                            />
                          </div>
                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns: "1fr 1fr",
                              gap: 14,
                            }}
                          >
                            <FocusInput
                              icon="◈"
                              label="Organization"
                              name="college"
                              value={form.college}
                              onChange={handle}
                              placeholder="GMIT / College"
                              required
                            />
                            <FocusInput
                              icon="⊞"
                              label="Department"
                              name="branch"
                              value={form.branch}
                              onChange={handle}
                              placeholder="CSE / ISE / ECE"
                              required
                            />
                          </div>

                          {/* Program select */}
                          <div>
                            <Label required>Program / Role</Label>
                            <div style={{ position: "relative" }}>
                              <IconWrap>◎</IconWrap>
                              <select
                                name="program"
                                value={form.program}
                                onChange={handle}
                                required
                                style={{
                                  width: "100%",
                                  background: "#080c14",
                                  border: "1px solid #1e2330",
                                  borderRadius: 10,
                                  padding: "11px 14px 11px 40px",
                                  color: form.program ? "#f0f4ff" : "#4a5568",
                                  fontFamily: "'DM Mono', monospace",
                                  fontSize: 13,
                                  outline: "none",
                                  appearance: "none",
                                  boxSizing: "border-box",
                                }}
                              >
                                <option value="" disabled>
                                  Select Program / Role
                                </option>
                                {PROGRAMS.map((p) => (
                                  <option key={p} value={p}>
                                    {p}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>

                          <FocusInput
                            icon="⌥"
                            label="GitHub / Portfolio URL"
                            name="githubLink"
                            type="url"
                            value={form.githubLink}
                            onChange={handle}
                            placeholder="https://github.com/..."
                            required
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Always-visible */}
                    <FocusInput
                      icon="✉"
                      label="Admin Email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handle}
                      placeholder="admin@inteconnect.io"
                      autoComplete="email"
                      required
                    />

                    {/* Password with toggle */}
                    <div>
                      <Label required>Password</Label>
                      <div style={{ position: "relative" }}>
                        <IconWrap>◉</IconWrap>
                        <input
                          type={showPass ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handle}
                          placeholder="Security key"
                          onFocus={() => setPassF(true)}
                          onBlur={() => setPassF(false)}
                          style={{ ...inputStyle(passF), paddingRight: 44 }}
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
                            padding: 4,
                          }}
                        >
                          {showPass ? "⊘" : "◉"}
                        </button>
                      </div>
                    </div>

                    {/* Forgot password link */}
                    {isLogin && (
                      <div
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <button
                          type="button"
                          onClick={() => setIsForgot(true)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 12,
                            color: "#e85d3a",
                            fontFamily: "'DM Mono', monospace",
                          }}
                        >
                          Override Sequence?
                        </button>
                      </div>
                    )}

                    <div style={{ marginTop: 4 }}>
                      <Btn type="submit" loading={isLoading}>
                        {isLogin
                          ? "Authenticate Node →"
                          : "Initialize Coordinator →"}
                      </Btn>
                    </div>
                  </form>

                  {/* Toggle mode link */}
                  <p
                    style={{
                      textAlign: "center",
                      fontSize: 12,
                      color: "#6b7a99",
                      marginTop: 24,
                      fontFamily: "'DM Mono', monospace",
                    }}
                  >
                    {isLogin ? "Need an account? " : "Already registered? "}
                    <button
                      onClick={() => setIsLogin((v) => !v)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#e85d3a",
                        fontWeight: 700,
                        fontSize: 12,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {isLogin ? "Initialize Node" : "Login here"}
                    </button>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminRegister;
