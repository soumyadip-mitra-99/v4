# EcoShare - AI-Powered Campus Food Sharing Platform

## Overview

EcoShare is an intelligent surplus food management platform that connects campus communities to reduce waste and feed everyone. The application uses Google Gemini AI to automatically analyze food images, categorize items, assess freshness levels, and calculate environmental impact. Users can share surplus food through an intuitive interface and discover available items nearby, creating a sustainable campus ecosystem that reduces food waste while building community connections.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

**Environment Configuration Updates (August 19, 2025):**
- Added comprehensive environment variable management with `server/env.ts`
- Integrated dotenv for local development support
- Created `.env.example` template for local setup
- Added `.gitignore` to protect sensitive environment files
- Updated all services to use centralized environment configuration
- Added support for optional Google AI API key for Gemini integration
- Improved local development workflow with port 5000 configuration

## System Architecture

### Full-Stack Monorepo Architecture
The application follows a monorepo structure with clear separation between client, server, and shared code. The frontend is built with React and Vite for fast development, while the backend uses Express.js with TypeScript. Shared schemas and types ensure type safety across the entire stack.

### Frontend Architecture
- **React 18 with TypeScript**: Modern React features with comprehensive type safety
- **Vite Build System**: Fast development server and optimized production builds
- **Wouter Routing**: Lightweight client-side routing without React Router overhead
- **TanStack Query**: Server state management with caching, synchronization, and background updates
- **shadcn/ui Components**: Radix UI primitives with customizable design system
- **Tailwind CSS**: Utility-first styling with custom design tokens and dark mode support
- **React Hook Form + Zod**: Type-safe form handling with schema validation

### Backend Architecture  
- **Express.js with TypeScript**: RESTful API with type-safe request/response handling
- **Google OAuth 2.0**: Secure authentication using Passport.js with session persistence
- **PostgreSQL Sessions**: Database-backed session storage using connect-pg-simple
- **Drizzle ORM**: Type-safe database operations with schema management and migrations
- **Google Gemini AI Integration**: Intelligent food analysis with robust error handling and fallbacks
- **Multer File Uploads**: Image processing with file size limits and validation

### Database Schema Design
The PostgreSQL database supports comprehensive food sharing workflows:

**Core Entities:**
- **Users**: Profile management with Google OAuth integration and demo user support
- **Food Listings**: Complete food item lifecycle with AI-generated metadata including category, freshness assessment, portions, location, and availability windows
- **Pickups**: Reservation system connecting users with food listings, including scheduling and status tracking
- **Notifications**: User engagement system for platform activities and updates

**Analytics & Tracking:**
- **User Stats**: Personal impact tracking including food saved, carbon footprint reduction, and community engagement metrics
- **Platform Stats**: Aggregate community impact data for dashboard visualization
- **Sessions**: PostgreSQL-backed session storage required for Google OAuth authentication

### AI-Powered Food Analysis
Google Gemini AI provides intelligent food categorization and assessment:
- **Image Analysis**: Automatic food identification from uploaded photos
- **Smart Categorization**: Classification into meals, snacks, beverages, desserts, produce, and baked goods  
- **Freshness Assessment**: Real-time evaluation with safety recommendations (fresh, good, consume soon)
- **Portion Estimation**: Serving size calculation based on visual analysis
- **Safety Scoring**: Food safety assessment with consumption recommendations
- **Fallback System**: Graceful degradation when AI services are unavailable, using default values to maintain functionality

### Authentication & Security
- **Google OAuth 2.0**: Secure user authentication with profile and email access
- **Session Management**: PostgreSQL-backed sessions with configurable expiration and security settings
- **CORS & Security Headers**: Production-ready security configuration
- **Environment-Based Configuration**: Separate development and production OAuth callback handling

## External Dependencies

### Core Infrastructure
- **Neon PostgreSQL**: Cloud-hosted PostgreSQL database with serverless scaling
- **Google Cloud Platform**: OAuth 2.0 authentication services and Gemini AI API access

### AI & Machine Learning
- **Google Gemini AI**: Advanced food image analysis, categorization, and freshness assessment
- **@google/generative-ai**: Official Google AI SDK for Gemini integration

### Authentication & Sessions  
- **Passport.js**: Authentication middleware with Google OAuth strategy
- **connect-pg-simple**: PostgreSQL session store for persistent authentication
- **express-session**: Session management middleware

### Database & ORM
- **@neondatabase/serverless**: Neon database connection with WebSocket support
- **drizzle-orm**: Type-safe ORM with schema management and query builder
- **drizzle-kit**: Database migration and schema management tools

### Frontend Libraries
- **@tanstack/react-query**: Server state management with caching and synchronization
- **@radix-ui/***: Headless UI primitives for accessibility and customization
- **wouter**: Lightweight routing library for React applications
- **react-hook-form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Form validation resolvers for Zod schema integration
- **zod**: TypeScript-first schema validation library

### Development & Build Tools
- **Vite**: Fast build tool with TypeScript support and optimized bundling
- **esbuild**: Fast JavaScript bundler for server-side code
- **tsx**: TypeScript execution environment for Node.js
- **Tailwind CSS**: Utility-first CSS framework with design system support
- **PostCSS**: CSS processing with autoprefixer and Tailwind integration

### File Processing
- **multer**: Multipart form data handling for image uploads
- **File size limits**: 5MB maximum for food image uploads with validation