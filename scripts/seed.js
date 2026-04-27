/**
 * Run with: node scripts/seed.js
 * Make sure DATABASE_URL is set in .env.local first
 *
 * Install dotenv if needed: npm install -D dotenv
 */

import "dotenv/config";
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

  // Admin user — change this password!
  const password = await bcrypt.hash("changeme123", 12);
  await db
    .insert(users)
    .values({ email: "sas@example.com", password })
    .onConflictDoNothing();
  console.log("  ✓ Admin user: sas@example.com / changeme123");

  console.log("\n✅ Done! Update the admin password after first login.");
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
