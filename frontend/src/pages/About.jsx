import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ranjitha from "../../public/ranjitha.png";
import shiv from "../../public/shivanagowda.png";
import ramya from "../../public/ramya11.jpeg";
import pallavi from "../../public/pallavi.jpeg";
import prateeksha from "../../public/prateeksha11.jpeg";
import giresh from "../../public/giresh11.jpeg";
import beeresh from "../../public/Beeresh.jpeg";
import yashwanth from "../../public/yashwanth.jpeg";
import prathamImg from "../../public/pratham.png";
import rahulImg from "../../public/rahul.jpeg";
import vinayImg from "../../public/vinyas.jpeg";
import adi from "../../public/adi.jpeg";
import puneet from "../../public/puneet11.jpeg";
import vinayaka from "../../public/vinayakak.jpeg";
import kousthubha from "../../public/kousthubha.jpeg";
import annapurna from "../../public/none.png";
import chandana from "../../public/chandanaap.png";
import preeti from "../../public/preeti.jpeg";
import rakshitha from "../../public/Rakshithasn.jpeg";
import yashaswini from "../../public/yashaswini.jpeg";
import pushpa from "../../public/pushpakc.jpeg";
import usha from "../../public/ushab.png";
import ruchitha from "../../public/ruchitharaju.jpeg";
import vaibhavi from "../../public/vibhavi.jpeg";
import junaid from "../../public/junaid.jpeg";
import maqsood from "../../public/MaqsoodMD.jpeg";
import khaderouse from "../../public/gouse.jpeg";
import manasa from "../../public/manasahmata.png";
import shashidhar from "../../public/shashidar.jpeg";
import promo from "../../public/promo.mp4";
import { User, Phone, Mail, Volume2, VolumeX } from "lucide-react";

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
const FacultyCard = ({ img, name, role, email, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="relative flex items-center gap-6 p-6 rounded-2xl bg-[#0c0f18] border border-[#1e2330] overflow-hidden group hover:border-[#3a9de850] hover:shadow-[0_10px_40px_rgba(58,157,232,0.15)] transition-all"
    >
      {/* Gradient Glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-[#3a9de810] to-[#6080f510]" />

      {/* IMAGE */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#3a9de8] to-[#6080f5] blur-md opacity-30 group-hover:opacity-60 transition" />
        <img
          src={img}
          alt={name}
          className="relative w-full h-full object-cover rounded-xl border border-[#1e2330]"
        />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 flex-1 min-w-0">
        <p className="text-xs font-mono text-[#3a9de8] uppercase tracking-wider mb-1">
          Faculty
        </p>

        <h3 className="font-display text-lg font-bold text-white truncate">
          {name}
        </h3>

        <p className="text-sm text-[#8892a4] mb-2">{role}</p>

        <a
          href={`mailto:${email}`}
          className="text-xs text-[#3a9de8] hover:text-[#8bb8ff] transition"
        >
          ✉ {email}
        </a>
      </div>
    </motion.div>
  );
};

/* Added dynamic role prop for StudentCard */
const StudentCard = ({
  img,
  name,
  role = "Student Coordinator",
  phone,
  email,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="relative p-[1px] rounded-2xl bg-gradient-to-br from-[#3a9de8]/30 to-[#6080f5]/20 hover:from-[#3a9de8] hover:to-[#6080f5] transition-all"
    >
      <div className="bg-[#0c0f18]/90 backdrop-blur-xl rounded-2xl p-6 text-center group hover:shadow-[0_20px_50px_rgba(58,157,232,0.15)] transition-all">
        {/* IMAGE */}
        <div className="relative w-24 h-24 mx-auto mb-5 overflow-hidden rounded-xl">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition"></div>
        </div>

        {/* NAME */}
        <h3 className="font-display text-lg font-semibold text-white mb-2 tracking-tight">
          {name}
        </h3>

        {/* ROLE TAG */}
        <p className="text-[10px] uppercase tracking-widest text-[#3a9de8] font-mono mb-4">
          {role}
        </p>

        {/* CONTACT */}
        <div className="space-y-2 text-sm text-[#8892a4]">
          <div className="flex justify-center items-center gap-2">
            <Phone size={14} className="text-[#3a9de8]" />
            <span className="font-mono">{phone}</span>
          </div>

          <div className="flex justify-center items-center gap-2">
            <Mail size={14} className="text-[#3a9de8]" />
            <span className="truncate max-w-[180px]">{email}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Section label ─── */
const SectionLabel = ({ color = "#3a9de8", children }) => (
  <p
    className="font-mono text-[10px] tracking-[0.28em] uppercase font-bold mb-3"
    style={{ color }}
  >
    ✦ {children}
  </p>
);

const mediaTeam = [
  {
    name: "Pratham Bhavi",
    phone: "+91 91086 70736",
    email: "prathambhavi@gmail.com",
    role: "Media Lead ",
    image: prathamImg,
  },
  {
    name: "Rahul R",
    phone: "9113581424",
    email: "rahulr142005@gmail.com",
    role: "Media Team",
    image: rahulImg,
  },
  {
    name: "Vinay S Angadi",
    phone: "8088446257",
    email: "vinaysangadi31@gmail.com",
    role: "Media Team",
    image: vinayImg,
  },
];

const adminTeam = [
  {
    name: "Ramya S",
    phone: "8073114564",
    email: "ramyas5188@gmail.com",
    role: "Admin",
    image: ramya,
  },
  {
    name: "Puneet C Negalur",
    phone: "8073336221",
    email: "puneet@gmail.com",
    role: "Admin",
    image: puneet,
  },

  {
    name: "Pallavi D S",
    phone: "9611185331",
    email: "pallavids359@gmail.com",
    role: "Admin",
    image: pallavi,
  },

  {
    name: "Prateeksha D G",
    phone: "9483743743",
    email: "dgprateeksha01@gmail.com",
    role: "Admin",
    image: prateeksha,
  },
  {
    name: "Gireesh L P",
    phone: "7795065290",
    email: "gireeshlp1@gmail.com",
    role: "Admin",
    image: giresh,
  },
  {
    name: "Vinayaka K",
    phone: "6361685509",
    email: "vinayaka@gmail.com",
    role: "Admin",
    image: vinayaka,
  },
  {
    name: "Aditya R H",
    phone: "8762622221",
    email: "adityarh2020@gmail.com",
    role: "Admin",
    image: adi,
  },

  // 🔥 rest same (unchanged)
  {
    name: "Kousthubha S V",
    phone: "9019716749",
    email: "kousthubha@gmail.com",
    role: "Admin",
    image: kousthubha,
  },
  {
    name: "Annapurna S K",
    phone: "6362887009",
    email: "annapurna@gmail.com",
    role: "Admin",
    image: annapurna,
  },
  {
    name: "Chandana A P",
    phone: "8317489749",
    email: "chandana@gmail.com",
    role: "Admin",
    image: chandana,
  },
  {
    name: "Preeti Gangar",
    phone: "7019866565",
    email: "preeti@gmail.com",
    role: "Admin",
    image: preeti,
  },
  {
    name: "Rakshitha S N",
    phone: "7204450048",
    email: "rakshitha@gmail.com",
    role: "Admin",
    image: rakshitha,
  },
  {
    name: "Yashaswini A L",
    phone: "8861829891",
    email: "yashaswini@gmail.com",
    role: "Admin",
    image: yashaswini,
  },
  {
    name: "Pushpa K C",
    phone: "8792041529",
    email: "pushpa@gmail.com",
    role: "Admin",
    image: pushpa,
  },
  {
    name: "Usha B",
    phone: "8431541078",
    email: "usha@gmail.com",
    role: "Admin",
    image: usha,
  },
  {
    name: "Ruchitha",
    phone: "7022189283",
    email: "ruchitha@gmail.com",
    role: "Admin",
    image: ruchitha,
  },
  {
    name: "Vaibhavi Bhandare",
    phone: "7795366836",
    email: "vaibhavi@gmail.com",
    role: "Admin",
    image: vaibhavi,
  },
  {
    name: "Junaid Kotwal",
    phone: "8197041637",
    email: "junaid@gmail.com",
    role: "Admin",
    image: junaid,
  },
  {
    name: "Maqsood MD",
    phone: "8792404950",
    email: "maqsood@gmail.com",
    role: "Admin",
    image: maqsood,
  },
  {
    name: "Khaderouse Savanur",
    phone: "7353625114",
    email: "khaderouse@gmail.com",
    role: "Admin",
    image: khaderouse,
  },
  {
    name: "Manasa H Mota",
    phone: "9019580671",
    email: "manasa@gmail.com",
    role: "Admin",
    image: manasa,
  },
  {
    name: "Shashidhar Bhattad",
    phone: "8050791640",
    email: "shashidhar@gmail.com",
    role: "Admin",
    image: shashidhar,
  },
];

const CreativeCard = ({ member }) => {
  return (
    <motion.div
      whileHover={{ rotateY: 10, rotateX: -10, scale: 1.05 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="w-60 h-80 bg-[#0c0f18] rounded-xl overflow-hidden relative shadow-2xl"
      style={{ perspective: 800 }}
    >
      {/* IMAGE */}
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover"
      />

      {/* OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent p-4 flex flex-col justify-end">
        <h3 className="text-white font-bold text-lg">{member.name}</h3>
        <p className="text-sm text-gray-300">{member.role}</p>

        <div className="mt-2 text-xs text-gray-400">📞 {member.phone}</div>
        <div className="text-xs text-gray-400 truncate">✉ {member.email}</div>
      </div>
    </motion.div>
  );
};

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

  // Video State & Handlers
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const [videoProgress, setVideoProgress] = useState(0);

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

        .animate-team-slider {
          animation: teamSlider 40s linear infinite;
        }

        @keyframes teamSlider {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
          
        /* video corner brackets */
        .ab-tl{top:12px;left:12px;border-top:1.5px solid rgba(58,157,232,0.55);border-left:1.5px solid rgba(58,157,232,0.55);}
        .ab-tr{top:12px;right:12px;border-top:1.5px solid rgba(58,157,232,0.55);border-right:1.5px solid rgba(58,157,232,0.55);}
        .ab-bl{bottom:12px;left:12px;border-bottom:1.5px solid rgba(58,157,232,0.55);border-left:1.5px solid rgba(58,157,232,0.55);}
        .ab-br{bottom:12px;right:12px;border-bottom:1.5px solid rgba(58,157,232,0.55);border-right:1.5px solid rgba(58,157,232,0.55);}
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
            3. VIDEO PROMO
        ══════════════════════════════ */}
        <section
          className="ab-section"
          style={{ paddingTop: 80, paddingBottom: 40 }}
        >
          {/* Header */}
          <div className="mb-10 text-center sm:text-left">
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <SectionLabel color="#9c3ae8">Official Promo</SectionLabel>
              <h2
                className="font-display uppercase leading-[0.9] tracking-tight"
                style={{
                  fontSize: "clamp(36px,5vw,64px)",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Feel the{" "}
                <span
                  style={{
                    background:
                      "linear-gradient(110deg, #3a9de8, #6080f5, #9c3ae8)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Energy.
                </span>
                <br />
                Join the movement.
              </h2>
              <p
                className="mt-3 font-sans"
                style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}
              >
                Witness the innovation, the community, and the future.
              </p>
            </motion.div>
          </div>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="relative overflow-hidden bg-[#0c0f18] mx-auto rounded-3xl"
              style={{
                width: "min(100%, 900px)",
                height: "50vh",
                boxShadow:
                  "0 16px 64px rgba(0,0,0,0.55), 0 2px 12px rgba(58,157,232,0.15)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <video
                ref={videoRef}
                className="w-full h-full object-cover block"
                src={promo}
                muted
                loop
                playsInline
                autoPlay
                onTimeUpdate={handleTimeUpdate}
              />

              {/* Gradient Overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom,rgba(0,0,0,0.01) 0%,rgba(0,0,0,0.5) 100%)",
                }}
              />

              {/* Corner Accents */}
              {["ab-tl", "ab-tr", "ab-bl", "ab-br"].map((c) => (
                <div
                  key={c}
                  className={`absolute w-6 h-6 z-30 pointer-events-none ${c}`}
                />
              ))}

              {/* Top Label */}
              <div
                className="absolute top-4 left-5 flex items-center gap-2 z-20 px-3 py-[6px] rounded-lg border border-white/5"
                style={{
                  background: "rgba(0,0,0,0.45)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full ab-hero__dot" />
                <span
                  className="font-mono"
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  InterConnect 26.0 — Official Promo
                </span>
              </div>

              {/* Controls */}
              <div
                className="absolute bottom-0 left-0 right-0 flex items-center gap-3 px-6 py-5 z-20"
                style={{
                  background:
                    "linear-gradient(to top,rgba(0,0,0,0.82) 0%,transparent 100%)",
                }}
              >
                {/* Progress Bar */}
                <div
                  className="flex-1 h-[2px] rounded overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.15)" }}
                >
                  <div
                    className="h-full rounded transition-[width] duration-300 ease-linear"
                    style={{
                      width: `${videoProgress}%`,
                      background: "#3a9de8",
                    }}
                  />
                </div>

                {/* Mute Button */}
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
        </section>

        <div className="ab-rule" />

        {/* ══════════════════════════════
            4. FACULTY COORDINATORS
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
            5. STUDENT COORDINATORS
        ══════════════════════════════ */}
        <section
          className="ab-section"
          style={{ paddingTop: 48, paddingBottom: 48 }}
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
              img={beeresh}
              name="Beeresh Kumar B C"
              role="Tech Lead - Student Coordinator"
              phone="6360995219"
              email="bcbeereshkumar@gmail.com"
              delay={0.05}
            />
            <StudentCard
              img={yashwanth}
              name="Yashwanth M"
              role="Student Coordinator"
              phone="7795817114"
              email="yy6996843@gmail.com"
              delay={0.12}
            />
          </div>
        </section>

        {/* ══════════════════════════════
            6. MEDIA TEAM
        ══════════════════════════════ */}
        <section
          className="ab-section"
          style={{ paddingTop: 40, paddingBottom: 40 }}
        >
          <div className="ab-team-header">
            <div>
              <SectionLabel color="#22c55e">Media Team</SectionLabel>
              <h2 className="ab-team-header__title font-display">
                Our Media Team
              </h2>
            </div>
            <div className="ab-team-header__rule" />
          </div>

          <div className="overflow-hidden w-full mt-10">
            <div className="flex w-max gap-6 animate-team-slider">
              {/* Duplicated 4 times to ensure it covers enough width for seamless scrolling */}
              {[...mediaTeam, ...mediaTeam, ...mediaTeam, ...mediaTeam].map(
                (member, i) => (
                  <div key={i} className="min-w-[250px] flex-shrink-0">
                    <CreativeCard member={member} />
                  </div>
                ),
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════
            7. ADMIN TEAM
        ══════════════════════════════ */}
        <section
          className="ab-section"
          style={{ paddingTop: 40, paddingBottom: 80 }}
        >
          <div className="ab-team-header">
            <div>
              <SectionLabel color="#ec4899">Admin Team</SectionLabel>
              <h2 className="ab-team-header__title font-display">
                Our Admin Team
              </h2>
            </div>
            <div className="ab-team-header__rule" />
          </div>

          <div className="overflow-hidden w-full mt-10">
            <div className="flex w-max gap-6 animate-team-slider">
              {[...adminTeam, ...adminTeam].map((member, i) => (
                <div key={i} className="min-w-[250px] flex-shrink-0">
                  <CreativeCard member={member} />
                </div>
              ))}
            </div>
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
