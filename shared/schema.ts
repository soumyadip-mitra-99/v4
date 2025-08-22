import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean, integer, decimal, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  googleId: text("google_id").unique(),
  name: text("name").notNull(),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const foodListings = pgTable("food_listings", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  providerId: uuid("provider_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // meal, snack, beverage, dessert
  imageUrl: text("image_url"),
  portions: integer("portions").default(1),
  location: text("location").notNull(),
  availableUntil: timestamp("available_until").notNull(),
  freshnessLevel: text("freshness_level").notNull(), // fresh, good, consume_soon
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const pickups = pgTable("pickups", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  listingId: uuid("listing_id").references(() => foodListings.id).notNull(),
  recipientId: uuid("recipient_id").references(() => users.id).notNull(),
  status: text("status").notNull().default("reserved"), // reserved, completed, expired
  scheduledTime: timestamp("scheduled_time"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // pickup_reserved, listing_expired, etc
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userStats = pgTable("user_stats", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  totalFoodSaved: decimal("total_food_saved", { precision: 10, scale: 2 }).default("0"),
  totalCarbonSaved: decimal("total_carbon_saved", { precision: 10, scale: 2 }).default("0"),
  totalPeopleServed: integer("total_people_served").default(0),
  totalListings: integer("total_listings").default(0),
  totalPickups: integer("total_pickups").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const platformStats = pgTable("platform_stats", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  totalFoodSaved: decimal("total_food_saved", { precision: 10, scale: 2 }).default("0"),
  totalCarbonSaved: decimal("total_carbon_saved", { precision: 10, scale: 2 }).default("0"),
  totalPeopleServed: integer("total_people_served").default(0),
  activeListings: integer("active_listings").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFoodListingSchema = createInsertSchema(foodListings, {
  // ✅ This is the change.
  // It tells Zod to accept a string and convert it to a Date.
  availableUntil: z.coerce.date(), 
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPickupSchema = createInsertSchema(pickups).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  lastUpdated: true,
});

// Types
export type User = typeof users.$inferSelect;
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type FoodListing = typeof foodListings.$inferSelect;
export type InsertFoodListing = z.infer<typeof insertFoodListingSchema>;
export type Pickup = typeof pickups.$inferSelect;
export type InsertPickup = z.infer<typeof insertPickupSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type PlatformStats = typeof platformStats.$inferSelect;
