"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function PhotoUploader({ galleries, onUploaded }) {
  const [files, setFiles] = useState([]);
  const [destination, setDestination] = useState("carousel"); // "carousel" | "gallery"
  const [orientation, setOrientation] = useState("landscape");
  const [galleryId, setGalleryId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState([]);
  const inputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
    setFiles((p) => [...p, ...dropped]);
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"));
    setFiles((p) => [...p, ...selected]);
  };

  const removeFile = (i) => setFiles((p) => p.filter((_, idx) => idx !== i));

  const uploadAll = async () => {
    if (!files.length) return;
    if (destination === "gallery" && !galleryId) return;
    setUploading(true);
    setProgress(files.map(() => "pending"));

    const sigRes = await fetch("/api/cloudinary-sign");
    const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

    for (let i = 0; i < files.length; i++) {
      setProgress((p) => p.map((v, idx) => (idx === i ? "uploading" : v)));
      try {
        const formData = new FormData();
        formData.append("file", files[i]);
        formData.append("api_key", apiKey);
        formData.append("timestamp", timestamp);
        formData.append("signature", signature);
        formData.append("folder", "sas-photography");

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData },
        );
        const data = await res.json();

        await fetch("/api/photos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: data.secure_url,
            publicId: data.public_id,
            orientation: destination === "carousel" ? orientation : "landscape",
            galleryId: destination === "gallery" ? galleryId : null,
          }),
        });

        setProgress((p) => p.map((v, idx) => (idx === i ? "done" : v)));
      } catch {
        setProgress((p) => p.map((v, idx) => (idx === i ? "error" : v)));
      }
    }

    setUploading(false);
    setFiles([]);
    setProgress([]);
    onUploaded?.();
  };

  return (
    <div className="border-3 border-[#2A2520] bg-[#F5F0EA] shadow-[6px_6px_0_#2A2520] p-6">
      <h3
        className="font-black text-[#2A2520] text-2xl mb-5 uppercase"
        style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
      >
        Upload Photos
      </h3>

      {/* Destination toggle */}
      <div className="mb-4">
        <label className="text-xs font-bold uppercase tracking-widest text-[#2A2520]/60 mb-1.5 block">
          Upload to
        </label>
        <div className="flex gap-2">
          {[
            { value: "carousel", label: "Carousel" },
            { value: "gallery", label: "Gallery" },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => { setDestination(opt.value); setGalleryId(""); }}
              className={`flex-1 text-xs font-black uppercase tracking-widest py-2.5 border-3 border-[#2A2520] transition-all duration-150 ${
                destination === opt.value
                  ? "bg-[#2A2520] text-white shadow-[3px_3px_0_#C9A96E]"
                  : "bg-[#EDE8DF] text-[#2A2520] shadow-[3px_3px_0_#2A2520] hover:shadow-[1px_1px_0_#2A2520] hover:translate-x-0.5 hover:translate-y-0.5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel: orientation toggle */}
      {destination === "carousel" && (
        <div className="mb-4">
          <label className="text-xs font-bold uppercase tracking-widest text-[#2A2520]/60 mb-1.5 block">
            Orientation
          </label>
          <div className="flex gap-2">
            {[
              { value: "landscape", label: "Landscape 16:9" },
              { value: "portrait", label: "Portrait 9:16" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setOrientation(opt.value)}
                className={`flex-1 text-xs font-black uppercase tracking-widest py-2.5 border-3 border-[#2A2520] transition-all duration-150 ${
                  orientation === opt.value
                    ? "bg-[#2A2520] text-white shadow-[3px_3px_0_#C9A96E]"
                    : "bg-[#EDE8DF] text-[#2A2520] shadow-[3px_3px_0_#2A2520] hover:shadow-[1px_1px_0_#2A2520] hover:translate-x-0.5 hover:translate-y-0.5"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Gallery: picker (required) */}
      {destination === "gallery" && (
        <div className="mb-4">
          <label className="text-xs font-bold uppercase tracking-widest text-[#2A2520]/60 mb-1.5 block">
            Select Gallery
          </label>
          {galleries.length === 0 ? (
            <p className="text-[#2A2520]/40 text-xs font-bold uppercase tracking-widest py-2">
              No galleries yet — create one first
            </p>
          ) : (
            <select
              value={galleryId}
              onChange={(e) => setGalleryId(e.target.value)}
              className="w-full px-4 py-3 bg-[#EDE8DF] border-3 border-[#2A2520] shadow-[3px_3px_0_#2A2520] text-[#2A2520] font-bold focus:outline-none appearance-none cursor-pointer text-sm"
            >
              <option value="">— Choose a gallery —</option>
              {galleries.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-3 border-dashed border-[#2A2520]/30 hover:border-[#C9A96E] transition-colors bg-[#EDE8DF] p-10 text-center cursor-pointer mb-4"
      >
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        <p className="text-4xl mb-2">📸</p>
        <p className="font-black text-[#2A2520]/60 text-sm uppercase tracking-widest">
          Drop photos here or click to browse
        </p>
      </div>

      {/* Previews */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-5"
          >
            {files.map((file, i) => (
              <motion.div
                key={`${file.name}-${i}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative border-3 border-[#2A2520] overflow-hidden"
                style={{ aspectRatio: "1" }}
              >
                <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                {progress[i] === "uploading" && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
                {progress[i] === "done" && (
                  <div className="absolute inset-0 bg-[#C9A96E]/80 flex items-center justify-center">
                    <span className="text-white text-xl font-black">✓</span>
                  </div>
                )}
                {progress[i] === "error" && (
                  <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center">
                    <span className="text-white text-xl">✕</span>
                  </div>
                )}
                {!uploading && (
                  <button
                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="absolute top-1 right-1 w-5 h-5 bg-[#2A2520] text-white text-xs flex items-center justify-center hover:bg-red-500 transition-colors"
                  >
                    ×
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {files.length > 0 && (
        <button
          onClick={uploadAll}
          disabled={uploading || (destination === "gallery" && !galleryId)}
          className="w-full bg-[#C9A96E] text-black font-black uppercase tracking-widest text-sm py-3.5 border-3 border-[#2A2520] shadow-[4px_4px_0_#2A2520] hover:shadow-[2px_2px_0_#2A2520] hover:translate-x-0.5 hover:translate-y-0.5 transition-all disabled:opacity-50"
        >
          {uploading ? "Uploading..." : `Upload ${files.length} Photo${files.length > 1 ? "s" : ""} to ${destination === "carousel" ? "Carousel" : "Gallery"}`}
        </button>
      )}
    </div>
  );
}
