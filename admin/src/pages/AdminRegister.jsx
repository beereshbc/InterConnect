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

const TabSwitch = ({ isLogin, onChange }) => (
  <div
    className="flex rounded-xl p-1 mb-8"
    style={{ background: "#080c14", border: "1px solid #1e2330" }}
  >
    {[
      { key: false, label: "Register" },
      { key: true, label: "Login" },
    ].map((t) => (
      <button
        key={String(t.key)}
        type="button"
        onClick={() => onChange(t.key)}
        className="flex-1 py-2.5 rounded-xl font-display text-[12px] font-bold tracking-wide cursor-pointer transition-all duration-200"
        style={{
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
  extraStyle,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      {label && (
        <label
          className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5"
          style={{ color: "#6b7a99" }}
        >
          {label} {required && <span style={{ color: "#e85d3a" }}>*</span>}
        </label>
      )}
      <div className="relative">
        <span
          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
          style={{ color: "#4a5568" }}
        >
          {icon}
        </span>
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
          className="w-full rounded-xl font-mono text-[13px] outline-none transition-all"
          style={{
            background: "#080c14",
            border: `1px solid ${focused ? "#e85d3a60" : "#1e2330"}`,
            padding: "11px 14px 11px 40px",
            color: "#f0f4ff",
            boxShadow: focused ? "0 0 0 3px #e85d3a10" : "none",
            boxSizing: "border-box",
            ...extraStyle,
          }}
        />
      </div>
    </div>
  );
};

const AdminRegister = () => {
  const navigate = useNavigate();
  const { axios, setAdminToken } = useAppContext();

  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [isForgot, setIsForgot] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [passF, setPassF] = useState(false);

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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Syne', sans-serif !important; }
        .font-mono    { font-family: 'DM Mono', monospace !important; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #1e2330; border-radius: 2px; }
        select option { background: #0c0f18; color: #f0f4ff; }
      `}</style>

      <div
        className="min-h-screen flex items-stretch font-mono"
        style={{ background: "#080c14" }}
      >
        {/* Left branding */}
        <div
          className="flex-1 hidden lg:flex flex-col justify-between relative overflow-hidden p-16"
          style={{ borderRight: "1px solid #1e2330", background: "#0c0f18" }}
        >
          <div
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,#e85d3a06 0%,transparent 70%)",
            }}
          />
          <div
            className="absolute -bottom-24 -right-16 w-72 h-72 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle,#3a9de808 0%,transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          <div className="relative z-10">
            <div className="flex items-center gap-2.5 mb-14">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-extrabold text-lg text-white"
                style={{
                  background: "#e85d3a",
                  boxShadow: "0 0 20px #e85d3a40",
                }}
              >
                I
              </div>
              <div>
                <div
                  className="font-display text-lg font-extrabold"
                  style={{ color: "#f0f4ff", letterSpacing: "-0.02em" }}
                >
                  InteConnect
                </div>
                <div
                  className="font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: "#6b7a99" }}
                >
                  Admin Portal
                </div>
              </div>
            </div>
            <h2
              className="font-display font-extrabold leading-tight mb-5"
              style={{
                fontSize: 36,
                color: "#f0f4ff",
                letterSpacing: "-0.02em",
              }}
            >
              {isForgot
                ? "Reset\nProtocol."
                : isLogin
                  ? "Authorize\nAccess."
                  : "Initialize\nCoordinator."}
            </h2>
            <p
              className="font-mono text-[13px] leading-relaxed max-w-xs mb-11"
              style={{ color: "#6b7a99" }}
            >
              {isLogin
                ? "Access the control panel, manage problem statements, and oversee student progress."
                : "Create an admin node to issue challenges and coordinate network activities."}
            </p>
            <div className="flex flex-col gap-4">
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
                  className="flex items-center gap-3"
                >
                  <div
                    className="w-[34px] h-[34px] rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                    style={{
                      background: `${f.accent}14`,
                      border: `1px solid ${f.accent}25`,
                    }}
                  >
                    {f.icon}
                  </div>
                  <span
                    className="font-mono text-[12px]"
                    style={{ color: "#8892a4" }}
                  >
                    {f.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
          <div
            className="font-mono text-[11px] relative z-10"
            style={{ color: "#4a5568" }}
          >
            © {new Date().getFullYear()} GMIT · Team-Falcon
          </div>
        </div>

        {/* Right: form */}
        <div className="flex-1 flex items-center justify-center p-10 overflow-y-auto">
          <div className="w-full max-w-[480px]">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center justify-center gap-2.5 mb-9">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-display font-extrabold text-base text-white"
                style={{ background: "#e85d3a" }}
              >
                I
              </div>
              <span
                className="font-display text-base font-extrabold"
                style={{ color: "#f0f4ff" }}
              >
                InteConnect
              </span>
            </div>

            <AnimatePresence mode="wait">
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
                    className="flex items-center gap-1.5 font-mono text-[12px] mb-7 cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6b7a99",
                    }}
                  >
                    ← Back
                  </button>
                  <h2
                    className="font-display text-2xl font-extrabold mb-2"
                    style={{ color: "#f0f4ff" }}
                  >
                    Reset Protocol
                  </h2>
                  <p
                    className="font-mono text-[12px] mb-8"
                    style={{ color: "#6b7a99" }}
                  >
                    {otpSent
                      ? "Enter the OTP and set a new password."
                      : "Enter your admin email to receive an override OTP."}
                  </p>
                  {!otpSent ? (
                    <form
                      onSubmit={handleSendOtp}
                      className="flex flex-col gap-4"
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
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl font-display font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: "#e85d3a",
                          color: "#fff",
                          border: "none",
                          padding: "13px 20px",
                          boxShadow: "0 4px 20px #e85d3a30",
                        }}
                      >
                        {isLoading && (
                          <span
                            className="inline-block"
                            style={{ animation: "spin 0.7s linear infinite" }}
                          >
                            ◌
                          </span>
                        )}
                        {isLoading ? "Sending…" : "Send Override OTP →"}
                      </motion.button>
                    </form>
                  ) : (
                    <form
                      onSubmit={handleResetPassword}
                      className="flex flex-col gap-4"
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
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl font-display font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                        style={{
                          background: "#e85d3a",
                          color: "#fff",
                          border: "none",
                          padding: "13px 20px",
                          boxShadow: "0 4px 20px #e85d3a30",
                        }}
                      >
                        {isLoading && (
                          <span
                            style={{
                              animation: "spin 0.7s linear infinite",
                              display: "inline-block",
                            }}
                          >
                            ◌
                          </span>
                        )}
                        {isLoading
                          ? "Resetting…"
                          : "Confirm New Authorization →"}
                      </motion.button>
                    </form>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.28 }}
                >
                  <TabSwitch isLogin={isLogin} onChange={setIsLogin} />
                  <h2
                    className="font-display text-2xl font-extrabold mb-1.5"
                    style={{ color: "#f0f4ff" }}
                  >
                    {isLogin ? "Admin Authorization" : "Coordinator Setup"}
                  </h2>
                  <p
                    className="font-mono text-[12px] mb-7"
                    style={{ color: "#6b7a99" }}
                  >
                    {isLogin
                      ? "Enter your credentials to access the control panel."
                      : "Fill in the details to establish your admin account."}
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <AnimatePresence>
                      {!isLogin && (
                        <motion.div
                          key="reg-fields"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden flex flex-col gap-4"
                        >
                          <div className="grid grid-cols-2 gap-3.5">
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
                          <div className="grid grid-cols-2 gap-3.5">
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
                          <div>
                            <label
                              className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5"
                              style={{ color: "#6b7a99" }}
                            >
                              Program / Role{" "}
                              <span style={{ color: "#e85d3a" }}>*</span>
                            </label>
                            <div className="relative">
                              <span
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
                                style={{ color: "#4a5568" }}
                              >
                                ◎
                              </span>
                              <select
                                name="program"
                                value={form.program}
                                onChange={handle}
                                required
                                className="w-full rounded-xl font-mono text-[13px] outline-none appearance-none"
                                style={{
                                  background: "#080c14",
                                  border: "1px solid #1e2330",
                                  padding: "11px 14px 11px 40px",
                                  color: form.program ? "#f0f4ff" : "#4a5568",
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
                      <label
                        className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5"
                        style={{ color: "#6b7a99" }}
                      >
                        Password <span style={{ color: "#e85d3a" }}>*</span>
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-sm pointer-events-none"
                          style={{ color: "#4a5568" }}
                        >
                          ◉
                        </span>
                        <input
                          type={showPass ? "text" : "password"}
                          name="password"
                          value={form.password}
                          onChange={handle}
                          placeholder="Security key"
                          onFocus={() => setPassF(true)}
                          onBlur={() => setPassF(false)}
                          className="w-full rounded-xl font-mono text-[13px] outline-none transition-all"
                          style={{
                            background: "#080c14",
                            border: `1px solid ${passF ? "#e85d3a60" : "#1e2330"}`,
                            padding: "11px 44px 11px 40px",
                            color: "#f0f4ff",
                            boxShadow: passF ? "0 0 0 3px #e85d3a10" : "none",
                            boxSizing: "border-box",
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass((s) => !s)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm cursor-pointer p-1"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#4a5568",
                          }}
                        >
                          {showPass ? "⊘" : "◉"}
                        </button>
                      </div>
                    </div>

                    {isLogin && (
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setIsForgot(true)}
                          className="font-mono text-[12px] cursor-pointer"
                          style={{
                            background: "none",
                            border: "none",
                            color: "#e85d3a",
                          }}
                        >
                          Override Sequence?
                        </button>
                      </div>
                    )}

                    <div className="mt-1">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl font-display font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        style={{
                          background: "#e85d3a",
                          color: "#fff",
                          border: "none",
                          padding: "13px 20px",
                          boxShadow: "0 4px 20px #e85d3a30",
                        }}
                      >
                        {isLoading && (
                          <span
                            style={{
                              animation: "spin 0.7s linear infinite",
                              display: "inline-block",
                            }}
                          >
                            ◌
                          </span>
                        )}
                        {isLoading
                          ? "Processing…"
                          : isLogin
                            ? "Authenticate Node →"
                            : "Initialize Coordinator →"}
                      </motion.button>
                    </div>
                  </form>

                  <p
                    className="text-center font-mono text-[12px] mt-6"
                    style={{ color: "#6b7a99" }}
                  >
                    {isLogin ? "Need an account? " : "Already registered? "}
                    <button
                      onClick={() => setIsLogin((v) => !v)}
                      className="font-bold cursor-pointer"
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e85d3a",
                        fontSize: 12,
                        fontFamily: "inherit",
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
