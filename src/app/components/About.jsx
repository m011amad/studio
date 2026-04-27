"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import ConnectDrawer from "./ConnectDrawer";

const TAGS = [
  "Nature",
  "Portraits",
  "Street",
  "Cars",
  "Architecture",
  "Events",
];

export default function About() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={ref}
      className="bg-[#2C2C2C] py-24 px-6 md:px-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left — text */}
        <div>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-[#52C41A] text-xs font-black uppercase tracking-[0.3em] mb-4"
          >
            About
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-white font-black leading-none mb-6"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 6vw, 4rem)",
              letterSpacing: "0.04em",
            }}
          >
            The Eye
            <br />
            Behind
            <br />
            The Lens
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-white/60 leading-relaxed mb-4"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.05rem",
            }}
          >
            Sas is a photographer whose work spans the full breadth of visual
            storytelling — from the raw stillness of nature to the kinetic
            energy of machines and the quiet intimacy of people in their
            element.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-white/60 leading-relaxed mb-8"
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.05rem",
            }}
          >
            Every shot is a conversation — between light and shadow, movement
            and stillness, the expected and the extraordinary.
          </motion.p>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="text-xs font-black uppercase tracking-widest px-3 py-1.5 border-2 border-white/20 text-white/50"
              >
                {tag}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.6 }}
          >
            <ConnectDrawer
              trigger={
                <button className="inline-block bg-[#52C41A] text-black font-black uppercase tracking-widest text-sm px-8 py-3 border-3 border-[#52C41A] hover:bg-transparent hover:text-[#52C41A] transition-all duration-200">
                  Work With Sas
                </button>
              }
            />
          </motion.div>
        </div>

        {/* Right — decorative grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.2, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative hidden md:block"
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              { bg: "#52C41A", h: "h-48", label: "Nature" },
              { bg: "#FFF9F0", h: "h-32", label: "People" },
              { bg: "#FFF9F0", h: "h-32", label: "Cars" },
              { bg: "#52C41A", h: "h-48", label: "Everything" },
            ].map(({ bg, h, label }) => (
              <div
                key={label}
                className={`${h} border-3 border-white/10 flex items-end p-4`}
                style={{
                  backgroundColor:
                    bg === "#FFF9F0" ? "rgba(255,249,240,0.05)" : bg + "22",
                }}
              >
                <span
                  className="text-white/30 text-xs font-black uppercase tracking-widest"
                  style={{ color: bg === "#52C41A" ? "#52C41A88" : undefined }}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          {/* Accent */}
          <div className="absolute -top-4 -right-4 w-24 h-24 border-3 border-[#52C41A]/30" />
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-[#52C41A]/10 border-3 border-[#52C41A]/20" />
        </motion.div>
      </div>
    </section>
  );
}
