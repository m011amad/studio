import { db } from "@/lib/db";
import { categories, photos } from "@/lib/schema";
import { eq } from "drizzle-orm";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import About from "@/components/About";
import ConnectDrawer from "@/components/ConnectDrawer";

export const revalidate = 60;

async function getData() {
  const [cats, allPhotos] = await Promise.all([
    db.select().from(categories).orderBy(categories.order),
    db.select().from(photos).orderBy(photos.uploadedAt),
  ]);

  const photosByCategory = {};
  for (const cat of cats) {
    photosByCategory[cat.id] = allPhotos.filter((p) => p.categoryId === cat.id);
  }

  return { cats, photosByCategory };
}

export default async function HomePage() {
  const { cats, photosByCategory } = await getData();

  return (
    <main className="min-h-screen">
      <Hero />
      <Gallery categories={cats} photosByCategory={photosByCategory} />
      <About />

      {/* Footer */}
      <footer className="bg-[#0a0a0a] py-12 px-6 md:px-10 border-t-3 border-[#2C2C2C]">
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
          <p className="text-white/30 text-sm">
            © {new Date().getFullYear()} Sas Photography. All rights reserved.
          </p>
          <ConnectDrawer
            trigger={
              <button className="text-sm font-bold uppercase tracking-widest text-[#52C41A] border-2 border-[#52C41A] px-5 py-2 hover:bg-[#52C41A] hover:text-black transition-all">
                Get In Touch
              </button>
            }
          />
        </div>
      </footer>
    </main>
  );
}
