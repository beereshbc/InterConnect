import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Phone,
  Building,
  Hash,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Terminal,
  Cpu,
  Key,
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Zap,
  Users,
  Lightbulb,
  Trophy,
  Briefcase, // Added for Department
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const PROGRAMS = [
  "BE/B.Tech",
  "M.Tech",
  "BCA",
  "MCA",
  "B.Sc",
  "MBA",
  "Polytechnic",
  "B Com",
  "Law",
  "Pharmacy",
  "BBA",
  "Others",
];

const SEMESTERS = [
  "1st Sem",
  "2nd Sem",
  "3rd Sem",
  "4th Sem",
  "5th Sem",
  "6th Sem",
  "7th Sem",
  "8th Sem",
];

const TIMELINE = [
  { label: "Registration Closes", date: "April 10, 2026", icon: CalendarDays },
  { label: "Development Phase", date: "Till April 17", icon: Cpu },
  { label: "Final Presentation", date: "April 18, 2026", icon: Trophy },
];

const WHY_PARTICIPATE = [
  { icon: Lightbulb, text: "Solve real-world problems" },
  { icon: Users, text: "Gain hands-on team experience" },
  { icon: Zap, text: "Build & present real solutions" },
  { icon: Trophy, text: "Earn recognition & grow" },
];

