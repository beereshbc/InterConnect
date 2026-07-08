import { createContext, useContext, useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AppContext = createContext();

// Axios Global Configuration
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  // Initialize state from localStorage (Runs once on load)
  const [adminToken, setAdminToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Y2U0ZTA3NWMzYmU2NDA3MTdmODk2MiIsImlhdCI6MTc3ODkxMjYzMywiZXhwIjoxNzgxNTA0NjMzfQ.u5IFrNac6Cb1Owc2J_O4rdi8HGTXkMM6516JzoR3sjI",
  );

  // Update Axios headers and LocalStorage whenever the token state changes
  useEffect(() => {
    if (adminToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${adminToken}`;
      localStorage.setItem("adminToken", adminToken);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("adminToken");
    }
  }, [adminToken]);

  /**
   * Logout Functionality
   */
  const logout = () => {
    setAdminToken(""); // This triggers the useEffect above to clear localStorage
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Memoize the value to prevent unnecessary re-renders of the entire app tree
  const value = useMemo(
    () => ({
      navigate,
      axios,
      adminToken,
      setAdminToken, // Exposing this so your Admin Login component can use it
      logout,
      toast,
    }),
    [navigate, adminToken],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook for easier consumption
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
