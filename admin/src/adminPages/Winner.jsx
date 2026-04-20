import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  User,
  Award,
  Code,
  Database,
  Zap,
  Trophy,
  Shield,
  ChevronRight,
  Sparkles,
  Lock,
  Eye,
  AlertTriangle,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   CONFIG
═══════════════════════════════════════════════ */
const EVENT_DATE = "April 21, 2026";
const ORGANIZATION = "GM University · GMIT";
const COUNTDOWN_FROM = 5;

const WINNERS_DATA = {
  contributors: [
    {
      id: "c1",
      rank: 1,
      name: "Mallikarjun C V",
      branch: "CSE",
      totalScore: 706,
      awardTitle: "Top Contributor Award",
    },
    {
      id: "c2",
      rank: 2,
      name: "Tasmiya Khanum",
      branch: "CSE",
      totalScore: 365,
      awardTitle: "Top Contributor Award",
    },
    {
      id: "c3",
      rank: 3,
      name: "Trupti Shetti",
      branch: "ISE",
      totalScore: 348,
      awardTitle: "Top Contributor Award",
    },
    {
      id: "c4",
      rank: 4,
      name: "Maanvi M",
      branch: "AIML",
      totalScore: 312,
      awardTitle: "Top Contributor Award",
    },
    {
      id: "c5",
      rank: 5,
      name: "Rishikesh N",
      branch: "CSE",
      totalScore: 258,
      awardTitle: "Top Contributor Award",
    },
    {
      id: "c6",
      rank: 6,
      name: "Ananya D",
      branch: "ECE",
      totalScore: 780,
      awardTitle: "Top Contributor Award",
    },
    {
      id: "c7",
      rank: 7,
      name: "Rohan G",
      branch: "ISE",
      totalScore: 710,
      awardTitle: "Top Contributor Award",
    },
  ],
  projects: [
    {
      id: "p1",
      rank: 1,
      projectID: "PROJ-GT",
      name: "GoldenTime",
      awardTitle: "Vanguard Innovation Award",
    },
    {
      id: "p2",
      rank: 2,
      projectID: "PROJ-FD",
      name: "FarmDirect",
      awardTitle: "Catalyst Excellence Award",
    },
  ],
  admins: [
    {
      id: "a1",
      name: "Ramya S",
      role: "Admin Coordinator",
      awardTitle: "Architect of Excellence Award",
    },
    {
      id: "a2",
      name: "Puneet C Negalur",
      role: "Admin Coordinator",
      awardTitle: "Guiding Star Award",
    },
  ],
};

const TYPE_THEME = {
  contributor: { color: "#3a9de8", glow: "rgba(58,157,232,0.45)", Icon: User },
  project: { color: "#fbbf24", glow: "rgba(251,191,36,0.45)", Icon: Database },
  admin: { color: "#ec4899", glow: "rgba(236,72,153,0.45)", Icon: Shield },
};

