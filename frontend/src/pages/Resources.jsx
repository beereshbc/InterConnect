import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  Bell,
  BookOpen,
  Pin,
  AlertCircle,
  CheckCircle,
  Clock,
  Info,
  Youtube,
  FileText,
  Download,
  ExternalLink,
  Layers,
  Play,
} from "lucide-react";

// ─── Main Component ───────────────────────────────────────────────────────────
const Resources = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoReady, setVideoReady] = useState(false);

  // Fetch published notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
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

  // YouTube video ID
  const YOUTUBE_VIDEO_ID = "apGV9Kg7ics";
  const YOUTUBE_THUMB = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500;700&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono    { font-family: 'DM Mono', monospace; }

        /* Custom Scrollbar */
        .custom-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #2a3045; border-radius: 3px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: #3a9de8; }

        /* YouTube thumbnail fade */
        .yt-thumb-overlay {
          background: linear-gradient(135deg, rgba(10,13,22,0.55) 0%, rgba(10,13,22,0.3) 100%);
          transition: background 0.25s ease;
        }
        .yt-thumb-overlay:hover {
          background: linear-gradient(135deg, rgba(10,13,22,0.2) 0%, rgba(10,13,22,0.1) 100%);
        }
        .yt-play-btn {
          transition: transform 0.22s cubic-bezier(.34,1.56,.64,1), box-shadow 0.22s ease;
        }
        .yt-play-btn:hover {
          transform: scale(1.13);
          box-shadow: 0 0 32px #ff000060;
        }

        /* PDF card shimmer line */
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .pdf-shimmer::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.04), transparent);
          animation: shimmer 2.8s infinite;
        }

        /* Iframe responsive */
        .video-iframe-wrapper {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          border-radius: 12px;
        }
        .video-iframe-wrapper iframe {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 100%;
          border: none;
          border-radius: 12px;
        }
      `}</style>

      <div
        className="min-h-screen font-mono pt-24 pb-10 px-4 sm:px-8 relative overflow-hidden"
        style={{ background: "#080b14", color: "#f0f4ff" }}
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
          {/* ── Page Header ── */}
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

          {/* ── Two-Panel Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* ════ LEFT PANEL: NOTIFICATIONS ════ */}
            <div className="flex flex-col h-[600px] lg:h-[700px]">
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

                {/* Panel Body */}
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
                                  style={{ background: `${color}15`, color }}
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

            {/* ════ RIGHT PANEL: PROJECT TOOLKIT ════ */}
            <div className="flex flex-col h-[600px] lg:h-[700px]">
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
                  <span
                    className="text-[9px] font-mono px-2 py-0.5 rounded-full uppercase tracking-wider"
                    style={{
                      background: "#3a9de820",
                      color: "#3a9de8",
                      border: "1px solid #3a9de830",
                    }}
                  >
                    2 Resources
                  </span>
                </div>

                {/* Panel Body */}
                <div className="p-5 overflow-y-auto custom-scroll flex-1 flex flex-col gap-5">
                  {/* ── 1. YouTube Tutorial Card ── */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="rounded-xl overflow-hidden flex flex-col"
                    style={{
                      background: "#101520",
                      border: "1px solid #1e2840",
                    }}
                  >
                    {/* Card Header */}
                    <div className="px-4 pt-4 pb-3 flex items-center gap-3 border-b border-slate-800/50">
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          background: "#ff000018",
                          border: "1px solid #ff000030",
                        }}
                      >
                        <Youtube size={16} className="text-[#ff4545]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold text-[13px] text-slate-100 leading-tight truncate">
                          Git & GitHub — Version Control Tutorial
                        </h3>
                        <p className="text-[10px] text-slate-500 mt-0.5 tracking-wide">
                          YouTube · Official InterConnect Resource
                        </p>
                      </div>
                      <span
                        className="shrink-0 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded"
                        style={{
                          background: "#ff000018",
                          color: "#ff4545",
                          border: "1px solid #ff000025",
                        }}
                      >
                        Video
                      </span>
                    </div>

                    {/* Thumbnail / Embed Toggle */}
                    <div className="px-4 pt-4 pb-2">
                      {!videoReady ? (
                        /* Thumbnail Clickable Preview */
                        <div
                          className="relative rounded-xl overflow-hidden cursor-pointer group"
                          style={{ aspectRatio: "16/9" }}
                          onClick={() => setVideoReady(true)}
                        >
                          <img
                            src={YOUTUBE_THUMB}
                            alt="Video thumbnail"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = `https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/hqdefault.jpg`;
                            }}
                          />
                          {/* Overlay */}
                          <div className="yt-thumb-overlay absolute inset-0" />
                          {/* Play Button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div
                              className="yt-play-btn w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
                              style={{
                                background: "#ff0000ee",
                                boxShadow: "0 0 24px #ff000050",
                              }}
                            >
                              <Play
                                size={22}
                                fill="white"
                                className="text-white ml-1"
                              />
                            </div>
                          </div>
                          {/* Click to play hint */}
                          <div
                            className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-widest px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                              background: "#000000aa",
                              color: "#ffffffcc",
                            }}
                          >
                            Click to play
                          </div>
                        </div>
                      ) : (
                        /* Actual iframe embed */
                        <div className="video-iframe-wrapper">
                          <iframe
                            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1`}
                            title="Git & GitHub Version Control Tutorial"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}
                    </div>

                    {/* Description + Action */}
                    <div className="px-4 pb-4 pt-2">
                      <p className="font-sans text-[11px] text-slate-400 leading-relaxed mb-3">
                        Learn the fundamentals of version control using Git and
                        GitHub — covering commits, branches, pull requests, and
                        collaborative workflows essential for InterConnect 26.O.
                      </p>
                      <a
                        href={`https://youtu.be/${YOUTUBE_VIDEO_ID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg px-3 py-2 transition-colors hover:opacity-80"
                        style={{
                          background: "#ff000018",
                          color: "#ff4545",
                          border: "1px solid #ff000030",
                        }}
                      >
                        <ExternalLink size={11} /> Open on YouTube
                      </a>
                    </div>
                  </motion.div>

                  {/* ── 2. Rulebook PDF Card ── */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="rounded-xl overflow-hidden relative pdf-shimmer flex flex-col"
                    style={{
                      background: "#101520",
                      border: "1px solid #1e2840",
                    }}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5">
                      {/* PDF Icon Block */}
                      <div
                        className="shrink-0 w-14 h-16 sm:w-12 sm:h-14 rounded-xl flex flex-col items-center justify-center relative overflow-hidden"
                        style={{
                          background:
                            "linear-gradient(145deg, #1e2840 0%, #131925 100%)",
                          border: "1px solid #2a3a55",
                        }}
                      >
                        {/* Folded corner */}
                        <div
                          className="absolute top-0 right-0 w-4 h-4"
                          style={{
                            background: "#0c0f18",
                            clipPath: "polygon(100% 0, 0 0, 100% 100%)",
                            borderLeft: "1px solid #2a3a55",
                            borderBottom: "1px solid #2a3a55",
                          }}
                        />
                        <FileText size={22} className="text-[#e84040]" />
                        <span
                          className="text-[7px] font-bold mt-1 tracking-widest"
                          style={{ color: "#e84040" }}
                        >
                          PDF
                        </span>
                      </div>

                      {/* Text Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-display font-bold text-[14px] text-slate-100 leading-tight">
                            InterConnect 26.O — Official Rulebook
                          </h3>
                          <span
                            className="text-[8px] uppercase tracking-widest px-2 py-0.5 rounded font-bold"
                            style={{
                              background: "#e8404018",
                              color: "#e84040",
                              border: "1px solid #e8404030",
                            }}
                          >
                            Rulebook
                          </span>
                        </div>
                        <p className="font-sans text-[11px] text-slate-400 leading-relaxed mb-3">
                          The complete official guidelines, judging criteria,
                          submission rules, and code-of-conduct for all
                          participants of InterConnect 26.O. Read before you
                          build.
                        </p>

                        {/* Meta Tags */}
                        <div className="flex items-center gap-3 flex-wrap mb-4">
                          {[
                            { label: "Format", value: "PDF" },
                            { label: "Edition", value: "26.O" },
                            {
                              label: "Status",
                              value: "Official",
                              highlight: true,
                            },
                          ].map((tag) => (
                            <div
                              key={tag.label}
                              className="flex items-center gap-1"
                            >
                              <span className="text-[9px] uppercase tracking-wider text-slate-600">
                                {tag.label}:
                              </span>
                              <span
                                className="text-[9px] font-bold tracking-wider"
                                style={{
                                  color: tag.highlight ? "#4ade80" : "#6b7a99",
                                }}
                              >
                                {tag.value}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <a
                            href="/rulebook-interconnect-26.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg px-3 py-2 transition-opacity hover:opacity-80"
                            style={{
                              background: "#e8404015",
                              color: "#e84040",
                              border: "1px solid #e8404030",
                            }}
                          >
                            <ExternalLink size={11} /> Preview
                          </a>
                          <a
                            href="/rulebook-interconnect-26.pdf"
                            download="InterConnect-26.O-Rulebook.pdf"
                            className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest rounded-lg px-3 py-2 transition-opacity hover:opacity-80"
                            style={{
                              background: "#131925",
                              color: "#6b7a99",
                              border: "1px solid #1e2840",
                            }}
                          >
                            <Download size={11} /> Download
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Bottom bar with warning */}
                    <div
                      className="px-5 py-3 flex items-center gap-2 border-t border-slate-800/50"
                      style={{ background: "#0c0f18" }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: "#4ade80" }}
                      />
                      <p className="text-[10px] text-slate-500 font-sans">
                        Carefully read all rules before starting your project
                        submission.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            {/* ════ END RIGHT PANEL ════ */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Resources;
