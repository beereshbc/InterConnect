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
  const [studentToken, setStudentToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5Y2U0OTI1MjdmMTU5NjU0MWRhZjYyYiIsImlhdCI6MTc4MzUwOTk1OSwiZXhwIjoxNzg2MTAxOTU5fQ.BZp7amVb9VE8eB2UpVwwwaHf54Sjay4a-mjGQi8CyiY",
  );

  // Update Axios headers and LocalStorage whenever the token state changes
  useEffect(() => {
    if (studentToken) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${studentToken}`;
      localStorage.setItem("clientToken", studentToken);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem("clientToken");
    }
  }, [studentToken]);

  /**
   * Logout Functionality
   */
  const logout = () => {
    setStudentToken(""); // This triggers the useEffect above to clear localStorage
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Memoize the value to prevent unnecessary re-renders of the entire app tree
  const value = useMemo(
    () => ({
      navigate,
      axios,
      studentToken,
      setStudentToken, // Exposing this so Register.jsx can use it
      logout,
      toast,
    }),
    [navigate, studentToken],
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
