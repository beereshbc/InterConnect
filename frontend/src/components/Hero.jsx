/**
 * Hero.jsx
 * Full-viewport hero section for InterConnect 26.O
 * Clean, formal, responsive — no glow effects, thin borders, user-psychology driven.
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
    animate={{ opacity: 1, y: 0 }}
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
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

        .ic-hero * { box-sizing: border-box; }
        .ic-hero { position: relative; min-height: 100vh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 80px 24px 60px; overflow: hidden; }

        .ic-badge { display: inline-flex; align-items: center; gap: 7px; padding: 5px 12px; background: rgba(59,91,219,0.08); border: 1px solid rgba(59,91,219,0.18); border-radius: 6px; font-family: 'DM Mono', monospace; font-size: 10.5px; font-weight: 500; color: #6080f5; letter-spacing: 0.08em; text-transform: uppercase; }
        .ic-badge__dot { width: 5px; height: 5px; border-radius: 50%; background: #6080f5; animation: ic-pulse 2s ease-in-out infinite; }
        @keyframes ic-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(0.7)} }

        .ic-title { font-family: 'Sora', sans-serif; font-size: clamp(38px, 7.5vw, 84px); font-weight: 700; color: #e8edf5; line-height: 1.06; letter-spacing: -0.03em; margin: 0; text-align: center; }
        .ic-title__year { color: #3b5bdb; position: relative; }
        .ic-title__year::after { content: ''; position: absolute; bottom: 4px; left: 0; right: 0; height: 2px; background: #3b5bdb; border-radius: 2px; opacity: 0.5; }

        .ic-rule { width: 40px; height: 1px; background: rgba(59,91,219,0.35); border-radius: 1px; }

        .ic-subtitle { font-family: 'DM Sans', sans-serif; font-size: clamp(14px, 2vw, 16px); color: #5a6880; font-weight: 400; text-align: center; max-width: 480px; line-height: 1.7; margin: 0; }

        .ic-institution { font-family: 'DM Mono', monospace; font-size: 11px; letter-spacing: 0.15em; color: #3a4a60; text-transform: uppercase; text-align: center; }

        .ic-cta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; justify-content: center; }
        .ic-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 11px 24px; background: #1a2d7a; border: 1px solid #2d4399; border-radius: 8px; color: #a5b8f8; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s; text-decoration: none; }
        .ic-btn-primary:hover { background: #203291; border-color: #3b5bdb; color: #c5d0fb; }
        .ic-btn-ghost { display: inline-flex; align-items: center; gap: 8px; padding: 11px 24px; background: transparent; border: 1px solid rgba(255,255,255,0.07); border-radius: 8px; color: #4a5a74; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.18s; text-decoration: none; }
        .ic-btn-ghost:hover { border-color: rgba(255,255,255,0.14); color: #8a9ab8; }

        .ic-stats { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; width: 100%; max-width: 720px; }

        .ic-divider { width: 100%; max-width: 720px; height: 1px; background: linear-gradient(90deg, transparent, rgba(59,91,219,0.15) 30%, rgba(59,91,219,0.15) 70%, transparent); }

        .ic-scroll { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .ic-scroll__label { font-family: 'DM Mono', monospace; font-size: 9px; letter-spacing: 0.15em; color: #2d3a50; text-transform: uppercase; }
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

      <section className="ic-hero" ref={containerRef}>
        {/* Dot canvas */}
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

        {/* Decorative grid lines */}
        <div className="ic-line-h" style={{ top: "22%" }} />
        <div className="ic-line-h" style={{ bottom: "22%" }} />
        <div className="ic-line-v" style={{ left: "12%" }} />
        <div className="ic-line-v" style={{ right: "12%" }} />

        {/* Corner marks */}
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

        {/* Content stack */}
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
          {/* Badge */}
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

          {/* Title */}
          <motion.h1
            className="ic-title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            InterConnect&nbsp;
            <span className="ic-title__year">26.O</span>
          </motion.h1>

          {/* Rule */}
          <motion.div
            className="ic-rule"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          />

          {/* Subtitle */}
          <motion.p
            className="ic-subtitle"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            An inter-disciplinary project management community where engineers,
            designers, and innovators solve real-world challenges together.
          </motion.p>

          {/* Institution */}
          <motion.p
            className="ic-institution"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            GMIT&nbsp;&nbsp;·&nbsp;&nbsp;GMU&nbsp;&nbsp;·&nbsp;&nbsp;Davangere
          </motion.p>

          {/* CTAs */}
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

          {/* Divider */}
          <motion.div
            className="ic-divider"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.55 }}
          />

          {/* Stats */}
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

        {/* Scroll cue */}
        <motion.div
          className="ic-scroll"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <span className="ic-scroll__label">Scroll</span>
          <ChevronDown
            className="ic-scroll__icon"
            size={16}
            color="rgba(59,91,219,0.35)"
            strokeWidth={1.8}
          />
        </motion.div>
      </section>
    </>
  );
};

export default Hero;
