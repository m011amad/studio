"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

function Lightbox({ photo, photos, onClose, onPrev, onNext }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onNext, onPrev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Prev */}
      <button
        className="absolute left-4 md:left-8 z-10 w-11 h-11 flex items-center justify-center text-white/50 hover:text-white transition-colors"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
      </button>

      {/* Image */}
      <motion.div
        key={photo.id}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="relative max-w-[88vw] max-h-[88vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.url}
          alt={photo.title || ""}
          className="max-w-full max-h-[88vh] object-contain block"
        />
        {photo.title && (
          <p className="absolute bottom-0 left-0 right-0 text-center text-white/50 text-xs uppercase tracking-widest py-3 bg-gradient-to-t from-black/40 to-transparent">
            {photo.title}
          </p>
        )}
      </motion.div>

      {/* Next */}
      <button
        className="absolute right-4 md:right-8 z-10 w-11 h-11 flex items-center justify-center text-white/50 hover:text-white transition-colors"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      {/* Close */}
      <button
        className="absolute top-5 right-5 text-white/40 hover:text-white transition-colors"
        onClick={onClose}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
      </button>

      {/* Counter */}
      <p className="absolute bottom-6 left-0 right-0 text-center text-white/25 text-xs tracking-widest uppercase">
        {photos.indexOf(photo) + 1} / {photos.length}
      </p>
    </motion.div>
  );
}

function MasonryGrid({ photos, onPhotoClick }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
      {photos.map((photo, i) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.45, delay: (i % 6) * 0.06 }}
          className="break-inside-avoid mb-3 cursor-pointer group overflow-hidden"
          onClick={() => onPhotoClick(i)}
        >
          <div className="relative overflow-hidden bg-[#1a1614]">
            <img
              src={photo.url}
              alt={photo.title || ""}
              className="w-full object-cover block transition-transform duration-700 group-hover:scale-[1.03]"
              style={{
                aspectRatio: photo.orientation === "portrait" ? "9/16" : "16/9",
              }}
              onError={(e) => {
                e.target.src = `https://picsum.photos/seed/${photo.id}/800/450`;
              }}
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            {photo.title && (
              <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-black/60 backdrop-blur-sm px-4 py-3">
                <p className="text-white text-xs font-bold uppercase tracking-widest truncate">
                  {photo.title}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function GallerySection({ galleries, photosByGallery }) {
  const [activeId, setActiveId] = useState(galleries[0]?.id ?? null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const currentPhotos = (activeId ? photosByGallery[activeId] : null) ?? [];

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevPhoto = useCallback(() =>
    setLightboxIndex((i) => (i - 1 + currentPhotos.length) % currentPhotos.length),
    [currentPhotos.length]);
  const nextPhoto = useCallback(() =>
    setLightboxIndex((i) => (i + 1) % currentPhotos.length),
    [currentPhotos.length]);

  if (!galleries.length) return null;

  return (
    <section id="galleries" className="bg-[#0E0D0C] py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-[#C9A96E] text-xs font-black uppercase tracking-[0.3em] mb-2">
            Galleries
          </p>
          <h2
            className="text-white font-black leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              letterSpacing: "0.04em",
            }}
          >
            The Collection
          </h2>
        </motion.div>

        {/* Gallery tabs */}
        <div className="flex flex-wrap gap-px mb-12 border border-white/10 w-fit">
          {galleries.map((g) => (
            <button
              key={g.id}
              onClick={() => setActiveId(g.id)}
              className={`text-xs font-black uppercase tracking-[0.15em] px-6 py-3 transition-all duration-200 ${
                activeId === g.id
                  ? "bg-[#C9A96E] text-black"
                  : "bg-transparent text-white/40 hover:text-white hover:bg-white/5"
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        {/* Photos */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {currentPhotos.length === 0 ? (
              <div className="flex items-center justify-center py-32 border border-white/5">
                <p className="text-white/20 text-sm font-bold uppercase tracking-widest">
                  No photos in this gallery yet
                </p>
              </div>
            ) : (
              <MasonryGrid photos={currentPhotos} onPhotoClick={setLightboxIndex} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && currentPhotos[lightboxIndex] && (
          <Lightbox
            photo={currentPhotos[lightboxIndex]}
            photos={currentPhotos}
            onClose={closeLightbox}
            onPrev={prevPhoto}
            onNext={nextPhoto}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
