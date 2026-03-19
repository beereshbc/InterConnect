import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  AlertCircle,
  Trophy,
  BookOpen,
  Info,
  UserPlus,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useAppContext } from "../context/AppContext"; // Import context

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Pull authentication state and logout function from context
  const { studentToken, logout } = useAppContext();

  // Dynamically generate Nav Links based on login status
  const NAV_LINKS = [
    { name: "Home", path: "/", icon: Home },
    ...(studentToken
      ? [{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }]
      : []),
    { name: "Problem Statement", path: "/problems", icon: AlertCircle },
    { name: "LeaderBoard", path: "/leaderboard", icon: Trophy },
    { name: "Resource", path: "/resources", icon: BookOpen },
    { name: "About", path: "/about", icon: Info },
    // Conditional Links
    ...(!studentToken
      ? [{ name: "Register", path: "/register", icon: UserPlus }]
      : []),
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Wrapper for logout to also close the mobile menu if open
  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? "top-4 mx-auto max-w-fit px-2 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border border-slate-200/50 dark:border-slate-700/50 shadow-2xl rounded-full"
          : "top-0 w-full py-6 bg-transparent border-transparent"
      }`}
    >
      <div
        className={`flex items-center justify-between transition-all duration-500 ${
          scrolled ? "gap-6 px-4" : "container mx-auto px-6"
        }`}
      >
        {/* Brand / Logo */}
        <motion.div layout>
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative flex-shrink-0 flex items-center justify-center">
              {/* === Changed SVG to Image === */}
              <img
                src="public/ibg.png" // <-- Replace with your image path (PNG, JPG, SVG file, etc.)
                alt="InterConnect Logo"
                // Dynamically change size based on scrolled state, just like the SVG
                style={{
                  width: scrolled ? "30px" : "80px",
                  height: scrolled ? "30px" : "80px",
                }}
                // Keep the hover rotation effect from original code
                className="group-hover:rotate-12 transition-all duration-300 object-contain"
              />
            </div>
          </Link>
        </motion.div>
        {/* Desktop Navigation */}
        <nav className="hidden lg:block">
          <ul className={`flex items-center ${scrolled ? "gap-4" : "gap-8"}`}>
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <motion.li key={link.name} layout>
                  <Link
                    to={link.path}
                    className={`flex items-center gap-2 font-medium transition-all duration-300 relative px-2 py-1 ${
                      scrolled
                        ? "text-[11px] uppercase tracking-wider"
                        : "text-sm"
                    } ${
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-300 hover:text-blue-500"
                    }`}
                  >
                    <link.icon size={scrolled ? 14 : 16} />
                    {link.name}
                    {isActive && !scrolled && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-500 rounded-full"
                      />
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </nav>

        {/* Action Area (CTA / Logout) */}
        <div className="flex items-center gap-3">
          <motion.div layout>
            {studentToken ? (
              <button
                onClick={handleLogout}
                className={`bg-slate-800 hover:bg-red-600 text-white font-semibold transition-all shadow-lg shadow-red-500/20 flex items-center justify-center gap-2 ${
                  scrolled
                    ? "h-8 px-4 text-[10px] rounded-full"
                    : "h-10 px-6 text-sm rounded-full"
                }`}
              >
                {scrolled ? (
                  <LogOut size={14} />
                ) : (
                  <>
                    <LogOut size={16} /> Logout
                  </>
                )}
              </button>
            ) : (
              <Link
                to="/register"
                className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center ${
                  scrolled
                    ? "h-8 px-4 text-[10px] rounded-full"
                    : "h-10 px-6 text-sm rounded-full"
                }`}
              >
                {scrolled ? "Join" : "Join Now"}
              </Link>
            )}
          </motion.div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-1 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full mt-4 left-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-2xl lg:hidden p-4"
          >
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl transition-colors ${
                    location.pathname === link.path
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                  }`}
                >
                  <link.icon size={20} />
                  <span className="font-semibold">{link.name}</span>
                </Link>
              ))}

              {/* Mobile Logout Button */}
              {studentToken && (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-4 rounded-2xl transition-colors mt-2 bg-red-500/10 text-red-500 hover:bg-red-500/20"
                >
                  <LogOut size={20} />
                  <span className="font-semibold">Logout</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
