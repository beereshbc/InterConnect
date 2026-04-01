import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
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
  Handshake,
} from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { studentToken, logout } = useAppContext();

  const NAV_LINKS = [
    { name: "Home", path: "/", icon: Home },
    ...(studentToken
      ? [{ name: "Dashboard", path: "/dashboard", icon: LayoutDashboard }]
      : []),
    { name: "Problem Statement", path: "/problems", icon: AlertCircle },
    { name: "LeaderBoard", path: "/leaderboard", icon: Trophy },
    { name: "Resource", path: "/resources", icon: BookOpen },
    { name: "Sponsor", path: "/sponsored", icon: Handshake },
    { name: "About", path: "/about", icon: Info },
    ...(!studentToken
      ? [{ name: "Register", path: "/register", icon: UserPlus }]
      : []),
  ];

  // Efficient scroll listener
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const isScrolled = latest > 40;
    if (scrolled !== isScrolled) setScrolled(isScrolled);
  });

  const handleLogout = () => {
    setMobileMenuOpen(false);
    logout();
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? "top-2 sm:top-4 mx-auto w-[95%] max-w-fit px-3 py-2 bg-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-xl rounded-full"
            : "top-0 w-full px-4 sm:px-6 py-4 sm:py-6 bg-transparent border-transparent"
        }`}
      >
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? "gap-4 sm:gap-6" : "container mx-auto"
          }`}
        >
          {/* Brand / Logo */}
          <Link to="/" className="flex items-center gap-2 group z-50">
            <div className="relative flex-shrink-0 flex items-center justify-center">
              <img
                src="/ibg.png"
                alt="InterConnect Logo"
                fetchPriority="high"
                decoding="async"
                className={`object-contain origin-center transition-all duration-300 group-hover:rotate-12 ${
                  scrolled
                    ? "h-8 w-8"
                    : "h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16"
                }`}
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:block">
            <ul
              className={`flex items-center transition-all duration-300 ${scrolled ? "gap-2 lg:gap-4" : "gap-6 lg:gap-8"}`}
            >
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.name} className="relative">
                    <Link
                      to={link.path}
                      className={`flex items-center gap-2 font-medium transition-colors duration-200 px-3 py-2 rounded-full hover:bg-slate-800/50 ${
                        scrolled
                          ? "text-xs uppercase tracking-wider text-slate-200"
                          : "text-sm text-slate-300"
                      } ${isActive ? "text-blue-400" : "hover:text-blue-400"}`}
                    >
                      <link.icon size={scrolled ? 14 : 16} />
                      {link.name}

                      {/* Active Indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          }}
                          className={`absolute left-2 right-2 bg-blue-500 rounded-full ${
                            scrolled ? "-bottom-0 h-[2px]" : "-bottom-1 h-[3px]"
                          }`}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Action Area (CTA / Logout / Mobile Menu Toggle) */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:block">
              {studentToken ? (
                <button
                  onClick={handleLogout}
                  className={`bg-slate-800 hover:bg-red-600 text-white font-semibold transition-all shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2 ${
                    scrolled
                      ? "h-9 px-4 text-xs rounded-full"
                      : "h-11 px-6 text-sm rounded-full"
                  }`}
                >
                  <LogOut size={scrolled ? 14 : 16} />
                  {!scrolled && <span>Logout</span>}
                </button>
              ) : (
                <Link
                  to="/register"
                  className={`bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center ${
                    scrolled
                      ? "h-9 px-5 text-xs rounded-full"
                      : "h-11 px-7 text-sm rounded-full"
                  }`}
                >
                  {scrolled ? "Join" : "Join Now"}
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="xl:hidden relative z-50 p-2 text-slate-300 hover:bg-slate-800 rounded-full transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <div
                className={`transition-transform duration-200 ${mobileMenuOpen ? "rotate-90" : "rotate-0"}`}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay 
        Placed OUTSIDE the header so it breaks free from the header's blur/width constraints.
      */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-[45] xl:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Dropdown Panel */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-[80px] sm:top-[90px] left-4 right-4 bg-slate-900/95 backdrop-blur-2xl border border-slate-700/80 rounded-3xl shadow-2xl p-3 max-h-[calc(100dvh-100px)] overflow-y-auto overscroll-contain"
            >
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 p-3 sm:p-4 rounded-2xl transition-colors active:scale-[0.98] ${
                      location.pathname === link.path
                        ? "bg-blue-500/15 text-blue-400 font-bold"
                        : "hover:bg-slate-800 text-slate-200 font-medium"
                    }`}
                  >
                    <link.icon
                      size={20}
                      className={
                        location.pathname === link.path
                          ? "text-blue-400"
                          : "text-slate-400"
                      }
                    />
                    <span className="text-sm sm:text-base">{link.name}</span>
                  </Link>
                ))}

                {/* Mobile Auth Actions */}
                <div className="mt-2 pt-2 border-t border-slate-800/80">
                  {studentToken ? (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-3 p-3 sm:p-4 rounded-2xl transition-colors active:scale-[0.98] bg-red-500/10 text-red-400 hover:bg-red-500/20 font-semibold"
                    >
                      <LogOut size={20} />
                      <span className="text-sm sm:text-base">Logout</span>
                    </button>
                  ) : (
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-3 p-3 sm:p-4 rounded-2xl transition-colors active:scale-[0.98] bg-blue-600 text-white hover:bg-blue-700 font-semibold shadow-lg shadow-blue-500/25"
                    >
                      <UserPlus size={20} />
                      <span className="text-sm sm:text-base">Join Now</span>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
