import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "./auth";
import { storage } from "./storage";
import { analyzeFoodItem } from "./gemini";
import { insertFoodListingSchema } from "@shared/schema";
import { z } from "zod";

const PgSession = connectPgSimple(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration
  app.use(session({
    store: new PgSession({
      conString: process.env.DATABASE_URL,
      tableName: 'sessions',
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }));

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Auth routes
  app.get("/api/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"],
  }));

  app.get("/api/auth/google/callback", 
    passport.authenticate("google", { failureRedirect: "/auth" }),
    (req, res) => {
      res.redirect("/");
    }
  );

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    if (req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: "Not authenticated" });
    }
  });

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.user) {
      next();
    } else {
      res.status(401).json({ message: "Authentication required" });
    }
  };

  // Food listings routes
  app.get("/api/listings", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const listings = await storage.getFoodListings(limit);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch listings" });
    }
  });

  app.get("/api/listings/:id", async (req, res) => {
    try {
      const listing = await storage.getFoodListingById(req.params.id);
      if (!listing) {
        return res.status(404).json({ message: "Listing not found" });
      }
      res.json(listing);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch listing" });
    }
  });

  app.post("/api/listings", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      console.log('Raw request body:', JSON.stringify(req.body, null, 2));
      
      // Transform the data to match schema expectations
      const transformedData = {
        ...req.body,
        providerId: user.id,
        providerName: `${user.firstName} ${user.lastName}`.trim() || user.email,
        // Ensure availableUntil is a proper Date object
        availableUntil: new Date(req.body.availableUntil),
      };
      
      console.log('Transformed data:', JSON.stringify(transformedData, null, 2));
      const validatedData = insertFoodListingSchema.parse(transformedData);

      // Analyze food item with AI (with fallback)
      let aiAnalysis;
      try {
        aiAnalysis = await analyzeFoodItem(
          validatedData.title,
          validatedData.description,
          validatedData.category
        );
      } catch (error) {
        console.log('AI analysis failed, using fallback values:', error);
        aiAnalysis = {
          category: validatedData.category,
          freshnessStatus: validatedData.freshnessStatus,
          servesCount: 1,
          carbonSavings: 0.5, // Default carbon savings
          healthScore: 7,
          allergens: [],
          nutritionalHighlights: ["Food available for sharing"],
          storageRecommendations: "Standard food safety guidelines apply"
        };
      }

      const listingData = {
        ...validatedData,
        freshnessStatus: aiAnalysis.freshnessStatus || validatedData.freshnessStatus,
        carbonSavings: aiAnalysis.carbonSavings?.toString() || "0",
        servesCount: aiAnalysis.servesCount || 1,
        aiAnalysis: aiAnalysis,
      };

      const listing = await storage.createFoodListing(listingData);
      res.json(listing);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log('Validation error details:', JSON.stringify(error.errors, null, 2));
        console.log('Request body:', JSON.stringify(req.body, null, 2));
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      console.error('Server error creating listing:', error);
      res.status(500).json({ message: "Failed to create listing" });
    }
  });

  app.get("/api/listings/provider/:providerId", requireAuth, async (req, res) => {
    try {
      const listings = await storage.getFoodListingsByProvider(req.params.providerId);
      res.json(listings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch provider listings" });
    }
  });

  // Pickup routes
  app.post("/api/pickups", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      const pickup = await storage.createPickup({
        ...req.body,
        recipientId: user.id,
      });
      res.json(pickup);
    } catch (error) {
      res.status(500).json({ message: "Failed to create pickup" });
    }
  });

  app.get("/api/pickups/user/:userId", requireAuth, async (req, res) => {
    try {
      const pickups = await storage.getPickupsByUser(req.params.userId);
      res.json(pickups);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pickups" });
    }
  });

  // Statistics routes
  app.get("/api/stats/user/:userId", requireAuth, async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.userId);
      res.json(stats || {
        totalFoodSaved: "0",
        totalCarbonSaved: "0",
        totalPeopleServed: 0,
        totalListings: 0,
        totalPickups: 0,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  app.get("/api/stats/platform", async (req, res) => {
    try {
      let stats = await storage.getPlatformStats();
      if (!stats) {
        stats = await storage.updatePlatformStats();
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch platform stats" });
    }
  });

  // Notifications routes
  app.get("/api/notifications/:userId", requireAuth, async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
