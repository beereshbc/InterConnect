import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Calendar,
  MapPin,
  Sparkles,
  Rocket,
  Medal,
  Coins,
} from "lucide-react";

// ─── Main Component (Event Hype Page) ─────────────────────────────────────────
const LeaderBoard = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500;700&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono    { font-family: 'DM Mono', monospace; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a3045; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #3a9de8; }
      `}</style>

      <div
        className="min-h-screen font-mono py-10 px-4 sm:px-8 relative overflow-hidden flex items-center justify-center"
        style={{ color: "#f0f4ff" }}
      >
        {/* Ambient Background Glows */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, #fbbf240a 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, #3a9de808 0%, transparent 70%)",
            }}
          />
        </div>

        <div className="relative z-10 w-full max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="rounded-2xl p-8 sm:p-12 text-center shadow-2xl relative overflow-hidden"
            style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
          >
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-500" />

            {/* Trophy Icon */}
            <div className="flex justify-center mb-6">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "#fbbf2415",
                  border: "1px solid #fbbf2440",
                  color: "#fbbf24",
                  boxShadow: "0 0 30px #fbbf2420",
                }}
              >
                <Trophy size={32} />
              </div>
            </div>

            {/* Main Hype Text */}
            <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight mb-6 text-white">
              The Big Reveal is Coming!
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
              The leaderboard will be published on the event day, and your
              points will update as it is. Stay tuned! You are in the top, so
              keep working hard to stay on top.
              <br />
              <span className="font-bold text-blue-400">Happy coding!</span>
            </p>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8">
              <div className="p-5 rounded-xl border border-slate-800/60 bg-[#101520] flex items-start gap-4">
                <Calendar
                  className="text-emerald-400 flex-shrink-0 mt-1"
                  size={24}
                />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                    Date & Time
                  </div>
                  <div className="font-display font-bold text-lg text-slate-200">
                    21st April
                  </div>
                  <div className="text-sm text-slate-400">
                    Morning, 10:30 AM
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border border-slate-800/60 bg-[#101520] flex items-start gap-4">
                <MapPin
                  className="text-purple-400 flex-shrink-0 mt-1"
                  size={24}
                />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                    Venue
                  </div>
                  <div className="font-display font-bold text-lg text-slate-200">
                    GM Halamma
                  </div>
                  <div className="text-sm text-slate-400">Auditorium</div>
                </div>
              </div>
            </div>

            {/* Announcement Box */}
            <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/5 flex flex-col gap-4 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="text-blue-400" size={20} />
                  <h3 className="font-display font-bold text-xl text-blue-100">
                    Top Recognition & Future Events
                  </h3>
                  <Sparkles className="text-blue-400" size={20} />
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">
                  Come and make this event a success! The{" "}
                  <span className="font-extrabold text-white bg-blue-500/20 px-2 py-0.5 rounded">
                    Top 5+ Contributors and Projects
                  </span>{" "}
                  will be announced live on the event day, featuring:
                </p>

                {/* Prize Highlights */}
                <div className="flex flex-wrap justify-center gap-3 mb-2">
                  <div className="flex items-center gap-2 bg-[#131925] border border-yellow-500/30 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.1)]">
                    <Coins className="text-yellow-400" size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-yellow-200">
                      Cash Prizes
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#131925] border border-amber-500/30 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                    <Trophy className="text-amber-500" size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-amber-200">
                      Trophies
                    </span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#131925] border border-slate-400/30 px-3 py-1.5 rounded-full shadow-[0_0_10px_rgba(148,163,184,0.1)]">
                    <Medal className="text-slate-300" size={16} />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-slate-200">
                      Medals
                    </span>
                  </div>
                </div>
              </div>

              {/* Special highlight for industry-level events */}
              <div className="mt-4 inline-flex items-center justify-center gap-3 bg-[#0c0f18] border border-emerald-500/30 rounded-lg p-3 mx-auto shadow-[0_0_15px_rgba(52,211,153,0.1)] w-full sm:w-auto">
                <Rocket className="text-emerald-400 flex-shrink-0" size={18} />
                <p className="text-emerald-300 text-[13px] font-semibold tracking-wide text-left sm:text-center">
                  PLUS: We will announce Global open-source events designed for
                  industry-level recognition!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LeaderBoard;
// import React, { useState, useEffect, useCallback } from "react";
// import { motion } from "framer-motion";
// import { useAppContext } from "../context/AppContext";
// import {
//   Trophy,
//   Crown,
//   Star,
//   ChevronLeft,
//   ChevronRight,
//   Target,
//   Building,
//   TrendingUp,
//   Activity,
// } from "lucide-react";

// // ─── Helpers ──────────────────────────────────────────────────────────────────
// const initials = (name = "") =>
//   name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .toUpperCase()
//     .slice(0, 2);

// const PALETTE = [
//   "#e85d3a",
//   "#3a9de8",
//   "#9c3ae8",
//   "#e8a33a",
//   "#3ae87c",
//   "#e83a8c",
// ];
// const avatarBg = (name = "") => {
//   let h = 0;
//   for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h);
//   return PALETTE[Math.abs(h) % PALETTE.length];
// };

// const Avatar = ({ name = "", size = 36 }) => (
//   <div
//     className="rounded-full flex items-center justify-center font-bold text-white font-mono flex-shrink-0"
//     style={{
//       width: size,
//       height: size,
//       background: avatarBg(name),
//       fontSize: size * 0.35,
//     }}
//   >
//     {initials(name)}
//   </div>
// );

// // ─── Main Component ───────────────────────────────────────────────────────────
// const LeaderBoard = () => {
//   const { axios, studentToken } = useAppContext();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);

//   const fetchLeaderboard = useCallback(async () => {
//     if (!studentToken) return;
//     setLoading(true);
//     try {
//       // UPDATED: Changed limit from 100 to 20
//       const res = await axios.get(
//         `/api/student/leaderboard?page=${page}&limit=20`,
//         {
//           headers: { Authorization: `Bearer ${studentToken}` },
//         },
//       );
//       if (res.data.success) {
//         setData(res.data);
//       }
//     } catch (err) {
//       console.error("Failed to load leaderboard");
//     } finally {
//       setLoading(false);
//     }
//   }, [axios, studentToken, page]);

//   useEffect(() => {
//     fetchLeaderboard();
//   }, [fetchLeaderboard]);

//   const {
//     leaderboard = [],
//     topProject,
//     topCoordinator,
//     pagination,
//   } = data || {};

//   return (
//     <>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500;700&display=swap');
//         .font-display { font-family: 'Syne', sans-serif; }
//         .font-mono    { font-family: 'DM Mono', monospace; }
//         ::-webkit-scrollbar { width: 5px; height: 5px; }
//         ::-webkit-scrollbar-track { background: transparent; }
//         ::-webkit-scrollbar-thumb { background: #2a3045; border-radius: 3px; }
//         ::-webkit-scrollbar-thumb:hover { background: #3a9de8; }
//       `}</style>

