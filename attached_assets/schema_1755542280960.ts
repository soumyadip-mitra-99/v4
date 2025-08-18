import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for session management, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  googleId: text("google_id").unique(),
  isDemo: boolean("is_demo").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Food freshness status enum
export const freshnessStatusEnum = pgEnum("freshness_status", ["fresh", "moderate", "urgent"]);

// Food categories enum
export const foodCategoryEnum = pgEnum("food_category", [
  "meals",
  "snacks",
  "beverages",
  "baked_goods",
  "fruits_vegetables",
  "dairy",
  "other"
]);

// Pickup status enum
export const pickupStatusEnum = pgEnum("pickup_status", ["available", "reserved", "completed", "expired"]);

// Food listings table
export const foodListings = pgTable("food_listings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: foodCategoryEnum("category").notNull(),
  quantity: varchar("quantity").notNull(),
  location: varchar("location").notNull(),
  providerId: varchar("provider_id").notNull().references(() => users.id),
  providerName: varchar("provider_name").notNull(),
  imageUrl: varchar("image_url"),
  freshnessStatus: freshnessStatusEnum("freshness_status").notNull(),
  availableUntil: timestamp("available_until").notNull(),
  pickupInstructions: text("pickup_instructions"),
  isActive: boolean("is_active").default(true),
  servesCount: integer("serves_count"),
  carbonSavings: decimal("carbon_savings", { precision: 10, scale: 2 }),
  aiAnalysis: jsonb("ai_analysis"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pickup reservations table
export const pickups = pgTable("pickups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  foodListingId: varchar("food_listing_id").notNull().references(() => foodListings.id),
  recipientId: varchar("recipient_id").notNull().references(() => users.id),
  status: pickupStatusEnum("status").default("available"),
  scheduledTime: timestamp("scheduled_time"),
  completedAt: timestamp("completed_at"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Notifications table
export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type").notNull(),
  isRead: boolean("is_read").default(false),
  relatedListingId: varchar("related_listing_id").references(() => foodListings.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// User statistics table for tracking impact
export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  totalFoodSaved: decimal("total_food_saved", { precision: 10, scale: 2 }).default("0"),
  totalCarbonSaved: decimal("total_carbon_saved", { precision: 10, scale: 2 }).default("0"),
  totalPeopleServed: integer("total_people_served").default(0),
  totalListings: integer("total_listings").default(0),
  totalPickups: integer("total_pickups").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Platform statistics table for global stats
export const platformStats = pgTable("platform_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalFoodSaved: decimal("total_food_saved", { precision: 10, scale: 2 }).default("0"),
  totalCarbonSaved: decimal("total_carbon_saved", { precision: 10, scale: 2 }).default("0"),
  totalPeopleServed: integer("total_people_served").default(0),
  activeListings: integer("active_listings").default(0),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  foodListings: many(foodListings),
  pickups: many(pickups),
  notifications: many(notifications),
  stats: one(userStats),
}));

export const foodListingsRelations = relations(foodListings, ({ one, many }) => ({
  provider: one(users, {
    fields: [foodListings.providerId],
    references: [users.id],
  }),
  pickups: many(pickups),
  notifications: many(notifications),
}));

export const pickupsRelations = relations(pickups, ({ one }) => ({
  foodListing: one(foodListings, {
    fields: [pickups.foodListingId],
    references: [foodListings.id],
  }),
  recipient: one(users, {
    fields: [pickups.recipientId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
  relatedListing: one(foodListings, {
    fields: [notifications.relatedListingId],
    references: [foodListings.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertFoodListingSchema = createInsertSchema(foodListings).omit({
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
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type FoodListing = typeof foodListings.$inferSelect;
export type InsertFoodListing = z.infer<typeof insertFoodListingSchema>;
export type Pickup = typeof pickups.$inferSelect;
export type InsertPickup = z.infer<typeof insertPickupSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;
export type PlatformStats = typeof platformStats.$inferSelect;
