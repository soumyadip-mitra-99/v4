import {
  users,
  foodListings,
  pickups,
  notifications,
  userStats,
  platformStats,
  type User,
  type UpsertUser,
  type FoodListing,
  type InsertFoodListing,
  type Pickup,
  type InsertPickup,
  type Notification,
  type InsertNotification,
  type UserStats,
  type InsertUserStats,
  type PlatformStats,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, count, sum } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByGoogleId(googleId: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Food listing operations
  getFoodListings(limit?: number): Promise<FoodListing[]>;
  getFoodListingById(id: string): Promise<FoodListing | undefined>;
  createFoodListing(listing: InsertFoodListing): Promise<FoodListing>;
  updateFoodListing(id: string, listing: Partial<InsertFoodListing>): Promise<FoodListing>;
  deleteFoodListing(id: string): Promise<void>;
  getFoodListingsByProvider(providerId: string): Promise<FoodListing[]>;
  
  // Pickup operations
  createPickup(pickup: InsertPickup): Promise<Pickup>;
  getPickupsByUser(userId: string): Promise<Pickup[]>;
  updatePickupStatus(id: string, status: "available" | "reserved" | "completed" | "expired"): Promise<Pickup>;
  
  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;
  
  // Statistics operations
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, stats: Partial<InsertUserStats>): Promise<UserStats>;
  getPlatformStats(): Promise<PlatformStats | undefined>;
  updatePlatformStats(): Promise<PlatformStats>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserByGoogleId(googleId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.googleId, googleId));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    if (userData.googleId) {
      // Try to find existing user by Google ID first
      const existingUser = await this.getUserByGoogleId(userData.googleId);
      if (existingUser) {
        const [updatedUser] = await db
          .update(users)
          .set({
            ...userData,
            updatedAt: new Date(),
          })
          .where(eq(users.googleId, userData.googleId))
          .returning();
        return updatedUser;
      }
    }

    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: userData.email ? users.email : users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    // Create initial user stats
    await this.getUserStats(user.id).then(async (stats) => {
      if (!stats) {
        await db.insert(userStats).values({ userId: user.id });
      }
    });
    
    return user;
  }

  // Food listing operations
  async getFoodListings(limit = 20): Promise<FoodListing[]> {
    return await db
      .select()
      .from(foodListings)
      .where(and(eq(foodListings.isActive, true), gte(foodListings.availableUntil, new Date())))
      .orderBy(desc(foodListings.createdAt))
      .limit(limit);
  }

  async getFoodListingById(id: string): Promise<FoodListing | undefined> {
    const [listing] = await db.select().from(foodListings).where(eq(foodListings.id, id));
    return listing;
  }

  async createFoodListing(listing: InsertFoodListing): Promise<FoodListing> {
    const [newListing] = await db.insert(foodListings).values(listing).returning();
    
    // Update user stats
    await this.updateUserStats(listing.providerId, { totalListings: 1 });
    
    return newListing;
  }

  async updateFoodListing(id: string, listing: Partial<InsertFoodListing>): Promise<FoodListing> {
    const [updated] = await db
      .update(foodListings)
      .set({ ...listing, updatedAt: new Date() })
      .where(eq(foodListings.id, id))
      .returning();
    return updated;
  }

  async deleteFoodListing(id: string): Promise<void> {
    await db.update(foodListings).set({ isActive: false }).where(eq(foodListings.id, id));
  }

  async getFoodListingsByProvider(providerId: string): Promise<FoodListing[]> {
    return await db
      .select()
      .from(foodListings)
      .where(eq(foodListings.providerId, providerId))
      .orderBy(desc(foodListings.createdAt));
  }

  // Pickup operations
  async createPickup(pickup: InsertPickup): Promise<Pickup> {
    const [newPickup] = await db.insert(pickups).values(pickup).returning();
    
    // Update user stats
    await this.updateUserStats(pickup.recipientId, { totalPickups: 1 });
    
    return newPickup;
  }

  async getPickupsByUser(userId: string): Promise<Pickup[]> {
    return await db
      .select()
      .from(pickups)
      .where(eq(pickups.recipientId, userId))
      .orderBy(desc(pickups.createdAt));
  }

  async updatePickupStatus(id: string, status: "available" | "reserved" | "completed" | "expired"): Promise<Pickup> {
    const [updated] = await db
      .update(pickups)
      .set({ status, updatedAt: new Date() })
      .where(eq(pickups.id, id))
      .returning();
    return updated;
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  // Statistics operations
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    return stats;
  }

  async updateUserStats(userId: string, statsUpdate: Partial<InsertUserStats>): Promise<UserStats> {
    const currentStats = await this.getUserStats(userId);
    
    if (!currentStats) {
      const [newStats] = await db.insert(userStats).values({ userId, ...statsUpdate }).returning();
      return newStats;
    }
    
    const updates: any = { lastUpdated: new Date() };
    if (statsUpdate.totalFoodSaved) {
      updates.totalFoodSaved = String(Number(currentStats.totalFoodSaved) + Number(statsUpdate.totalFoodSaved));
    }
    if (statsUpdate.totalCarbonSaved) {
      updates.totalCarbonSaved = String(Number(currentStats.totalCarbonSaved) + Number(statsUpdate.totalCarbonSaved));
    }
    if (statsUpdate.totalPeopleServed) {
      updates.totalPeopleServed = currentStats.totalPeopleServed + statsUpdate.totalPeopleServed;
    }
    if (statsUpdate.totalListings) {
      updates.totalListings = currentStats.totalListings + statsUpdate.totalListings;
    }
    if (statsUpdate.totalPickups) {
      updates.totalPickups = currentStats.totalPickups + statsUpdate.totalPickups;
    }
    
    const [updated] = await db
      .update(userStats)
      .set(updates)
      .where(eq(userStats.userId, userId))
      .returning();
    
    return updated;
  }

  async getPlatformStats(): Promise<PlatformStats | undefined> {
    const [stats] = await db.select().from(platformStats).limit(1);
    return stats;
  }

  async updatePlatformStats(): Promise<PlatformStats> {
    // Calculate current platform statistics
    const [foodStats] = await db
      .select({
        totalFoodSaved: sum(userStats.totalFoodSaved),
        totalCarbonSaved: sum(userStats.totalCarbonSaved),
        totalPeopleServed: sum(userStats.totalPeopleServed),
      })
      .from(userStats);
    
    const [activeListingsCount] = await db
      .select({ count: count() })
      .from(foodListings)
      .where(and(eq(foodListings.isActive, true), gte(foodListings.availableUntil, new Date())));
    
    const statsData = {
      totalFoodSaved: foodStats.totalFoodSaved || "0",
      totalCarbonSaved: foodStats.totalCarbonSaved || "0",
      totalPeopleServed: foodStats.totalPeopleServed || 0,
      activeListings: activeListingsCount.count || 0,
      lastUpdated: new Date(),
    };
    
    // Upsert platform stats
    const existingStats = await this.getPlatformStats();
    if (existingStats) {
      const [updated] = await db
        .update(platformStats)
        .set(statsData)
        .where(eq(platformStats.id, existingStats.id))
        .returning();
      return updated;
    } else {
      const [newStats] = await db.insert(platformStats).values(statsData).returning();
      return newStats;
    }
  }
}

export const storage = new DatabaseStorage();