//       <div
//         className="min-h-screen font-mono py-10 px-4 sm:px-8 relative overflow-hidden"
//         style={{ background: "", color: "#f0f4ff" }}
//       >
//         {/* Ambient Background Glows */}
//         <div className="fixed inset-0 pointer-events-none z-0">
//           <div
//             className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full"
//             style={{
//               background:
//                 "radial-gradient(circle, #fbbf240a 0%, transparent 70%)",
//             }}
//           />
//           <div
//             className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full"
//             style={{
//               background:
//                 "radial-gradient(circle, #3a9de808 0%, transparent 70%)",
//             }}
//           />
//         </div>

//         <div className="relative z-10 max-w-[1400px] mx-auto">
//           {/* Header */}
//           <div className="flex flex-col items-center justify-center text-center mb-10">
//             <div
//               className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
//               style={{
//                 background: "#fbbf2415",
//                 border: "1px solid #fbbf2440",
//                 color: "#fbbf24",
//                 boxShadow: "0 0 20px #fbbf2420",
//               }}
//             >
//               <Trophy size={24} />
//             </div>
//             <h1 className="font-display font-extrabold text-3xl sm:text-4xl tracking-tight mb-2">
//               Global Network Rankings
//             </h1>
//             <p className="text-slate-400 text-xs sm:text-sm max-w-lg">
//               Compete, collaborate, and rise through the ranks. Track the most
//               impactful contributors and projects of InterConnect 26.0.
//             </p>
//           </div>

