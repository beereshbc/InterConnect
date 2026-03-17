/**
 * Home.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Layer architecture:
 *
 *   position:fixed  z:0    → <NeuralLattice />   (3-D bg, reacts to mouse+scroll)
 *   position:fixed  z:100  → <Header />           (transparent → frosted on scroll)
 *   position:relative z:1  → <main>               (scrollable content stack)
 *     └─ <Hero />          transparent, full-height, title overlay
 *     └─ <AboutSection />  semi-transparent, lattice bleeds through
 *     └─ … add more …
 *
 * To add a new section:
 *   1. Create YourSection.jsx
 *   2. Give its root element:
 *        className="nl-section"
 *        style={{ background: "rgba(0,0,0,0.X)" }}   ← 0 = see-through, 1 = solid
 *   3. Import and drop it below <Hero /> inside <main>
 */

import React from "react";
import NeuralLattice from "../components/NeuralLattice";
import Header from "../components/Header";
import Hero from "../components/Hero";

/* ── Placeholder sections ──────────────────────────────────────────────────
   Replace these with your real About.jsx, Schedule.jsx, etc.
───────────────────────────────────────────────────────────────────────────── */

const AboutSection = () => (
  <section
    id="about"
    className="nl-section"
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 24,
      padding: "clamp(4rem,10vw,8rem) clamp(1.5rem,6vw,6rem)",
      textAlign: "center",
    }}
  >
    <p
      style={{
        fontSize: "0.68rem",
        letterSpacing: "0.42em",
        textTransform: "uppercase",
        color: "rgba(0,136,255,0.85)",
        fontWeight: 600,
      }}
    >
      ✦&nbsp;&nbsp;About the Event&nbsp;&nbsp;✦
    </p>
    <h2
      style={{
        fontSize: "clamp(1.8rem,4vw,3rem)",
        fontWeight: 800,
        letterSpacing: "0.04em",
        color: "#fff",
      }}
    >
      Where Disciplines Converge
    </h2>
    <div
      style={{
        width: "min(480px,70vw)",
        height: 1,
        background:
          "linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent)",
      }}
    />
    <p
      style={{
        maxWidth: 640,
        fontSize: "clamp(0.9rem,1.6vw,1.05rem)",
        lineHeight: 1.85,
        color: "rgba(255,255,255,0.60)",
        fontWeight: 300,
      }}
    >
      InterConnect 26.O brings together engineers, designers, and project
      managers from GMIT and GMU to collaborate, compete, and build solutions
      that matter. Replace this placeholder with your real{" "}
      <code
        style={{
          color: "#0088ff",
          fontFamily: "'Google Sans Code', monospace",
        }}
      >
        About.jsx
      </code>
      .
    </p>
  </section>
);

const ScheduleSection = () => (
  <section
    id="schedule"
    className="nl-section"
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "rgba(255,255,255,0.45)",
      fontSize: "0.82rem",
      letterSpacing: "0.2em",
      textTransform: "uppercase",
      textAlign: "center",
      padding: "4rem 2rem",
    }}
  >
    Schedule section — replace with your real&nbsp;
    <code
      style={{
        color: "#0088ff",
        marginLeft: 4,
        fontFamily: "'Google Sans Code', monospace",
      }}
    >
      Schedule.jsx
    </code>
  </section>
);

/* ── Home ──────────────────────────────────────────────────────────────────── */

const Home = () => (
  <>
    {/* ① Fixed Three.js bg — mouse + scroll reactive */}
    <NeuralLattice />

    {/* ② Fixed transparent header */}
    <Header />

    {/* ③ Scrollable content — z-index:1 so it sits above the canvas */}
    <main style={{ position: "relative", zIndex: 1, width: "100%" }}>
      {/* Hero — 100vh, fully transparent, title floats over lattice */}
      <Hero />

      {/* Add your sections below ↓ */}
      <AboutSection />
      <ScheduleSection />

      {/*
        <Speakers />
        <Register />
        Each needs:
          className="nl-section"
          style={{ background: "rgba(0,0,0,0.X)" }}
      */}
    </main>
  </>
);

export default Home;
