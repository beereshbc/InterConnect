import React from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Added Navigate
import { Toaster } from "react-hot-toast";

// --- Global Components ---
import Header from "./components/Header";

// --- Pages ---
import Home from "./pages/Home";
import Register from "./pages/Register";
import Problems from "./pages/Problems";
import LeaderBoard from "./pages/LeaderBoard";
import Resources from "./pages/Resources";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import { useAppContext } from "./context/AppContext";

const App = () => {
  const { studentToken } = useAppContext();

  return (
    // Added the missing return statement
    <div className="relative min-h-screen bg-transparent text-slate-50 font-sans overflow-x-hidden">
      {/* Main wrapper: Transparent so the fixed background shows through */}

      {/* --- Cosmic Night / Space Background Layers --- */}
      <div className="fixed inset-0 z-[-1] bg-[#050505]">
        {/* Core Deep Space Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#050505] to-black"></div>

        {/* Glowing Nebula Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px]"></div>

        {/* Grainy Noise Overlay */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-screen pointer-events-none"
          style={{
            backgroundImage:
              "url('https://grainy-gradients.vercel.app/noise.svg')",
          }}
        ></div>
      </div>

      {/* Global Toast Notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.8)", // slate-900 with transparency
            backdropFilter: "blur(10px)",
            color: "#fff",
            border: "1px solid rgba(51, 65, 85, 0.5)",
            borderRadius: "12px",
          },
        }}
      />

      {/* Persistent Navigation */}
      <Header />

      {/* Main Content Area */}
      <main className="relative z-10 pt-28 pb-12 px-4 flex flex-col min-h-screen">
        <Routes>
          {/* Public Routes - Anyone can see these */}
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/leaderboard" element={<LeaderBoard />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/about" element={<About />} />

          {/* Authentication - Redirects to dashboard if they are ALREADY logged in */}
          <Route
            path="/register"
            element={
              studentToken ? <Navigate to="/dashboard" replace /> : <Register />
            }
          />
          <Route
            path="/login"
            element={
              studentToken ? <Navigate to="/dashboard" replace /> : <Register />
            }
          />

          {/* Protected / Private Route - Redirects to login if they are NOT logged in */}
          <Route
            path="/dashboard"
            element={
              studentToken ? <Dashboard /> : <Navigate to="/login" replace />
            }
          />

          {/* Fallback route for unknown URLs */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
