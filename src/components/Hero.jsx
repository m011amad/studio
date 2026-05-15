"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Mail } from "lucide-react";
import ConnectDrawer from "./ConnectDrawer";

function InstagramIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Hero() {
  const [profilePhoto, setProfilePhoto] = useState(null);

  useEffect(() => {
    fetch("/api/profile-photo")
      .then((r) => r.json())
      .then((d) => { if (d.url) setProfilePhoto(d.url); });
  }, []);

  return (
    <section
      id="about"
      className="relative min-h-screen bg-[#0E0D0C] flex flex-col items-center justify-center overflow-hidden px-6 pt-20 md:pt-0 isolate"
      style={{
        backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(201,169,110,0.07) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(201,169,110,0.04) 0%, transparent 50%)`,
      }}
    >
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Decorative lines */}
      <div className="absolute top-32 left-10 w-px h-32 bg-[#C9A96E]/20" />
      <div className="absolute top-32 left-10 w-32 h-px bg-[#C9A96E]/20" />
      <div className="absolute bottom-32 right-10 w-px h-32 bg-[#C9A96E]/20" />
      <div className="absolute bottom-32 right-10 w-32 h-px bg-[#C9A96E]/20" />

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 md:gap-20 max-w-5xl w-full">
        {/* Portrait */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex-shrink-0 relative"
        >
          <div
            className="absolute inset-0 rounded-full border-3 border-[#C9A96E]"
            style={{ transform: "translate(8px, 8px)" }}
          />
          <div className="relative w-52 h-52 md:w-72 md:h-72 rounded-full border-3 border-[#2A2520] overflow-hidden bg-[#161412]">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Sas — Photographer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#C9A96E" strokeWidth="1">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                </svg>
              </div>
            )}
          </div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 300 }}
            className="absolute bottom-3 right-3 w-7 h-7 rounded-full bg-[#C9A96E] border-3 border-[#0E0D0C] flex items-center justify-center"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#0E0D0C]" />
          </motion.div>
        </motion.div>

        {/* Text */}
        <div className="text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-[#C9A96E] text-sm font-bold uppercase tracking-[0.25em] mb-4"
          >
            Visual Storyteller
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
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
              href="#galleries"
              className="inline-block bg-[#C9A96E] text-black font-black uppercase tracking-widest text-sm px-8 py-3 border-3 border-[#C9A96E] hover:bg-transparent hover:text-[#C9A96E] transition-all duration-200"
            >
              View Work
            </a>
            <ConnectDrawer
              trigger={
                <button className="inline-block bg-transparent text-white font-black uppercase tracking-widest text-sm px-8 py-3 border-3 border-white/30 hover:border-white transition-all duration-200">
                  Get a Quote
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
                <div className="text-white font-black text-2xl" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                  {num}
                </div>
                <div className="text-white/40 text-xs uppercase tracking-widest">{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05 }}
            className="flex gap-4 mt-6 justify-center md:justify-start"
          >
            <a
              href="https://instagram.com/captsas_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/40 hover:text-[#C9A96E] transition-colors duration-200"
            >
              <InstagramIcon size={18} />
              <span className="text-xs font-bold tracking-widest uppercase">@captsas_</span>
            </a>
            <a
              href="https://instagram.com/s8r_sas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white/40 hover:text-[#C9A96E] transition-colors duration-200"
            >
              <InstagramIcon size={18} />
              <span className="text-xs font-bold tracking-widest uppercase">@s8r_sas</span>
            </a>
            <a
              href="mailto:captsas.media@gmail.com"
              className="flex items-center gap-2 text-white/40 hover:text-[#C9A96E] transition-colors duration-200"
            >
              <Mail size={18} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="hidden md:flex absolute bottom-10 left-1/2 -translate-x-1/2 flex-col items-center gap-2"
      >
        <span className="text-white/30 text-xs uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.4 }}
          className="w-px h-8 bg-gradient-to-b from-[#C9A96E]/60 to-transparent"
        />
      </motion.div>
    </section>
  );
}