//           {loading && !data ? (
//             <div className="flex flex-col items-center justify-center h-64 gap-4">
//               <div className="w-8 h-8 rounded-full border-2 border-slate-700 border-t-blue-500 animate-spin" />
//               <p className="text-[11px] uppercase tracking-widest text-slate-500">
//                 Compiling Network Data...
//               </p>
//             </div>
//           ) : (
//             // Removed the grid layout to allow the leaderboard to be a single centered element
//             <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 items-center">
//               {/* ── LEFT PANEL: TOP PROJECT (COMMENTED OUT) ── */}
//               {/* <div className="lg:col-span-1 flex flex-col gap-6 w-full">
//                 <div
//                   className="rounded-2xl p-6"
//                   style={{
//                     background: "#0c0f18",
//                     border: "1px solid #1e2330",
//                     boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
//                   }}
//                 >
//                   <div className="flex items-center gap-2 mb-4">
//                     <Target size={16} className="text-emerald-400" />
//                     <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
//                       Project of the Week
//                     </span>
//                   </div>

//                   {topProject ? (
//                     <div>
//                       <div className="font-mono text-[10px] text-slate-500 mb-1">
//                         {topProject.projectID}
//                       </div>
//                       <div className="font-display font-bold text-lg leading-tight mb-4 text-slate-100">
//                         {topProject.problemTitle}
//                       </div>
//                       <div
//                         className="inline-block px-2 py-1 rounded text-[9px] uppercase tracking-widest mb-5"
//                         style={{
//                           background: "#131925",
//                           border: "1px solid #1e2840",
//                           color: "#9c3ae8",
//                         }}
//                       >
//                         {topProject.theme}
//                       </div>
//                       <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
//                         <div>
//                           <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">
//                             Yield
//                           </div>
//                           <div className="font-display font-extrabold text-emerald-400 text-lg">
//                             +{topProject.weekPoints}{" "}
//                             <span className="text-[10px] font-mono">pts</span>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">
//                             Velocity
//                           </div>
//                           <div className="font-display font-extrabold text-slate-300 text-lg">
//                             {topProject.weekTasks}{" "}
//                             <span className="text-[10px] font-mono">tasks</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <Activity size={24} className="mx-auto mb-2 opacity-20" />
//                       <div className="text-[11px] text-slate-500">
//                         No project activity this week yet.
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//               */}

//               {/* ── CENTER PANEL: LEADERBOARD ── */}
//               <div
//                 className="w-full rounded-2xl overflow-hidden shadow-2xl"
//                 style={{ background: "#0c0f18", border: "1px solid #1e2330" }}
//               >
//                 <div
//                   className="px-6 py-4 flex items-center justify-between border-b border-slate-800/60"
//                   style={{ background: "#101520" }}
//                 >
//                   <div className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
//                     Top Contributors
//                   </div>
//                   <div className="text-[10px] text-slate-500">
//                     Page {pagination?.page} of {pagination?.totalPages}
//                   </div>
//                 </div>

//                 <div className="divide-y divide-slate-800/40">
//                   {leaderboard.length === 0 ? (
//                     <div className="text-center py-16 text-slate-500 text-[12px]">
//                       No contributors found.
//                     </div>
//                   ) : (
//                     leaderboard.map((student, idx) => {
//                       const rank =
//                         (pagination.page - 1) * pagination.limit + idx + 1;

//                       // Theme logic based on Rank
//                       let rowStyle = {
//                         background: "transparent",
//                         borderLeft: "3px solid transparent",
//                       };
//                       let rankColor = "#6b7a99";
//                       let scoreColor = "#c4cedf";