const Register = () => {
  const navigate = useNavigate();
  const { axios, setStudentToken } = useAppContext();

  // Default to login view
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showEventInfo, setShowEventInfo] = useState(false);

  // Forgot Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    department: "", // Added to map with Schema
    program: "",
    semester: "",
    usn: "",
    password: "",
  });

  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleForgotChange = (e) =>
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        const { data } = await axios.post("/api/student/login", {
          email: formData.email,
          password: formData.password,
        });
        if (data.success) {
          setStudentToken(data.token);
          toast.success("Welcome back to the network!");
          navigate("/");
        }
      } else {
        const { data } = await axios.post("/api/student/register", formData);
        if (data.success) {
          setStudentToken(data.token);
          toast.success("Profile initialized! Welcome to the network.");
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Connection failed. Try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotData.email) return toast.error("Please enter your email.");
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "/api/student/forgot-password/send-otp",
        {
          email: forgotData.email,
        },
      );
      if (data.success) {
        toast.success(data.message);
        setOtpSent(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotData.otp || !forgotData.newPassword)
      return toast.error("Please fill all fields.");
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "/api/student/forgot-password/reset",
        forgotData,
      );
      if (data.success) {
        toast.success(data.message);
        setIsForgotPassword(false);
        setOtpSent(false);
        setIsLogin(true);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center relative w-full min-h-screen px-3 py-8 sm:px-4 sm:py-12 font-sans bg-slate-950">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        layout
        className="relative z-10 w-full max-w-5xl bg-slate-900/70 backdrop-blur-2xl border border-slate-700/50 rounded-2xl sm:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col lg:flex-row"
      >
        {/* ===================== LEFT SIDE: Event Info ===================== */}
        <div className="hidden lg:flex w-[42%] flex-col justify-between border-r border-slate-700/40 relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900">
          {/* Decorative top grid lines */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />
          <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-500/8 to-transparent pointer-events-none" />

          <div className="relative z-10 p-9 flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2.5 bg-blue-500/15 rounded-xl border border-blue-500/25">
                <Terminal className="text-blue-400" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight leading-none">
                  Inter<span className="text-blue-400">Connect</span>
                </h1>
                <p className="text-[10px] text-slate-500 mt-0.5 tracking-widest uppercase">
                  GM University
                </p>
              </div>
            </div>

            {/* Event Badge */}
            <div className="mb-5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs font-semibold tracking-wide">
                <Zap size={11} /> Innovation Challenge
              </span>
            </div>

            {/* Event Title */}
            <div className="mb-5">
              <h2 className="text-2xl font-extrabold text-white leading-tight mb-2">
                INTERCONNECT{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                  26.0
                </span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Have an idea? This is your chance to turn it into something
                real. Submit your idea, join a team, and build across domains.
              </p>
            </div>

            {/* Why Participate */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Why Participate?
              </p>
              <ul className="space-y-2.5">
                {WHY_PARTICIPATE.map(({ icon: Icon, text }, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 + 0.2 }}
                    className="flex items-center gap-3 text-slate-300"
                  >
                    <div className="w-6 h-6 flex items-center justify-center bg-slate-800/80 rounded-lg text-blue-400 flex-shrink-0">
                      <Icon size={13} />
                    </div>
                    <span className="text-xs font-medium">{text}</span>
                  </motion.li>
                ))}
              </ul>
            </div>

            {/* Timeline */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">
                Event Timeline
              </p>
              <div className="space-y-2">
                {TIMELINE.map(({ label, date, icon: Icon }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2.5 bg-slate-800/40 rounded-xl border border-slate-700/40"
                  >
                    <div className="w-7 h-7 flex items-center justify-center bg-blue-500/10 rounded-lg text-blue-400 flex-shrink-0">
                      <Icon size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 leading-none mb-0.5">
                        {label}
                      </p>
                      <p className="text-xs font-semibold text-slate-200">
                        {date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-semibold">
                No Registration Fee
              </span>
              <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-semibold">
                GMIT & GMU Students
              </span>
            </div>

            {/* CTA Link */}
            <a
              href="https://inter-connect-self.vercel.app/problems"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-xl text-blue-400 text-xs font-semibold transition-all group"
            >
              View Problem Statements
              <ExternalLink
                size={12}
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </a>

            <div className="mt-auto pt-6 text-xs text-slate-600 font-medium">
              © {new Date().getFullYear()} InterConnect Network
            </div>
          </div>
        </div>

        {/* ===================== RIGHT SIDE: Auth Form ===================== */}
        <div className="w-full lg:w-[58%] flex flex-col justify-center relative">
          {/* Mobile Event Info Banner */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowEventInfo(!showEventInfo)}
              className="w-full flex items-center justify-between px-5 py-3.5 bg-blue-600/10 border-b border-blue-500/20 text-blue-400 text-xs font-semibold"
            >
              <span className="flex items-center gap-2">
                <Zap size={13} />
                INTERCONNECT 26.0 – Innovation Challenge
              </span>
              <span className="text-slate-500 text-[10px]">
                {showEventInfo ? "Hide ▲" : "Show details ▼"}
              </span>
            </button>

            <AnimatePresence>
              {showEventInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 py-4 bg-slate-900/80 border-b border-slate-700/40 space-y-4">
                    <p className="text-slate-400 text-xs leading-relaxed">
                      Have an idea? Submit it, join a team, and build real
                      solutions across domains.
                    </p>
                    {/* Mobile Timeline */}
                    <div className="grid grid-cols-1 gap-2">
                      {TIMELINE.map(({ label, date, icon: Icon }, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2.5 bg-slate-800/50 rounded-xl border border-slate-700/40"
                        >
                          <div className="w-7 h-7 flex items-center justify-center bg-blue-500/10 rounded-lg text-blue-400 flex-shrink-0">
                            <Icon size={13} />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-500 leading-none mb-0.5">
                              {label}
                            </p>
                            <p className="text-xs font-semibold text-slate-200">
                              {date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-semibold">
                        No Registration Fee
                      </span>
                      <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-[10px] font-semibold">
                        GMIT & GMU Students
                      </span>
                    </div>
                    <a
                      href="https://inter-connect-self.vercel.app/problems"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-blue-400 text-xs font-semibold hover:text-blue-300 transition-colors"
                    >
                      View Problem Statements <ExternalLink size={11} />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scrollable form area */}
          <div className="p-5 sm:p-8 md:p-10 overflow-y-auto max-h-[85vh] lg:max-h-screen custom-scrollbar">
            <AnimatePresence mode="wait">
              {/* =========== FORGOT PASSWORD FLOW =========== */}
              {isForgotPassword ? (
                <motion.div
                  key="forgot-password"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="w-full"
                >
                  <button
                    onClick={() => {
                      setIsForgotPassword(false);
                      setOtpSent(false);
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-7"
                  >
                    <ArrowLeft size={15} /> Back to Login
                  </button>

                  <div className="mb-7">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                      Reset Password
                    </h2>
                    <p className="text-slate-400 text-sm">
                      {otpSent
                        ? "Check your email for the OTP and enter your new password below."
                        : "Enter your registered email address to receive an OTP."}
                    </p>
                  </div>

                  {!otpSent ? (
                    <form onSubmit={handleSendOtp} className="space-y-4">
                      <InputField
                        icon={Mail}
                        name="email"
                        placeholder="Registered Email Address"
                        type="email"
                        value={forgotData.email}
                        onChange={handleForgotChange}
                        required
                      />
                      <SubmitButton
                        isLoading={isLoading}
                        label="Send Recovery OTP"
                      />
                    </form>
                  ) : (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                      <InputField
                        icon={Key}
                        name="otp"
                        placeholder="Enter 6-digit OTP"
                        type="text"
                        maxLength="6"
                        value={forgotData.otp}
                        onChange={handleForgotChange}
                        required
                      />
                      <InputField
                        icon={Lock}
                        name="newPassword"
                        placeholder="Enter New Password"
                        type="password"
                        value={forgotData.newPassword}
                        onChange={handleForgotChange}
                        required
                      />
                      <SubmitButton
                        isLoading={isLoading}
                        label="Confirm New Password"
                        gradient="from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500"
                      />
                    </form>
                  )}
                </motion.div>
              ) : (
                /* =========== LOGIN / REGISTER FLOW =========== */
                <motion.div
                  key="auth"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="w-full"
                >
                  {/* Mobile brand */}
                  <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
                    <div className="p-2 bg-blue-500/15 rounded-xl border border-blue-500/25">
                      <Terminal className="text-blue-400" size={20} />
                    </div>
                    <h1 className="text-lg font-bold text-white">
                      Inter<span className="text-blue-400">Connect</span>
                    </h1>
                  </div>

                  {/* Tab switcher */}
                  <div className="flex p-1.5 bg-slate-950/60 border border-slate-800 rounded-2xl mb-7">
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                        isLogin
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${
                        !isLogin
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Register
                    </button>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1.5">
                      {isLogin ? "Welcome Back" : "Create Account"}
                    </h2>
                    <p className="text-slate-400 text-sm">
                      {isLogin
                        ? "Enter your credentials to access the network."
                        : "Join the INTERCONNECT 26.0 challenge — fill in your details below."}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <AnimatePresence mode="popLayout">
                      {!isLogin && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-hidden"
                        >
                          <InputField
                            icon={User}
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                          <InputField
                            icon={Phone}
                            name="phone"
                            placeholder="Phone Number"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                          />
                          <InputField
                            icon={Building}
                            name="college"
                            placeholder="College Name"
                            value={formData.college}
                            onChange={handleChange}
                            required
                          />
                          <InputField
                            icon={Briefcase}
                            name="department"
                            placeholder="Department (e.g., CS, IS)"
                            value={formData.department}
                            onChange={handleChange}
                            required
                          />

                          <SelectField
                            icon={BookOpen}
                            name="program"
                            value={formData.program}
                            onChange={handleChange}
                            placeholder="Select Program"
                            options={PROGRAMS}
                            required
                          />
                          <SelectField
                            icon={GraduationCap}
                            name="semester"
                            value={formData.semester}
                            onChange={handleChange}
                            placeholder="Select Semester"
                            options={SEMESTERS}
                            required
                          />

                          <div className="sm:col-span-2">
                            <InputField
                              icon={Hash}
                              name="usn"
                              placeholder="USN / Roll Number"
                              value={formData.usn}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div layout className="space-y-4">
                      <InputField
                        icon={Mail}
                        name="email"
                        placeholder="Email Address"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      <PasswordField
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        show={showPassword}
                        onToggle={() => setShowPassword(!showPassword)}
                      />
                    </motion.div>

                    {isLogin && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-end text-sm"
                      >
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(true)}
                          className="font-semibold text-blue-400 hover:text-blue-300 transition-colors text-sm"
                        >
                          Forgot Password?
                        </button>
                      </motion.div>
                    )}

                    <motion.button
                      layout
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={isLoading}
                      type="submit"
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-1"
                    >
                      {isLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          {isLogin
                            ? "Login to Network"
                            : "Register for Challenge"}
                          <ArrowRight size={18} />
                        </>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ===================== REUSABLE COMPONENTS ===================== */

const InputField = ({ icon: Icon, className = "", ...props }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
      <Icon
        size={17}
        className="text-slate-500 group-focus-within:text-blue-400 transition-colors"
      />
    </div>
    <input
      {...props}
      className="w-full bg-slate-950/50 border border-slate-700/60 text-slate-200 text-sm rounded-xl pl-11 p-3.5 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600"
    />
  </div>
);

const SelectField = ({ icon: Icon, placeholder, options, ...props }) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
      <Icon
        size={17}
        className="text-slate-500 group-focus-within:text-blue-400 transition-colors"
      />
    </div>
    <select
      {...props}
      className="w-full bg-slate-950/50 border border-slate-700/60 text-slate-200 text-sm rounded-xl pl-11 p-3.5 appearance-none outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600 cursor-pointer"
    >
      <option value="" disabled className="bg-slate-900">
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt} className="bg-slate-900">
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const PasswordField = ({
  name,
  placeholder,
  value,
  onChange,
  show,
  onToggle,
}) => (
  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none z-10">
      <Lock
        size={17}
        className="text-slate-500 group-focus-within:text-blue-400 transition-colors"
      />
    </div>
    <input
      type={show ? "text" : "password"}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required
      className="w-full bg-slate-950/50 border border-slate-700/60 text-slate-200 text-sm rounded-xl pl-11 pr-12 p-3.5 placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all hover:border-slate-600"
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-blue-400 transition-colors z-10"
    >
      {show ? <EyeOff size={17} /> : <Eye size={17} />}
    </button>
  </div>
);

const SubmitButton = ({
  isLoading,
  label,
  gradient = "from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500",
}) => (
  <motion.button
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    disabled={isLoading}
    type="submit"
    className={`w-full bg-gradient-to-r ${gradient} disabled:opacity-60 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-2`}
  >
    {isLoading ? (
      <Loader2 size={20} className="animate-spin" />
    ) : (
      <>
        {label} <ArrowRight size={18} />
      </>
    )}
  </motion.button>
);

export default Register;
