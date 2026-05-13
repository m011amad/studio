"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function PhotoCarousel({ photos }) {
  const [current, setCurrent] = useState(0);

  const go = (dir) =>
    setCurrent((p) => (p + dir + photos.length) % photos.length);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (photos.length <= 1) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % photos.length), 5000);
    return () => clearInterval(t);
  }, [photos.length]);

  if (!photos.length) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-white/20 font-bold uppercase tracking-widest text-sm">
          No photos yet
        </p>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 select-none">
      {/* All images stacked — crossfade via opacity, no unmount = no undefined */}
      {photos.map((photo, i) => (
        <motion.div
          key={photo.id ?? i}
          className="absolute inset-0"
          initial={{ opacity: i === current ? 1 : 0 }}
          animate={{ opacity: i === current ? 1 : 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <img
            src={photo.url}
            alt={photo.title || ""}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/${photo.id ?? i}/1600/900`;
            }}
          />
        </motion.div>
      ))}

      {/* Transparent drag layer on top */}
      <motion.div
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.05}
        onDragEnd={(_, info) => {
          if (info.offset.x < -50) go(1);
          else if (info.offset.x > 50) go(-1);
        }}
      />

      {/* Gradient — readable text at bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20 pointer-events-none" />

      {/* Title — bottom left */}
      <div className="absolute bottom-20 left-6 md:left-12 pointer-events-none">
        <p className="text-[#C9A96E] text-xs font-black uppercase tracking-[0.3em] mb-1">
          Selected Work
        </p>
        <h2
          className="text-white font-black leading-none"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3rem, 9vw, 6.5rem)",
            letterSpacing: "0.04em",
          }}
        >
          Captured
        </h2>
      </div>

      {/* Dot indicators — bottom center */}
      <div className="absolute bottom-7 left-0 right-0 flex justify-center items-center gap-2">
        {photos.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-px rounded-full transition-all duration-500 ${
              i === current
                ? "w-10 bg-[#C9A96E]"
                : "w-4 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Gallery({ landscapePhotos, portraitPhotos }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // md breakpoint = 768px: landscape on desktop, portrait on mobile
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const photos = isMobile ? portraitPhotos : landscapePhotos;

  return (
    <section
      id="work"
      className="relative w-full h-screen bg-[#0E0D0C] overflow-hidden"
    >
      <PhotoCarousel photos={photos} />
    </section>
  );
}
