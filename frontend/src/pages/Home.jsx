/**
 * Home.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Layer architecture:
 *
 * position:fixed  z:0    → <NeuralLattice />   (3-D bg, reacts to mouse+scroll)
 * position:fixed  z:100  → <Header />           (transparent → frosted on scroll)
 * position:relative z:1  → <main>               (scrollable content stack)
 * └─ <Hero />          transparent, full-height, title overlay
 * └─ <AboutSection />  semi-transparent, lattice bleeds through
 * └─ <WorkflowSection/> semi-transparent, explains the platform
 * └─ <CTASection />    call to action with buttons
 */

import React from "react";

import NeuralLattice from "../components/NeuralLattice";
import Header from "../components/Header";
import Hero from "../components/Hero";
import { AboutSection, WorkflowSection, CTASection } from "../components/Hero";

// ─── HOME COMPONENT ──────────────────────────────────────────────────────────
const Home = () => (
  <>
    {/* ① Fixed Three.js bg — mouse + scroll reactive */}
    <NeuralLattice />

    {/* ② Fixed transparent header */}
    <Header />

    {/* ③ Scrollable content — z-index:1 so it sits above the canvas */}
    <main className="relative z-10 w-full overflow-x-hidden">
      {/* Hero — 100vh, fully transparent, title floats over lattice */}
      <Hero />

      {/* Embedded Sections */}
      <AboutSection />
      <WorkflowSection />
      <CTASection />
    </main>
  </>
);

export default Home;
