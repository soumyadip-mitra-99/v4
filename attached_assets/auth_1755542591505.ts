import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { storage } from "./storage";
import type { User } from "@shared/schema";

// Configure Google OAuth strategy
const getCallbackURL = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`
      : "http://localhost:5000/api/auth/google/callback";
  }
  return "/api/auth/google/callback";
};

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: getCallbackURL(),
    },
    async (accessToken: string, refreshToken: string, profile: any, done: any) => {
      try {
        // Check if user already exists
        let user = await storage.getUserByGoogleId(profile.id);
        
        if (user) {
          return done(null, user);
        }

        // Create new user
        const newUser = await storage.upsertUser({
          googleId: profile.id,
          email: profile.emails?.[0]?.value || "",
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          profileImageUrl: profile.photos?.[0]?.value || "",
        });

        return done(null, newUser);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await storage.getUser(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