//                       if (rank === 1) {
//                         rowStyle = {
//                           background: "#fbbf2410",
//                           borderLeft: "3px solid #fbbf24",
//                         };
//                         rankColor = "#fbbf24";
//                         scoreColor = "#fbbf24";
//                       } else if (rank === 2) {
//                         rowStyle = {
//                           background: "#9ca3af10",
//                           borderLeft: "3px solid #9ca3af",
//                         };
//                         rankColor = "#9ca3af";
//                         scoreColor = "#9ca3af";
//                       } else if (rank === 3) {
//                         rowStyle = {
//                           background: "#b4530910",
//                           borderLeft: "3px solid #b45309",
//                         };
//                         rankColor = "#b45309";
//                         scoreColor = "#b45309";
//                       } else if (rank <= 10) {
//                         rowStyle = {
//                           background: "#fbbf2405",
//                           borderLeft: "3px solid #fbbf2450",
//                         };
//                         rankColor = "#fbbf24";
//                         scoreColor = "#e2e8f0";
//                       } else if (rank <= 25) {
//                         rowStyle = {
//                           background: "#3a9de805",
//                           borderLeft: "3px solid #3a9de850",
//                         };
//                         rankColor = "#3a9de8";
//                         scoreColor = "#e2e8f0";
//                       }

//                       return (
//                         <motion.div
//                           key={student._id}
//                           initial={{ opacity: 0, y: 5 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           transition={{ delay: idx * 0.01 }}
//                           className="flex items-center gap-3 sm:gap-4 px-4 sm:px-6 py-3 sm:py-4 transition-colors hover:bg-slate-900/40"
//                           style={rowStyle}
//                         >
//                           <div className="w-6 sm:w-8 flex-shrink-0 text-center">
//                             {rank <= 3 ? (
//                               <span className="text-lg sm:text-xl drop-shadow-lg">
//                                 {["🥇", "🥈", "🥉"][rank - 1]}
//                               </span>
//                             ) : (
//                               <span
//                                 className="font-display font-extrabold text-[12px] sm:text-[14px]"
//                                 style={{ color: rankColor }}
//                               >
//                                 #{rank}
//                               </span>
//                             )}
//                           </div>

//                           <Avatar name={student.name} size={32} />

//                           <div className="flex-1 min-w-0">
//                             <div className="font-display font-bold text-[13px] sm:text-[14px] text-slate-100 truncate flex items-center gap-2">
//                               {student.name}
//                               {rank <= 10 && (
//                                 <Star
//                                   size={10}
//                                   fill={rankColor}
//                                   color={rankColor}
//                                 />
//                               )}
//                             </div>

//                             {/* UPDATED: Program and Department Display */}
//                             <div className="flex items-center gap-2 mt-0.5 font-mono text-[9px] sm:text-[10px] text-slate-500 truncate">
//                               {student.program && student.department ? (
//                                 <>
//                                   <span className="font-semibold text-slate-400">
//                                     {student.program}
//                                   </span>
//                                   <span className="hidden sm:inline">
//                                     · {student.department}
//                                   </span>
//                                 </>
//                               ) : student.program ? (
//                                 <span className="font-semibold text-slate-400">
//                                   {student.program}
//                                 </span>
//                               ) : student.department ? (
//                                 <span>{student.department}</span>
//                               ) : (
//                                 <span>Contributor</span>
//                               )}
//                             </div>
//                           </div>

//                           <div className="text-right flex-shrink-0">
//                             <div
//                               className="font-display font-extrabold text-[14px] sm:text-[18px]"
//                               style={{ color: scoreColor }}
//                             >
//                               {student.totalScore}
//                             </div>
//                             <div className="font-mono text-[8px] uppercase tracking-widest text-slate-600 mt-0.5">
//                               {student.totalTasksCompleted} Tasks
//                             </div>
//                           </div>
//                         </motion.div>
//                       );
//                     })
//                   )}
//                 </div>

