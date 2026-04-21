import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";

import Home from "./pages/Home";
import AdminRegister from "./pages/AdminRegister";
import Dashboard from "./pages/Dashboard";
import ManageProjects from "./pages/ManageProjects";
import SAAuth from "./components/SAAuth";
import SAHome from "./adminPages/SAHome";
import SADashboard from "./adminPages/SADashboard";
import ProblemManagement from "./adminPages/ProblemManagement";
import AdminManagement from "./adminPages/AdminManagement";
import StudentManagement from "./adminPages/StudentManagement";
import SANotification from "./adminPages/SANotification";
import Winners from "./adminPages/Winner";
import AdminLeaderboard from "./pages/AdminLeaderboard";

const RequireSA = ({ children }) => {
  const saToken = localStorage.getItem("saToken");
  return saToken ? children : <Navigate to="/super-admin/login" replace />;
};

const App = () => {
  const { adminToken } = useAppContext();
  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#080c14",
        color: "#f0f4ff",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          style={{ position: "absolute", inset: 0, background: "#080c14" }}
        />
        <div
          style={{
            position: "absolute",
            top: "-15%",
            left: "-5%",
            width: "55%",
            height: "55%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #e85d3a06 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-20%",
            right: "-10%",
            width: "50%",
            height: "50%",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, #3a9de808 0%, transparent 65%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage:
              "linear-gradient(#ffffff 1px,transparent 1px),linear-gradient(90deg,#ffffff 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#0c0f18",
            color: "#f0f4ff",
            border: "1px solid #2a3045",
            borderRadius: 10,
            fontSize: 13,
            fontFamily: "'DM Mono', monospace",
            boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          },
          success: { iconTheme: { primary: "#4ade80", secondary: "#0c0f18" } },
          error: { iconTheme: { primary: "#f87171", secondary: "#0c0f18" } },
        }}
      />
      <main style={{ position: "relative", zIndex: 1 }}>
        <Routes>
          {adminToken ? (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/my-projects" element={<ManageProjects />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<AdminRegister />} />
              <Route path="/register" element={<AdminRegister />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          )}
          {/* Super Admin — independent auth */}
          <Route path="/super-admin/login" element={<SAAuth />} />
          <Route
            path="/super-admin"
            element={
              <RequireSA>
                <SAHome />
              </RequireSA>
            }
          />
          <Route
            path="/super-admin/dashboard"
            element={
              <RequireSA>
                <SADashboard />
              </RequireSA>
            }
          />
          <Route
            path="/super-admin/leaderboard"
            element={
              <RequireSA>
                <AdminLeaderboard />
              </RequireSA>
            }
          />
          <Route
            path="/super-admin/problems"
            element={
              <RequireSA>
                <ProblemManagement />
              </RequireSA>
            }
          />
          <Route
            path="/super-admin/admins"
            element={
              <RequireSA>
                <AdminManagement />
              </RequireSA>
            }
          />
          <Route
            path="/super-admin/winners"
            element={
              <RequireSA>
                <Winners />
              </RequireSA>
            }
          />
          <Route
            path="/super-admin/students"
            element={
              <RequireSA>
                <StudentManagement />
              </RequireSA>
            }
          />

          <Route
            path="/super-admin/notifications"
            element={
              <RequireSA>
                <SANotification />
              </RequireSA>
            }
          />
        </Routes>
      </main>
    </div>
  );
};

export default App;
