"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

export default function ProfilePhotoUploader() {
  const [current, setCurrent] = useState(null);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    fetch("/api/profile-photo")
      .then((r) => r.json())
      .then((d) => setCurrent(d.url));
  }, []);

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setDone(false);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    const folder = "sas-photography/profile";
    const sigRes = await fetch(`/api/cloudinary-sign?folder=${folder}`);
    const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);
    formData.append("folder", folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );
    const data = await res.json();

    await fetch("/api/profile-photo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: data.secure_url, publicId: data.public_id }),
    });

    setCurrent(data.secure_url);
    setPreview(null);
    setFile(null);
    setUploading(false);
    setDone(true);
  };

  const displayPhoto = preview || current;

  return (
    <div className="border-3 border-[#2A2520] bg-[#F5F0EA] shadow-[6px_6px_0_#2A2520] p-6">
      <h3
        className="font-black text-[#2A2520] text-2xl mb-5 uppercase"
        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
      >
        Profile Photo
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Preview circle */}
        <div className="relative flex-shrink-0">
          <div
            className="w-28 h-28 rounded-full border-3 border-[#2A2520] shadow-[4px_4px_0_#2A2520] overflow-hidden bg-[#EDE8DF] flex items-center justify-center cursor-pointer"
            onClick={() => inputRef.current?.click()}
          >
            {displayPhoto ? (
              <img
                src={displayPhoto}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2A2520" strokeWidth="1.5" opacity="0.3">
                <circle cx="12" cy="8" r="4" />
                <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
              </svg>
            )}
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {/* Offset accent */}
          <div
            className="absolute inset-0 rounded-full border-3 border-[#C9A96E] pointer-events-none"
            style={{ transform: "translate(5px, 5px)", zIndex: -1 }}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3 flex-1 w-full">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />

          {!file ? (
            <button
              onClick={() => inputRef.current?.click()}
              className="w-full text-sm font-black uppercase tracking-widest py-3 border-3 border-dashed border-[#2A2520]/40 hover:border-[#C9A96E] hover:text-[#C9A96E] text-[#2A2520]/60 transition-all bg-[#EDE8DF]"
            >
              {current ? "Change Photo" : "Upload Photo"}
            </button>
          ) : (
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="w-full text-sm font-black uppercase tracking-widest py-3 bg-[#C9A96E] text-black border-3 border-[#2A2520] shadow-[4px_4px_0_#2A2520] hover:shadow-[2px_2px_0_#2A2520] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Save Photo"}
            </button>
          )}

          {file && !uploading && (
            <button
              onClick={() => { setFile(null); setPreview(null); }}
              className="w-full text-xs font-bold uppercase tracking-widest py-2 border-2 border-[#2A2520]/20 text-[#2A2520]/40 hover:text-[#2A2520] hover:border-[#2A2520]/60 transition-all"
            >
              Cancel
            </button>
          )}

          {done && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[#C9A96E] text-xs font-black uppercase tracking-widest text-center"
            >
              ✓ Profile photo updated
            </motion.p>
          )}

          <p className="text-[#2A2520]/30 text-xs text-center">
            This appears as your circular portrait on the homepage
          </p>
        </div>
      </div>
    </div>
  );
}
