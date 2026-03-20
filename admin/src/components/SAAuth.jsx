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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500&display=swap');
        .font-display { font-family: 'Syne', sans-serif !important; }
        .font-mono    { font-family: 'DM Mono', monospace !important; }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes spin     { to { transform: rotate(360deg); } }
        @keyframes scanline { 0%{top:-8px} 100%{top:100%} }
        @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        .sa-input-focused { border-color: #9c3ae860 !important; box-shadow: 0 0 0 3px #9c3ae810 !important; }
      `}</style>

      <div
        className="min-h-screen flex font-mono relative overflow-hidden"
        style={{ background: "#06080f" }}
      >
        {/* BG */}
        <div className="fixed inset-0 pointer-events-none">
          <div
            className="absolute"
            style={{
              top: "-20%",
              left: "-10%",
              width: "60%",
              height: "60%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle,#9c3ae812 0%,transparent 65%)",
            }}
          />
          <div
            className="absolute"
            style={{
              bottom: "-15%",
              right: "-5%",
              width: "50%",
              height: "50%",
              borderRadius: "50%",
              background:
                "radial-gradient(circle,#3a9de808 0%,transparent 65%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              opacity: 0.03,
              backgroundImage:
                "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <div
            className="absolute left-0 right-0 h-0.5"
            style={{
              background: "linear-gradient(transparent,#9c3ae820,transparent)",
              animation: "scanline 4s linear infinite",
            }}
          />
        </div>

        {/* Left brand panel */}
        <div
          className="w-[45%] hidden lg:flex flex-col justify-between relative"
          style={{ padding: "60px 52px", borderRight: "1px solid #1e2330" }}
        >
          <div className="relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-14">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center font-display font-extrabold text-lg text-white"
                style={{
                  background: "linear-gradient(135deg,#9c3ae8,#7c2abf)",
                  boxShadow: "0 0 24px #9c3ae840",
                }}
              >
                SA
              </div>
              <div>
                <div
                  className="font-display text-[17px] font-extrabold"
                  style={{ color: "#f0f4ff", letterSpacing: "-0.02em" }}
                >
                  Super Admin
                </div>
                <div
                  className="font-mono text-[9px] uppercase tracking-widest"
                  style={{ color: "#6b7a99" }}
                >
                  InteConnect Control
                </div>
              </div>
            </div>
            <h2
              className="font-display font-extrabold leading-tight mb-5"
              style={{
                fontSize: 40,
                color: "#f0f4ff",
                letterSpacing: "-0.025em",
              }}
            >
              Elevated
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg,#9c3ae8,#b65aff)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Access Level
              </span>
            </h2>
            <p
              className="font-mono text-[13px] leading-relaxed mb-12 max-w-sm"
              style={{ color: "#6b7a99" }}
            >
              This portal is restricted to authorized Super Administrators only.
              All sessions are logged and monitored.
            </p>
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
                className="flex items-center gap-3 mb-4"
              >
                <div
                  className="w-[34px] h-[34px] rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                  style={{
                    background: `${f.color}14`,
                    border: `1px solid ${f.color}25`,
                    color: f.color,
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
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
            className="rounded-xl p-4 mb-8 self-start"
            style={{ background: "#9c3ae814", border: "1px solid #9c3ae830" }}
          >
            <div
              className="font-mono text-[10px] font-bold uppercase tracking-widest mb-1"
              style={{ color: "#9c3ae8" }}
            >
              Clearance Level
            </div>
            <div
              className="font-display text-[22px] font-extrabold"
              style={{ color: "#f0f4ff" }}
            >
              ALPHA
            </div>
          </motion.div>
          <div className="font-mono text-[11px]" style={{ color: "#4a5568" }}>
            © {new Date().getFullYear()} GMIT · Team-Falcon
          </div>
        </div>

        {/* Right: form */}
        <div className="flex-1 flex items-center justify-center p-10">
          <div className="w-full max-w-[420px]">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center justify-center gap-2.5 mb-9">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-display font-extrabold text-base text-white"
                style={{
                  background: "linear-gradient(135deg,#9c3ae8,#7c2abf)",
                }}
              >
                SA
              </div>
              <span
                className="font-display text-[17px] font-extrabold"
                style={{ color: "#f0f4ff" }}
              >
                Super Admin
              </span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="rounded-2xl"
                style={{
                  background: "#0c0f18",
                  border: "1px solid #2a1a4a",
                  padding: "36px",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.5),0 0 0 1px #9c3ae810",
                }}
              >
                {/* Header */}
                <div className="mb-7">
                  <div
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg mb-4"
                    style={{
                      background: "#9c3ae814",
                      border: "1px solid #9c3ae830",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{
                        background: "#9c3ae8",
                        boxShadow: "0 0 6px #9c3ae8",
                      }}
                    />
                    <span
                      className="font-mono text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: "#9c3ae8" }}
                    >
                      Restricted Access
                    </span>
                  </div>
                  <h2
                    className="font-display text-2xl font-extrabold mb-1.5"
                    style={{ color: "#f0f4ff" }}
                  >
                    Super Admin Login
                  </h2>
                  <p
                    className="font-mono text-[12px]"
                    style={{ color: "#6b7a99" }}
                  >
                    Enter your elevated credentials to proceed.
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 mb-5 font-mono text-[12px]"
                    style={{
                      background: "#3a1a1a",
                      border: "1px solid #f8717140",
                      color: "#f87171",
                    }}
                  >
                    ✕ {error}
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  {/* Email */}
                  <div>
                    <label
                      className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5"
                      style={{ color: "#6b7a99" }}
                    >
                      SA Email <span style={{ color: "#9c3ae8" }}>*</span>
                    </label>
                    <div className="relative">
                      <span
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] pointer-events-none"
                        style={{ color: "#4a5568" }}
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
                        className="w-full rounded-xl font-mono text-[13px] outline-none transition-all pl-10"
                        style={{
                          background: "#060810",
                          border: `1px solid ${emailF ? "#9c3ae860" : "#1e2330"}`,
                          padding: "12px 14px 12px 42px",
                          color: "#f0f4ff",
                          boxShadow: emailF ? "0 0 0 3px #9c3ae810" : "none",
                          boxSizing: "border-box",
                        }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label
                      className="block font-mono text-[10px] font-bold uppercase tracking-widest mb-1.5"
                      style={{ color: "#6b7a99" }}
                    >
                      SA Password <span style={{ color: "#9c3ae8" }}>*</span>
                    </label>
                    <div className="relative">
                      <span
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[13px] pointer-events-none"
                        style={{ color: "#4a5568" }}
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
                        className="w-full rounded-xl font-mono text-[13px] outline-none transition-all"
                        style={{
                          background: "#060810",
                          border: `1px solid ${passF ? "#9c3ae860" : "#1e2330"}`,
                          padding: "12px 44px 12px 42px",
                          color: "#f0f4ff",
                          boxShadow: passF ? "0 0 0 3px #9c3ae810" : "none",
                          boxSizing: "border-box",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm cursor-pointer"
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

                  <div
                    className="rounded-lg px-3.5 py-2.5 font-mono text-[11px]"
                    style={{
                      background: "#1a1428",
                      border: "1px solid #9c3ae830",
                      color: "#8892a4",
                    }}
                  >
                    ⚠ All Super Admin sessions are logged for security purposes.
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl font-display font-bold text-[13px] tracking-wide flex items-center justify-center gap-2 mt-1 cursor-pointer disabled:cursor-not-allowed"
                    style={{
                      background: loading
                        ? "#2a1a4a"
                        : "linear-gradient(135deg,#9c3ae8,#7c2abf)",
                      color: "#fff",
                      border: "none",
                      padding: "13px 20px",
                      boxShadow: loading ? "none" : "0 4px 20px #9c3ae830",
                    }}
                  >
                    {loading && (
                      <span
                        className="inline-block"
                        style={{ animation: "spin 0.7s linear infinite" }}
                      >
                        ◌
                      </span>
                    )}
                    {loading ? "Authenticating…" : "Authenticate Super Admin →"}
                  </motion.button>
                </form>

                <div className="mt-5 text-center">
                  <button
                    onClick={() => navigate("/login")}
                    className="font-mono text-[12px] cursor-pointer"
                    style={{
                      background: "none",
                      border: "none",
                      color: "#6b7a99",
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
