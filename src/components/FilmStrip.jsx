"use client";

import { motion } from "framer-motion";

const FRAMES = Array.from({ length: 10 });

export default function FilmStrip() {
  return (
    <div className="w-full bg-[#0E0D0C] overflow-hidden border-y border-[#C9A96E]/10 py-2.5">
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        className="flex"
      >
        {[...FRAMES, ...FRAMES].map((_, i) => (
          <div key={i} className="flex items-center flex-shrink-0">
            {/* Sprocket holes */}
            <div className="flex flex-col gap-4 px-2">
              <div className="w-3 h-2 rounded-[2px] border border-[#EDE8DF]/12 bg-[#EDE8DF]/5" />
              <div className="w-3 h-2 rounded-[2px] border border-[#EDE8DF]/12 bg-[#EDE8DF]/5" />
            </div>
            {/* Film frame */}
            <div className="w-20 h-14 mx-1 border border-[#C9A96E]/12 bg-[#161412] flex items-center justify-center">
              <span className="text-[#C9A96E]/15 text-[8px] font-mono tracking-widest">
                {String((i % FRAMES.length) + 1).padStart(2, "0")}
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
