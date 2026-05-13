"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

function DownloadButton({ image, index }) {
  return (
    <motion.a
      href={`${image.url}?fl_attachment`}
      download
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="group relative overflow-hidden bg-[#161412] border border-white/10 hover:border-[#C9A96E]/50 transition-all duration-300 block"
    >
      <div className="aspect-video overflow-hidden">
        <img
          src={image.url}
          alt={`Wallpaper ${index + 1}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4 flex items-center justify-between">
        <span className="text-white/50 text-xs uppercase tracking-widest font-bold">
          Wallpaper {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-[#C9A96E] text-xs font-black uppercase tracking-widest flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
          Download
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </span>
      </div>
    </motion.a>
  );
}

function DownloadContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [state, setState] = useState("loading");
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!sessionId) {
      setState("error");
      setErrorMsg("No session ID found. Please use the link from your email.");
      return;
    }

    fetch(`/api/download?session_id=${sessionId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) {
          setErrorMsg(d.error);
          setState("error");
        } else {
          setData(d);
          setState("success");
        }
      })
      .catch(() => {
        setErrorMsg("Something went wrong. Please try again or contact us.");
        setState("error");
      });
  }, [sessionId]);

  return (
    <>
      {state === "loading" && (
        <div className="flex flex-col items-center justify-center py-32 gap-5">
          <div className="w-10 h-10 border-2 border-[#C9A96E]/30 border-t-[#C9A96E] rounded-full animate-spin" />
          <p className="text-white/30 text-xs uppercase tracking-widest font-bold">Verifying purchase…</p>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
          <p className="text-white/20 text-xs uppercase tracking-widest font-bold mb-2">Error</p>
          <p className="text-white text-lg font-bold max-w-sm">{errorMsg}</p>
          <a href="/" className="text-[#C9A96E] text-xs uppercase tracking-widest font-bold hover:underline mt-4">
            Return Home
          </a>
        </div>
      )}

      {state === "success" && data && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-12 border-b border-white/5 pb-10">
            <p className="text-[#C9A96E] text-xs font-black uppercase tracking-[0.3em] mb-2">
              Purchase confirmed
            </p>
            <h1
              className="text-white font-black leading-none mb-3"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                letterSpacing: "0.04em",
              }}
            >
              {data.package?.name ?? "Wallpaper Package"}
            </h1>
            {data.email && (
              <p className="text-white/30 text-sm">
                Receipt sent to <span className="text-white/60">{data.email}</span>
              </p>
            )}
          </div>

          {data.images?.length === 0 ? (
            <p className="text-white/30 text-sm font-bold uppercase tracking-widest py-16 text-center border border-white/5">
              Wallpapers are being prepared — check your email shortly.
            </p>
          ) : (
            <>
              <p className="text-white/30 text-xs uppercase tracking-widest font-bold mb-6">
                {data.images.length} wallpaper{data.images.length !== 1 ? "s" : ""} included
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {data.images.map((img, i) => (
                  <DownloadButton key={img.id} image={img} index={i} />
                ))}
              </div>
            </>
          )}

          <p className="text-white/20 text-xs text-center mt-16">
            Bookmark this page — your download link is permanent.
            Questions? <a href="mailto:captsas.media@gmail.com" className="text-white/40 hover:text-[#C9A96E] transition-colors">captsas.media@gmail.com</a>
          </p>
        </motion.div>
      )}
    </>
  );
}

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#0E0D0C] px-6 py-16 md:px-10">
      <div className="max-w-5xl mx-auto">
        <a href="/" className="inline-block mb-16">
          <span
            className="text-white font-black text-3xl"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.08em" }}
          >
            SAS
          </span>
        </a>

        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-32 gap-5">
              <div className="w-10 h-10 border-2 border-[#C9A96E]/30 border-t-[#C9A96E] rounded-full animate-spin" />
              <p className="text-white/30 text-xs uppercase tracking-widest font-bold">Loading…</p>
            </div>
          }
        >
          <DownloadContent />
        </Suspense>
      </div>
    </div>
  );
}
