import { config } from 'dotenv';

// Load .env file only in local development
if (process.env.NODE_ENV !== 'production' && !process.env.REPLIT_DOMAINS) {
  config();
}

export const env = {
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || '',
  PGHOST: process.env.PGHOST || 'localhost',
  PGPORT: process.env.PGPORT || '5432',
  PGUSER: process.env.PGUSER || 'postgres',
  PGPASSWORD: process.env.PGPASSWORD || '',
  PGDATABASE: process.env.PGDATABASE || 'ecoshare_dev',

  // Google OAuth Configuration
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
  
  // Google AI Configuration (Optional)
  GOOGLE_AI_API_KEY: process.env.GOOGLE_AI_API_KEY || '',

  // Session Configuration
  SESSION_SECRET: process.env.SESSION_SECRET || 'default-development-secret',

  // Server Configuration
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Helper functions
  isProduction: () => process.env.NODE_ENV === 'production',
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isReplit: () => !!process.env.REPLIT_DOMAINS,
} as const;

// Validation for required environment variables
const requiredVars = ['DATABASE_URL', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'];

for (const varName of requiredVars) {
  if (!env[varName as keyof typeof env]) {
    throw new Error(`Required environment variable ${varName} is not set`);
  }
}