"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoUploader from "./PhotoUploader";
import ProfilePhotoUploader from "./ProfilePhotoUploader";

function PhotoGrid({ photos, onDelete }) {
  return (
    <div className="border-3 border-[#2A2520] bg-[#F5F0EA] shadow-[6px_6px_0_#2A2520] p-6">
      <h3
        className="font-black text-[#2A2520] text-2xl mb-5 uppercase"
        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
      >
        All Photos ({photos.length})
      </h3>
      {photos.length === 0 ? (
        <p className="text-[#2A2520]/40 text-sm font-bold uppercase tracking-widest py-8 text-center">
          No photos uploaded yet
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo) => (
            <motion.div
              key={photo.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative group border-3 border-[#2A2520] overflow-hidden"
              style={{ aspectRatio: "1" }}
            >
              <img
                src={photo.url}
                alt=""
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://picsum.photos/seed/${photo.id}/300/300`;
                }}
              />
              {/* Orientation badge */}
              <div className="absolute top-1 left-1 bg-[#2A2520]/70 text-white text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5">
                {photo.orientation === "portrait" ? "9:16" : "16:9"}
              </div>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <button
                  onClick={() => onDelete(photo.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 bg-red-500 border-2 border-white text-white font-black text-sm flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/photos");
    const phs = await res.json();
    setPhotos(phs);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this photo?")) return;
    await fetch(`/api/photos/${id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <div className="min-h-screen bg-[#EDE8DF]">
      <nav className="bg-[#2A2520] border-b-3 border-[#2A2520] px-6 md:px-10 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-white font-black text-2xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
          >
            SAS
          </a>
          <span className="text-[#C9A96E] text-xs font-black uppercase tracking-widest border border-[#C9A96E]/40 px-2 py-0.5">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            className="text-white/50 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            View Site
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-xs font-black uppercase tracking-widest text-[#2A2520] bg-[#C9A96E] px-4 py-2 border-2 border-[#C9A96E] hover:bg-transparent hover:text-[#C9A96E] transition-all"
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-black text-[#2A2520] mb-10"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(2.5rem, 6vw, 4rem)",
            letterSpacing: "0.04em",
          }}
        >
          Dashboard
        </motion.h1>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 border-3 border-[#2A2520] border-t-[#C9A96E] rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <ProfilePhotoUploader />
              <PhotoUploader onUploaded={refresh} />
            </div>
            <div className="lg:col-span-2">
              <AnimatePresence>
                <PhotoGrid photos={photos} onDelete={handleDelete} />
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
