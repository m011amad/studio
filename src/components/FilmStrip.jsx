"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import ConnectDrawer from "./ConnectDrawer";

const FRAMES = Array.from({ length: 12 });

export default function FilmStrip() {
  const router = useRouter();
  const tapCount = useRef(0);
  const tapTimer = useRef(null);

  const handleLogoTap = () => {
    tapCount.current += 1;
    clearTimeout(tapTimer.current);
    if (tapCount.current >= 5) {
      tapCount.current = 0;
      router.push("/admin");
    } else {
      tapTimer.current = setTimeout(() => { tapCount.current = 0; }, 2000);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#0E0D0C] border-b border-[#C9A96E]/10 flex items-center h-12 overflow-hidden">
      {/* Logo */}
      <div className="flex-shrink-0 pl-5 pr-4 z-10">
        <span
          onClick={handleLogoTap}
          className="text-white font-black text-xl cursor-default select-none"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.1em" }}
        >
          SAS
        </span>
      </div>

      {/* Scrolling film — fills remaining space */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#0E0D0C] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#0E0D0C] to-transparent z-10 pointer-events-none" />
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="flex items-center"
        >
          {[...FRAMES, ...FRAMES].map((_, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className="flex flex-col gap-[6px] px-1.5">
                <div className="w-2 h-[5px] rounded-[1px] border border-[#EDE8DF]/10 bg-[#EDE8DF]/4" />
                <div className="w-2 h-[5px] rounded-[1px] border border-[#EDE8DF]/10 bg-[#EDE8DF]/4" />
              </div>
              <div className="w-14 h-9 mx-0.5 border border-[#C9A96E]/10 bg-[#161412] flex items-center justify-center">
                <span className="text-[#C9A96E]/12 text-[7px] font-mono tracking-widest">
                  {String((i % FRAMES.length) + 1).padStart(2, "0")}
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Nav */}
      <div className="flex-shrink-0 flex items-center gap-5 pl-4 pr-5 z-10">
        <a
          href="#about"
          className="hidden md:block text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors duration-200"
        >
          About
        </a>
        <ConnectDrawer
          trigger={
            <button className="text-xs font-bold uppercase tracking-widest text-[#C9A96E] border border-[#C9A96E]/50 px-3 py-1 hover:bg-[#C9A96E] hover:text-black transition-all duration-200">
              Get a Quote
            </button>
          }
        />
      </div>
    </div>
  );
}
