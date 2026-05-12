"use client";

import { useScroll, useTransform, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ScrollCamera() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["8vh", "78vh"]);
  const lensRotate = useTransform(scrollYProgress, [0, 1], [0, 340]);
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      [0.25, 0.5, 0.75].forEach((t) => {
        if (Math.abs(v - t) < 0.008) {
          setBlink(true);
          setTimeout(() => setBlink(false), 180);
        }
      });
    });
  }, [scrollYProgress]);

  return (
    <motion.div
      style={{ y }}
      className="fixed right-6 top-0 z-40 hidden xl:flex flex-col items-center pointer-events-none select-none"
    >
      <svg width="56" height="46" viewBox="0 0 56 46" fill="none">
        {/* Body */}
        <rect x="1" y="10" width="54" height="34" rx="4" fill="#1A1310" stroke="#C9A96E" strokeWidth="1.5" />
        {/* Viewfinder bump */}
        <rect x="14" y="4" width="18" height="9" rx="3" fill="#1A1310" stroke="#C9A96E" strokeWidth="1.5" />
        {/* Flash */}
        <rect x="5" y="15" width="8" height="5" rx="1.5" fill="#C9A96E" fillOpacity="0.35" />
        {/* Shutter button */}
        <circle cx="43" cy="7" r="3.5" fill="#2A2520" stroke="#C9A96E" strokeWidth="1.5" />
        <motion.circle
          cx="43" cy="7" r="2"
          fill="#C9A96E"
          animate={{ scale: blink ? 0.2 : 1, opacity: blink ? 0.3 : 1 }}
          transition={{ duration: 0.09 }}
        />
        {/* Lens housing */}
        <circle cx="28" cy="27" r="13" fill="#0E0D0C" stroke="#C9A96E" strokeWidth="1.5" />
        {/* Lens inner ring */}
        <circle cx="28" cy="27" r="9" fill="#0E0D0C" stroke="#C9A96E" strokeWidth="1" strokeOpacity="0.45" />
        {/* Rotating aperture blades */}
        <motion.g style={{ rotate: lensRotate, originX: "28px", originY: "27px" }}>
          <line x1="28" y1="20" x2="28" y2="34" stroke="#C9A96E" strokeWidth="0.7" strokeOpacity="0.5" />
          <line x1="21" y1="27" x2="35" y2="27" stroke="#C9A96E" strokeWidth="0.7" strokeOpacity="0.5" />
          <line x1="23" y1="22" x2="33" y2="32" stroke="#C9A96E" strokeWidth="0.7" strokeOpacity="0.5" />
          <line x1="33" y1="22" x2="23" y2="32" stroke="#C9A96E" strokeWidth="0.7" strokeOpacity="0.5" />
        </motion.g>
        {/* Lens center */}
        <circle cx="28" cy="27" r="4" fill="#161412" stroke="#C9A96E" strokeWidth="1" />
        <circle cx="28" cy="27" r="1.5" fill="#C9A96E" />
        {/* Glass highlight */}
        <circle cx="23.5" cy="22.5" r="1.5" fill="#EDE8DF" fillOpacity="0.12" />
        {/* Shutter blink overlay */}
        <motion.rect
          x="1" y="10" width="54" height="34" rx="4"
          fill="#0E0D0C"
          animate={{ opacity: blink ? 0.9 : 0 }}
          transition={{ duration: 0.09 }}
        />
      </svg>

      {/* Scroll progress line */}
      <div className="mt-3 w-px h-16 bg-[#C9A96E]/15 relative rounded-full overflow-hidden">
        <motion.div
          style={{ scaleY: scrollYProgress, originY: 0 }}
          className="absolute inset-0 bg-[#C9A96E]/60 rounded-full"
        />
      </div>
    </motion.div>
  );
}
