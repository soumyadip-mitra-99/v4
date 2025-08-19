# Local Development Setup for EcoShare

## Prerequisites

1. **Node.js 18+** - Download from [nodejs.org](https://nodejs.org/)
2. **PostgreSQL** - Download from [postgresql.org](https://www.postgresql.org/download/)
3. **VS Code** - Download from [code.visualstudio.com](https://code.visualstudio.com/)

## Step-by-Step Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to your project folder in VS Code terminal
cd path/to/your/project

# Install all dependencies
npm install
```

### 2. Environment Variables Setup

Create a `.env` file in the root directory with these variables:

```env
# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecoshare_dev
PGHOST=localhost
PGPORT=5432
PGUSER=postgres
PGPASSWORD=your_postgres_password
PGDATABASE=ecoshare_dev

# Google OAuth Configuration (Required)
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# Google AI Configuration (Optional - for food analysis)
GOOGLE_AI_API_KEY=your_gemini_api_key_here

# Session Configuration
SESSION_SECRET=your_secure_random_string_here

# Server Configuration
PORT=5000
NODE_ENV=development
```

### 3. Database Setup

```bash
# Create the database (run in PostgreSQL command line or pgAdmin)
createdb ecoshare_dev

# OR using psql:
psql -U postgres
CREATE DATABASE ecoshare_dev;
\q

# Push the schema to your database
npm run db:push
```

### 4. Google Cloud Setup

**For Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API or People API
4. Create OAuth 2.0 credentials
5. Add `http://localhost:5000` to authorized origins
6. Add `http://localhost:5000/api/auth/google/callback` to authorized redirect URIs
7. Copy Client ID and Client Secret to your `.env` file

**For Gemini AI (Optional):**
1. Enable the Generative AI API in your Google Cloud project
2. Create an API key for Gemini
3. Add it to your `.env` file as `GOOGLE_AI_API_KEY`

### 5. Running the Application

```bash
# Development mode (with hot reload)
npm run dev

# The app will be available at http://localhost:5000
```

### 6. VS Code Extensions (Recommended)

Install these VS Code extensions for better development experience:
- TypeScript and JavaScript Language Features (built-in)
- Tailwind CSS IntelliSense
- ES7+ React/Redux/React-Native snippets
- PostgreSQL (for database management)
- Thunder Client (for API testing)

## Common Issues and Solutions

### Issue: `cross-env not found`
```bash
npm install cross-env --save-dev
```

### Issue: Database connection errors
- Make sure PostgreSQL is running
- Check your DATABASE_URL format
- Verify database exists: `psql -U postgres -l`

### Issue: Google OAuth not working
- Check your OAuth credentials
- Verify redirect URIs match exactly
- Make sure APIs are enabled in Google Cloud Console

### Issue: Port 5000 already in use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or change port in .env file
PORT=3000
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Type checking
npm run check

# Database operations
npm run db:push    # Push schema changes
npm run db:studio  # Open database GUI
```

## Project Structure

```
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and schemas
├── .env            # Environment variables (create this)
├── .env.example    # Environment template
└── package.json    # Dependencies and scripts
```

## Troubleshooting

If you encounter any issues:
1. Make sure all dependencies are installed: `npm install`
2. Check that PostgreSQL is running and accessible
3. Verify your `.env` file has all required variables
4. Check the VS Code terminal for error messages
5. Try restarting the development server: `Ctrl+C` then `npm run dev`