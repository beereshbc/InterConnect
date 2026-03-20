import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ranjitha from "../../public/ranjitha.png";
import shiv from "../assets/shivanagowda.png";
import { User, Phone, Mail } from "lucide-react";

/* ─── animation variants ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, delay: d, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: (d = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: d },
  }),
};

/* ─── Pillar card ─── */
const Pillar = ({ icon, label, color, bg, border, delay }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    custom={delay}
    viewport={{ once: true }}
    className="ab-pillar"
    style={{ "--p-color": color, "--p-bg": bg, "--p-border": border }}
  >
    <span className="ab-pillar__icon">{icon}</span>
    <span className="ab-pillar__label">{label}</span>
  </motion.div>
);

/* ─── Faculty card ─── */
const FacultyCard = ({ img, name, role, email, delay }) => (
  <motion.div
    variants={fadeUp}
    initial="hidden"
    whileInView="show"
    custom={delay}
    viewport={{ once: true }}
    className="ab-person-card ab-person-card--faculty"
  >
    <div className="ab-person-card__img-wrap">
      <img src={img} alt={name} className="ab-person-card__img" />
      <div className="ab-person-card__img-ring" />
    </div>
    <div className="ab-person-card__body">
      <p className="ab-person-card__eyebrow">Faculty</p>
      <h3 className="ab-person-card__name">{name}</h3>
      <p className="ab-person-card__role">{role}</p>
      <a href={`mailto:${email}`} className="ab-person-card__contact">
        <span className="ab-person-card__contact-icon">✉</span>
        {email}
      </a>
    </div>
  </motion.div>
);

