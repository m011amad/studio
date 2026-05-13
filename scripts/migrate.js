import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

async function migrate() {
  console.log("Running migration...");

  // Drop FK constraint from photos -> categories
  await sql`ALTER TABLE photos DROP CONSTRAINT IF EXISTS photos_category_id_categories_id_fk`;

  // Drop category_id column from photos
  await sql`ALTER TABLE photos DROP COLUMN IF EXISTS category_id`;

  // Add orientation column (landscape | portrait)
  await sql`ALTER TABLE photos ADD COLUMN IF NOT EXISTS orientation text NOT NULL DEFAULT 'landscape'`;

  // Drop categories table
  await sql`DROP TABLE IF EXISTS categories`;

  console.log("Migration complete.");
}

migrate().catch((err) => { console.error(err); process.exit(1); });
