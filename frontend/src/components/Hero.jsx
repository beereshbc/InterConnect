/**
 * Hero.jsx
 * Full-viewport hero section for InterConnect 26.O followed by Event Details
 * Clean, formal, responsive — unified with ManageProjects theme.
 * Requires: framer-motion, react-router-dom, lucide-react
 */

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
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
  LayoutDashboard,
  GitMerge,
  Code2,
  Gift,
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
    className="flex items-center gap-3 p-3 md:p-4 bg-white/5 border border-white/10 rounded-xl flex-1 min-w-[130px] sm:min-w-[140px] md:min-w-[160px]"
  >
    <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-[#3b5bdb1f] border border-[#3b5bdb33] rounded-lg shrink-0">
      <Icon
        className="w-4 h-4 md:w-5 md:h-5 text-[#6080f5]"
        strokeWidth={1.8}
      />
    </div>
    <div className="min-w-0">
      <p className="m-0 text-base md:text-lg font-bold text-[#e2e8f0] leading-tight font-mono">
        <Counter end={value} />
        {suffix}
      </p>
      <p className="m-0 mt-0.5 text-[9px] sm:text-[10px] md:text-xs text-[#fff] font-medium whitespace-nowrap overflow-hidden text-ellipsis">
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
  const [isLoading, setIsLoading] = useState(true);

  /* Page Loader Logic */
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => setIsLoading(false), 800);
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
      const fallback = setTimeout(handleLoad, 3000);
      return () => {
        window.removeEventListener("load", handleLoad);
        clearTimeout(fallback);
      };
    }
  }, []);

  /* grid dots canvas */
  const canvasRef = useRef(null);
  useEffect(() => {
    if (isLoading) return;
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
  }, [isLoading]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono    { font-family: 'DM Mono', monospace; }

        /* Hero base styles */
        .ic-hero { position: relative; min-height: 100dvh; display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 80px 16px 60px; overflow: hidden; }

        .ic-badge { display: inline-flex; align-items: center; gap: 7px; padding: 6px 14px; background: rgba(59,91,219,0.08); border: 1px solid rgba(59,91,219,0.18); border-radius: 8px; font-family: 'DM Mono', monospace; font-size: 11px; font-weight: 500; color: #6080f5; letter-spacing: 0.08em; text-transform: uppercase; }
        .ic-badge__dot { width: 6px; height: 6px; border-radius: 50%; background: #6080f5; animation: ic-pulse 2s ease-in-out infinite; }
        @keyframes ic-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(0.7)} }

        .ic-title { font-family: 'Syne', sans-serif; font-size: clamp(30px, 6vw, 84px); font-weight: 800; color: #e8edf5; line-height: 1.05; letter-spacing: -0.03em; margin: 0; text-align: center; }
        .ic-title__year { color: #3b5bdb; position: relative; }
        .ic-title__year::after { content: ''; position: absolute; bottom: 4px; left: 0; right: 0; height: 3px; background: #3b5bdb; border-radius: 2px; opacity: 0.5; }

        .ic-rule { width: 60px; height: 2px; background: rgba(59,91,219,0.4); border-radius: 2px; margin: 20px auto; }

        .ic-subtitle { font-family: 'DM Sans', sans-serif; font-size: clamp(14px, 2vw, 18px); color: #fff; font-weight: 400; text-align: center; max-width: 540px; line-height: 1.6; margin: 0 auto; }

        .ic-scroll { position: absolute; bottom: 32px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .ic-scroll__icon { animation: ic-scroll-bounce 2s ease-in-out infinite; }
        @keyframes ic-scroll-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(5px)} }

        /* Loader CSS */
        .loader-wrapper { background-color: #121418; display: grid; place-items: center; min-height: 100vh; position: fixed; inset: 0; z-index: 9999; }
        .thing { width: 25vw; max-width: 120px; aspect-ratio: 1/1; position: relative; perspective: 2000px; transform-style: preserve-3d; transform: rotateY(0deg) rotateX(0deg); animation: box 10s infinite linear; }
        .ring { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 100%; height: 100%; border: clamp(3px, 1vw, 6px) solid #fff; border-radius: 50%; border-bottom-color: transparent; border-left-width: 0px; animation: spin 1s infinite linear; }
        .ring--1 { --r: rotateY(0deg); transform: translate(-50%, -50%) rotateZ(0deg); }
        .ring--2 { --r: rotateY(-90deg); transform: translate(-50%, -50%) rotateY(-90deg); animation-delay: 0.75s; }
        .ring--3 { --r: rotateX(-90deg); transform: translate(-50%, -50%) rotateX(-90deg); animation-delay: 0.5s; }
        @keyframes spin { to { transform: translate(-50%, -50%) var(--r) rotateZ(360deg); } }
        @keyframes box { to { transform: rotateX(360deg) rotateY(360deg); } }

        /* ════════════════════════════════════════════
           HIGHLIGHT BANNER — redesigned
        ════════════════════════════════════════════ */
        .hb-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          margin-bottom: 72px;
          border: 1px solid rgba(59,91,219,0.15);
          background: transparent;
        }

        /* Subtle noise grain overlay */
        .hb-wrap::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
          background-size: 180px;
          pointer-events: none;
          z-index: 0;
          border-radius: inherit;
        }

        .hb-inner {
          position: relative;
          z-index: 1;
          padding: 52px 48px 48px;
        }

        @media (max-width: 768px) {
          .hb-inner { padding: 36px 22px 32px; }
          .hb-wrap { border-radius: 20px; margin-bottom: 48px; }
        }

        /* ── Two-column statement layout on desktop ── */
        .hb-statements-grid {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        @media (min-width: 769px) {
          .hb-statements-grid {
            display: grid;
            grid-template-columns: 1fr 1px 1fr;
            gap: 0;
            align-items: start;
          }
        }

        .hb-divider {
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.07), transparent);
          align-self: stretch;
          margin: 0 32px;
        }

        /* Each statement row */
        .hb-statement {
          display: flex;
          align-items: flex-start;
          gap: 18px;
          padding: 24px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }

        @media (min-width: 769px) {
          .hb-statement {
            border-bottom: none;
            padding: 0;
          }
        }

        .hb-statement__icon-wrap {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 5px;
        }

        .hb-statement__content { flex: 1; min-width: 0; }

        /* Statement heading — the BIG text */
        .hb-statement__heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(21px, 2.6vw, 32px);
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -0.025em;
          margin: 0 0 7px;
          display: block;
        }

        .hb-statement__sub {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(13px, 1.3vw, 14.5px);
          color: #fff;
          line-height: 1.65;
          margin: 0;
          max-width: 500px;
        }

        /* Shimmer gradient text on headings */
        .hb-grad-yellow {
          background: linear-gradient(110deg, #fbbf24 0%, #f97316 45%, #fde68a 70%, #fbbf24 100%);
          background-size: 220% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: hb-shimmer 5s linear infinite;
        }

        .hb-grad-green {
          background: linear-gradient(110deg, #4ade80 0%, #22d3ee 50%, #86efac 75%, #4ade80 100%);
          background-size: 220% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: hb-shimmer 5s linear infinite;
          animation-delay: 1.2s;
        }

        @keyframes hb-shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 220% center; }
        }

        /* ── TAGLINE — the money line ── */
        .hb-tagline-wrap {
          padding-top: 40px;
          margin-top: 36px;
          text-align: center;
          position: relative;
        }

        /* Top separator with glow */
        .hb-tagline-wrap::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 55%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(96,128,245,0.45), transparent);
        }

        /* Small "the mission" eyebrow pill */
        .hb-tag-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 13px;
          background: rgba(96,128,245,0.07);
          border: 1px solid rgba(96,128,245,0.18);
          border-radius: 999px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: #6080f5;
          margin-bottom: 20px;
        }

        /* Main tagline */
        .hb-tagline {
          font-family: 'Syne', sans-serif;
          font-size: clamp(24px, 4vw, 52px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.1;
          margin: 0;
          color: #e8edf5;
        }

        /* "team up" — blue accent */
        .hb-tagline .w-team {
          color: #3a9de8;
        }

        /* "build" — purple gradient + animated underline */
        .hb-tagline .w-build {
          position: relative;
          display: inline-block;
          background: linear-gradient(135deg, #6080f5 0%, #9c3ae8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .hb-tagline .w-build::after {
          content: '';
          position: absolute;
          bottom: -3px;
          left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6080f5, #9c3ae8);
          border-radius: 2px;
          transform-origin: left;
          animation: hb-bar 3s ease-in-out infinite;
        }
        @keyframes hb-bar {
          0%,100% { opacity: 1; transform: scaleX(1); }
          50%      { opacity: 0.45; transform: scaleX(0.82); }
        }

        /* "real" — amber/orange */
        .hb-tagline .w-real {
          background: linear-gradient(110deg, #fbbf24, #f97316);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Ambient glows — purely decorative */
        .hb-glow-a {
          position: absolute;
          top: -60px; left: -80px;
          width: 320px; height: 320px;
          background: radial-gradient(circle, rgba(251,191,36,0.055) 0%, transparent 70%);
          pointer-events: none;
          border-radius: 50%;
        }
        .hb-glow-b {
          position: absolute;
          bottom: -60px; right: -80px;
          width: 340px; height: 340px;
          background: radial-gradient(circle, rgba(74,222,128,0.05) 0%, transparent 70%);
          pointer-events: none;
          border-radius: 50%;
        }
        .hb-glow-c {
          position: absolute;
          bottom: 10px; left: 50%;
          transform: translateX(-50%);
          width: 45%; height: 160px;
          background: radial-gradient(ellipse at center, rgba(96,128,245,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        @media (min-width: 768px) {
          .ic-rule { margin: 24px auto; }
        }
      `}</style>

      {/* ─── FULL PAGE LOADER ─── */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
            className="loader-wrapper"
          >
            <div className="thing">
              <div className="ring ring--1"></div>
              <div className="ring ring--2"></div>
              <div className="ring ring--3"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="min-h-screen bg-transparent text-[#f0f4ff] font-sans selection:bg-[#3a9de8] selection:text-white">
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

          <motion.div
            style={{ y, opacity }}
            className="relative z-10 flex flex-col items-center gap-5 md:gap-6 w-full max-w-4xl px-2"
          >
            {/* LOGO */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: isLoading ? 0 : 1,
                scale: isLoading ? 0.8 : 1,
              }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex justify-center mb-1 md:mb-2"
            >
              <img
                src="/ibg.png"
                alt="InterConnect Logo"
                className="w-16 sm:w-24 md:w-32 lg:w-48 h-auto object-contain drop-shadow-[0_0_20px_rgba(59,91,219,0.4)]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? -12 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="ic-badge">
                <span className="ic-badge__dot" />
                Annual Flagship Event · 2026
              </div>
            </motion.div>

            <motion.h1
              className="ic-title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              InterConnect&nbsp;
              <span className="ic-title__year">26.O</span>
            </motion.h1>

            <motion.div
              className="ic-rule"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isLoading ? 0 : 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            />

            <motion.p
              className="ic-subtitle"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 12 : 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              An inter-disciplinary project management community where
              engineers, designers, and innovators solve real-world challenges
              together.
            </motion.p>

            <motion.p
              className="font-mono text-[9px] sm:text-[10px] md:text-xs tracking-[0.15em] text-[#4e5a72] uppercase text-center mt-1 md:mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoading ? 0 : 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              GMIT · GMU · Davangere
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-4 md:mt-6 w-full sm:w-auto"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 12 : 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              <Link
                to="/problems"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-[#1a2d7a] hover:bg-[#203291] border border-[#2d4399] hover:border-[#3b5bdb] rounded-xl text-[#a5b8f8] hover:text-[#c5d0fb] font-sans text-sm font-semibold transition-all hover:-translate-y-0.5"
              >
                Explore Problems <ArrowRight size={16} strokeWidth={2} />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 rounded-xl text-[#6b7a99] hover:text-[#8a9ab8] font-sans text-sm font-medium transition-all"
              >
                Join the Network
              </Link>
            </motion.div>

            <motion.div
              className="w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-[#3b5bdb40] to-transparent my-6 md:my-8"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: isLoading ? 0 : 1 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            />

            {/* Stats Grid */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 w-full max-w-4xl px-2">
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
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <span className="font-mono text-[9px] tracking-[0.15em] text-[#4e5a72] uppercase mb-1">
              Scroll to Discover
            </span>
            <ChevronDown
              className="ic-scroll__icon text-[#3b5bdb80]"
              size={18}
              strokeWidth={2}
            />
          </motion.div>
        </section>

        {/* ─── 2. EVENT DETAILS SECTION ─── */}
        <section className="relative z-10 w-full max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-24">
          {/* ════════════════════════════════════════════════════
              ── HIGHLIGHT BANNER — redesigned ──
          ════════════════════════════════════════════════════ */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="hb-wrap"
          >
            {/* ambient glows */}
            <div className="hb-glow-a" />
            <div className="hb-glow-b" />
            <div className="hb-glow-c" />

            <div className="hb-inner">
              {/* ── Two statements ── */}
              <div className="hb-statements-grid">
                {/* LEFT — Got a problem */}
                <motion.div
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.18,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="hb-statement"
                >
                  <div
                    className="hb-statement__icon-wrap"
                    style={{
                      background: "rgba(251,191,36,0.07)",
                      border: "1px solid rgba(251,191,36,0.16)",
                    }}
                  >
                    <Lightbulb size={19} style={{ color: "#fbbf24" }} />
                  </div>
                  <div className="hb-statement__content">
                    <span className="hb-statement__heading hb-grad-yellow">
                      Got a problem to solve?
                    </span>
                    <p className="hb-statement__sub">
                      You don't need technical skills to spark innovation.
                      Submit your idea, and let experts bring it to reality.
                    </p>
                  </div>
                </motion.div>

                {/* Vertical divider — desktop only */}
                <div className="hb-divider hidden md:block" />

                {/* RIGHT — Want to build */}
                <motion.div
                  initial={{ opacity: 0, x: 14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: 0.28,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="hb-statement"
                >
                  <div
                    className="hb-statement__icon-wrap"
                    style={{
                      background: "rgba(74,222,128,0.07)",
                      border: "1px solid rgba(74,222,128,0.16)",
                    }}
                  >
                    <Code2 size={19} style={{ color: "#4ade80" }} />
                  </div>
                  <div className="hb-statement__content">
                    <span className="hb-statement__heading hb-grad-green">
                      Want to build solutions?
                    </span>
                    <p className="hb-statement__sub">
                      Browse our open problem statements, find a project that
                      matches your tech stack, and start contributing.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* ── TAGLINE — centrepiece ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.42,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="hb-tagline-wrap"
              >
                <div className="hb-tag-pill">
                  <Sparkles size={10} />
                  the mission
                </div>

                <p className="hb-tagline">
                  Let's <span className="w-team">team&nbsp;up</span> and{" "}
                  <span className="w-build">build</span>{" "}
                  <span className="w-real">real</span> solutions together!
                </p>
              </motion.div>
            </div>
          </motion.div>
          {/* ════════════════════════════════════════════════════ */}

          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 md:mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 rounded-full bg-[#fbbf2415] border border-[#fbbf2430] mb-5 md:mb-6">
              <Sparkles size={14} className="text-[#fbbf24]" />
              <span className="font-mono text-[10px] md:text-xs font-bold tracking-widest text-[#fbbf24] uppercase">
                Idea & Problem Submission
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#f0f4ff] mb-4 md:mb-6 leading-tight">
              Have you ever faced a problem in your field{" "}
              <br className="hidden md:block" />
              and thought there should be a better solution?
            </h2>
            <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-[#fff] font-sans leading-relaxed">
              InterConnect 26.0 is an interdisciplinary innovation initiative
              where students from different domains collaborate to solve
              real-world problems by combining domain knowledge and technical
              expertise.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
            {/* Card 1: The Focus */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 backdrop-blur-sm bg-[#131824]/50 border border-[#1e2330] rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 relative overflow-hidden group hover:border-[#3a9de850] transition-colors"
            >
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none">
                <Target size={120} className="md:w-[160px] md:h-[160px]" />
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#3a9de815] border border-[#3a9de830] rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6">
                <Target size={22} className="text-[#3a9de8]" />
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-[#f0f4ff] mb-3 md:mb-4">
                The Focus
              </h3>
              <p className="text-sm md:text-base text-[#fff] font-sans leading-relaxed mb-3 md:mb-4">
                The primary focus is on problems you are currently facing or
                observing in your field—whether academic, technical, social, or
                industry-related.
              </p>
              <p className="text-sm md:text-base text-[#fff] font-sans leading-relaxed">
                Your idea will be shared across the campus. Interested students
                will form{" "}
                <span className="text-[#3a9de8] font-semibold">
                  interdisciplinary teams
                </span>
                , collaborate, and develop practical solutions within the event
                timeline. Selected ideas will be built and presented at the
                final event.
              </p>
            </motion.div>

            {/* Card 2: Why Participate */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="md:col-span-1 backdrop-blur-sm bg-[#131824]/50 border border-[#1e2330] rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 hover:border-[#4ade8050] transition-colors"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#4ade8015] border border-[#4ade8030] rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6">
                <Award size={22} className="text-[#4ade80]" />
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-[#f0f4ff] mb-4 md:mb-6">
                Why Participate?
              </h3>
              <ul className="space-y-3 md:space-y-4 font-sans text-sm md:text-base text-[#fff]">
                {[
                  "Solve real-world problems",
                  "Collaborate across fields",
                  "Turn ideas into solutions",
                  "Gain teamwork skills",
                ].map((text, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle
                      size={18}
                      className="text-[#4ade80] flex-shrink-0 mt-0.5"
                    />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Card 3: Contribute & Earn Rewards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="md:col-span-2 backdrop-blur-sm bg-[#131824]/50 border border-[#f59e0b30] rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 relative overflow-hidden group hover:border-[#f59e0b60] transition-colors"
            >
              <div className="absolute -bottom-20 -right-20 w-48 h-48 md:w-64 md:h-64 bg-[#f59e0b10] rounded-full blur-[60px] md:blur-[80px] pointer-events-none" />
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#f59e0b15] border border-[#f59e0b30] rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6">
                <Gift size={22} className="text-[#f59e0b]" />
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-[#f0f4ff] mb-3 md:mb-4">
                Contribute & Earn Rewards
              </h3>
              <p className="text-sm md:text-base text-[#fff] font-sans leading-relaxed mb-5 md:mb-6">
                <span className="text-[#f59e0b] font-semibold">
                  Willing to contribute to projects you are passionate about?
                </span>{" "}
                Let's explore the problems! Find a project that matches your
                preferred tech stack or aligns with your core interests. Start
                contributing effectively, gain valuable points, and earn
                exclusive rewards for your hard work.
              </p>
              <Link
                to="/problems"
                className="inline-flex items-center gap-2 text-[#f59e0b] hover:text-[#fbbf24] font-semibold font-sans text-xs md:text-sm transition-colors"
              >
                Explore Tech Stacked Projects <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Card 4: Who Can Join */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="md:col-span-1 backdrop-blur-sm bg-[#131824]/50 border border-[#1e2330] rounded-2xl md:rounded-3xl p-6 md:p-8 hover:border-[#9c3ae850] transition-colors flex flex-col"
            >
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#9c3ae815] border border-[#9c3ae830] rounded-xl md:rounded-2xl flex items-center justify-center mb-5 md:mb-6">
                <Globe size={22} className="text-[#9c3ae8]" />
              </div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-[#f0f4ff] mb-3 md:mb-4">
                Who Can Join?
              </h3>
              <p className="text-sm text-[#fff] font-sans leading-relaxed mb-5 md:mb-6 flex-grow">
                Any{" "}
                <strong className="text-[#f0f4ff]">GMU / GMIT student</strong>{" "}
                with a problem or innovative idea from disciplines including
                Engineering, Law, Pharmacy, MBA, Science & more.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1.5 bg-[#1e2330] rounded-lg font-mono text-[9px] md:text-[10px] text-[#c4cedf]">
                  All Departments
                </span>
                <span className="px-2.5 py-1.5 bg-[#1e2330] rounded-lg font-mono text-[9px] md:text-[10px] text-[#c4cedf]">
                  Cross-Campus
                </span>
              </div>
            </motion.div>

            {/* Card 5: CTA Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="md:col-span-3 relative overflow-hidden rounded-2xl md:rounded-3xl p-8 sm:p-10 lg:p-16 text-center backdrop-blur-sm bg-[#131824]/80 border border-[#e85d3a40] mt-2 md:mt-4"
              style={{ boxShadow: "0 20px 40px -15px rgba(232, 93, 58, 0.15)" }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-[#e85d3a15] rounded-full blur-[70px] md:blur-[100px] pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center">
                <h3 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-[#f0f4ff] mb-3 md:mb-4">
                  Submit Your Idea Today
                </h3>
                <p className="font-mono text-xs sm:text-sm md:text-base text-[#e85d3a] mb-6 md:mb-10">
                  Your problem could become the starting point of the next
                  impactful innovation.
                </p>
                <Link
                  to="/problems"
                  className="inline-flex items-center justify-center gap-2 md:gap-3 bg-[#e85d3a] hover:bg-[#d14f2f] text-white font-display font-bold text-base md:text-lg px-6 py-3.5 md:px-10 md:py-4 rounded-xl md:rounded-2xl transition-all hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(232,93,58,0.35)] w-full sm:w-auto"
                >
                  Go to Submission Form{" "}
                  <ArrowRight size={18} className="md:w-[20px] md:h-[20px]" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export const AboutSection = () => (
  <section
    id="about"
    className="relative w-full min-h-[100dvh] flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-24 px-6 py-16 md:py-24 lg:px-24 bg-transparent"
  >
    <div className="flex-1 w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#3a9de8] font-bold mb-3 md:mb-4">
          ✦ About The Initiative
        </p>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#f0f4ff] mb-4 md:mb-6 leading-tight">
          Where Disciplines <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3a9de8] to-[#9c3ae8]">
            Converge
          </span>
        </h2>
        <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-[#3a9de8] to-transparent rounded-full mb-6 md:mb-8" />

        <p className="font-sans text-sm sm:text-base md:text-lg text-[#fff] leading-relaxed mb-6 md:mb-8">
          InterConnect 26.O breaks down academic silos. We bring together
          engineering innovators, business strategists, legal minds, and science
          researchers from GMIT and GMU to collaborate on high-impact problem
          statements.
        </p>

        <ul className="space-y-4 md:space-y-5 mb-8">
          {[
            {
              icon: Lightbulb,
              text: "Source real-world problems from various domains.",
            },
            {
              icon: Users,
              text: "Form cross-functional, highly specialized teams.",
            },
            {
              icon: GitMerge,
              text: "Develop, deploy, and scale practical solutions.",
            },
          ].map((item, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 md:gap-4 text-[#c4cedf] font-sans text-sm md:text-base"
            >
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-[#3a9de815] border border-[#3a9de830] flex items-center justify-center flex-shrink-0">
                <item.icon
                  size={18}
                  className="text-[#3a9de8] md:w-[20px] md:h-[20px]"
                />
              </div>
              {item.text}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>

    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="flex-1 w-full max-w-xl relative"
    >
      <div className="absolute -inset-4 bg-gradient-to-br from-[#3a9de820] to-[#9c3ae820] rounded-2xl md:rounded-3xl blur-xl md:blur-2xl -z-10" />
      <div className="relative rounded-2xl md:rounded-3xl p-6 bg-[#131824]/80 border border-[#1e2330] shadow-2xl overflow-hidden min-h-[250px] md:min-h-[400px] flex items-center justify-center">
        <img
          className="rounded-2xl"
          src="public/ICPoster_26.png"
          alt="InterConnect 26.O Poster"
          srcSet=""
        />
      </div>
    </motion.div>
  </section>
);

// ─── WORKFLOW SECTION ────────────────────────────────────────────────────────
export const WorkflowSection = () => (
  <section
    id="workflow"
    className="relative w-full py-16 md:py-24 px-6 lg:px-24 bg-transparent"
  >
    <div className="max-w-4xl mx-auto text-center mb-10 md:mb-16">
      <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#4ade80] font-bold mb-3 md:mb-4">
        ✦ How It Works
      </p>
      <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#f0f4ff] mb-4 md:mb-6">
        The Innovation Pipeline
      </h2>
      <p className="font-sans text-sm sm:text-base md:text-lg text-[#fff] leading-relaxed max-w-2xl mx-auto">
        Our platform provides a seamless workflow for project coordinators and
        student contributors to track milestones, assign tasks, and evaluate
        performance in real-time.
      </p>
    </div>
  </section>
);

// ─── CALL TO ACTION SECTION ──────────────────────────────────────────────────
export const CTASection = () => (
  <section className="relative w-full py-20 md:py-32 px-6 bg-transparent">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto text-center"
    >
      <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#f0f4ff] mb-4 md:mb-6">
        Ready to make an impact?
      </h2>
      <p className="font-sans text-base md:text-lg text-[#fff] mb-8 md:mb-12 max-w-2xl mx-auto">
        Join the network, find a problem statement that challenges you, and
        start building the future today.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
        <Link
          to="/problems"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 md:gap-3 px-6 py-3.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-display font-bold text-sm md:text-base bg-[#e85d3a] hover:bg-[#d14f2f] text-white transition-all shadow-[0_0_20px_rgba(232,93,58,0.2)] hover:shadow-[0_0_30px_rgba(232,93,58,0.4)] hover:-translate-y-1"
        >
          View Problem Statements{" "}
          <Lightbulb size={16} className="md:w-[18px] md:h-[18px]" />
        </Link>
        <Link
          to="/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 md:gap-3 px-6 py-3.5 md:px-8 md:py-4 rounded-xl md:rounded-2xl font-display font-bold text-sm md:text-base bg-[#1e2330] hover:bg-[#2a3045] border border-slate-700 text-[#f0f4ff] transition-all hover:-translate-y-1"
        >
          Enter Dashboard{" "}
          <LayoutDashboard size={16} className="md:w-[18px] md:h-[18px]" />
        </Link>
      </div>
    </motion.div>
  </section>
);

export default Hero;
