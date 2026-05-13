import { db } from "@/lib/db";
import { photos } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import FilmStrip from "@/components/FilmStrip";
import About from "@/components/About";
import ScrollCamera from "@/components/ScrollCamera";
import ConnectDrawer from "@/components/ConnectDrawer";
import { Mail } from "lucide-react";

function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const revalidate = 60;

async function getData() {
  const [landscapePhotos, portraitPhotos] = await Promise.all([
    db.select().from(photos).where(eq(photos.orientation, "landscape")).orderBy(photos.uploadedAt),
    db.select().from(photos).where(eq(photos.orientation, "portrait")).orderBy(photos.uploadedAt),
  ]);
  return { landscapePhotos, portraitPhotos };
}

export default async function HomePage() {
  const { landscapePhotos, portraitPhotos } = await getData();

  return (
    <main className="min-h-screen">
      <FilmStrip />
      <ScrollCamera />
      <Gallery landscapePhotos={landscapePhotos} portraitPhotos={portraitPhotos} />
      <Hero />
      <About />

      {/* Footer */}
      <footer className="bg-[#0E0D0C] py-12 px-6 md:px-10 border-t-3 border-[#2A2520]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span
            className="text-white font-black text-3xl"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              letterSpacing: "0.08em",
            }}
          >
            SAS
          </span>

          <div className="flex items-center gap-5">
            <a
              href="https://instagram.com/captsas_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/30 hover:text-[#C9A96E] transition-colors duration-200"
            >
              <InstagramIcon size={16} />
              <span className="text-xs font-bold tracking-widest uppercase">@captsas_</span>
            </a>
            <a
              href="https://instagram.com/s8r_sas"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white/30 hover:text-[#C9A96E] transition-colors duration-200"
            >
              <InstagramIcon size={16} />
              <span className="text-xs font-bold tracking-widest uppercase">@s8r_sas</span>
            </a>
            <a
              href="mailto:captsas.media@gmail.com"
              className="text-white/30 hover:text-[#C9A96E] transition-colors duration-200"
            >
              <Mail size={16} />
            </a>
          </div>

          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Sas Photography. All rights reserved.
          </p>
          <ConnectDrawer
            trigger={
              <button className="text-sm font-bold uppercase tracking-widest text-[#C9A96E] border-2 border-[#C9A96E] px-5 py-2 hover:bg-[#C9A96E] hover:text-black transition-all">
                Get a Quote
              </button>
            }
          />
        </div>
      </footer>
    </main>
  );
}
