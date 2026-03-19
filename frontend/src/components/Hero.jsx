/**
 * Hero.jsx
 * Full-viewport hero section for InterConnect 26.O followed by Event Details
 * Clean, formal, responsive — unified with ManageProjects theme.
 * Requires: framer-motion, react-router-dom, lucide-react
 */

import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  ChevronDown,
  Users,
  Layers,
  Award,
  Calendar,
  Lightbulb,
  Target,
  CheckCircle,
  ExternalLink,
  Sparkles,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ─── tiny animated counter ─── */
const Counter = ({ end, duration = 1800 }) => {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let start = 0;
          const step = end / (duration / 16);
          const tick = () => {
            start += step;
            if (start >= end) {
              setVal(end);
              return;
            }
            setVal(Math.floor(start));
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{val.toLocaleString()}</span>;
};

/* ─── stat pill ─── */
const Stat = ({ icon: Icon, value, suffix = "", label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "12px 18px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 10,
      flex: "1 1 160px",
      minWidth: 0,
    }}
  >
    <div
      style={{
        width: 32,
        height: 32,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(59,91,219,0.12)",
        border: "1px solid rgba(59,91,219,0.2)",
        borderRadius: 7,
        flexShrink: 0,
      }}
    >
      <Icon size={15} color="#6080f5" strokeWidth={1.8} />
    </div>
    <div style={{ minWidth: 0 }}>
      <p
        style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 700,
          color: "#e2e8f0",
          lineHeight: 1.1,
          fontFamily: "'DM Mono', monospace",
        }}
      >
        <Counter end={value} />
        {suffix}
      </p>
      <p
        style={{
          margin: "2px 0 0",
          fontSize: 11,
          color: "#4e5e7a",
          fontWeight: 500,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </p>
    </div>
  </motion.div>
);

/* ─── main component ─── */
const Hero = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 90]);
  const opacity = useTransform(scrollY, [0, 320], [1, 0]);

  /* grid dots canvas */
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const dots = [];
    const count = Math.floor((canvas.width * canvas.height) / 6000);
    for (let i = 0; i < count; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 0.8 + 0.3,
        a: Math.random(),
        da: (Math.random() - 0.5) * 0.005,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      dots.forEach((d) => {
        d.a = Math.max(0.05, Math.min(0.45, d.a + d.da));
        if (d.a <= 0.05 || d.a >= 0.45) d.da *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96,128,245,${d.a})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className=" min-h-screen text-[#f0f4ff] font-sans selection:bg-[#3a9de8] selection:text-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono    { font-family: 'DM Mono', monospace; }

        .ic-hero * { box-sizing: border-box; }
        .ic-hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 80px 24px 60px; overflow: hidden; }

        .ic-badge { display: inline-flex; align-items: center; gap: 7px; padding: 5px 12px; background: rgba(59,91,219,0.08); border: 1px solid rgba(59,91,219,0.18); border-radius: 6px; font-family: 'DM Mono', monospace; font-size: 10.5px; font-weight: 500; color: #6080f5; letter-spacing: 0.08em; text-transform: uppercase; }
        .ic-badge__dot { width: 5px; height: 5px; border-radius: 50%; background: #6080f5; animation: ic-pulse 2s ease-in-out infinite; }
        @keyframes ic-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(0.7)} }

        .ic-title { font-family: 'Syne', sans-serif; font-size: clamp(38px, 7.5vw, 84px); font-weight: 800; color: #e8edf5; line-height: 1.06; letter-spacing: -0.03em; margin: 0; text-align: center; }
        .ic-title__year { color: #3b5bdb; position: relative; }
        .ic-title__year::after { content: ''; position: absolute; bottom: 4px; left: 0; right: 0; height: 2px; background: #3b5bdb; border-radius: 2px; opacity: 0.5; }

        .ic-rule { width: 40px; height: 1px; background: rgba(59,91,219,0.35); border-radius: 1px; }

        .ic-subtitle { font-family: 'DM Sans', sans-serif; font-size: clamp(14px, 2vw, 16px); color: #8892a4; font-weight: 400; text-align: center; max-width: 480px; line-height: 1.7; margin: 0; }

        .ic-institution { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.15em; color: #4e5a72; text-transform: uppercase; text-align: center; }

        .ic-cta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .ic-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 11px 24px; background: #1a2d7a; border: 1px solid #2d4399; border-radius: 8px; color: #a5b8f8; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.18s; text-decoration: none; }
        .ic-btn-primary:hover { background: #203291; border-color: #3b5bdb; color: #c5d0fb; transform: translateY(-1px); }
        .ic-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 11px 24px; background: transparent; border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; color: #6b7a99; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s; text-decoration: none; }
        .ic-btn-ghost:hover { border-color: rgba(255,255,255,0.14); color: #8a9ab8; background: rgba(255,255,255,0.02); }

        .ic-stats { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; width: 100%; max-width: 720px; }

        .ic-divider { width: 100%; max-width: 720px; height: 1px; background: linear-gradient(90deg, transparent, rgba(59,91,219,0.15) 30%, rgba(59,91,219,0.15) 70%, transparent); }

        .ic-scroll { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .ic-scroll__label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.15em; color: #4e5a72; text-transform: uppercase; }
        .ic-scroll__icon { animation: ic-scroll-bounce 2s ease-in-out infinite; }
        @keyframes ic-scroll-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }

        .ic-line-h { position: absolute; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(59,91,219,0.08) 20%, rgba(59,91,219,0.08) 80%, transparent); pointer-events: none; }
        .ic-line-v { position: absolute; top: 0; bottom: 0; width: 1px; background: linear-gradient(180deg, transparent, rgba(59,91,219,0.06) 20%, rgba(59,91,219,0.06) 80%, transparent); pointer-events: none; }

        /* Responsive */
        @media (max-width: 640px) {
          .ic-hero { padding: 100px 16px 80px; }
          .ic-stats { gap: 8px; }
        }
      `}</style>

      {/* ─── 1. HERO SECTION ─── */}
      <section className="ic-hero" ref={containerRef}>
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />

        <div className="ic-line-h" style={{ top: "22%" }} />
        <div className="ic-line-h" style={{ bottom: "22%" }} />
        <div className="ic-line-v" style={{ left: "12%" }} />
        <div className="ic-line-v" style={{ right: "12%" }} />

        {[
          ["top:40px", "left:40px"],
          ["top:40px", "right:40px"],
          ["bottom:60px", "left:40px"],
          ["bottom:60px", "right:40px"],
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              [pos[0].split(":")[0]]: pos[0].split(":")[1],
              [pos[1].split(":")[0]]: pos[1].split(":")[1],
              width: 12,
              height: 12,
              borderTop: i < 2 ? "1px solid rgba(59,91,219,0.2)" : "none",
              borderBottom: i >= 2 ? "1px solid rgba(59,91,219,0.2)" : "none",
              borderLeft:
                i === 0 || i === 2 ? "1px solid rgba(59,91,219,0.2)" : "none",
              borderRight:
                i === 1 || i === 3 ? "1px solid rgba(59,91,219,0.2)" : "none",
              pointerEvents: "none",
            }}
          />
        ))}

        <motion.div
          style={{
            y,
            opacity,
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 22,
            width: "100%",
            maxWidth: 800,
          }}
        >
          {/* ADDED LOGO HERE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="flex justify-center"
          >
            <img
              src="/public/ibg.png" // <-- REPLACE WITH YOUR ACTUAL LOGO PATH
              alt="InterConnect Logo"
              className="w-16 md:w-40 lg:w-52 h-auto object-contain drop-shadow-[0_0_15px_rgba(59,91,219,0.3)]"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="ic-badge">
              <span className="ic-badge__dot" />
              Annual Flagship Event&nbsp;&nbsp;·&nbsp;&nbsp;2026
            </div>
          </motion.div>

          <motion.h1
            className="ic-title mt-[-10px] text-xs" // slight negative margin to pull it closer to the logo
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            InterConnect&nbsp;
            <span className="ic-title__year">26.O</span>
          </motion.h1>

          <motion.div
            className="ic-rule"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          />
          <motion.p
            className="ic-subtitle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            An inter-disciplinary project management community where engineers,
            designers, and innovators solve real-world challenges together.
          </motion.p>

          <motion.p
            className="ic-institution"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            GMIT&nbsp;&nbsp;·&nbsp;&nbsp;GMU&nbsp;&nbsp;·&nbsp;&nbsp;Davangere
          </motion.p>

          <motion.div
            className="ic-cta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            <Link to="/problems" className="ic-btn-primary">
              Explore Problems <ArrowRight size={14} strokeWidth={2} />
            </Link>
            <Link to="/register" className="ic-btn-ghost">
              Join the Network
            </Link>
          </motion.div>

          <motion.div
            className="ic-divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          />

          <div className="ic-stats">
            <Stat
              icon={Users}
              value={1200}
              suffix="+"
              label="Registered Students"
              delay={0.6}
            />
            <Stat
              icon={Layers}
              value={84}
              label="Problem Statements"
              delay={0.68}
            />
            <Stat
              icon={Award}
              value={36}
              label="Projects Completed"
              delay={0.76}
            />
            <Stat
              icon={Calendar}
              value={3}
              suffix=" yrs"
              label="Consecutive Editions"
              delay={0.84}
            />
          </div>
        </motion.div>

        <motion.div
          className="ic-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="ic-scroll__label">Scroll to Discover</span>
          <ChevronDown
            className="ic-scroll__icon"
            size={16}
            color="rgba(59,91,219,0.5)"
            strokeWidth={1.8}
          />
        </motion.div>
      </section>

      {/* ─── 2. EVENT DETAILS SECTION (Unified Bento Theme) ─── */}
      <section className="relative z-10 w-full max-w-[1100px] mx-auto px-6 py-20">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fbbf2415] border border-[#fbbf2430] mb-4">
            <Sparkles size={12} className="text-[#fbbf24]" />
            <span className="font-mono text-[10px] font-bold tracking-widest text-[#fbbf24] uppercase">
              Idea & Problem Submission
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#f0f4ff] mb-4">
            Have you ever faced a problem in your field and thought there should
            be a better solution?
          </h2>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#8892a4] font-sans leading-relaxed">
            InterConnect 26.0 is an interdisciplinary innovation initiative
            where students from different domains collaborate to solve
            real-world problems by combining domain knowledge and technical
            expertise.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: The Focus (Spans 2 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-2 backdrop-blur-sm border border-[#1e2330] rounded-2xl p-7 lg:p-10 relative overflow-hidden group hover:border-[#3a9de850] transition-colors"
          >
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500">
              <Lightbulb size={120} />
            </div>
            <div className="w-12 h-12 bg-[#3a9de815] border border-[#3a9de830] rounded-xl flex items-center justify-center mb-6">
              <Target size={20} className="text-[#3a9de8]" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#f0f4ff] mb-3">
              The Focus
            </h3>
            <p className="text-sm text-[#8892a4] font-sans leading-relaxed mb-4">
              The primary focus is on problems you are currently facing or
              observing in your field—whether academic, technical, social, or
              industry-related.
            </p>
            <p className="text-sm text-[#8892a4] font-sans leading-relaxed">
              Your idea will be shared across the GM School Campus (GMU / GMIT
              and other institutions). Interested students will form{" "}
              <span className="text-[#3a9de8] font-semibold">
                interdisciplinary teams
              </span>
              , collaborate, and develop practical solutions within the event
              timeline. Selected ideas will be built and presented at the final
              event.
            </p>
          </motion.div>

          {/* Card 2: Why Participate */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-1 backdrop-blur-sm  border border-[#1e2330] rounded-2xl p-7 lg:p-10 hover:border-[#4ade8050] transition-colors"
          >
            <div className="w-12 h-12 bg-[#4ade8015] border border-[#4ade8030] rounded-xl flex items-center justify-center mb-6">
              <Award size={20} className="text-[#4ade80]" />
            </div>
            <h3 className="font-display font-bold text-xl text-[#f0f4ff] mb-5">
              Why Participate?
            </h3>
            <ul className="space-y-3 font-sans text-sm text-[#8892a4]">
              {[
                "Solve real-world problems",
                "Collaborate with students from different fields",
                "Turn ideas into innovative solutions",
                "Gain practical experience and teamwork skills",
              ].map((text, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle
                    size={16}
                    className="text-[#4ade80] flex-shrink-0 mt-0.5"
                  />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Card 3: Who Can Participate (Spans full width) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-3 backdrop-blur-sm border border-[#1e2330] rounded-2xl p-7 lg:p-10 flex flex-col md:flex-row items-center gap-8 justify-between hover:border-[#9c3ae850] transition-colors"
          >
            <div className="flex-1">
              <div className="w-12 h-12 bg-[#9c3ae815] border border-[#9c3ae830] rounded-xl flex items-center justify-center mb-4">
                <Globe size={20} className="text-[#9c3ae8]" />
              </div>
              <h3 className="font-display font-bold text-xl text-[#f0f4ff] mb-2">
                Who Can Participate?
              </h3>
              <p className="text-sm text-[#8892a4] font-sans leading-relaxed mb-4">
                Any{" "}
                <strong className="text-[#f0f4ff]">GMU / GMIT student</strong>{" "}
                with a problem or innovative idea. Students from the following
                disciplines are encouraged to submit real challenges from their
                domain:
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Engineering (CSE, ISE, AIML, ECE, Mech, Civil, EEE)",
                  "Law",
                  "Pharmacy",
                  "MBA",
                  "BCA",
                  "B.Com",
                  "BBA",
                  "MCA",
                  "M.Tech",
                  "Science",
                ].map((dept) => (
                  <span
                    key={dept}
                    className="inline-block px-3 py-1 bg-[#131925] border border-[#1e2840] rounded-md font-mono text-[10px] text-[#c4cedf]"
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Action / CTA Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="md:col-span-3 relative overflow-hidden rounded-2xl p-8 lg:p-12 text-center backdrop-blur-sm border border-[#e85d3a40]"
            style={{
              boxShadow: "0 20px 40px -15px rgba(232, 93, 58, 0.15)",
            }}
          >
            {/* Glowing orb behind text */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#e85d3a15] rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <h3 className="font-display font-extrabold text-2xl md:text-3xl text-[#f0f4ff] mb-3">
                Submit Your Idea Today
              </h3>
              <p className="font-mono text-sm text-[#e85d3a] mb-8">
                Your problem could become the starting point of the next
                impactful innovation.
              </p>

              <Link
                to="/problems"
                className="inline-flex items-center gap-2 bg-[#e85d3a] hover:bg-[#d14f2f] text-white font-display font-bold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(232,93,58,0.3)] no-underline"
              >
                Go to Submission Form <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Hero;
