import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Bell,
  BookOpen,
  Pin,
  ExternalLink,
  Download,
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  FileCode2,
  Figma,
  Terminal,
  Database,
  Layers,
} from "lucide-react";

// ─── Main Component ───────────────────────────────────────────────────────────
const Resources = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch published notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Adjust this endpoint based on your router setup
        const { data } = await axios.get("/api/student/notifications");
        setNotifications(data.notifications || []);
      } catch (error) {
        console.error("Failed to load notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  // Helper for notification icons and colors
  const getTypeConfig = (type) => {
    switch (type) {
      case "alert":
        return { icon: <AlertCircle size={16} />, color: "#f87171" };
      case "success":
        return { icon: <CheckCircle size={16} />, color: "#4ade80" };
      case "update":
        return { icon: <Clock size={16} />, color: "#fbbf24" };
      default:
        return { icon: <Info size={16} />, color: "#3a9de8" };
    }
  };

  // Dummy resources data
  const STATIC_RESOURCES = [
    {
      title: "InterConnect 26.O GitHub Template",
      description:
        "The official boilerplate repository with pre-configured linting, folders, and README structures.",
      category: "Code",
      icon: <FileCode2 size={20} className="text-[#3a9de8]" />,
      color: "#3a9de8",
      link: "#",
    },
    {
      title: "UI/UX Design Kit (Figma)",
      description:
        "Official color palettes, typography, and logo assets to use in your project presentations.",
      category: "Design",
      icon: <Figma size={20} className="text-[#9c3ae8]" />,
      color: "#9c3ae8",
      link: "#",
    },
    {
      title: "API Documentation Guidelines",
      description:
        "Standard practices for documenting your backend endpoints for the final evaluation.",
      category: "Docs",
      icon: <Terminal size={20} className="text-[#4ade80]" />,
      color: "#4ade80",
      link: "#",
    },
    {
      title: "Sample Database Schemas",
      description:
        "Common architecture patterns for E-commerce, Healthcare, and Social platforms.",
      category: "Database",
      icon: <Database size={20} className="text-[#fbbf24]" />,
      color: "#fbbf24",
      link: "#",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500;700&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono    { font-family: 'DM Mono', monospace; }
        
        /* Custom Scrollbar matching Leaderboard */
        .custom-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #2a3045; border-radius: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #3a9de8; }
      `}</style>

      <div
        className="min-h-screen font-mono pt-24 pb-10 px-4 sm:px-8 relative overflow-hidden"
        style={{ background: "#", color: "#f0f4ff" }}
      >
        {/* Ambient Background Glows */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, #3a9de80a 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, #9c3ae808 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1200px] mx-auto">
          {/* Header */}
          <div className="flex flex-col items-center justify-center text-center mb-10">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
              style={{
                background: "#3a9de815",
                border: "1px solid #3a9de840",
                color: "#3a9de8",
                boxShadow: "0 0 20px #3a9de820",
              }}
            >
              <Layers size={24} />
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight mb-2">
              Hub & Resources
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-lg">
              Stay updated with official announcements and access the essential
              toolkits required to build your projects.
            </p>
          </div>

          {/* Two Equal Panels Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* ── LEFT PANEL: NOTIFICATIONS ── */}
            <div className="flex flex-col h-[600px] lg:h-[650px]">
              <div
                className="rounded-2xl flex flex-col h-full overflow-hidden"
                style={{
                  background: "#0c0f18",
                  border: "1px solid #1e2330",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                {/* Panel Header */}
                <div
                  className="px-6 py-5 border-b border-slate-800/60 flex items-center justify-between shrink-0"
                  style={{ background: "#101520" }}
                >
                  <div className="flex items-center gap-2">
                    <Bell size={16} className="text-[#fbbf24]" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#fbbf24]">
                      Announcements
                    </span>
                  </div>
                  {notifications.length > 0 && (
                    <span className="bg-[#fbbf2420] text-[#fbbf24] text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {notifications.length} Updates
                    </span>
                  )}
                </div>

                {/* Panel Body (Scrollable) */}
                <div className="p-5 overflow-y-auto custom-scroll flex-1">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                      <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
                      <p className="text-[10px] uppercase tracking-widest text-slate-500">
                        Syncing Data...
                      </p>
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Bell
                        size={32}
                        className="mb-3 opacity-20 text-slate-500"
                      />
                      <div className="text-[11px] text-slate-500">
                        No new announcements right now.
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <AnimatePresence>
                        {notifications.map((notif, i) => {
                          const { icon, color } = getTypeConfig(notif.type);
                          return (
                            <motion.div
                              key={notif._id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: i * 0.05 }}
                              className="rounded-xl p-4 relative overflow-hidden transition-colors hover:bg-[#131925]/80"
                              style={{
                                background: "#101520",
                                border: "1px solid #1e2840",
                                borderLeft: `3px solid ${color}`,
                              }}
                            >
                              {notif.isPinned && (
                                <div className="absolute top-0 right-0 w-8 h-8 bg-blue-500/10 rounded-bl-full flex items-start justify-end p-1.5 border-l border-b border-blue-500/20">
                                  <Pin
                                    size={10}
                                    className="text-blue-400 rotate-45"
                                  />
                                </div>
                              )}
                              <div className="flex items-start gap-3">
                                <div
                                  className="mt-0.5 p-1.5 rounded-lg flex-shrink-0"
                                  style={{
                                    background: `${color}15`,
                                    color: color,
                                  }}
                                >
                                  {icon}
                                </div>
                                <div className="pr-4">
                                  <h3 className="font-display font-bold text-[14px] text-slate-100 leading-tight mb-1">
                                    {notif.title}
                                  </h3>
                                  <p className="text-[10px] text-slate-500 mb-3 tracking-wide">
                                    {new Date(
                                      notif.createdAt,
                                    ).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </p>
                                  <p className="font-sans text-[12px] text-slate-400 leading-relaxed whitespace-pre-wrap">
                                    {notif.message}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── RIGHT PANEL: RESOURCES ── */}
            <div className="flex flex-col h-[600px] lg:h-[650px]">
              <div
                className="rounded-2xl flex flex-col h-full overflow-hidden"
                style={{
                  background: "#0c0f18",
                  border: "1px solid #1e2330",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                }}
              >
                {/* Panel Header */}
                <div
                  className="px-6 py-5 border-b border-slate-800/60 flex items-center justify-between shrink-0"
                  style={{ background: "#101520" }}
                >
                  <div className="flex items-center gap-2">
                    <BookOpen size={16} className="text-[#3a9de8]" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#3a9de8]">
                      Project Toolkit
                    </span>
                  </div>
                </div>

                {/* Panel Body (Scrollable) */}
                <div className="p-5 overflow-y-auto custom-scroll flex-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                    {STATIC_RESOURCES.map((res, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-xl p-5 flex flex-col h-full transition-colors hover:bg-[#131925]/80"
                        style={{
                          background: "#101520",
                          border: "1px solid #1e2840",
                        }}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className="p-2 rounded-lg border border-[#1e2840]"
                            style={{ background: `${res.color}15` }}
                          >
                            {res.icon}
                          </div>
                          <span
                            className="text-[9px] uppercase tracking-widest px-2 py-1 rounded"
                            style={{
                              background: "#131925",
                              color: res.color,
                              border: "1px solid #1e2840",
                            }}
                          >
                            {res.category}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-[14px] text-slate-100 leading-tight mb-2">
                          {res.title}
                        </h3>
                        <p className="font-sans text-[12px] text-slate-400 leading-relaxed mb-4 flex-grow">
                          {res.description}
                        </p>

                        <div className="flex gap-2 mt-auto pt-4 border-t border-slate-800/60">
                          <a
                            href={res.link}
                            className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg py-2 transition-colors hover:text-white"
                            style={{
                              background: "#131925",
                              color: "#6b7a99",
                              border: "1px solid #1e2840",
                            }}
                          >
                            <Download size={12} /> Get
                          </a>
                          <a
                            href={res.link}
                            className="flex-1 flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg py-2 transition-colors"
                            style={{
                              background: `${res.color}15`,
                              color: res.color,
                              border: `1px solid ${res.color}30`,
                            }}
                          >
                            <ExternalLink size={12} /> View
                          </a>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Help Banner */}
                  <div className="mt-4 rounded-xl p-5 border border-dashed border-slate-700 bg-[#131925] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-center sm:text-left">
                      <div className="font-display font-bold text-[14px] text-white mb-1">
                        Need Mentorship?
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans">
                        Connect with coordinators on Discord.
                      </div>
                    </div>
                    <button className="shrink-0 text-[10px] font-bold uppercase tracking-widest bg-[#9c3ae8] hover:bg-[#8a2be2] text-white px-4 py-2.5 rounded-lg transition-colors">
                      Join Server
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resources;
