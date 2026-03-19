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
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  LayoutDashboard,
  Lightbulb,
  Users,
  GitMerge,
} from "lucide-react";
import NeuralLattice from "../components/NeuralLattice";
import Header from "../components/Header";
import Hero from "../components/Hero";

// ─── ABOUT SECTION ───────────────────────────────────────────────────────────
const AboutSection = () => (
  <section
    id="about"
    className="nl-section relative w-full min-h-screen flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 px-6 py-24 lg:px-24 "
  >
    <div className="flex-1 w-full max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#3a9de8] font-bold mb-4">
          ✦ About The Initiative
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#f0f4ff] mb-6 leading-tight">
          Where Disciplines <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3a9de8] to-[#9c3ae8]">
            Converge
          </span>
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-[#3a9de8] to-transparent rounded-full mb-6" />

        <p className="font-sans text-sm md:text-base text-[#8892a4] leading-relaxed mb-6">
          InterConnect 26.O breaks down academic silos. We bring together
          engineering innovators, business strategists, legal minds, and science
          researchers from GMIT and GMU to collaborate on high-impact problem
          statements.
        </p>

        <ul className="space-y-4 mb-8">
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
              className="flex items-center gap-4 text-[#c4cedf] font-sans text-sm"
            >
              <div className="w-8 h-8 rounded-lg  flex items-center justify-center flex-shrink-0">
                <item.icon size={16} className="text-[#3a9de8]" />
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
      <div className="absolute -inset-4 bg-gradient-to-br from-[#3a9de820] to-[#9c3ae820] rounded-2xl blur-2xl -z-10" />
      <div className="relative rounded-2xl p-4 shadow-2xl overflow-hidden"></div>
    </motion.div>
  </section>
);

// ─── WORKFLOW SECTION ────────────────────────────────────────────────────────
const WorkflowSection = () => (
  <section
    id="workflow"
    className="nl-section relative w-full py-24 px-6 lg:px-24 "
  >
    <div className="max-w-4xl mx-auto text-center mb-16">
      <p className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#4ade80] font-bold mb-4">
        ✦ How It Works
      </p>
      <h2 className="font-display text-3xl md:text-4xl font-extrabold text-[#f0f4ff] mb-6">
        The Innovation Pipeline
      </h2>
      <p className="font-sans text-sm md:text-base text-[#8892a4] leading-relaxed">
        Our platform provides a seamless workflow for project coordinators and
        student contributors to track milestones, assign tasks, and evaluate
        performance in real-time.
      </p>
    </div>
  </section>
);

// ─── CALL TO ACTION SECTION ──────────────────────────────────────────────────
const CTASection = () => (
  <section className="nl-section relative w-full min-bg-gradient-to-t from-[#080c14] to-[#0c0f18]/60">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto"
    >
      <h2 className="font-display text-4xl md:text-5xl font-extrabold text-[#f0f4ff] mb-6">
        Ready to make an impact?
      </h2>
      <p className="font-sans text-base text-[#8892a4] mb-10 max-w-xl mx-auto">
        Join the network, find a problem statement that challenges you, and
        start building the future today.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          to="/problems"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold text-sm bg-[#e85d3a] hover:bg-[#d14f2f] text-white transition-all shadow-[0_0_20px_rgba(232,93,58,0.2)] hover:shadow-[0_0_30px_rgba(232,93,58,0.4)] hover:-translate-y-0.5 no-underline"
        >
          View Problem Statements <Lightbulb size={16} />
        </Link>
        <Link
          to="/dashboard"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-display font-bold text-sm bg-[#1e2330] hover:bg-[#2a3045] border border-slate-700 text-[#f0f4ff] transition-all hover:-translate-y-0.5 no-underline"
        >
          Enter Dashboard <LayoutDashboard size={16} />
        </Link>
      </div>
    </motion.div>
  </section>
);

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
