import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Shield,
  Volume2,
  VolumeX,
  ExternalLink,
  Flame,
  Trophy,
  Target,
  Star,
  ChevronDown,
  ArrowRight,
  Users,
  Clock,
  Instagram,
} from "lucide-react";

import strengthArenaLogo from "../../public/sa logo.png";
import strengthArenaVideo from "../../public/strength_arena__14050112_120824368.mp4";

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  show: (d = 0) => ({ opacity: 1, transition: { duration: 0.5, delay: d } }),
};

const TICKER_ITEMS = [
  "STRENGTH ARENA",
  "TRAIN HARDER",
  "ELITE EQUIPMENT",
  "EXPERT COACHES",
  "500+ MEMBERS",
  "DAVANGERE'S #1 GYM",
  "GO FURTHER",
  "BUILD WHAT LASTS",
  "COMPETITION READY",
  "HIGH PERFORMANCE",
  "INTERCONNECT 26.0",
];

/* ─── Animated Counter ─── */
const Counter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const num = parseInt(target.replace(/\D/g, "")) || 0;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * num));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, target, duration]);
  const suffix = target.includes("+")
    ? "+"
    : target.includes("%")
      ? "%"
      : target.includes("★")
        ? "★"
        : "";
  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
};

/* ─── Stat Card ─── */
const StatCard = ({ value, label, icon: Icon, color, delay }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    custom={delay}
    viewport={{ once: true }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="flex flex-col items-center text-center px-5 py-8 rounded-2xl"
    style={{
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(12px)",
    }}
  >
    <div
      className="flex items-center justify-center w-10 h-10 rounded-xl mb-4"
      style={{ background: `${color}22` }}
    >
      <Icon size={18} style={{ color }} />
    </div>
    <span
      className="block text-5xl font-extrabold leading-none mb-2 tracking-tight"
      style={{ color, fontFamily: "'Bebas Neue', sans-serif" }}
    >
      <Counter target={value} />
    </span>
    <span
      className="text-[10px] tracking-[0.16em] uppercase font-medium"
      style={{
        color: "rgba(255,255,255,0.38)",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {label}
    </span>
  </motion.div>
);

/* ─── Feature Pill ─── */
const FeaturePill = ({ icon, text, delay }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    custom={delay}
    viewport={{ once: true }}
    whileHover={{ scale: 1.04 }}
    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-default transition-all duration-200"
    style={{ background: "rgba(255,255,255,0.07)" }}
  >
    <span className="text-sm leading-none">{icon}</span>
    <span
      className="text-[10.5px] tracking-wide uppercase font-medium"
      style={{
        color: "rgba(255,255,255,0.5)",
        fontFamily: "'DM Mono', monospace",
      }}
    >
      {text}
    </span>
  </motion.div>
);

/* ─── Section Label ─── */
const SectionLabel = ({ color = "#ff8c6b", children }) => (
  <p
    className="text-[10px] tracking-[0.28em] uppercase font-bold mb-3"
    style={{ color, fontFamily: "'DM Mono', monospace" }}
  >
    ✦ {children}
  </p>
);

/* ─── Divider ─── */
const Divider = () => (
  <div
    className="w-full h-px"
    style={{
      background:
        "linear-gradient(to right, transparent, rgba(255,107,74,0.2), transparent)",
    }}
  />
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const Sponsored = () => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 55]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, []);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setVideoProgress(
      (videoRef.current.currentTime / videoRef.current.duration) * 100,
    );
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:ital,wght@0,700;0,800;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

        .sp-display { font-family: 'Bebas Neue', 'Barlow Condensed', sans-serif !important; }
        .sp-cond    { font-family: 'Barlow Condensed', sans-serif !important; }
        .sp-mono    { font-family: 'DM Mono', monospace !important; }

        /* gradient texts — warmed up for dark bg */
        .sp-grad-title {
          background: linear-gradient(110deg, #ff6b4a 0%, #ff8c6b 55%, #ffb347 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .sp-ghost-title {
          -webkit-text-stroke: 2px rgba(255,255,255,0.1);
          color: transparent;
        }
        .sp-grad-brand {
          background: linear-gradient(110deg, #ff6b4a, #ff8c6b);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }
        .sp-grad-manifesto {
          background: linear-gradient(110deg, #ff6b4a, #ff8c6b, #ffb347);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* subtle radial warmth behind hero — no solid bg */
        .sp-hero-overlay {
          background:
            radial-gradient(ellipse 70% 50% at 50% 35%, rgba(232,48,30,0.1) 0%, transparent 65%),
            radial-gradient(ellipse 45% 30% at 72% 68%, rgba(245,197,66,0.05) 0%, transparent 55%);
        }
        /* white dot grid */
        .sp-grid {
          background-image: radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px);
          background-size: 28px 28px;
          -webkit-mask-image: radial-gradient(ellipse 75% 70% at 50% 50%, black 0%, transparent 75%);
          mask-image: radial-gradient(ellipse 75% 70% at 50% 50%, black 0%, transparent 75%);
        }

        /* ticker */
        @keyframes sp-fwd   { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes sp-rev   { from{transform:translateX(-50%)} to{transform:translateX(0)} }
        @keyframes sp-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.3;transform:scale(0.5)} }
        @keyframes sp-bounce{ 0%,100%{transform:translateY(0)} 50%{transform:translateY(6px)} }
        @keyframes sp-spin  { to{transform:rotate(360deg)} }
        @keyframes sp-spin-r{ to{transform:rotate(-360deg)} }

        .sp-fwd    { animation: sp-fwd    32s linear infinite; }
        .sp-rev    { animation: sp-rev    26s linear infinite; }
        .sp-pulse  { animation: sp-pulse  1.8s ease-in-out infinite; }
        .sp-bounce { animation: sp-bounce 1.6s ease-in-out infinite; }
        .sp-spin   { animation: sp-spin   14s linear infinite; }
        .sp-spin-r { animation: sp-spin-r 22s linear infinite; }
        .sp-spin-s { animation: sp-spin   44s linear infinite; }

        .sp-ring-dot::after {
          content:''; position:absolute; top:-3px; left:50%;
          transform:translateX(-50%); width:6px; height:6px;
          border-radius:50%; background:#ff6b4a;
        }

        /* video corner brackets */
        .sp-tl{top:12px;left:12px;border-top:1.5px solid rgba(255,107,74,0.55);border-left:1.5px solid rgba(255,107,74,0.55);}
        .sp-tr{top:12px;right:12px;border-top:1.5px solid rgba(255,107,74,0.55);border-right:1.5px solid rgba(255,107,74,0.55);}
        .sp-bl{bottom:12px;left:12px;border-bottom:1.5px solid rgba(255,107,74,0.55);border-left:1.5px solid rgba(255,107,74,0.55);}
        .sp-br{bottom:12px;right:12px;border-bottom:1.5px solid rgba(255,107,74,0.55);border-right:1.5px solid rgba(255,107,74,0.55);}

        /* glassmorphism cards */
        .sp-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(16px);
          box-shadow: 0 4px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.07) inset;
        }
        .sp-cta-card {
          background: rgba(255,255,255,0.04);
          backdrop-filter: blur(16px);
          box-shadow: 0 4px 40px rgba(0,0,0,0.35);
        }

        /* quote block */
        .sp-quote {
          border-left: 3px solid rgba(255,107,74,0.35);
          background: rgba(255,107,74,0.06);
          border-radius: 0 10px 10px 0;
        }

        /* tinted section bg */
        .sp-tinted { background: rgba(255,255,255,0.025); }

        /* buttons */
        .sp-btn-primary {
          background: linear-gradient(135deg, #c41e0c, #e8301e);
          box-shadow: 0 4px 18px rgba(232,48,30,0.4);
          transition: all 0.2s;
        }
        .sp-btn-primary:hover { filter: brightness(1.1); transform: translateY(-1px); }

        .sp-btn-outline {
          background: rgba(255,255,255,0.07);
          transition: all 0.2s;
        }
        .sp-btn-outline:hover { background: rgba(255,255,255,0.13); transform: translateY(-1px); }
      `}</style>

      {/* ambient glows */}
      <div
        className="fixed top-[-5%] left-[-8%] w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle,rgba(232,48,30,0.07),transparent 65%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="fixed bottom-[10%] right-[-6%] w-[440px] h-[440px] rounded-full pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(circle,rgba(245,197,66,0.05),transparent 65%)",
          filter: "blur(70px)",
        }}
      />

      {/* ROOT — transparent bg, all text defaults to white */}
      <div
        className="min-h-screen bg-transparent overflow-x-hidden"
        style={{
          fontFamily: "'DM Sans', sans-serif",
          color: "rgba(255,255,255,0.88)",
        }}
      >
        {/* ════════════════ 1 · HERO ════════════════ */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden px-5"
        >
          <div className="absolute inset-0 sp-hero-overlay z-0" />
          <div className="absolute inset-0 sp-grid z-0" />

          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* eyebrow */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              custom={0.08}
              className="inline-flex items-center gap-2.5 mb-6 sp-mono font-bold"
              style={{
                fontSize: 10,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "#ff8c6b",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 1,
                  background: "#ff8c6b",
                  opacity: 0.4,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              InterConnect 26.0 · Presenting Sponsor
              <span
                style={{
                  width: 24,
                  height: 1,
                  background: "#ff8c6b",
                  opacity: 0.4,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
            </motion.div>

            {/* pretitle */}
            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate="show"
              custom={0.16}
              className="sp-cond font-bold mb-1 text-base text-gray-50"
              style={{
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Powered by
            </motion.p>

            {/* main title */}
            <motion.h1
              className="sp-display leading-[0.88]"
              style={{
                fontSize: "clamp(72px,12vw,152px)",
                textTransform: "uppercase",
              }}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.24,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <span className="block sp-grad-title">Strength</span>
              <motion.span
                className="block text-gray-400 sp-mono"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                Arena
              </motion.span>
            </motion.h1>

            {/* sub */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.46}
              className="max-w-[420px] leading-[1.8] mt-7 mb-9"
              style={{
                fontSize: "clamp(13px,1.4vw,15px)",
                color: "rgba(255,255,255,0.42)",
              }}
            >
              Davangere's premier high-performance training ground — fuelling
              innovation with discipline, strength, and relentless ambition.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.58}
              className="flex items-center gap-3 flex-wrap justify-center"
            >
              <a
                href="https://instagram.com/strengtharena"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 sp-btn-primary text-white sp-cond font-bold text-sm rounded-xl"
                style={{ letterSpacing: "0.1em", textTransform: "uppercase" }}
              >
                <Flame size={13} /> Join the Movement <ArrowRight size={13} />
              </a>
              <a
                href="#video"
                className="inline-flex items-center gap-2 px-6 py-[13px] sp-btn-outline sp-cond font-bold text-sm rounded-xl"
                style={{
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                ↓ Watch Promo
              </a>
            </motion.div>
          </motion.div>

          {/* sponsor pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-2.5 rounded-full whitespace-nowrap z-10"
            style={{
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0 sp-pulse"
              style={{ background: "#ff6b4a" }}
            />
            <span
              className="sp-mono"
              style={{
                fontSize: 9.5,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.38)",
              }}
            >
              Official Presenting Sponsor ·{" "}
              <strong style={{ color: "#ff8c6b" }}>InterConnect 26.0</strong>
            </span>
            <Shield size={10} style={{ color: "#ff8c6b" }} />
          </motion.div>

          {/* scroll hint */}
          <div className="absolute bottom-11 right-10 hidden sm:flex flex-col items-center gap-1.5 z-10">
            <span
              className="sp-mono"
              style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                writingMode: "vertical-rl",
                color: "rgba(255,255,255,0.22)",
              }}
            >
              Scroll
            </span>
            <ChevronDown
              size={13}
              className="sp-bounce"
              style={{ color: "rgba(255,255,255,0.22)" }}
            />
          </div>
        </section>

        {/* ════════════════ TICKERS ════════════════ */}
        <div className="relative z-10 overflow-hidden">
          <div
            className="w-full overflow-hidden py-3"
            style={{ background: "#e8301e" }}
          >
            <div className="sp-fwd flex w-max">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-6 sp-display whitespace-nowrap"
                  style={{
                    fontSize: 12,
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.92)",
                  }}
                >
                  <Flame
                    size={9}
                    style={{ color: "rgba(255,255,255,0.5)", flexShrink: 0 }}
                  />{" "}
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div
            className="w-full overflow-hidden py-3"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div className="sp-rev flex w-max">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 px-6 sp-mono whitespace-nowrap"
                  style={{
                    fontSize: 9.5,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.25)",
                  }}
                >
                  <Flame size={9} style={{ color: "#ff6b4a", flexShrink: 0 }} />{" "}
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        <Divider />

        {/* ════════════════ 2 · IDENTITY ════════════════ */}
        <section className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-10 py-20 lg:py-28">
          <SectionLabel>About the Sponsor</SectionLabel>

          <div className="grid grid-cols-1 gap-16 items-center lg:grid-cols-[420px_1fr] lg:gap-20 mt-2">
            {/* LEFT · card */}
            <motion.div
              initial={{ opacity: 0, x: -36 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative sp-card rounded-3xl px-10 py-14 overflow-hidden">
                <span
                  className="absolute bottom-4 right-5 sp-mono"
                  style={{
                    fontSize: 8,
                    letterSpacing: "0.1em",
                    color: "rgba(255,255,255,0.12)",
                  }}
                >
                  SA·001
                </span>
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl"
                  style={{
                    background:
                      "linear-gradient(90deg,#c41e0c,#e8301e,#f97316,#f5c542)",
                  }}
                />

                <div className="flex flex-col items-center text-center gap-6">
                  {/* rings + logo */}
                  <div className="relative w-[180px] h-[180px] flex items-center justify-center">
                    <div
                      className="sp-spin sp-ring-dot absolute inset-0 rounded-full"
                      style={{ border: "1px solid rgba(255,107,74,0.22)" }}
                    />
                    <div
                      className="sp-spin-r absolute rounded-full"
                      style={{
                        inset: "-14px",
                        border: "1px dashed rgba(245,197,66,0.14)",
                      }}
                    />
                    <div
                      className="sp-spin-s absolute rounded-full"
                      style={{
                        inset: "-28px",
                        border: "1px solid rgba(255,255,255,0.04)",
                      }}
                    />
                    <img
                      src={strengthArenaLogo}
                      alt="Strength Arena"
                      className="w-[160px] h-[160px] rounded-full object-cover block relative z-10"
                      style={{
                        filter: "drop-shadow(0 4px 28px rgba(232,48,30,0.38))",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="hidden w-[160px] h-[160px] rounded-full items-center justify-center text-[64px] relative z-10"
                      style={{ background: "rgba(232,48,30,0.1)" }}
                    >
                      🦍
                    </div>
                  </div>

                  {/* brand name */}
                  <div
                    className="sp-display leading-[0.9] text-5xl"
                    style={{ letterSpacing: "0.02em" }}
                  >
                    <span className="block sp-grad-brand">Strength</span>
                    <span
                      className="block text-4xl sp-ghost-title"
                      style={{ letterSpacing: "0.1em" }}
                    >
                      Arena
                    </span>
                  </div>

                  {/* badges */}
                  <div className="flex items-center gap-2 flex-wrap justify-center">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-[5px] rounded-lg sp-mono font-medium"
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#ff8c6b",
                        background: "rgba(255,107,74,0.12)",
                      }}
                    >
                      <Shield size={9} /> Official Sponsor
                    </span>
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-[5px] rounded-lg sp-mono font-medium"
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "#fbbf24",
                        background: "rgba(245,197,66,0.1)",
                      }}
                    >
                      <Star size={9} /> 5-Star Rated
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT · description */}
            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.75,
                delay: 0.14,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <h2
                className="sp-display uppercase leading-[0.92] mb-6"
                style={{
                  fontSize: "clamp(44px,5.5vw,72px)",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                More than a gym —<br />
                <span style={{ color: "#fbbf24" }}>a </span>
                <span className="sp-grad-title">movement.</span>
              </h2>

              <div className="sp-quote pl-5 py-4 pr-4 my-6">
                <p
                  className="sp-cond font-bold italic text-lg leading-snug"
                  style={{
                    color: "rgba(255,255,255,0.72)",
                    letterSpacing: "0.02em",
                  }}
                >
                  "Train harder. Go further. Build what lasts."
                </p>
                <p
                  className="sp-mono mt-2 text-gray-200"
                  style={{
                    fontSize: 9.5,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                  }}
                >
                  — Strength Arena · Est. Davangere
                </p>
              </div>

              <p className="text-sm font-light leading-[1.85] mb-3 text-gray-300">
                Strength Arena is Davangere's premier destination for
                high-performance training, state-of-the-art equipment, and a
                community obsessed with pushing the architectural limits of the
                human body.
              </p>
              <p className="text-sm font-light leading-[1.85] mb-3 text-gray-300">
                From elite athletes to beginners finding their first rep —
                Strength Arena is built around one principle: every person who
                walks through those doors deserves to be stronger when they
                leave. This is why they believe in investing in young innovators
                at InterConnect 26.0.
              </p>
              <p className="text-sm font-light leading-[1.85] text-gray-300">
                Excellence in the gym. Excellence in the classroom. The hustle
                is the same.
              </p>

              <div className="flex flex-wrap gap-2 mt-7">
                {[
                  { icon: "💪", text: "Elite Training" },
                  { icon: "🏋️", text: "Pro Equipment" },
                  { icon: "🔥", text: "Expert Coaches" },
                  { icon: "🥇", text: "Competition-Ready" },
                  { icon: "🌐", text: "Community-Driven" },
                  { icon: "⚡", text: "High Performance" },
                  { icon: "🎯", text: "Goal-Focused" },
                  { icon: "🧬", text: "Science-Based" },
                ].map((f, i) => (
                  <FeaturePill
                    key={i}
                    icon={f.icon}
                    text={f.text}
                    delay={0.04 * i}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        <Divider />

        {/* ════════════════ 3 · STATS ════════════════ */}
        <div className="relative z-10 sp-tinted">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-10 py-20">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={0}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <SectionLabel color="#fbbf24">By the Numbers</SectionLabel>
              <h2
                className="sp-display uppercase leading-[0.9]"
                style={{
                  fontSize: "clamp(36px,5vw,64px)",
                  color: "rgba(255,255,255,0.88)",
                }}
              >
                Numbers <span style={{ color: "#fbbf24" }}>don't lie.</span>
              </h2>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <StatCard
                value="500+"
                label="Active Members"
                icon={Users}
                color="#ff6b4a"
                delay={0.05}
              />
              <StatCard
                value="5★"
                label="Google Rated"
                icon={Star}
                color="#fbbf24"
                delay={0.1}
              />
              <StatCard
                value="100%"
                label="Results-Driven"
                icon={Target}
                color="#34d399"
                delay={0.15}
              />
              <StatCard
                value="365"
                label="Open Days / Yr"
                icon={Clock}
                color="#f97316"
                delay={0.2}
              />
            </div>
          </div>
        </div>

        <Divider />

        {/* ════════════════ 4 · MANIFESTO ════════════════ */}
        <div className="relative z-10 py-20 text-center overflow-hidden px-6 text-gray-300">
          {[
            {
              text: "The Iron",
              opacity: 0.07,
              size: "clamp(28px,5vw,56px)",
              grad: false,
            },
            {
              text: "Never Lies.",
              opacity: 0.88,
              size: "clamp(28px,5vw,56px)",
              grad: false,
            },
            {
              text: "Only the",
              opacity: 0.07,
              size: "clamp(28px,5vw,56px)",
              grad: false,
            },
            {
              text: "STRONGEST",
              opacity: 1,
              size: "clamp(44px,8vw,96px)",
              grad: true,
            },
            {
              text: "Survive.",
              opacity: 0.07,
              size: "clamp(28px,5vw,56px)",
              grad: false,
            },
          ].map((line, i) => (
            <motion.p
              key={i}
              className={`sp-display leading-[1.0] text-gray-300 uppercase ${line.grad ? "sp-grad-manifesto" : ""}`}
              style={{
                fontSize: line.size,
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.1 }}
            >
              {line.text}
            </motion.p>
          ))}
        </div>

        <Divider />

        {/* ════════════════ 5 · VIDEO (full bleed width) ════════════════ */}
        {/* ════════════════ 5 · VIDEO (controlled size) ════════════════ */}
        <div id="video" className="relative z-10 pb-24">
          {/* header */}
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-10 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <SectionLabel color="#f97316">Official Promo</SectionLabel>
              <h2
                className="sp-display uppercase leading-[0.9]"
                style={{
                  fontSize: "clamp(44px,7vw,80px)",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Feel the <span className="sp-grad-title">fire.</span>
                <br />
                See the arena.
              </h2>
              <p
                className="mt-3"
                style={{ fontSize: 13, color: "rgba(255,255,255,0.28)" }}
              >
                Witness the energy, the equipment, and the community.
              </p>
            </motion.div>
          </div>

          {/* VIDEO — constrained size */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="relative overflow-hidden bg-black mx-auto rounded-3xl"
              style={{
                width: "min(100%, 900px)", // controlled width
                height: "50vh", // 50% of viewport height
                boxShadow:
                  "0 16px 64px rgba(0,0,0,0.55), 0 2px 8px rgba(232,48,30,0.1)",
              }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover block"
                src={strengthArenaVideo}
                muted
                loop
                playsInline
                autoPlay
                onTimeUpdate={handleTimeUpdate}
              />

              {/* gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom,rgba(0,0,0,0.01) 0%,rgba(0,0,0,0.5) 100%)",
                }}
              />

              {/* corner accents */}
              {["sp-tl", "sp-tr", "sp-bl", "sp-br"].map((c) => (
                <div
                  key={c}
                  className={`absolute w-6 h-6 z-30 pointer-events-none ${c}`}
                />
              ))}

              {/* label */}
              <div
                className="absolute top-4 left-5 flex items-center gap-2 z-20 px-3 py-[5px] rounded-lg"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full sp-pulse"
                  style={{ background: "#ff6b4a" }}
                />
                <span
                  className="sp-mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.58)",
                  }}
                >
                  Strength Arena — Official Promo
                </span>
              </div>

              {/* controls */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-6 py-5 z-20"
                style={{
                  background:
                    "linear-gradient(to top,rgba(0,0,0,0.82) 0%,transparent 100%)",
                }}
              >
                <div
                  className="flex-1 h-[2px] rounded overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <div
                    className="h-full rounded transition-[width] duration-300 ease-linear"
                    style={{
                      width: `${videoProgress}%`,
                      background: "#ff6b4a",
                    }}
                  />
                </div>

                <button
                  onClick={toggleMute}
                  aria-label="Mute"
                  className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointer transition-all duration-150 hover:scale-110"
                  style={{
                    background: "rgba(255,255,255,0.1)",
                    backdropFilter: "blur(6px)",
                    color: "rgba(255,255,255,0.65)",
                    border: "none",
                  }}
                >
                  {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
        {/* ════════════════ 6 · CTA ════════════════ */}
        <section className="relative z-10 px-4 sm:px-6 lg:px-10 pb-24">
          <div className="max-w-[1180px] mx-auto">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={0.08}
              viewport={{ once: true }}
            >
              <div className="relative overflow-hidden sp-cta-card text-center px-6 py-16 sm:px-12 sm:py-20 rounded-3xl">
                <div
                  className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl"
                  style={{
                    background:
                      "linear-gradient(90deg,transparent,#e8301e,#f97316,#f5c542,transparent)",
                  }}
                />

                <span
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sp-display pointer-events-none select-none leading-none whitespace-nowrap"
                  style={{
                    fontSize: "clamp(180px,22vw,300px)",
                    color: "rgba(255,255,255,0.025)",
                  }}
                >
                  SA
                </span>

                <div className="relative z-10">
                  <p
                    className="sp-mono font-bold mb-5"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.28em",
                      textTransform: "uppercase",
                      color: "#ff8c6b",
                    }}
                  >
                    <Trophy size={10} className="inline mr-2" /> Join the Legacy
                  </p>
                  <h2
                    className="sp-display uppercase leading-[0.9] mb-4"
                    style={{
                      fontSize: "clamp(44px,7vw,88px)",
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    Train at
                    <br />
                    Strength Arena
                  </h2>
                  <p
                    className="text-sm max-w-[400px] mx-auto mb-9 leading-[1.75]"
                    style={{ color: "rgba(255,255,255,0.42)" }}
                  >
                    Join the community that's powering the next generation of
                    achievers. Your strongest version starts here.
                  </p>
                  <div className="flex gap-3 justify-center flex-wrap">
                    <a
                      href="https://strengtharena.in"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 sp-btn-primary text-white sp-cond font-bold text-sm rounded-xl"
                      style={{
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                      }}
                    >
                      <ExternalLink size={13} /> Visit Strength Arena
                    </a>
                    <a
                      href="https://www.instagram.com/strength_arena_"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-[13px] sp-btn-outline sp-cond font-bold text-sm rounded-xl"
                      style={{
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.72)",
                      }}
                    >
                      <Instagram size={13} /> Follow on Instagram
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ════════════════ FOOTER ════════════════ */}
        <footer
          className="relative z-10 max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-10 py-7 flex items-center justify-between gap-4 flex-wrap"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span
            className="sp-display text-lg"
            style={{ letterSpacing: "0.04em", color: "rgba(255,255,255,0.18)" }}
          >
            STRENGTH ARENA × INTERCONNECT 26.0
          </span>
          <span
            className="sp-mono"
            style={{
              fontSize: 9,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.22)",
            }}
          >
            Official Presenting Sponsor · Davangere, Karnataka
          </span>
        </footer>
      </div>
    </>
  );
};

export default Sponsored;