const StudentCard = ({ name, phone, email, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="backdrop-blur-sm bg-[#131824]/50 border border-[#1e2330] rounded-2xl p-6 text-center hover:border-[#3a9de850] transition-all group hover:-translate-y-1 shadow-xl"
    >
      {/* Profile Icon Wrapper (Replaces the broken <img> tag) */}
      <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#1e2330] to-[#0c0f18] border border-[#3a9de830] rounded-full flex items-center justify-center group-hover:shadow-[0_0_20px_rgba(58,157,232,0.2)] transition-all duration-300">
        <User
          size={40}
          className="text-[#3a9de8] opacity-80"
          strokeWidth={1.5}
        />
      </div>

      <h3 className="font-display font-bold text-lg text-[#f0f4ff] mb-4 tracking-tight">
        {name}
      </h3>

      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2.5 text-[#8892a4] text-sm">
          <div className="p-1.5 bg-[#3a9de810] rounded-lg">
            <Phone size={14} className="text-[#3a9de8]" />
          </div>
          <span className="font-mono">{phone}</span>
        </div>

        <div className="flex items-center justify-center gap-2.5 text-[#8892a4] text-sm">
          <div className="p-1.5 bg-[#3a9de810] rounded-lg">
            <Mail size={14} className="text-[#3a9de8]" />
          </div>
          <span className="truncate max-w-[180px] font-sans">{email}</span>
        </div>
      </div>
    </motion.div>
  );
};
StudentCard;
/* ─── Section label ─── */
const SectionLabel = ({ color = "#3a9de8", children }) => (
  <p
    className="font-mono text-[10px] tracking-[0.28em] uppercase font-bold mb-3"
    style={{ color }}
  >
    ✦ {children}
  </p>
);

/* ═══════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════ */
const About = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono    { font-family: 'DM Mono', monospace; }

        /* ── HERO ── */
        .ab-hero {
          position: relative;
          min-height: 62vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 100px 16px 72px;
          text-align: center;
          overflow: hidden;
        }

        .ab-hero__label {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 5px 14px;
          background: rgba(59,91,219,0.07);
          border: 1px solid rgba(59,91,219,0.16);
          border-radius: 8px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          color: #6080f5;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .ab-hero__dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: #6080f5;
          animation: ab-pulse 2s ease-in-out infinite;
        }
        @keyframes ab-pulse {
          0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(0.7)}
        }

        .ab-hero__title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(34px, 7vw, 90px);
          font-weight: 800;
          color: #e8edf5;
          line-height: 1.03;
          letter-spacing: -0.035em;
          margin: 0 0 20px;
        }
        .ab-hero__title em {
          font-style: normal;
          background: linear-gradient(110deg, #3a9de8 0%, #6080f5 60%, #9c3ae8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .ab-hero__sub {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(14px, 1.8vw, 17px);
          color: #5a6680;
          max-width: 500px;
          line-height: 1.7;
          margin: 0 auto 28px;
        }

        .ab-hero__org {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #3a4558;
        }

        /* ── RULE LINE ── */
        .ab-rule {
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(59,91,219,0.25), transparent);
          margin: 0;
        }

        /* ── SECTION wrapper ── */
        .ab-section {
          padding: 72px 16px;
          max-width: 1180px;
          margin: 0 auto;
        }
        @media (min-width: 640px)  { .ab-section { padding: 80px 24px; } }
        @media (min-width: 1024px) { .ab-section { padding: 96px 40px; } }

        /* ── MISSION block ── */
        .ab-mission-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }
        @media (min-width: 900px) {
          .ab-mission-grid { grid-template-columns: 1fr 1fr; gap: 64px; }
        }

        .ab-mission__heading {
          font-family: 'Syne', sans-serif;
          font-size: clamp(26px, 3.5vw, 44px);
          font-weight: 800;
          color: #e8edf5;
          line-height: 1.12;
          letter-spacing: -0.025em;
          margin: 0 0 20px;
        }
        .ab-mission__heading span { color: #3a9de8; }

        .ab-mission__body {
          font-family: 'DM Sans', sans-serif;
          font-size: clamp(13px, 1.4vw, 15px);
          color: #4e5e7a;
          line-height: 1.75;
          margin: 0 0 14px;
        }

        .ab-mission__quote {
          border-left: 2px solid #3a9de840;
          padding: 10px 0 10px 16px;
          margin: 20px 0;
          font-family: 'DM Mono', monospace;
          font-size: 12px;
          color: #3a9de8;
          letter-spacing: 0.02em;
        }

        /* Tags */
        .ab-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 24px; }
        .ab-tag {
          padding: 6px 14px;
          border-radius: 8px;
          background: rgba(12,15,24,0.8);
          border: 1px solid rgba(255,255,255,0.07);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #7888a4;
          transition: border-color 0.2s, color 0.2s;
          cursor: default;
        }
        .ab-tag:hover { border-color: #3a9de840; color: #c4cedf; }

        /* Why card */
        .ab-why-card {
          background: rgba(12,15,24,0.7);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 20px;
          padding: 28px 28px 24px;
          backdrop-filter: blur(8px);
        }
        .ab-why-card__title {
          font-family: 'Syne', sans-serif;
          font-size: 18px;
          font-weight: 700;
          color: #3a9de8;
          margin: 0 0 20px;
        }
        .ab-why-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 13px; }
        .ab-why-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          color: #8892a4;
          padding-bottom: 13px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .ab-why-list li:last-child { border-bottom: none; padding-bottom: 0; }
        .ab-why-check {
          width: 20px; height: 20px;
          flex-shrink: 0;
          border-radius: 6px;
          background: rgba(58,157,232,0.1);
          border: 1px solid rgba(58,157,232,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 10px;
          color: #3a9de8;
        }
        .ab-why-bottom {
          margin-top: 20px;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(16,21,32,0.8);
          border: 1px solid rgba(255,255,255,0.05);
          font-family: 'DM Mono', monospace;
          font-size: 11px;
          color: #3a4558;
        }
        .ab-why-bottom span { color: #3a9de8; }

        /* ── PILLARS ── */
        .ab-pillars-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        @media (min-width: 540px) { .ab-pillars-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 900px) { .ab-pillars-grid { grid-template-columns: repeat(5, 1fr); gap: 14px; } }

        .ab-pillar {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          padding: 20px 12px 18px;
          border-radius: 16px;
          background: var(--p-bg);
          border: 1px solid var(--p-border);
          text-align: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .ab-pillar:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(0,0,0,0.25);
        }
        .ab-pillar__icon { font-size: 24px; line-height: 1; }
        .ab-pillar__label {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--p-color);
        }

        /* ── STATS ROW ── */
        .ab-stats-row {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 56px;
        }
        @media (min-width: 640px)  { .ab-stats-row { grid-template-columns: repeat(4, 1fr); } }

        .ab-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 12px 20px;
          border-radius: 16px;
          background: rgba(12,15,24,0.6);
          border: 1px solid rgba(255,255,255,0.05);
          text-align: center;
          gap: 6px;
        }
        .ab-stat__val {
          font-family: 'Syne', sans-serif;
          font-size: clamp(26px, 4vw, 38px);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .ab-stat__lbl {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #3a4558;
        }

        /* ── TEAM SECTION HEADER ── */
        .ab-team-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }
        .ab-team-header__title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(22px, 3vw, 32px);
          font-weight: 800;
          color: #e8edf5;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .ab-team-header__rule {
          flex: 1;
          height: 1px;
          background: linear-gradient(to right, rgba(255,255,255,0.06), transparent);
          min-width: 40px;
          margin-bottom: 6px;
        }

        /* ── PERSON CARDS ── */
        .ab-cards-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        @media (min-width: 640px) { .ab-cards-grid { grid-template-columns: repeat(2, 1fr); } }

        .ab-person-card {
          display: flex;
          gap: 20px;
          padding: 24px;
          border-radius: 20px;
          background: rgba(12,15,24,0.7);
          border: 1px solid rgba(255,255,255,0.06);
          backdrop-filter: blur(8px);
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
          position: relative;
          overflow: hidden;
        }
        .ab-person-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(58,157,232,0.03) 0%, transparent 60%);
          pointer-events: none;
        }
        .ab-person-card--student::before {
          background: linear-gradient(135deg, rgba(251,191,36,0.03) 0%, transparent 60%);
        }
        .ab-person-card:hover {
          border-color: rgba(58,157,232,0.2);
          transform: translateY(-3px);
          box-shadow: 0 16px 36px rgba(0,0,0,0.3);
        }
        .ab-person-card--student:hover {
          border-color: rgba(251,191,36,0.2);
        }

        .ab-person-card__img-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .ab-person-card__img {
          width: 72px; height: 72px;
          border-radius: 14px;
          object-fit: cover;
          display: block;
        }
        @media (min-width: 540px) {
          .ab-person-card__img { width: 84px; height: 84px; }
        }
        .ab-person-card__img-ring {
          position: absolute;
          inset: -2px;
          border-radius: 16px;
          border: 1.5px solid rgba(58,157,232,0.25);
          pointer-events: none;
        }
        .ab-person-card__img-ring--amber {
          border-color: rgba(251,191,36,0.22);
        }

        .ab-person-card__body {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ab-person-card__eyebrow {
          font-family: 'DM Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #3a9de8;
          margin: 0;
        }
        .ab-person-card__eyebrow--amber { color: #fbbf24; }

        .ab-person-card__name {
          font-family: 'Syne', sans-serif;
          font-size: clamp(14px, 2vw, 17px);
          font-weight: 700;
          color: #e8edf5;
          margin: 2px 0 2px;
          letter-spacing: -0.01em;
        }

        .ab-person-card__role {
          font-family: 'DM Sans', sans-serif;
          font-size: 12px;
          color: #4e5e7a;
          margin: 0 0 8px;
        }

        .ab-person-card__contacts {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 4px;
        }

        .ab-person-card__contact {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: #3a4558;
          text-decoration: none;
          transition: color 0.2s;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ab-person-card__contact:hover { color: #7888a4; }
        .ab-person-card__contact-icon { font-style: normal; font-size: 11px; }

        /* ── BOTTOM CTA ── */
        .ab-cta {
          margin-top: 80px;
          padding: 52px 32px;
          border-radius: 24px;
          background: rgba(12,15,24,0.6);
          border: 1px solid rgba(59,91,219,0.12);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .ab-cta::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 400px; height: 200px;
          background: radial-gradient(ellipse, rgba(59,91,219,0.06) 0%, transparent 70%);
          pointer-events: none;
        }
        .ab-cta__title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(22px, 4vw, 38px);
          font-weight: 800;
          color: #e8edf5;
          letter-spacing: -0.025em;
          margin: 0 0 10px;
        }
        .ab-cta__sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
          color: #4e5e7a;
          margin: 0 0 28px;
        }
        .ab-cta__btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 12px;
          background: #1a2d7a;
          border: 1px solid #2d4399;
          color: #a5b8f8;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
        }
        .ab-cta__btn:hover {
          background: #203291;
          border-color: #3b5bdb;
          color: #c5d0fb;
          transform: translateY(-2px);
        }

        /* Ambient decorative glows */
        .ab-glow-tl {
          position: fixed;
          top: -8%; left: -8%;
          width: 420px; height: 420px;
          background: radial-gradient(circle, rgba(58,157,232,0.055) 0%, transparent 70%);
          pointer-events: none;
          border-radius: 50%;
          z-index: 0;
        }
        .ab-glow-br {
          position: fixed;
          bottom: -10%; right: -10%;
          width: 480px; height: 480px;
          background: radial-gradient(circle, rgba(251,191,36,0.04) 0%, transparent 70%);
          pointer-events: none;
          border-radius: 50%;
          z-index: 0;
        }
      `}</style>

      {/* Ambient glows */}
      <div className="ab-glow-tl" />
      <div className="ab-glow-br" />

      <div className="min-h-screen bg-transparent text-[#f0f4ff] selection:bg-[#3a9de8] selection:text-white">
        {/* ══════════════════════════════
            1. HERO
        ══════════════════════════════ */}
        <section className="ab-hero" ref={heroRef}>
          <motion.div
            style={{ y: heroY, opacity: heroOpacity }}
            className="relative z-10 flex flex-col items-center"
          >
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate="show"
              custom={0}
            >
              <div className="ab-hero__label">
                <span className="ab-hero__dot" />
                InterConnect 26.O · GMIT & GMU
              </div>
            </motion.div>

            <motion.h1
              className="ab-hero__title font-display"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.08}
            >
              About <em>InterConnect</em>
            </motion.h1>

            <motion.p
              className="ab-hero__sub"
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0.18}
            >
              A next-generation innovation platform connecting students, ideas,
              and real-world problem solving across disciplines.
            </motion.p>

            <motion.p
              className="ab-hero__org font-mono"
              variants={fadeIn}
              initial="hidden"
              animate="show"
              custom={0.28}
            >
              GM University · GMIT · CSE Department
            </motion.p>
          </motion.div>
        </section>

        <div className="ab-rule" />

        {/* ══════════════════════════════
            2. MISSION & WHY
        ══════════════════════════════ */}
        <section className="ab-section">
          <div className="ab-mission-grid">
            {/* LEFT — mission copy */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={0}
              viewport={{ once: true }}
            >
              <SectionLabel>About the Initiative</SectionLabel>

              <h2 className="ab-mission__heading font-display">
                InterConnect 26.0 <span>Innovation Challenge</span>
              </h2>

              <div className="ab-mission__quote font-mono">
                Collaborate, innovate, and build impactful solutions across
                disciplines.
              </div>

              <p className="ab-mission__body">
                InterConnect 26.0 brings together students from Engineering,
                MBA, Law, Pharmacy, and more to tackle real-world challenges.
                It's where domain knowledge meets technical expertise to build
                things that actually matter.
              </p>
              <p className="ab-mission__body">
                Participants submit innovative ideas and transform them into
                real solutions through mentorship, cross-functional
                collaboration, and a structured problem-solving pipeline.
              </p>
              <p className="ab-mission__body">
                The mission is simple: build creativity, grow skills, and ship
                impactful innovations that extend beyond the classroom.
              </p>

              <div className="ab-tags">
                {[
                  "🚀 Innovation",
                  "🤝 Teamwork",
                  "💡 Real Impact",
                  "🎓 All Departments",
                  "⚡ Fast Execution",
                ].map((t, i) => (
                  <span key={i} className="ab-tag font-mono">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* RIGHT — why card */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              custom={0.15}
              viewport={{ once: true }}
            >
              <div className="ab-why-card">
                <p className="ab-why-card__title font-display">
                  Why InterConnect?
                </p>
                <ul className="ab-why-list">
                  {[
                    "Real-world problem solving experience",
                    "Cross-department collaboration",
                    "Industry-relevant technical skills",
                    "Expert mentorship & guidance",
                    "Innovation-driven project culture",
                    "Recognition, rewards & networking",
                  ].map((item, i) => (
                    <li key={i}>
                      <span className="ab-why-check">✓</span>
                      <span
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13,
                        }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="ab-why-bottom font-mono">
                  🚀 Build. Learn. Lead.{" "}
                  <span>— Your ideas can create real impact.</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Pillars ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={0}
            viewport={{ once: true }}
            className="mt-20"
          >
            <SectionLabel color="#4ade80">Core Pillars</SectionLabel>
            <div className="ab-pillars-grid">
              <Pillar
                icon="🧩"
                label="Interdisciplinary"
                color="#3a9de8"
                bg="rgba(58,157,232,0.06)"
                border="rgba(58,157,232,0.12)"
                delay={0.05}
              />
              <Pillar
                icon="🔬"
                label="Research-Driven"
                color="#4ade80"
                bg="rgba(74,222,128,0.06)"
                border="rgba(74,222,128,0.12)"
                delay={0.1}
              />
              <Pillar
                icon="🛠"
                label="Build to Ship"
                color="#fbbf24"
                bg="rgba(251,191,36,0.06)"
                border="rgba(251,191,36,0.12)"
                delay={0.15}
              />
              <Pillar
                icon="🌐"
                label="Cross-Campus"
                color="#9c3ae8"
                bg="rgba(156,58,232,0.06)"
                border="rgba(156,58,232,0.12)"
                delay={0.2}
              />
              <Pillar
                icon="🏆"
                label="Impact First"
                color="#e85d3a"
                bg="rgba(232,93,58,0.06)"
                border="rgba(232,93,58,0.12)"
                delay={0.25}
              />
            </div>
          </motion.div>
        </section>

        <div className="ab-rule" />

        {/* ══════════════════════════════
            3. FACULTY COORDINATORS
        ══════════════════════════════ */}
        <section
          className="ab-section"
          style={{ paddingTop: 64, paddingBottom: 48 }}
        >
          <div className="ab-team-header">
            <div>
              <SectionLabel>Our Team</SectionLabel>
              <h2 className="ab-team-header__title font-display">
                Faculty Coordinators
              </h2>
            </div>
            <div className="ab-team-header__rule" />
          </div>

          <div className="ab-cards-grid">
            <FacultyCard
              img={shiv}
              name="Dr. Shivanagowda G. M"
              role="Professor & Head, CSE"
              email="shivana.gowda@gmail.com"
              delay={0.05}
            />
            <FacultyCard
              img={ranjitha}
              name="Ms. Ranjitha D S"
              role="Assistant Professor, CSE"
              email="ranjithads@gmu.ac.in"
              delay={0.12}
            />
          </div>
        </section>

        {/* ══════════════════════════════
            4. STUDENT COORDINATORS
        ══════════════════════════════ */}
        <section
          className="ab-section"
          style={{ paddingTop: 48, paddingBottom: 80 }}
        >
          <div className="ab-team-header">
            <div>
              <SectionLabel color="#fbbf24">Student Team</SectionLabel>
              <h2 className="ab-team-header__title font-display">
                Student Coordinators
              </h2>
            </div>
            <div className="ab-team-header__rule" />
          </div>

          <div className="ab-cards-grid">
            <StudentCard
              name="Beeresh Kumar B C"
              phone="6360995219"
              email="bcbeereshkumar@gmail.com"
              delay={0.05}
            />
            <StudentCard
              name="Yashwanth M"
              phone="7795817114"
              email="yy6996843@gmail.com"
              delay={0.12}
            />
          </div>

          {/* ── Bottom CTA ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            custom={0.1}
            viewport={{ once: true }}
            className="ab-cta"
          >
            <div className="relative z-10">
              <p className="ab-cta__title font-display">
                Ready to be part of it?
              </p>
              <p className="ab-cta__sub">
                Join the network, find a challenge, and start building.
              </p>
              <a href="/problems" className="ab-cta__btn font-display">
                Explore Problem Statements →
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </>
  );
};

export default About;
