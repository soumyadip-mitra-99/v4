import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";
import { analyzeFoodImage } from "./services/gemini";
import { insertFoodListingSchema, insertPickupSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import { env } from "./env";
import ConnectPgSimple from "connect-pg-simple";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Session configuration with PostgreSQL store
  const PgSession = ConnectPgSimple(session);
  
  app.use(session({
    store: new PgSession({
      conString: env.DATABASE_URL,
      tableName: 'sessions',
      createTableIfMissing: true,
    }),
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: env.isProduction(), 
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  const callbackURL = env.isReplit() 
    ? `https://${process.env.REPLIT_DOMAINS || process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`
    : "http://localhost:5000/api/auth/google/callback";
    
  console.log("Google OAuth callback URL:", callbackURL);
    
  passport.use(new GoogleStrategy({
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
  }, async (accessToken: string, refreshToken: string, profile: any, done: any) => {
    try {
      const user = await storage.upsertUser({
        email: profile.emails?.[0]?.value || "",
        googleId: profile.id,
        name: profile.displayName || "",
        profilePicture: profile.photos?.[0]?.value || "",
      });
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Auth routes
  app.get("/api/auth/google", (req, res, next) => {
    console.log("Starting Google OAuth flow...");
    next();
  }, passport.authenticate("google", { scope: ["profile", "email"] }));

  app.get("/api/auth/google/callback", 
    (req, res, next) => {
      console.log("OAuth callback received with code:", req.query.code ? "present" : "missing");
      console.log("OAuth callback received with error:", req.query.error || "none");
      next();
    },
    passport.authenticate("google", { 
      failureRedirect: "/?error=auth_failed",
      failureMessage: true 
    }),
    (req, res) => {
      console.log("OAuth callback successful, user:", (req.user as any)?.email);
      res.redirect("/?success=authenticated");
    }
  );

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) return res.status(500).json({ error: "Failed to logout" });
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", (req, res) => {
    res.json(req.user || null);
  });

  // Demo authentication route for testing
  app.post("/api/auth/demo", async (req, res) => {
    try {
      const demoUser = await storage.upsertUser({
        email: "demo@ecoshare.app",
        name: "Demo User",
        profilePicture: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      });
      
      req.login(demoUser, (err) => {
        if (err) {
          return res.status(500).json({ error: "Failed to login demo user" });
        }
        res.json(demoUser);
      });
    } catch (error) {
      console.error("Demo auth error:", error);
      res.status(500).json({ error: "Failed to create demo user" });
    }
  });

  // Middleware to check authentication
  function requireAuth(req: any, res: any, next: any) {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }
    next();
  }

  // Food listing routes
  app.get("/api/food-listings", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const listings = await storage.getFoodListings(limit);
      res.json(listings);
    } catch (error) {
      console.error("Failed to get food listings:", error);
      res.status(500).json({ error: "Failed to fetch food listings" });
    }
  });

  app.get("/api/food-listings/:id", async (req, res) => {
    try {
      const listing = await storage.getFoodListingById(req.params.id);
      if (!listing) {
        return res.status(404).json({ error: "Food listing not found" });
      }
      res.json(listing);
    } catch (error) {
      console.error("Failed to get food listing:", error);
      res.status(500).json({ error: "Failed to fetch food listing" });
    }
  });

  app.post("/api/food-listings", requireAuth, upload.single("image"), async (req: any, res) => {
    try {
      let listingData = JSON.parse(req.body.data || "{}");
      
      // AI image analysis if image provided
      if (req.file) {
        try {
          const imageBase64 = req.file.buffer.toString('base64');
          const analysis = await analyzeFoodImage(imageBase64, req.file.mimetype);
          
          // Use AI analysis to enhance listing data
          listingData = {
            ...listingData,
            title: listingData.title || analysis.title,
            description: listingData.description || analysis.description,
            category: listingData.category || analysis.category,
            freshnessLevel: listingData.freshnessLevel || analysis.freshnessLevel,
            portions: listingData.portions || analysis.portions,
          };
        } catch (error) {
          console.error("AI analysis failed:", error);
          // Continue without AI analysis
        }
      }

      const validatedData = insertFoodListingSchema.parse({
        ...listingData,
        providerId: req.user.id,
      });

      const listing = await storage.createFoodListing(validatedData);
      res.json(listing);
    } catch (error) {
      console.error("Failed to create food listing:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid listing data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create food listing" });
    }
  });

  app.get("/api/my-listings", requireAuth, async (req: any, res) => {
    try {
      const listings = await storage.getFoodListingsByProvider(req.user.id);
      res.json(listings);
    } catch (error) {
      console.error("Failed to get user listings:", error);
      res.status(500).json({ error: "Failed to fetch user listings" });
    }
  });

  // Pickup routes
  app.post("/api/pickups", requireAuth, async (req: any, res) => {
    try {
      const validatedData = insertPickupSchema.parse({
        ...req.body,
        recipientId: req.user.id,
      });

      const pickup = await storage.createPickup(validatedData);
      
      // Create notification for food provider
      const listing = await storage.getFoodListingById(pickup.listingId);
      if (listing) {
        await storage.createNotification({
          userId: listing.providerId,
          title: "Food Reserved",
          message: `${req.user.name} reserved your ${listing.title}`,
          type: "pickup_reserved",
        });
      }

      res.json(pickup);
    } catch (error) {
      console.error("Failed to create pickup:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid pickup data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create pickup" });
    }
  });

  app.get("/api/my-pickups", requireAuth, async (req: any, res) => {
    try {
      const pickups = await storage.getPickupsByUser(req.user.id);
      res.json(pickups);
    } catch (error) {
      console.error("Failed to get user pickups:", error);
      res.status(500).json({ error: "Failed to fetch user pickups" });
    }
  });

  // Statistics routes
  app.get("/api/stats/platform", async (req, res) => {
    try {
      const stats = await storage.updatePlatformStats();
      res.json(stats);
    } catch (error) {
      console.error("Failed to get platform stats:", error);
      res.status(500).json({ error: "Failed to fetch platform statistics" });
    }
  });

  app.get("/api/stats/user", requireAuth, async (req: any, res) => {
    try {
      const stats = await storage.getUserStats(req.user.id);
      res.json(stats);
    } catch (error) {
      console.error("Failed to get user stats:", error);
      res.status(500).json({ error: "Failed to fetch user statistics" });
    }
  });

  // Notifications routes
  app.get("/api/notifications", requireAuth, async (req: any, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.user.id);
      res.json(notifications);
    } catch (error) {
      console.error("Failed to get notifications:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      res.status(500).json({ error: "Failed to update notification" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
