"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6"
      style={{
        backgroundImage: `radial-gradient(ellipse at 30% 60%, rgba(82,196,26,0.06) 0%, transparent 60%)`,
      }}
    >
      {/* Decorative corners */}
      <div className="absolute top-8 left-8 w-px h-20 bg-[#52C41A]/20" />
      <div className="absolute top-8 left-8 w-20 h-px bg-[#52C41A]/20" />
      <div className="absolute bottom-8 right-8 w-px h-20 bg-[#52C41A]/20" />
      <div className="absolute bottom-8 right-8 w-20 h-px bg-[#52C41A]/20" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <a
            href="/"
            className="text-white font-black text-5xl"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            SAS
          </a>
          <p className="text-[#52C41A] text-xs font-bold uppercase tracking-[0.25em] mt-2">
            Admin Login
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#141414] border-3 border-[#2C2C2C] shadow-[8px_8px_0_#52C41A] p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5 block">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-[#0a0a0a] border-3 border-[#2C2C2C] text-white placeholder:text-white/20 font-medium focus:outline-none focus:border-[#52C41A] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5 block">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#0a0a0a] border-3 border-[#2C2C2C] text-white placeholder:text-white/20 font-medium focus:outline-none focus:border-[#52C41A] transition-colors"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm font-bold"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#52C41A] text-black font-black uppercase tracking-widest text-sm py-3.5 border-3 border-[#52C41A] hover:bg-transparent hover:text-[#52C41A] transition-all duration-200 disabled:opacity-50 mt-2"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          <a href="/" className="hover:text-white/50 transition-colors">
            ← Back to portfolio
          </a>
        </p>
      </motion.div>
    </div>
  );
}
