# EcoShare - AI-Powered Campus Food Sharing Platform

Transform campus food waste into community connections with intelligent food sharing powered by Google Gemini AI.

## Features

- 🤖 **AI-Powered Food Analysis**: Automatic categorization and freshness assessment using Google Gemini
- 🔐 **Google OAuth Authentication**: Secure sign-in with Google accounts
- 📱 **Responsive Design**: Modern UI with dark mode support
- 🎯 **Smart Matching**: Connect food providers with recipients efficiently
- 📊 **Impact Tracking**: Monitor food saved and environmental impact
- 🔔 **Real-time Notifications**: Stay updated on reservations and pickups

## Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google Cloud Platform account (for OAuth and Gemini AI)

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd ecoshare
npm install
```

> **For VS Code Users:** See [SETUP_LOCAL.md](SETUP_LOCAL.md) for detailed local development setup instructions.

2. **Set up environment variables:**

Create a `.env` file in the root directory:

```env
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/ecoshare_dev
PGHOST=localhost
PGPORT=5432
PGUSER=your_username
PGPASSWORD=your_password
PGDATABASE=ecoshare_dev

# Google OAuth Configuration (Required)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Google Gemini AI (Optional - for food analysis)
GOOGLE_AI_API_KEY=your_gemini_api_key

# Session Configuration
SESSION_SECRET=your_secure_session_secret

# Server Configuration
PORT=5000
NODE_ENV=development
```

3. **Set up your PostgreSQL database:**
```bash
# Create database
createdb ecoshare_dev

# Push schema to database
npm run db:push
```

4. **Configure Google Cloud Services:**

   **For Google OAuth:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API or People API
   - Create OAuth 2.0 credentials
   - Add `http://localhost:5000` to authorized origins
   - Add `http://localhost:5000/api/auth/google/callback` to authorized redirect URIs

   **For Gemini AI (Optional):**
   - Enable the Generative AI API
   - Create an API key for Gemini

5. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

## Environment Configuration

The app automatically detects the environment:

- **Local Development**: Uses `.env` file via dotenv
- **Replit**: Uses Replit's secure environment system
- **Production**: Uses system environment variables

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and API client
├── server/                # Express.js backend
│   ├── services/          # External service integrations
│   ├── db.ts             # Database configuration
│   ├── env.ts            # Environment variable management
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data access layer
├── shared/               # Shared types and schemas
│   └── schema.ts        # Database schema and types
└── README.md
```

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - OAuth callback
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user

### Food Listings
- `GET /api/food-listings` - Get all food listings
- `GET /api/food-listings/:id` - Get specific listing
- `POST /api/food-listings` - Create new listing (with AI analysis)
- `GET /api/my-listings` - Get user's listings

### Pickups
- `POST /api/pickups` - Reserve food for pickup
- `GET /api/my-pickups` - Get user's pickups

### Statistics
- `GET /api/stats/platform` - Platform-wide statistics
- `GET /api/stats/user` - User's personal statistics

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications/:id/read` - Mark notification as read

## Technologies

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** for component library
- **TanStack Query** for server state management
- **Wouter** for routing

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** for data persistence
- **Passport.js** for authentication
- **Google Gemini AI** for food analysis

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions, please open an issue in the GitHub repository.