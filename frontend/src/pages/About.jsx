import React from "react";
import { motion } from "framer-motion";

import yashwanth from "../assets/yashwanth.png";
import beeresh from "../assets/beeresh.png";
import ranjitha from "../assets/ranjitha.png";
import shiv from "../assets/shivanagowda.png";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
};

const About = () => {
  return (
    <>
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Mono:wght@400;500;700&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono { font-family: 'DM Mono', monospace; }
      `}</style>

      <div className="min-h-screen font-mono px-4 sm:px-6 py-12 sm:py-16 relative text-[#f0f4ff] overflow-hidden">

        {/* Glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-[#3a9de810] blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] sm:w-[600px] h-[450px] sm:h-[600px] bg-[#fbbf2410] blur-[120px]" />

        <div className="max-w-6xl mx-auto relative z-10">

          {/* HERO */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-center mb-12 sm:mb-20"
          >
            <h1 className="font-display text-4xl sm:text-6xl font-extrabold mb-4">
              About <span className="text-[#3a9de8]">InterConnect</span>
            </h1>

            <p className="text-slate-400 text-xs sm:text-sm max-w-md sm:max-w-xl mx-auto">
              A next-generation innovation platform connecting students,
              ideas, and real-world problem solving.
            </p>

            <p className="text-blue-400 text-[10px] sm:text-xs tracking-widest uppercase mt-3">
              InterConnect 26.0 • Innovation Platform
            </p>
          </motion.div>

          {/* MAIN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-16 items-start">

            {/* LEFT */}
            <motion.div variants={fadeUp} initial="hidden" animate="show">
              <h2 className="font-display text-2xl sm:text-3xl font-bold leading-snug">
                InterConnect 26.0{" "}
                <span className="text-[#3a9de8]">Innovation Challenge</span>
              </h2>

              <p className="mt-3 text-slate-400 text-xs sm:text-sm">
                Organized by GM University & GMIT (CSE Department)
              </p>

              <div className="mt-5 border-l-2 border-[#3a9de8] pl-3 text-slate-300 text-xs sm:text-sm">
                Collaborate, innovate, and build impactful solutions across multiple disciplines.
              </div>

              <div className="mt-5 space-y-3 text-slate-300 text-xs sm:text-sm leading-relaxed">
                <p>
                  InterConnect 26.0 brings together students from Engineering,
                  MBA, Law, Pharmacy, and more to solve real-world challenges.
                </p>

                <p>
                  Participants submit innovative ideas and transform them into
                  real solutions through collaboration and mentorship.
                </p>

                <p>
                  The mission is to build creativity, skills, and impactful
                  innovation for the future.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-3 mt-6">
                {["🚀 Innovation", "🤝 Teamwork", "💡 Impact"].map((f, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 rounded-lg bg-[#0c0f18] border border-slate-700 text-xs sm:text-sm hover:border-[#3a9de8] transition"
                  >
                    {f}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* RIGHT */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              className="w-full"
            >
              <div className="w-full p-5 sm:p-6 rounded-2xl bg-[#0c0f18] border border-slate-800">

                <h3 className="font-display text-lg sm:text-xl font-bold mb-4 text-[#3a9de8]">
                  Why InterConnect?
                </h3>

                <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                  <li>✔ Real-world problem solving</li>
                  <li>✔ Cross-department collaboration</li>
                  <li>✔ Industry-relevant skills</li>
                  <li>✔ Mentorship & guidance</li>
                  <li>✔ Innovation-driven platform</li>
                </ul>

                <div className="mt-5 p-3 rounded-xl bg-[#101520] border border-slate-700">
                  <p className="text-[10px] sm:text-xs text-slate-400">
                    🚀 Build. Learn. Lead. — Your ideas can create real impact.
                  </p>
                </div>

              </div>
            </motion.div>

          </div>

          {/* FACULTY */}
          <h2 className="font-display text-xl sm:text-2xl font-bold mt-16 mb-6">
            Faculty Coordinators
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[{
              img: shiv,
              name: "Dr. Shivanagowda G. M",
              role: "Professor & Head, CSE",
              phone: "",
              email: "shivana.gowda@gmail.com"
            },
            {
              img: ranjitha,
              name: "Ms. Ranjitha D S",
              role: "Assistant Professor",
              phone: "",
              email: "ranjithads@gmu.ac.in"
            }].map((f, i) => (

              <div key={i} className="flex gap-4 p-4 rounded-xl bg-[#0c0f18] border border-slate-800">
                <img src={f.img} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover" />
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-lg">{f.name}</h3>
                  <p className="text-slate-400 text-xs">{f.role}</p>
                  <p className="text-slate-500 text-[10px] mt-1">📞 {f.phone}</p>
                  <p className="text-slate-500 text-[10px]">✉️ {f.email}</p>
                </div>
              </div>
            ))}
          </div>

          {/* STUDENTS */}
          <h2 className="font-display text-xl sm:text-2xl font-bold mt-16 mb-6">
            Student Coordinators
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[{
              img: beeresh,
              name: "Beeresh Kumar B C",
              phone: "6360995219",
              email: "bcbeereshkumar@gmail.com"
            },
            {
              img: yashwanth,
              name: "Yashwanth M",
              phone: "7795817114",
              email: "yy6996843@gmail.com"
            }].map((s, i) => (

              <div key={i} className="flex gap-4 p-4 rounded-xl bg-[#0c0f18] border border-slate-800">
                <img src={s.img} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover" />
                <div>
                  <h3 className="font-display font-bold text-sm sm:text-lg">{s.name}</h3>
                  <p className="text-slate-500 text-[10px] mt-1">📞 {s.phone}</p>
                  <p className="text-slate-500 text-[10px]">✉️ {s.email}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
};

export default About;