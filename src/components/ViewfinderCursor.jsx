"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export default function ViewfinderCursor() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const x = useSpring(mouseX, { stiffness: 600, damping: 45 });
  const y = useSpring(mouseY, { stiffness: 600, damping: 45 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const el = document.elementFromPoint(e.clientX, e.clientY);
      setIsPointer(!!el?.closest("a, button, [role='button']"));
    };
    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{ x, y, translateX: "-50%", translateY: "-50%" }}
      animate={{
        scale: isClicking ? 0.7 : isPointer ? 1.4 : 1,
        opacity: isPointer ? 0.7 : 1,
      }}
      transition={{ duration: 0.15 }}
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="16" stroke="#C9A96E" strokeWidth="1" opacity="0.85" />
        <line x1="18" y1="2" x2="18" y2="11" stroke="#C9A96E" strokeWidth="1" />
        <line x1="18" y1="25" x2="18" y2="34" stroke="#C9A96E" strokeWidth="1" />
        <line x1="2" y1="18" x2="11" y2="18" stroke="#C9A96E" strokeWidth="1" />
        <line x1="25" y1="18" x2="34" y2="18" stroke="#C9A96E" strokeWidth="1" />
        <circle cx="18" cy="18" r="2" fill="#C9A96E" />
      </svg>
    </motion.div>
  );
}
