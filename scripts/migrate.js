import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log("Running migration...");

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      "order" INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE photos ADD COLUMN IF NOT EXISTS gallery_id INTEGER REFERENCES categories(id) ON DELETE SET NULL`;

  await sql`
    CREATE TABLE IF NOT EXISTS wallpaper_packages (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      price INTEGER NOT NULL,
      stripe_product_id TEXT,
      stripe_price_id TEXT,
      cover_url TEXT,
      active BOOLEAN DEFAULT TRUE,
      "order" INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS wallpaper_images (
      id SERIAL PRIMARY KEY,
      package_id INTEGER NOT NULL REFERENCES wallpaper_packages(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      public_id TEXT NOT NULL,
      "order" INTEGER DEFAULT 0
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS purchases (
      id SERIAL PRIMARY KEY,
      package_id INTEGER REFERENCES wallpaper_packages(id) ON DELETE SET NULL,
      customer_email TEXT NOT NULL,
      stripe_session_id TEXT NOT NULL UNIQUE,
      email_sent BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;

  console.log("Migration complete.");
}

migrate().catch((err) => { console.error(err); process.exit(1); });
