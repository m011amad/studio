/**
 * Run with: node scripts/seed.js
 * Make sure DATABASE_URL is set in .env.local first
 *
 * Install dotenv if needed: npm install -D dotenv
 */

import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories, users } from "../src/lib/schema.js";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function seed() {
  console.log("🌱 Seeding database...");

  // Categories
  const cats = [
    { name: "Nature", slug: "nature", order: 1 },
    { name: "Portraits", slug: "portraits", order: 2 },
    { name: "Cars", slug: "cars", order: 3 },
    { name: "Street", slug: "street", order: 4 },
  ];

  for (const cat of cats) {
    await db.insert(categories).values(cat).onConflictDoNothing();
    console.log(`  ✓ Category: ${cat.name}`);
  }

  // Admin user — credentials loaded from .env.local
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    console.error("  ✗ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local");
    process.exit(1);
  }
  const password = await bcrypt.hash(adminPassword, 12);
  await db
    .insert(users)
    .values({ email: adminEmail, password })
    .onConflictDoNothing();
  console.log(`  ✓ Admin user: ${adminEmail}`);

  console.log("\n✅ Done! Update the admin password after first login.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
