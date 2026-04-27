"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ConnectDrawer from "./ConnectDrawer";

const NAV_LINKS = ["Work", "About", "Connect"];

export default function Hero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* NAV */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b-3 border-[#2C2C2C]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-black text-2xl text-white tracking-tight"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            SAS
          </motion.span>
          <ul className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link, i) => (
              <motion.li
                key={link}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
              >
                {link === "Connect" ? (
                  <ConnectDrawer
                    trigger={
                      <button className="text-sm font-bold uppercase tracking-widest text-[#52C41A] border-2 border-[#52C41A] px-4 py-1.5 hover:bg-[#52C41A] hover:text-black transition-all duration-200">
                        {link}
                      </button>
                    }
                  />
                ) : (
                  <a
                    href={`#${link.toLowerCase()}`}
                    className="text-sm font-bold uppercase tracking-widest text-white/70 hover:text-white transition-colors duration-200"
                  >
                    {link}
                  </a>
                )}
              </motion.li>
            ))}
          </ul>
          {/* Mobile connect */}
          <div className="md:hidden">
            <ConnectDrawer
              trigger={
                <button className="text-xs font-bold uppercase tracking-widest text-[#52C41A] border-2 border-[#52C41A] px-3 py-1.5">
                  Connect
                </button>
              }
            />
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <section
        className="relative min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden px-6"
        style={{
          backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(82,196,26,0.08) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(82,196,26,0.05) 0%, transparent 50%)`,
        }}
      >
        {/* Grain overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
            backgroundSize: "128px",
          }}
        />

        {/* Decorative lines */}
        <div className="absolute top-32 left-10 w-px h-32 bg-[#52C41A]/20" />
        <div className="absolute top-32 left-10 w-32 h-px bg-[#52C41A]/20" />
        <div className="absolute bottom-32 right-10 w-px h-32 bg-[#52C41A]/20" />
        <div className="absolute bottom-32 right-10 w-32 h-px bg-[#52C41A]/20" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20 max-w-5xl w-full">
          {/* Portrait */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 relative"
          >
            {/* Offset border */}
            <div
              className="absolute inset-0 rounded-full border-3 border-[#52C41A]"
              style={{ transform: "translate(8px, 8px)" }}
            />
            <div className="relative w-52 h-52 md:w-72 md:h-72 rounded-full border-3 border-[#2C2C2C] overflow-hidden bg-[#1a1a1a]">
              {/* Replace src with actual Cloudinary URL */}
              <img
                src="/placeholder-sas.jpg"
                alt="Sas — Photographer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.parentNode.innerHTML += `
                    <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#1a1a1a;">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#52C41A" stroke-width="1">
                        <circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0 1 12 0v2"/>
                      </svg>
                    </div>`;
                }}
              />
            </div>
            {/* Green dot badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
              className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-[#52C41A] border-3 border-[#0a0a0a] flex items-center justify-center"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a]" />
            </motion.div>
          </motion.div>

          {/* Text block */}
          <div className="text-center md:text-left">
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-[#52C41A] text-sm font-bold uppercase tracking-[0.25em] mb-4"
            >
              Visual Storyteller
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.35,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="text-white font-black leading-none mb-6"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(4rem, 12vw, 8rem)",
                letterSpacing: "0.04em",
              }}
            >
              SAS
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="text-white/50 text-base md:text-lg leading-relaxed max-w-sm mb-8"
              style={{ fontFamily: "'DM Serif Display', serif" }}
            >
              Nature, people, cars, and everything in between — captured through
              a lens that finds beauty in the unexpected.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <a
                href="#work"
                className="inline-block bg-[#52C41A] text-black font-black uppercase tracking-widest text-sm px-8 py-3 border-3 border-[#52C41A] hover:bg-transparent hover:text-[#52C41A] transition-all duration-200"
              >
                View Work
              </a>
              <ConnectDrawer
                trigger={
                  <button className="inline-block bg-transparent text-white font-black uppercase tracking-widest text-sm px-8 py-3 border-3 border-white/30 hover:border-white hover:text-white transition-all duration-200">
                    Let's Connect
                  </button>
                }
              />
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="flex gap-8 mt-10 justify-center md:justify-start"
            >
              {[
                { num: "4+", label: "Galleries" },
                { num: "100s", label: "Shoots" },
                { num: "∞", label: "Stories" },
              ].map(({ num, label }) => (
                <div key={label} className="text-center md:text-left">
                  <div
                    className="text-white font-black text-2xl"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {num}
                  </div>
                  <div className="text-white/40 text-xs uppercase tracking-widest">
                    {label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-white/30 text-xs uppercase tracking-widest">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
            className="w-px h-8 bg-gradient-to-b from-[#52C41A]/60 to-transparent"
          />
        </motion.div>
      </section>
    </>
  );
}