/* ═══════════════════════════════════════════════
   FLOATING PARTICLE CANVAS
═══════════════════════════════════════════════ */
const ParticleField = () => {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const pts = Array.from({ length: 130 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.4 + 0.3,
      dx: (Math.random() - 0.5) * 0.25,
      dy: -(Math.random() * 0.35 + 0.08),
      a: Math.random() * 0.55 + 0.1,
      ph: Math.random() * Math.PI * 2,
      hue:
        Math.random() < 0.5
          ? "255,200,80"
          : Math.random() < 0.5
            ? "80,180,255"
            : "255,80,160",
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        p.ph += 0.018;
        if (p.y < -4) {
          p.y = canvas.height + 4;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
        const alpha = p.a * (0.65 + 0.35 * Math.sin(p.ph));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.hue},${alpha})`;
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
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.7,
      }}
    />
  );
};

/* ═══════════════════════════════════════════════
   SVG CIRCULAR COUNTDOWN RING
═══════════════════════════════════════════════ */
const CountdownRing = ({ value, max, color }) => {
  const R = 72;
  const circ = 2 * Math.PI * R;
  const offset = circ * (1 - value / max);
  return (
    <svg
      width={190}
      height={190}
      viewBox="0 0 190 190"
      style={{ transform: "rotate(-90deg)", position: "absolute" }}
    >
      {/* Track */}
      <circle
        cx={95}
        cy={95}
        r={R}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth={3}
      />
      {/* Outer pulse ring */}
      <circle
        cx={95}
        cy={95}
        r={R + 8}
        fill="none"
        stroke={color}
        strokeWidth={1}
        opacity={0.15}
        strokeDasharray="4 8"
      />
      {/* Live progress */}
      <motion.circle
        cx={95}
        cy={95}
        r={R}
        fill="none"
        stroke={color}
        strokeWidth={3.5}
        strokeLinecap="round"
        strokeDasharray={circ}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 0.85, ease: "easeOut" }}
        style={{ filter: `drop-shadow(0 0 6px ${color})` }}
      />
    </svg>
  );
};

/* ═══════════════════════════════════════════════
   CORNER BRACKET DECORATION
═══════════════════════════════════════════════ */
const CornerBrackets = ({ color }) => (
  <>
    {[
      { top: 8, left: 8, bt: `2px solid ${color}`, bl: `2px solid ${color}` },
      { top: 8, right: 8, bt: `2px solid ${color}`, br: `2px solid ${color}` },
      {
        bottom: 8,
        left: 8,
        bb: `2px solid ${color}`,
        bl: `2px solid ${color}`,
      },
      {
        bottom: 8,
        right: 8,
        bb: `2px solid ${color}`,
        br: `2px solid ${color}`,
      },
    ].map((s, i) => (
      <div
        key={i}
        style={{
          position: "absolute",
          width: 18,
          height: 18,
          zIndex: 10,
          ...s,
          borderTop: s.bt || "none",
          borderBottom: s.bb || "none",
          borderLeft: s.bl || "none",
          borderRight: s.br || "none",
          opacity: 0.5,
        }}
      />
    ))}
  </>
);

/* ═══════════════════════════════════════════════
   FULL-SCREEN FLASH OVERLAY
═══════════════════════════════════════════════ */
let flashSetters = [];
const triggerGlobalFlash = () => flashSetters.forEach((fn) => fn(true));

const FlashOverlay = () => {
  const [on, setOn] = useState(false);
  useEffect(() => {
    flashSetters.push(setOn);
    return () => {
      flashSetters = flashSetters.filter((f) => f !== setOn);
    };
  }, []);
  useEffect(() => {
    if (on) {
      const t = setTimeout(() => setOn(false), 600);
      return () => clearTimeout(t);
    }
  }, [on]);
  return (
    <AnimatePresence>
      {on && (
        <motion.div
          key="flash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          style={{
            position: "fixed",
            inset: 0,
            background:
              "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.98) 0%, rgba(240,220,100,0.7) 40%, transparent 80%)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        />
      )}
    </AnimatePresence>
  );
};

/* ═══════════════════════════════════════════════
   WINNER CARD  (states: idle→activating→counting→revealed)
═══════════════════════════════════════════════ */
const WinnerCard = ({ data, type, index }) => {
  const [status, setStatus] = useState("idle");
  const [cd, setCd] = useState(COUNTDOWN_FROM);
  const theme = TYPE_THEME[type];
  const TheIcon = theme.Icon;

  /* countdown ticker */
  useEffect(() => {
    if (status !== "counting") return;
    if (cd > 0) {
      const t = setTimeout(() => setCd((n) => n - 1), 1000);
      return () => clearTimeout(t);
    }
    // cd === 0 → reveal
    triggerGlobalFlash();
    setTimeout(() => {
      setStatus("revealed");
      fireConfetti();
    }, 400);
  }, [status, cd]);

  /* activating → counting after brief flash */
  useEffect(() => {
    if (status === "activating") {
      const t = setTimeout(() => setStatus("counting"), 900);
      return () => clearTimeout(t);
    }
  }, [status]);

  const handleClick = () => {
    if (status === "idle") setStatus("activating");
  };

  const fireConfetti = () => {
    const end = Date.now() + 2800;
    const colors = [
      "#ffd700",
      "#ff4081",
      "#00c8ff",
      "#ffffff",
      "#fbbf24",
      "#ec4899",
      "#a78bfa",
    ];
    (function frame() {
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 70,
        origin: { x: 0 },
        colors,
        gravity: 0.9,
      });
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 70,
        origin: { x: 1 },
        colors,
        gravity: 0.9,
      });
      confetti({
        particleCount: 5,
        angle: 90,
        spread: 110,
        origin: { x: 0.5, y: 0.55 },
        colors,
        gravity: 1.1,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  };

  /* shake intensity grows as countdown decreases */
  const shakeX =
    status === "counting" && cd <= 3
      ? [0, (4 - cd) * 2.5, -(4 - cd) * 2.5, (4 - cd) * 1.5, 0]
      : 0;
  const shakeY =
    status === "counting" && cd <= 3
      ? [0, -(4 - cd) * 1.2, (4 - cd) * 1.2, 0]
      : 0;

  /* urgency color */
  const urgencyColor =
    cd <= 1
      ? "#ff3b30"
      : cd <= 2
        ? "#ff9500"
        : cd <= 3
          ? "#ffcc00"
          : theme.color;

  /* ─── card label based on type ─── */
  const typeLabel =
    type === "contributor"
      ? `Rank #${data.rank} · Contributor`
      : type === "project"
        ? `Project Award · Rank #${data.rank}`
        : "Admin Excellence Award";

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 55, scale: 0.88 },
        show: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            type: "spring",
            stiffness: 240,
            damping: 22,
            delay: index * 0.06,
          },
        },
      }}
      style={{ perspective: 1400 }}
    >
      {/* shake wrapper */}
      <motion.div
        animate={{ x: shakeX, y: shakeY }}
        transition={
          status === "counting" && cd <= 3
            ? { duration: 0.28, repeat: Infinity, repeatType: "loop" }
            : { duration: 0 }
        }
        onClick={handleClick}
        style={{ width: "100%", height: 348 }}
      >
        {/* 3-D flip wrapper */}
        <motion.div
          animate={{ rotateY: status === "revealed" ? 180 : 0 }}
          transition={{
            duration: 1.1,
            type: "spring",
            stiffness: 75,
            damping: 17,
          }}
          style={{
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            position: "relative",
          }}
        >
          {/* ══════════ FRONT FACE ══════════ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              overflow: "hidden",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              background:
                "linear-gradient(155deg, #090c18 0%, #10141f 55%, #0a0d18 100%)",
              border: `1px solid ${status === "counting" ? urgencyColor + "55" : "rgba(255,255,255,0.07)"}`,
              boxShadow:
                status === "counting"
                  ? `0 0 35px ${urgencyColor}28, inset 0 0 28px ${urgencyColor}08`
                  : "none",
              cursor: status === "idle" ? "pointer" : "default",
            }}
          >
            {/* scanline overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
                backgroundImage:
                  "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.13) 2px,rgba(0,0,0,0.13) 4px)",
              }}
            />
            {/* grid lines */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 1,
                pointerEvents: "none",
                opacity: 0.4,
                backgroundImage: `linear-gradient(${theme.color}07 1px,transparent 1px),linear-gradient(90deg,${theme.color}07 1px,transparent 1px)`,
                backgroundSize: "48px 48px",
              }}
            />

            <CornerBrackets color={theme.color} />

            <div
              style={{
                position: "relative",
                zIndex: 5,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <AnimatePresence mode="wait">
                {/* ── IDLE ── */}
                {status === "idle" && (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      padding: "0 28px",
                    }}
                  >
                    {/* CLASSIFIED stamp */}
                    <motion.div
                      animate={{ opacity: [0.35, 0.75, 0.35] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                      style={{
                        position: "absolute",
                        top: 20,
                        right: 18,
                        border: "2px solid rgba(255,50,50,0.45)",
                        borderRadius: 3,
                        padding: "2px 7px",
                        transform: "rotate(13deg)",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'DM Mono',monospace",
                          fontSize: 8,
                          fontWeight: 700,
                          letterSpacing: "0.28em",
                          color: "rgba(255,80,80,0.75)",
                          textTransform: "uppercase",
                        }}
                      >
                        Classified
                      </span>
                    </motion.div>

                    {/* lock ring */}
                    <motion.div
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 3.5, repeat: Infinity }}
                      style={{
                        width: 86,
                        height: 86,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 20,
                        position: "relative",
                        background: `radial-gradient(circle, ${theme.color}12 0%, transparent 70%)`,
                        border: `1px solid ${theme.color}35`,
                      }}
                    >
                      {/* spinning dashed ring */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 14,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        style={{
                          position: "absolute",
                          inset: 0,
                          borderRadius: "50%",
                          border: `1px dashed ${theme.color}30`,
                        }}
                      />
                      <Lock
                        size={30}
                        color={theme.color}
                        style={{ opacity: 0.75 }}
                      />
                    </motion.div>

                    <p
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 10,
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                        color: theme.color,
                        marginBottom: 10,
                      }}
                    >
                      {typeLabel}
                    </p>
                    <h3
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontSize: 22,
                        fontWeight: 800,
                        color: "white",
                        marginBottom: 14,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      Tap to Reveal
                    </h3>

                    {/* pulse dots */}
                    <motion.div
                      animate={{ opacity: [0.45, 1, 0.45] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: theme.color,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'DM Mono',monospace",
                          fontSize: 9,
                          color: "#4e5e7a",
                          textTransform: "uppercase",
                          letterSpacing: "0.3em",
                        }}
                      >
                        Identity Sealed
                      </span>
                      <div
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: theme.color,
                        }}
                      />
                    </motion.div>

                    {/* hover hint */}
                    <motion.div
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        position: "absolute",
                        bottom: 22,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        opacity: 0.3,
                      }}
                    >
                      <Eye size={11} color="#8892a4" />
                      <span
                        style={{
                          fontFamily: "'DM Mono',monospace",
                          fontSize: 8,
                          color: "#8892a4",
                          letterSpacing: "0.25em",
                          textTransform: "uppercase",
                        }}
                      >
                        Click to decrypt
                      </span>
                    </motion.div>
                  </motion.div>
                )}

                {/* ── ACTIVATING ── */}
                {status === "activating" && (
                  <motion.div
                    key="activating"
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, type: "spring" }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.7, ease: "easeInOut" }}
                      style={{
                        width: 68,
                        height: 68,
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 18,
                        background: `radial-gradient(circle, ${theme.color}35 0%, transparent 70%)`,
                        border: `1.5px solid ${theme.color}`,
                        boxShadow: `0 0 24px ${theme.glow}`,
                      }}
                    >
                      <Eye size={28} color={theme.color} />
                    </motion.div>
                    <motion.p
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 0.35, repeat: Infinity }}
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 12,
                        letterSpacing: "0.42em",
                        textTransform: "uppercase",
                        color: theme.color,
                      }}
                    >
                      Access Granted
                    </motion.p>
                    <motion.p
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{
                        duration: 0.5,
                        repeat: Infinity,
                        delay: 0.15,
                      }}
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 9,
                        color: "#4e5e7a",
                        letterSpacing: "0.28em",
                        textTransform: "uppercase",
                        marginTop: 8,
                      }}
                    >
                      Initialising sequence...
                    </motion.p>
                  </motion.div>
                )}

                {/* ── COUNTING ── */}
                {status === "counting" && (
                  <motion.div
                    key="counting"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, filter: "blur(18px)", scale: 1.3 }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      position: "relative",
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                    }}
                  >
                    {/* outer ping circles */}
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      style={{
                        position: "absolute",
                        width: 200,
                        height: 200,
                        borderRadius: "50%",
                        border: `1px solid ${urgencyColor}`,
                        pointerEvents: "none",
                      }}
                    />
                    <motion.div
                      animate={{ scale: [1, 1.9, 1], opacity: [0.1, 0, 0.1] }}
                      transition={{ duration: 1, repeat: Infinity, delay: 0.3 }}
                      style={{
                        position: "absolute",
                        width: 220,
                        height: 220,
                        borderRadius: "50%",
                        border: `1px solid ${urgencyColor}`,
                        pointerEvents: "none",
                      }}
                    />

                    {/* ring */}
                    <CountdownRing
                      value={cd}
                      max={COUNTDOWN_FROM}
                      color={urgencyColor}
                    />

                    {/* number */}
                    <div
                      style={{
                        position: "relative",
                        zIndex: 10,
                        width: 190,
                        height: 190,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {/* glitch layers at cd <= 2 */}
                      {cd <= 2 && (
                        <>
                          <motion.span
                            animate={{ x: [-4, 4, -4], opacity: [0, 0.55, 0] }}
                            transition={{ duration: 0.13, repeat: Infinity }}
                            style={{
                              position: "absolute",
                              fontFamily: "'Syne',sans-serif",
                              fontSize: 88,
                              fontWeight: 900,
                              color: "#ff3b30",
                              lineHeight: 1,
                              clipPath:
                                "polygon(0 25%,100% 25%,100% 50%,0 50%)",
                            }}
                          >
                            {cd}
                          </motion.span>
                          <motion.span
                            animate={{ x: [4, -4, 4], opacity: [0, 0.45, 0] }}
                            transition={{
                              duration: 0.1,
                              repeat: Infinity,
                              delay: 0.06,
                            }}
                            style={{
                              position: "absolute",
                              fontFamily: "'Syne',sans-serif",
                              fontSize: 88,
                              fontWeight: 900,
                              color: "#00d4ff",
                              lineHeight: 1,
                              clipPath:
                                "polygon(0 60%,100% 60%,100% 78%,0 78%)",
                            }}
                          >
                            {cd}
                          </motion.span>
                        </>
                      )}
                      <motion.span
                        key={cd}
                        initial={{ scale: 1.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.4, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 420,
                          damping: 22,
                        }}
                        style={{
                          fontFamily: "'Syne',sans-serif",
                          fontSize: 88,
                          fontWeight: 900,
                          lineHeight: 1,
                          background: `linear-gradient(180deg, #ffffff 20%, ${urgencyColor} 100%)`,
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          position: "relative",
                          textShadow: "none",
                          filter:
                            cd <= 1
                              ? `drop-shadow(0 0 18px ${urgencyColor})`
                              : "none",
                        }}
                      >
                        {cd}
                      </motion.span>

                      <motion.p
                        animate={{ opacity: cd <= 2 ? [1, 0.2, 1] : 0.75 }}
                        transition={{
                          duration: 0.38,
                          repeat: cd <= 2 ? Infinity : 0,
                        }}
                        style={{
                          fontFamily: "'DM Mono',monospace",
                          fontSize: 9,
                          letterSpacing: "0.4em",
                          textTransform: "uppercase",
                          color: urgencyColor,
                          marginTop: 4,
                        }}
                      >
                        {cd <= 1
                          ? "⚡ Imminent"
                          : cd <= 3
                            ? "Revealing..."
                            : "Decrypting"}
                      </motion.p>
                    </div>

                    {/* warning strip at bottom */}
                    {cd <= 2 && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 0.32, repeat: Infinity }}
                        style={{
                          position: "absolute",
                          bottom: 20,
                          left: 16,
                          right: 16,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <AlertTriangle size={10} color="#ff3b30" />
                        <span
                          style={{
                            fontFamily: "'DM Mono',monospace",
                            fontSize: 8,
                            color: "#ff3b30",
                            letterSpacing: "0.28em",
                            textTransform: "uppercase",
                          }}
                        >
                          Critical · Reveal Imminent
                        </span>
                        <AlertTriangle size={10} color="#ff3b30" />
                      </motion.div>
                    )}

                    {/* ekg bar row */}
                    <div
                      style={{
                        position: "absolute",
                        top: 14,
                        left: 16,
                        right: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      {Array.from({ length: 28 }).map((_, i) => (
                        <motion.div
                          key={i}
                          animate={{ scaleY: [1, 1 + Math.random() * 3, 1] }}
                          transition={{
                            duration: 0.3 + Math.random() * 0.4,
                            repeat: Infinity,
                            delay: i * 0.05,
                          }}
                          style={{
                            flex: 1,
                            height: 12,
                            background: `${urgencyColor}`,
                            borderRadius: 1,
                            transformOrigin: "bottom",
                            opacity: 0.35,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ══════════ BACK FACE (Winner Revealed) ══════════ */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 20,
              overflow: "hidden",
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background:
                "linear-gradient(155deg, #06101e 0%, #0d1a2a 55%, #071018 100%)",
              border: `1px solid ${theme.color}`,
              boxShadow: `0 0 50px ${theme.glow}, 0 0 100px ${theme.glow}55, inset 0 0 40px ${theme.color}0d`,
            }}
          >
            {/* bg grid */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                backgroundImage: `linear-gradient(${theme.color}09 1px,transparent 1px),linear-gradient(90deg,${theme.color}09 1px,transparent 1px)`,
                backgroundSize: "38px 38px",
              }}
            />
            {/* top beam */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "70%",
                height: 1,
                background: `linear-gradient(90deg, transparent, ${theme.color}, transparent)`,
              }}
            />
            {/* bottom beam */}
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: "40%",
                height: 1,
                background: `linear-gradient(90deg, transparent, ${theme.color}66, transparent)`,
              }}
            />

            <CornerBrackets color={theme.color} />

            <div
              style={{
                position: "relative",
                zIndex: 5,
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                padding: "20px 20px 16px",
              }}
            >
              {/* body */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {/* icon badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -25 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: 0.45,
                    type: "spring",
                    stiffness: 220,
                    damping: 15,
                  }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 14,
                    background: `linear-gradient(135deg, ${theme.color}22, ${theme.color}44)`,
                    border: `1px solid ${theme.color}70`,
                    boxShadow: `0 0 24px ${theme.glow}`,
                  }}
                >
                  <TheIcon size={28} color={theme.color} />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 }}
                >
                  <p
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 9,
                      letterSpacing: "0.38em",
                      textTransform: "uppercase",
                      color: theme.color,
                      marginBottom: 8,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 6,
                    }}
                  >
                    <Sparkles size={10} /> Certificate of Excellence{" "}
                    <Sparkles size={10} />
                  </p>
                  <h3
                    style={{
                      fontFamily: "'Syne',sans-serif",
                      fontSize: 30,
                      fontWeight: 900,
                      color: "white",
                      lineHeight: 1.05,
                      marginBottom: 8,
                      letterSpacing: "-0.02em",
                      textShadow: `0 0 32px ${theme.color}60`,
                    }}
                  >
                    {data.name}
                  </h3>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "5px 14px",
                      borderRadius: 50,
                      background: `${theme.color}12`,
                      border: `1px solid ${theme.color}35`,
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 10,
                        color: theme.color,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {data.awardTitle}
                    </p>
                  </div>
                </motion.div>

                {/* meta tags */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.72 }}
                  style={{
                    display: "flex",
                    gap: 8,
                    marginTop: 16,
                    flexWrap: "wrap",
                    justifyContent: "center",
                  }}
                >
                  {type === "contributor" && (
                    <>
                      <span
                        style={{
                          fontFamily: "'DM Mono',monospace",
                          fontSize: 10,
                          background: "rgba(255,255,255,0.04)",
                          padding: "4px 10px",
                          borderRadius: 6,
                          color: "#8892a4",
                        }}
                      >
                        Score:{" "}
                        <span style={{ color: "#4ade80", fontWeight: 700 }}>
                          {data.totalScore}
                        </span>
                      </span>
                    </>
                  )}
                  {type === "project" && (
                    <span
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 10,
                        background: "rgba(255,255,255,0.04)",
                        padding: "4px 10px",
                        borderRadius: 6,
                        color: "#8892a4",
                      }}
                    >
                      ID:{" "}
                      <span style={{ color: "white" }}>{data.projectID}</span>
                    </span>
                  )}
                  {type === "admin" && (
                    <span
                      style={{
                        fontFamily: "'DM Mono',monospace",
                        fontSize: 10,
                        background: "rgba(255,255,255,0.04)",
                        padding: "4px 10px",
                        borderRadius: 6,
                        color: "#8892a4",
                      }}
                    >
                      {data.role}
                    </span>
                  )}
                </motion.div>
              </div>

              {/* footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.88 }}
                style={{
                  paddingTop: 14,
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 7.5,
                      color: "#3a4a62",
                      textTransform: "uppercase",
                      letterSpacing: "0.26em",
                      marginBottom: 3,
                    }}
                  >
                    Awarded On
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 10,
                      color: "#7a8899",
                    }}
                  >
                    {EVENT_DATE}
                  </p>
                </div>
                <motion.div
                  animate={{ rotate: [0, 12, -12, 0] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    repeatDelay: 2.5,
                  }}
                >
                  <Award
                    color={theme.color}
                    size={22}
                    style={{ opacity: 0.55 }}
                  />
                </motion.div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 7.5,
                      color: "#3a4a62",
                      textTransform: "uppercase",
                      letterSpacing: "0.26em",
                      marginBottom: 3,
                    }}
                  >
                    Organized By
                  </p>
                  <p
                    style={{
                      fontFamily: "'DM Mono',monospace",
                      fontSize: 10,
                      color: "#7a8899",
                    }}
                  >
                    "InterConnect 26.0"
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════════
   SECTION LABEL
═══════════════════════════════════════════════ */
const SectionLabel = ({ color = "#fbbf24", children }) => (
  <p
    style={{
      fontFamily: "'DM Mono',monospace",
      fontSize: 10,
      letterSpacing: "0.32em",
      textTransform: "uppercase",
      fontWeight: 700,
      color,
      marginBottom: 12,
    }}
  >
    ✦ {children}
  </p>
);

/* ═══════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════ */
export default function Winner() {
  const [activeSection, setActiveSection] = useState(null);

  const categories = [
    {
      id: "contributors",
      label: "Top 7 Contributors",
      Icon: Code,
      color: "#3a9de8",
      key: "active-contributors",
    },
    {
      id: "projects",
      label: "Top 2 Projects",
      Icon: Zap,
      color: "#fbbf24",
      key: "active-projects",
    },
    {
      id: "admins",
      label: "Best 2 Admins",
      Icon: Shield,
      color: "#ec4899",
      key: "active-admins",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;700&family=Syne:wght@400;600;700;800;900&family=DM+Sans:wght@300;400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes scanmove {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes auraPulse {
          0%,100% { opacity: 0.035; transform: scale(1); }
          50%      { opacity: 0.07;  transform: scale(1.08); }
        }
        @keyframes borderRotate {
          to { transform: rotate(360deg); }
        }

        .cat-btn {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; padding: 18px 26px; border-radius: 18px; width: 100%;
          background: rgba(9,12,22,0.85);
          border: 1px solid rgba(255,255,255,0.06);
          color: #5a6880; font-family: 'Syne', sans-serif;
          font-size: 16px; font-weight: 700; cursor: pointer;
          transition: all 0.28s ease; position: relative; overflow: hidden;
          backdrop-filter: blur(12px);
        }
        .cat-btn::after {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.02) 0%, transparent 60%);
          pointer-events: none;
        }
        .cat-btn:hover { border-color: rgba(255,255,255,0.18); color: white; transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.4); }

        .cat-btn.b-contributors { border-color: #3a9de8; background: rgba(58,157,232,0.09); color: white; box-shadow: 0 0 24px rgba(58,157,232,0.18), inset 0 0 16px rgba(58,157,232,0.04); }
        .cat-btn.b-projects     { border-color: #fbbf24; background: rgba(251,191,36,0.09); color: white; box-shadow: 0 0 24px rgba(251,191,36,0.18), inset 0 0 16px rgba(251,191,36,0.04); }
        .cat-btn.b-admins       { border-color: #ec4899; background: rgba(236,72,153,0.09); color: white; box-shadow: 0 0 24px rgba(236,72,153,0.18), inset 0 0 16px rgba(236,72,153,0.04); }
      `}</style>

      {/* Particle background */}
      <ParticleField />

      {/* Flash overlay (global) */}
      <FlashOverlay />

      {/* Moving scanline */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          zIndex: 1,
          pointerEvents: "none",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(251,191,36,0.28) 40%, rgba(58,157,232,0.25) 70%, transparent 100%)",
          animation: "scanmove 9s linear infinite",
        }}
      />

      {/* Ambient aura glows */}
      <div
        style={{
          position: "fixed",
          top: "-15%",
          left: "-8%",
          width: 640,
          height: 640,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(251,191,36,1) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
          animation: "auraPulse 7s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-15%",
          right: "-8%",
          width: 640,
          height: 640,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(58,157,232,1) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
          animation: "auraPulse 8s ease-in-out infinite 1s",
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "35%",
          right: "5%",
          width: 380,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(236,72,153,1) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
          animation: "auraPulse 6s ease-in-out infinite 2s",
        }}
      />

      {/* PAGE */}
      <div
        style={{
          minHeight: "100vh",
          background: "#04060e",
          color: "#f0f4ff",
          paddingBottom: 96,
          position: "relative",
        }}
      >
        {/* ═══ HERO ═══ */}
        <section
          style={{
            position: "relative",
            minHeight: "48vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: 100,
            paddingBottom: 56,
            textAlign: "center",
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          {/* bg watermark */}
          <motion.div
            animate={{ opacity: [0.04, 0.09, 0.04], scale: [1, 1.04, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
            style={{
              position: "absolute",
              fontFamily: "'Syne',sans-serif",
              fontSize: 280,
              fontWeight: 900,
              color: "#fbbf24",
              lineHeight: 1,
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 0,
            }}
          >
            ◈
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 45 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: "relative", zIndex: 2 }}
          >
            <SectionLabel>
              InterConnect 26.0 · Award Ceremony · GM University
            </SectionLabel>

            {/* headline */}
            <h1
              style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: "clamp(44px, 7.5vw, 92px)",
                fontWeight: 900,
                lineHeight: 1.0,
                letterSpacing: "-0.025em",
                marginBottom: 18,
                color: "#dce4f0",
              }}
            >
              The{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #ffd700 0%, #fbbf24 25%, #f59e0b 60%, #ff6b35 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Champions
              </span>{" "}
              Await
            </h1>

            {/* sub */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              style={{
                fontFamily: "'DM Sans',sans-serif",
                color: "#5a6880",
                maxWidth: 580,
                margin: "0 auto 28px",
                fontSize: 15,
                lineHeight: 1.75,
              }}
            >
              Every identity is encrypted behind a 5-second countdown.
              <br />
              Select a category — then brace yourself for the reveal.
            </motion.p>

            {/* live badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding: "9px 20px",
                borderRadius: 50,
                background: "rgba(251,191,36,0.07)",
                border: "1px solid rgba(251,191,36,0.22)",
              }}
            >
              <motion.div
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ duration: 1.1, repeat: Infinity }}
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#fbbf24",
                  boxShadow: "0 0 8px #fbbf24",
                }}
              />
              <span
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 11,
                  color: "#fbbf24",
                  letterSpacing: "0.28em",
                  textTransform: "uppercase",
                }}
              >
                Live · GM University · April 2026
              </span>
            </motion.div>
          </motion.div>
        </section>

        {/* divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(251,191,36,0.22), rgba(58,157,232,0.18), transparent)",
            margin: "0 0 52px",
          }}
        />

        {/* ═══ CONTENT ═══ */}
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 20px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* category buttons */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 14,
              marginBottom: 56,
            }}
          >
            {categories.map(({ id, label, Icon, color }) => {
              const CatIcon = Icon;
              const isActive = activeSection === id;
              return (
                <motion.button
                  key={id}
                  onClick={() => setActiveSection(id)}
                  className={`cat-btn ${isActive ? `b-${id}` : ""}`}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.975 }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <CatIcon size={22} color={isActive ? color : "#5a6880"} />
                    <span>{label}</span>
                  </div>
                  <ChevronRight
                    size={18}
                    color={isActive ? color : "#5a6880"}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* winner section */}
          <AnimatePresence mode="wait">
            {activeSection && (
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -22 }}
                transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* section header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    gap: 24,
                    marginBottom: 38,
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: "'Syne',sans-serif",
                        fontSize: 34,
                        fontWeight: 900,
                        color: "white",
                        marginBottom: 8,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {activeSection === "contributors" && "Top Contributors"}
                      {activeSection === "projects" && "Winning Projects"}
                      {activeSection === "admins" && "Exceptional Admins"}
                    </h2>
                    <p
                      style={{
                        fontFamily: "'DM Sans',sans-serif",
                        color: "#5a6880",
                        fontSize: 13,
                        display: "flex",
                        alignItems: "center",
                        gap: 7,
                      }}
                    >
                      <Sparkles size={13} color="#fbbf24" />
                      Click any card to begin the 5-second decryption sequence
                    </p>
                  </div>
                  <div
                    style={{
                      flex: 1,
                      height: 1,
                      background:
                        "linear-gradient(90deg, rgba(255,255,255,0.07), transparent)",
                      minWidth: 40,
                    }}
                  />
                </div>

                {/* cards */}
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.1 } } }}
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(290px, 1fr))",
                    gap: 24,
                  }}
                >
                  {activeSection === "contributors" &&
                    WINNERS_DATA.contributors.map((d, i) => (
                      <WinnerCard
                        key={d.id}
                        data={d}
                        type="contributor"
                        index={i}
                      />
                    ))}
                  {activeSection === "projects" &&
                    WINNERS_DATA.projects.map((d, i) => (
                      <WinnerCard
                        key={d.id}
                        data={d}
                        type="project"
                        index={i}
                      />
                    ))}
                  {activeSection === "admins" &&
                    WINNERS_DATA.admins.map((d, i) => (
                      <WinnerCard key={d.id} data={d} type="admin" index={i} />
                    ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* empty state */}
          {!activeSection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ textAlign: "center", paddingTop: 80, paddingBottom: 80 }}
            >
              <motion.div
                animate={{ scale: [1, 1.06, 1], opacity: [0.18, 0.32, 0.18] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                <Trophy
                  size={90}
                  color="#2a3448"
                  style={{ margin: "0 auto 20px", display: "block" }}
                />
              </motion.div>
              <p
                style={{
                  fontFamily: "'Syne',sans-serif",
                  fontSize: 24,
                  fontWeight: 800,
                  color: "#2a3448",
                  letterSpacing: "-0.01em",
                }}
              >
                Awaiting your selection…
              </p>
              <p
                style={{
                  fontFamily: "'DM Mono',monospace",
                  fontSize: 11,
                  color: "#1e2a3a",
                  marginTop: 8,
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                }}
              >
                Choose a category above to begin
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}
