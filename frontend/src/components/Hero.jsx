/**
 * Hero.jsx
 * Full-viewport hero section. Fully transparent — NeuralLattice shows through.
 * All animation is driven by CSS classes in index.css (no inline keyframes).
 */

import React from "react";

const Hero = () => (
  <section id="hero" className="nl-hero">
    {/* Eyebrow */}
    <p className="nl-hero__eyebrow">
      ✦&nbsp;&nbsp;Annual Flagship Event&nbsp;&nbsp;✦
    </p>

    {/* Main title */}
    <h1 className="nl-hero__title">
      InterConnect&nbsp;
      <span className="nl-hero__title--accent">26.O</span>
    </h1>

    {/* Divider */}
    <div className="nl-hero__divider" />

    {/* Subtitle */}
    <p className="nl-hero__subtitle">
      An Inter-Disciplinary Project Management Community
    </p>

    {/* Institution */}
    <p className="nl-hero__institution">GMIT&nbsp;&nbsp;|&nbsp;&nbsp;GMU</p>

    {/* Scroll cue */}
    <div className="nl-hero__scroll-cue">
      <span className="nl-hero__scroll-label">Scroll</span>
      <svg
        className="nl-hero__scroll-icon"
        width="20"
        height="28"
        viewBox="0 0 20 28"
        fill="none"
      >
        <rect
          x="1"
          y="1"
          width="18"
          height="26"
          rx="9"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1.5"
        />
        <rect x="8.5" y="5" width="3" height="7" rx="1.5" fill="#0088ff" />
      </svg>
    </div>
  </section>
);

export default Hero;
