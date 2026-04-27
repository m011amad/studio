"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

function MasonryPhoto({ photo, index, onClick }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.5,
        delay: (index % 6) * 0.07,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="break-inside-avoid mb-4 cursor-pointer group"
      onClick={() => onClick(photo)}
    >
      <div className="relative border-3 border-[#2C2C2C] shadow-[4px_4px_0_#2C2C2C] overflow-hidden bg-[#e8e0d4]">
        <img
          src={photo.url}
          alt={photo.title || ""}
          className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ display: "block" }}
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${photo.id}/600/800`;
          }}
        />
        {photo.title && (
          <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[#2C2C2C] px-3 py-2">
            <p className="text-white text-xs font-bold uppercase tracking-wider truncate">
              {photo.title}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function MobilePhotoStack({ photos }) {
  const [current, setCurrent] = useState(0);
  const [dragging, setDragging] = useState(false);

  const next = () => setCurrent((p) => (p + 1) % photos.length);
  const prev = () => setCurrent((p) => (p - 1 + photos.length) % photos.length);

  const visible = photos.slice(current, current + 3);

  return (
    <div className="relative h-[380px] flex items-center justify-center select-none">
      {visible.map((photo, i) => (
        <motion.div
          key={photo.id || photo.url}
          className="absolute border-3 border-[#2C2C2C] overflow-hidden bg-[#e8e0d4]"
          style={{
            width: "75vw",
            maxWidth: 280,
            height: 340,
            zIndex: 10 - i,
          }}
          animate={{
            rotate: [0, 2, -1][i] ?? 0,
            scale: [1, 0.96, 0.92][i] ?? 0.9,
            x: [0, 10, 20][i] ?? 30,
            y: [0, 6, 12][i] ?? 18,
            boxShadow: i === 0 ? "6px 6px 0 #2C2C2C" : "3px 3px 0 #2C2C2C",
          }}
          transition={{ duration: 0.3 }}
          drag={i === 0 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.3}
          onDragStart={() => setDragging(true)}
          onDragEnd={(_, info) => {
            setDragging(false);
            if (info.offset.x < -60) next();
            else if (info.offset.x > 60) prev();
          }}
        >
          <img
            src={photo.url}
            alt={photo.title || ""}
            className="w-full h-full object-cover pointer-events-none"
            onError={(e) => {
              e.target.src = `https://picsum.photos/seed/${photo.id || i}/600/800`;
            }}
          />
        </motion.div>
      ))}

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-0 z-20 w-10 h-10 border-3 border-[#2C2C2C] bg-white shadow-[3px_3px_0_#2C2C2C] flex items-center justify-center"
      >
        ←
      </button>
      <button
        onClick={next}
        className="absolute right-0 z-20 w-10 h-10 border-3 border-[#2C2C2C] bg-white shadow-[3px_3px_0_#2C2C2C] flex items-center justify-center"
      >
        →
      </button>

      <p className="absolute bottom-0 text-xs font-bold text-[#2C2C2C]/40 uppercase tracking-widest">
        {current + 1} / {photos.length}
      </p>
    </div>
  );
}

function Lightbox({ photo, onClose }) {
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative max-w-4xl max-h-[90vh] border-3 border-white shadow-[8px_8px_0_#52C41A]"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.url}
          alt={photo.title || ""}
          className="max-w-full max-h-[85vh] object-contain block"
          onError={(e) => {
            e.target.src = `https://picsum.photos/seed/${photo.id}/800/1000`;
          }}
        />
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 bg-black border-2 border-white text-white font-bold flex items-center justify-center hover:bg-[#52C41A] hover:border-[#52C41A] transition-colors"
        >
          ✕
        </button>
        {photo.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/80 px-4 py-2">
            <p className="text-white text-sm font-bold uppercase tracking-wider">
              {photo.title}
            </p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function Gallery({ categories, photosByCategory }) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.id ?? null,
  );
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const currentPhotos = photosByCategory[activeCategory] ?? [];

  return (
    <section id="work" className="bg-[#FFF9F0] py-20 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="text-[#52C41A] text-xs font-black uppercase tracking-[0.3em] mb-2">
            Portfolio
          </p>
          <h2
            className="text-[#2C2C2C] font-black leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              letterSpacing: "0.04em",
            }}
          >
            The Work
          </h2>
        </motion.div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-3 mb-10">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              onClick={() => setActiveCategory(cat.id)}
              className={`text-sm font-black uppercase tracking-widest px-5 py-2.5 border-3 border-[#2C2C2C] transition-all duration-200 ${
                activeCategory === cat.id
                  ? "bg-[#2C2C2C] text-white shadow-[3px_3px_0_#52C41A]"
                  : "bg-white text-[#2C2C2C] shadow-[3px_3px_0_#2C2C2C] hover:shadow-[1px_1px_0_#2C2C2C] hover:translate-x-0.5 hover:translate-y-0.5"
              }`}
            >
              {cat.name}
            </motion.button>
          ))}
        </div>

        {/* Photos */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {currentPhotos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 border-3 border-dashed border-[#2C2C2C]/20">
                <p className="text-[#2C2C2C]/30 font-bold uppercase tracking-widest">
                  No photos yet
                </p>
              </div>
            ) : isMobile ? (
              <MobilePhotoStack photos={currentPhotos} />
            ) : (
              <div
                className={`gap-4 ${
                  currentPhotos.length === 1
                    ? "columns-1"
                    : currentPhotos.length === 2
                      ? "columns-2"
                      : currentPhotos.length === 3
                        ? "columns-2 lg:columns-3"
                        : "columns-2 lg:columns-3 xl:columns-4"
                }`}
              >
                {currentPhotos.map((photo, i) => (
                  <MasonryPhoto
                    key={photo.id}
                    photo={photo}
                    index={i}
                    onClick={setLightboxPhoto}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightboxPhoto && (
          <Lightbox
            photo={lightboxPhoto}
            onClose={() => setLightboxPhoto(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
