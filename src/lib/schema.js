import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const photos = pgTable("photos", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  publicId: text("public_id").notNull(),
  title: text("title"),
  orientation: text("orientation").notNull().default("landscape"),
  galleryId: integer("gallery_id").references(() => categories.id, { onDelete: "set null" }),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const wallpaperPackages = pgTable("wallpaper_packages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(), // in cents
  stripeProductId: text("stripe_product_id"),
  stripePriceId: text("stripe_price_id"),
  coverUrl: text("cover_url"),
  active: boolean("active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wallpaperImages = pgTable("wallpaper_images", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id").references(() => wallpaperPackages.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  publicId: text("public_id").notNull(),
  order: integer("order").default(0),
});

export const purchases = pgTable("purchases", {
  id: serial("id").primaryKey(),
  packageId: integer("package_id").references(() => wallpaperPackages.id, { onDelete: "set null" }),
  customerEmail: text("customer_email").notNull(),
  stripeSessionId: text("stripe_session_id").notNull().unique(),
  emailSent: boolean("email_sent").default(false),
  createdAt: timestamp("created_at").defaultNow(),
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
