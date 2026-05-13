"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function BuyModal({ pkg, onClose }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuy = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ packageId: pkg.id, email: email.trim() }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        setLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-[#161412] border border-white/10 p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-[#C9A96E] text-xs font-black uppercase tracking-[0.3em] mb-1">
          One-time purchase
        </p>
        <h3
          className="text-white font-black text-2xl mb-1"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          {pkg.name}
        </h3>
        <p className="text-white font-black text-3xl mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
          A${(pkg.price / 100).toFixed(2)}
        </p>

        <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5 block">
          Your email — download link sent here
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleBuy()}
          placeholder="you@example.com"
          className="w-full px-4 py-3 bg-[#0E0D0C] border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-[#C9A96E]/50 text-sm mb-4"
          autoFocus
        />

        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

        <button
          onClick={handleBuy}
          disabled={loading}
          className="w-full bg-[#C9A96E] text-black font-black uppercase tracking-widest text-sm py-4 hover:bg-[#d4b47a] transition-colors disabled:opacity-50"
        >
          {loading ? "Redirecting to Stripe…" : "Pay with Stripe →"}
        </button>

        <p className="text-white/20 text-xs text-center mt-4">
          Powered by Stripe · Secure · One-time charge
        </p>

        <button onClick={onClose} className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

function PackageCard({ pkg, index, onBuy }) {
  const previewImages = pkg.images?.slice(0, 3) ?? [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group bg-[#161412] border border-white/8 hover:border-[#C9A96E]/30 transition-all duration-300 flex flex-col"
    >
      {/* Cover / preview */}
      <div className="relative aspect-video overflow-hidden bg-[#0E0D0C]">
        {pkg.coverUrl ? (
          <img
            src={pkg.coverUrl}
            alt={pkg.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-white/10 text-xs uppercase tracking-widest font-bold">No preview</span>
          </div>
        )}

        {/* Preview stack — bottom right */}
        {previewImages.length > 1 && (
          <div className="absolute bottom-3 right-3 flex gap-1">
            {previewImages.slice(1).map((img, i) => (
              <div key={img.id} className="w-10 h-7 overflow-hidden border border-white/20">
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Image count badge */}
        {pkg.images?.length > 0 && (
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1">
            <span className="text-white text-xs font-black tracking-widest">
              {pkg.images.length} wallpaper{pkg.images.length !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-6 flex flex-col flex-1">
        <h3
          className="text-white font-black text-2xl leading-none mb-2"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.04em" }}
        >
          {pkg.name}
        </h3>
        {pkg.description && (
          <p className="text-white/40 text-sm leading-relaxed mb-6 flex-1">{pkg.description}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
          <span
            className="text-[#C9A96E] font-black text-3xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            A${(pkg.price / 100).toFixed(2)}
          </span>
          <button
            onClick={() => onBuy(pkg)}
            className="text-xs font-black uppercase tracking-widest text-black bg-[#C9A96E] px-6 py-3 hover:bg-[#d4b47a] transition-colors"
          >
            Buy Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function WallpaperSection({ packages }) {
  const [buyingPkg, setBuyingPkg] = useState(null);

  if (!packages?.length) return null;

  return (
    <section id="wallpapers" className="bg-[#1A1310] py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <p className="text-[#C9A96E] text-xs font-black uppercase tracking-[0.3em] mb-2">
            Digital Downloads
          </p>
          <h2
            className="text-white font-black leading-none mb-4"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              letterSpacing: "0.04em",
            }}
          >
            Wallpapers
          </h2>
          <p className="text-white/40 max-w-md leading-relaxed" style={{ fontFamily: "'DM Serif Display', serif" }}>
            High-resolution wallpapers for your desktop and phone. One-time purchase, yours forever.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} onBuy={setBuyingPkg} />
          ))}
        </div>
      </div>

      <AnimatePresence>
        {buyingPkg && <BuyModal pkg={buyingPkg} onClose={() => setBuyingPkg(null)} />}
      </AnimatePresence>
    </section>
  );
}