//                 {/* Pagination */}
//                 {pagination?.totalPages > 1 && (
//                   <div
//                     className="flex items-center justify-between px-6 py-4 border-t border-slate-800/60"
//                     style={{ background: "#101520" }}
//                   >
//                     <button
//                       disabled={page === 1 || loading}
//                       onClick={() => setPage((p) => Math.max(1, p - 1))}
//                       className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
//                     >
//                       <ChevronLeft size={14} /> Prev
//                     </button>
//                     <div className="flex gap-1">
//                       {(() => {
//                         const total = pagination.totalPages || 1;
//                         const maxVisiblePages = Math.min(5, total);
//                         let startPage = Math.max(1, page - 2);

//                         // If we're near the end, adjust the start page so we don't exceed totalPages
//                         if (startPage + maxVisiblePages - 1 > total) {
//                           startPage = Math.max(1, total - maxVisiblePages + 1);
//                         }

//                         return Array.from(
//                           { length: maxVisiblePages },
//                           (_, i) => startPage + i,
//                         ).map((pageNum) => (
//                           <button
//                             key={pageNum}
//                             onClick={() => setPage(pageNum)}
//                             className="w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold transition-colors"
//                             style={{
//                               background:
//                                 page === pageNum ? "#3a9de8" : "transparent",
//                               color: page === pageNum ? "#fff" : "#6b7a99",
//                               border:
//                                 page === pageNum ? "none" : "1px solid #1e2330",
//                             }}
//                           >
//                             {pageNum}
//                           </button>
//                         ));
//                       })()}
//                     </div>
//                     <button
//                       disabled={page === pagination.totalPages || loading}
//                       onClick={() =>
//                         setPage((p) => Math.min(pagination.totalPages, p + 1))
//                       }
//                       className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
//                     >
//                       Next <ChevronRight size={14} />
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* ── RIGHT PANEL: TOP COORDINATOR (COMMENTED OUT) ── */}
//               {/* <div className="lg:col-span-1 flex flex-col gap-6 w-full">
//                 <div
//                   className="rounded-2xl p-6"
//                   style={{
//                     background: "#0c0f18",
//                     border: "1px solid #1e2330",
//                     boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
//                   }}
//                 >
//                   <div className="flex items-center gap-2 mb-4">
//                     <Crown size={16} className="text-blue-400" />
//                     <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">
//                       Coordinator of the Week
//                     </span>
//                   </div>

//                   {topCoordinator ? (
//                     <div>
//                       <div className="flex items-center gap-3 mb-4">
//                         <Avatar name={topCoordinator.name} size={42} />
//                         <div>
//                           <div className="font-display font-bold text-[15px] text-slate-100">
//                             {topCoordinator.name}
//                           </div>
//                           <div className="font-mono text-[9px] text-slate-500 mt-0.5">
//                             {topCoordinator.college || "Organization Admin"}
//                           </div>
//                         </div>
//                       </div>

//                       <div
//                         className="p-3 rounded-xl mb-2"
//                         style={{
//                           background: "#131925",
//                           border: "1px solid #1e2840",
//                         }}
//                       >
//                         <div className="text-[9px] uppercase tracking-widest text-slate-500 mb-1">
//                           Impact Generated
//                         </div>
//                         <div className="font-display font-extrabold text-blue-400 text-xl">
//                           {topCoordinator.weekPoints}{" "}
//                           <span className="text-[10px] font-mono">pts</span>
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between px-1 mt-3">
//                         <span className="text-[10px] font-mono text-slate-500">
//                           Tasks Closed
//                         </span>
//                         <span className="font-display font-bold text-sm text-slate-300">
//                           {topCoordinator.weekTasks}
//                         </span>
//                       </div>
//                     </div>
//                   ) : (
//                     <div className="text-center py-8">
//                       <Building size={24} className="mx-auto mb-2 opacity-20" />
//                       <div className="text-[11px] text-slate-500">
//                         No admin activity this week yet.
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <div className="rounded-2xl p-5 border border-dashed border-slate-800/60 bg-transparent flex flex-col items-center justify-center text-center opacity-60">
//                   <TrendingUp size={20} className="text-slate-600 mb-2" />
//                   <p className="text-[10px] font-mono text-slate-500">
//                     Stats reset every Monday at 00:00 IST. Keep building!
//                   </p>
//                 </div>
//               </div>
//               */}
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default LeaderBoard;
