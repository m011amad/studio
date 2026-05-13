import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  publicId: text("public_id").notNull(),
  title: text("title"),
  orientation: text("orientation").notNull().default("landscape"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  profilePhotoUrl: text("profile_photo_url"),
  profilePhotoPublicId: text("profile_photo_public_id"),
  createdAt: timestamp("created_at").defaultNow(),
});
