import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  User,
  Phone,
  Building,
  Hash,
  Github,
  BookOpen,
  ArrowRight,
  Loader2,
  Eye,
  EyeOff,
  Terminal,
  Shield,
  Cpu,
  Key,
  ArrowLeft,
  Network,
} from "lucide-react";
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

const AdminRegister = () => {
  const navigate = useNavigate();

  // Pull context variables for Admin
  const { axios, setAdminToken } = useAppContext();

  // Auth Modes
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Forgot Password States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Form Data States mapped to Admin Schema
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    program: "",
    githubLink: "",
    password: "",
  });

  const [forgotData, setForgotData] = useState({
    email: "",
    otp: "",
    newPassword: "",
  });

  // Input Handlers
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleForgotChange = (e) =>
    setForgotData({ ...forgotData, [e.target.name]: e.target.value });

  // 1. Handle Standard Login / Register
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        // --- ADMIN LOGIN API CALL ---
        const { data } = await axios.post("/api/admin/login", {
          email: formData.email,
          password: formData.password,
        });
        if (data.success) {
          setAdminToken(data.token);
          toast.success("Admin Authorization Granted!");
          navigate("/admin-dashboard"); // Redirect to admin specific dashboard
        }
      } else {
        // --- ADMIN REGISTER API CALL ---
        const { data } = await axios.post("/api/admin/register", formData);
        if (data.success) {
          setAdminToken(data.token);
          toast.success("Admin Profile initialized! Welcome to the network.");
          navigate("/admin-dashboard");
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

  // 2. Handle Sending OTP for Password Reset
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!forgotData.email) return toast.error("Please enter your admin email.");

    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/admin/forgot-password/send-otp", {
        email: forgotData.email,
      });
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

  // 3. Handle Verifying OTP and Changing Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!forgotData.otp || !forgotData.newPassword)
      return toast.error("Please fill all fields.");

    setIsLoading(true);
    try {
      const { data } = await axios.post(
        "/api/admin/forgot-password/reset",
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
    <div className="flex-1 flex items-center justify-center relative w-full px-4 py-10 md:py-20 font-sans">
      <motion.div
        layout
        className="relative z-10 w-full max-w-5xl bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col lg:flex-row"
      >
        {/* --- LEFT SIDE: Branding & Info --- */}
        <div className="hidden lg:flex w-2/5 bg-gradient-to-br from-indigo-900/40 to-slate-900/80 p-10 flex-col justify-between border-r border-slate-700/50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="p-3 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                <Network className="text-indigo-400" size={28} />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Admin<span className="text-indigo-500">Portal</span>
              </h1>
            </div>
            <h2 className="text-4xl font-extrabold text-white leading-tight mb-6">
              {isLogin ? "Authorize Access." : "Initialize Coordinator."}
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              {isLogin
                ? "Access the control panel, manage problem statements, and oversee student progress."
                : "Create an admin node to issue challenges and coordinate network activities."}
            </p>
            <ul className="space-y-5">
              {[
                {
                  icon: Shield,
                  text: "Full administrative control over project pipelines.",
                },
                {
                  icon: Cpu,
                  text: "Issue and manage real-world problem statements.",
                },
                {
                  icon: Terminal,
                  text: "Monitor student metrics and total points distributed.",
                },
              ].map((feature, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                  className="flex items-center gap-4 text-slate-300"
                >
                  <div className="p-2 bg-slate-800/50 rounded-lg text-indigo-400">
                    <feature.icon size={18} />
                  </div>
                  <span className="text-sm font-medium">{feature.text}</span>
                </motion.li>
              ))}
            </ul>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            © {new Date().getFullYear()} InterConnect Network. Admin Node.
          </div>
        </div>

        {/* --- RIGHT SIDE: Form Section --- */}
        <div className="w-full lg:w-3/5 p-6 sm:p-10 md:p-12 flex flex-col justify-center relative overflow-y-auto max-h-[90vh] lg:max-h-none custom-scrollbar">
          <AnimatePresence mode="wait">
            {/* ================= FORGOT PASSWORD FLOW ================= */}
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
                  className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors mb-8"
                >
                  <ArrowLeft size={16} /> Back to Auth
                </button>
                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Reset Protocol
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {otpSent
                      ? "Check your admin email for the OTP and set a new authorization sequence."
                      : "Enter your registered admin email to receive an override OTP."}
                  </p>
                </div>

                {!otpSent ? (
                  <form onSubmit={handleSendOtp} className="space-y-5">
                    <InputField
                      icon={Mail}
                      name="email"
                      placeholder="Admin Email Address"
                      type="email"
                      value={forgotData.email}
                      onChange={handleForgotChange}
                      required
                    />
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={isLoading}
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      {isLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>
                          Send Override OTP <ArrowRight size={18} />
                        </>
                      )}
                    </motion.button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-5">
                    <InputField
                      icon={Key}
                      name="otp"
                      placeholder="Enter 6-digit Override Code"
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
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={isLoading}
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 mt-4"
                    >
                      {isLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                      ) : (
                        <>Confirm New Authorization</>
                      )}
                    </motion.button>
                  </form>
                )}
              </motion.div>
            ) : (
              /* ================= LOGIN / REGISTER FLOW ================= */
              <motion.div
                key="auth"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full"
              >
                <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                  <Network className="text-indigo-500" size={24} />
                  <h1 className="text-xl font-bold text-white">AdminPortal</h1>
                </div>

                <div className="flex p-1.5 bg-slate-950/50 border border-slate-800 rounded-2xl mb-8">
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${!isLogin ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" : "text-slate-400 hover:text-white"}`}
                  >
                    Initialize Node
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 ${isLogin ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" : "text-slate-400 hover:text-white"}`}
                  >
                    Secure Login
                  </button>
                </div>

                <div className="mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    {isLogin ? "Admin Authorization" : "Coordinator Setup"}
                  </h2>
                  <p className="text-slate-400 text-sm">
                    {isLogin
                      ? "Enter your secure credentials to access the control panel."
                      : "Fill out the required fields to establish an admin account."}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <AnimatePresence mode="popLayout">
                    {!isLogin && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="grid grid-cols-1 sm:grid-cols-2 gap-5 overflow-hidden"
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
                          placeholder="Organization/College"
                          value={formData.college}
                          onChange={handleChange}
                          required
                        />
                        <InputField
                          icon={Hash}
                          name="branch"
                          placeholder="Department/Branch (e.g., CSE)"
                          value={formData.branch}
                          onChange={handleChange}
                          required
                        />

                        <div className="relative group sm:col-span-2">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <BookOpen
                              size={18}
                              className="text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                            />
                          </div>
                          <select
                            name="program"
                            value={formData.program}
                            onChange={handleChange}
                            required
                            className="w-full bg-slate-950/50 border border-slate-700/60 text-slate-200 text-sm rounded-xl pl-11 p-3.5 appearance-none outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-slate-600"
                          >
                            <option value="" disabled>
                              Select Program/Role
                            </option>
                            {PROGRAMS.map((prog) => (
                              <option
                                key={prog}
                                value={prog}
                                className="bg-slate-900"
                              >
                                {prog}
                              </option>
                            ))}
                          </select>
                        </div>
                        <InputField
                          icon={Github}
                          name="githubLink"
                          placeholder="GitHub / Portfolio URL"
                          type="url"
                          className="sm:col-span-2"
                          value={formData.githubLink}
                          onChange={handleChange}
                          required
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.div layout className="space-y-5">
                    <InputField
                      icon={Mail}
                      name="email"
                      placeholder="Work/Admin Email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />

                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock
                          size={18}
                          className="text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                        />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Security Key (Password)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="w-full bg-slate-950/50 border border-slate-700/60 text-slate-200 text-sm rounded-xl pl-11 pr-12 p-3.5 placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-slate-600"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-indigo-400 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </motion.div>

                  {isLogin && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between text-sm mt-1"
                    >
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          className="rounded border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500/50 cursor-pointer"
                        />
                        <span className="text-slate-400 group-hover:text-slate-300 transition-colors">
                          Maintain Session
                        </span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPassword(true)}
                        className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Override Sequence?
                      </button>
                    </motion.div>
                  )}

                  <motion.button
                    layout
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    disabled={isLoading}
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        {isLogin
                          ? "Authenticate Node"
                          : "Initialize Coordinator"}
                        <ArrowRight size={18} />
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ icon: Icon, className = "", ...props }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
      <Icon
        size={18}
        className="text-slate-500 group-focus-within:text-indigo-400 transition-colors"
      />
    </div>
    <input
      {...props}
      className="w-full bg-slate-950/50 border border-slate-700/60 text-slate-200 text-sm rounded-xl pl-11 p-3.5 placeholder-slate-500 outline-none focus:ring-2 focus:ring-indigo-500 transition-all hover:border-slate-600"
    />
  </div>
);

export default AdminRegister;
