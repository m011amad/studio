"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import PhotoUploader from "./PhotoUploader";
import ProfilePhotoUploader from "./ProfilePhotoUploader";

// ─── Wallpaper Package Manager ───────────────────────────────────────────────

function WallpaperImageUploader({ packageId, onUploaded }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    const sigRes = await fetch("/api/cloudinary-sign");
    const { timestamp, signature, apiKey, cloudName } = await sigRes.json();

    for (const file of files) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("api_key", apiKey);
        fd.append("timestamp", timestamp);
        fd.append("signature", signature);
        fd.append("folder", "sas-wallpapers");

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
        const data = await res.json();

        await fetch(`/api/packages/${packageId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: data.secure_url, publicId: data.public_id }),
        });
      } catch { /* continue */ }
    }
    setUploading(false);
    onUploaded?.();
  };

  return (
    <div
      className="border-2 border-dashed border-[#2A2520]/20 hover:border-[#C9A96E]/40 transition-colors bg-[#EDE8DF] p-4 text-center cursor-pointer"
      onClick={() => inputRef.current?.click()}
      onDrop={(e) => { e.preventDefault(); handleFiles(Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"))); }}
      onDragOver={(e) => e.preventDefault()}
    >
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(Array.from(e.target.files))} />
      {uploading
        ? <p className="text-[#2A2520]/50 text-xs font-bold uppercase tracking-widest">Uploading…</p>
        : <p className="text-[#2A2520]/40 text-xs font-bold uppercase tracking-widest">+ Add wallpaper images</p>}
    </div>
  );
}

function PackageManager({ onUpdated }) {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [pkgImages, setPkgImages] = useState({});

  const load = useCallback(async () => {
    const res = await fetch("/api/packages");
    const data = await res.json();
    setPackages(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const loadImages = async (pkgId) => {
    const res = await fetch(`/api/packages/${pkgId}/images`);
    const imgs = await res.json();
    setPkgImages((p) => ({ ...p, [pkgId]: imgs }));
  };

  const handleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
    if (expanded !== id) loadImages(id);
  };

  const createPackage = async () => {
    if (!form.name.trim() || !form.price) return;
    setSaving(true);
    setFormError("");
    const res = await fetch("/api/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name.trim(), description: form.description.trim(), price: form.price }),
    });
    const data = await res.json();
    if (!res.ok) {
      setFormError(data.error || "Failed to create package.");
      setSaving(false);
      return;
    }
    setForm({ name: "", description: "", price: "" });
    setFormError("");
    setAdding(false);
    setSaving(false);
    load();
    onUpdated?.();
  };

  const deleteImage = async (pkgId, imageId, publicId) => {
    if (!confirm("Remove this wallpaper?")) return;
    await fetch(`/api/packages/${pkgId}/images`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageId, publicId }),
    });
    loadImages(pkgId);
  };

  const deactivate = async (id) => {
    if (!confirm("Deactivate this package? It will be hidden from the store.")) return;
    await fetch(`/api/packages/${id}`, { method: "DELETE" });
    load();
    onUpdated?.();
  };

  return (
    <div className="border-3 border-[#2A2520] bg-[#F5F0EA] shadow-[6px_6px_0_#2A2520] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-black text-[#2A2520] text-2xl uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}>
          Wallpaper Store
        </h3>
        <button
          onClick={() => setAdding(true)}
          className="text-xs font-black uppercase tracking-widest bg-[#C9A96E] text-black px-4 py-2 border-3 border-[#2A2520] shadow-[3px_3px_0_#2A2520] hover:shadow-[1px_1px_0_#2A2520] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
        >
          + New Package
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mb-4 border-3 border-[#2A2520] bg-[#EDE8DF] p-4 space-y-3">
            <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Package name (e.g. Nature Pack)" className="w-full px-3 py-2 border-2 border-[#2A2520]/30 bg-[#F5F0EA] text-[#2A2520] font-bold text-sm focus:outline-none focus:border-[#C9A96E]" />
            <input value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short description (optional)" className="w-full px-3 py-2 border-2 border-[#2A2520]/30 bg-[#F5F0EA] text-[#2A2520] font-bold text-sm focus:outline-none focus:border-[#C9A96E]" />
            <input value={form.price} onChange={(e) => setForm(p => ({ ...p, price: e.target.value }))} placeholder="Price in AUD (e.g. 9.99)" type="number" min="0.50" step="0.01" className="w-full px-3 py-2 border-2 border-[#2A2520]/30 bg-[#F5F0EA] text-[#2A2520] font-bold text-sm focus:outline-none focus:border-[#C9A96E]" />
            {formError && <p className="text-red-500 text-xs font-bold">{formError}</p>}
            <div className="flex gap-2">
              <button onClick={createPackage} disabled={saving} className="flex-1 py-2 bg-[#C9A96E] text-black font-black text-sm border-3 border-[#2A2520] shadow-[3px_3px_0_#2A2520] disabled:opacity-50">
                {saving ? "Creating…" : "Create Package"}
              </button>
              <button onClick={() => { setAdding(false); setFormError(""); }} className="px-4 py-2 border-3 border-[#2A2520] font-black text-sm text-[#2A2520]">✕</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="py-8 flex justify-center"><div className="w-6 h-6 border-2 border-[#2A2520] border-t-[#C9A96E] rounded-full animate-spin" /></div>
      ) : packages.length === 0 ? (
        <p className="text-[#2A2520]/40 text-sm font-bold uppercase tracking-widest py-6 text-center">No packages yet</p>
      ) : (
        <div className="space-y-2">
          {packages.map((pkg) => (
            <div key={pkg.id} className="border-2 border-[#2A2520]/10 bg-[#EDE8DF]">
              {/* Row */}
              <div className="flex items-center gap-3 p-3">
                {pkg.coverUrl && <img src={pkg.coverUrl} alt="" className="w-10 h-7 object-cover border border-[#2A2520]/20 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <p className="text-[#2A2520] font-bold text-sm truncate">{pkg.name}</p>
                  <p className="text-[#2A2520]/50 text-xs">${(pkg.price / 100).toFixed(2)}</p>
                </div>
                <button onClick={() => handleExpand(pkg.id)} className="text-[#2A2520]/40 hover:text-[#C9A96E] transition-colors text-xs font-black uppercase tracking-wider">
                  {expanded === pkg.id ? "Close" : "Manage"}
                </button>
                <button onClick={() => deactivate(pkg.id)} className="text-[#2A2520]/30 hover:text-red-500 transition-colors text-xs font-black uppercase tracking-wider">
                  Hide
                </button>
              </div>

              {/* Expanded — image management */}
              <AnimatePresence>
                {expanded === pkg.id && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-[#2A2520]/10 p-3 space-y-3">
                    <WallpaperImageUploader packageId={pkg.id} onUploaded={() => loadImages(pkg.id)} />
                    {pkgImages[pkg.id]?.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {pkgImages[pkg.id].map((img) => (
                          <div key={img.id} className="relative group">
                            <img src={img.url} alt="" className="w-full aspect-video object-cover border border-[#2A2520]/20" />
                            <button
                              onClick={() => deleteImage(pkg.id, img.id, img.publicId)}
                              className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >×</button>
                          </div>
                        ))}
                      </div>
                    )}
                    {!pkgImages[pkg.id]?.length && <p className="text-[#2A2520]/30 text-xs text-center py-2">No images yet</p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GalleryManager({ galleries, onUpdated }) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [addName, setAddName] = useState("");

  const saveEdit = async () => {
    if (!editing?.name.trim()) return;
    await fetch("/api/categories", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editing.id, name: editing.name }),
    });
    setEditing(null);
    onUpdated();
  };

  const addGallery = async () => {
    if (!addName.trim()) return;
    await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: addName }),
    });
    setAddName("");
    setAdding(false);
    onUpdated();
  };

  const deleteGallery = async (id) => {
    if (!confirm("Delete this gallery? Photos will be unlinked but not deleted.")) return;
    await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    onUpdated();
  };

  return (
    <div className="border-3 border-[#2A2520] bg-[#F5F0EA] shadow-[6px_6px_0_#2A2520] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3
          className="font-black text-[#2A2520] text-2xl uppercase"
          style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
        >
          Galleries
        </h3>
        <button
          onClick={() => setAdding(true)}
          className="text-xs font-black uppercase tracking-widest bg-[#C9A96E] text-black px-4 py-2 border-3 border-[#2A2520] shadow-[3px_3px_0_#2A2520] hover:shadow-[1px_1px_0_#2A2520] hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
        >
          + Add
        </button>
      </div>

      <AnimatePresence>
        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 flex gap-2"
          >
            <input
              value={addName}
              onChange={(e) => setAddName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGallery()}
              placeholder="Gallery name..."
              autoFocus
              className="flex-1 px-3 py-2 border-3 border-[#2A2520] shadow-[3px_3px_0_#2A2520] text-[#2A2520] font-bold text-sm focus:outline-none focus:border-[#C9A96E] bg-[#EDE8DF]"
            />
            <button onClick={addGallery} className="px-4 py-2 bg-[#C9A96E] text-black font-black text-sm border-3 border-[#2A2520] shadow-[3px_3px_0_#2A2520]">
              Save
            </button>
            <button onClick={() => { setAdding(false); setAddName(""); }} className="px-4 py-2 bg-[#F5F0EA] text-[#2A2520] font-black text-sm border-3 border-[#2A2520]">
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {galleries.length === 0 ? (
        <p className="text-[#2A2520]/40 text-sm font-bold uppercase tracking-widest py-4 text-center">
          No galleries yet
        </p>
      ) : (
        <div className="space-y-2">
          {galleries.map((g) => (
            <div key={g.id} className="flex items-center gap-3 p-3 border-2 border-[#2A2520]/10 bg-[#EDE8DF]">
              {editing?.id === g.id ? (
                <>
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                    autoFocus
                    className="flex-1 px-3 py-1.5 border-3 border-[#C9A96E] text-[#2A2520] font-bold text-sm focus:outline-none bg-[#F5F0EA]"
                  />
                  <button onClick={saveEdit} className="text-[#C9A96E] font-black text-sm">Save</button>
                  <button onClick={() => setEditing(null)} className="text-[#2A2520]/40 font-black text-sm">✕</button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-[#2A2520] font-bold text-sm">{g.name}</span>
                  <button onClick={() => setEditing({ id: g.id, name: g.name })} className="text-[#2A2520]/40 hover:text-[#C9A96E] transition-colors text-xs font-black uppercase tracking-wider">
                    Edit
                  </button>
                  <button onClick={() => deleteGallery(g.id)} className="text-[#2A2520]/30 hover:text-red-500 transition-colors text-xs font-black uppercase tracking-wider">
                    Delete
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PhotoGrid({ photos, galleries, onDelete }) {
  const galleryMap = Object.fromEntries(galleries.map((g) => [g.id, g.name]));

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
                onError={(e) => { e.target.src = `https://picsum.photos/seed/${photo.id}/300/300`; }}
              />
              {/* Badges */}
              <div className="absolute top-1 left-1 flex flex-col gap-0.5">
                <span className="bg-[#2A2520]/70 text-white text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5">
                  {photo.orientation === "portrait" ? "9:16" : "16:9"}
                </span>
                {photo.galleryId && (
                  <span className="bg-[#C9A96E]/80 text-black text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 truncate max-w-[60px]">
                    {galleryMap[photo.galleryId] ?? "Gallery"}
                  </span>
                )}
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
  const [galleries, setGalleries] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const [catRes, photoRes] = await Promise.all([
      fetch("/api/categories"),
      fetch("/api/photos"),
    ]);
    const [cats, phs] = await Promise.all([catRes.json(), photoRes.json()]);
    setGalleries(Array.isArray(cats) ? cats : []);
    setPhotos(Array.isArray(phs) ? phs : []);
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
          <a href="/" className="text-white font-black text-2xl" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}>
            SAS
          </a>
          <span className="text-[#C9A96E] text-xs font-black uppercase tracking-widest border border-[#C9A96E]/40 px-2 py-0.5">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-white/50 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">
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
          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4rem)", letterSpacing: "0.04em" }}
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
              <GalleryManager galleries={galleries} onUpdated={refresh} />
              <PhotoUploader galleries={galleries} onUploaded={refresh} />
              <PackageManager onUpdated={refresh} />
            </div>
            <div className="lg:col-span-2">
              <AnimatePresence>
                <PhotoGrid photos={photos} galleries={galleries} onDelete={handleDelete} />
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
