# TripGenie — AI-Powered Smart Travel Planner

TripGenie is a modern, full-stack AI-driven travel planning SaaS web application designed to turn travel aspirations into curated, realistic, day-by-day itineraries with smart budget allocation and an integrated AI travel assistant.

---

## Overview

Planning a multi-day trip usually involves jumping between dozens of tabs, estimating budgets manually, and struggling to pace activities. **TripGenie** solves this by leveraging Gemini AI to instantly generate personalized itineraries based on your travel style, party size, budget, and specific interests.

---

## Key Features

- 🔐 **Authentication & Security**: Secure user registration, login, and JWT-authenticated protected routes with password hashing via `bcryptjs`.
- ✨ **AI-Powered Itinerary Generator**: Structured JSON itineraries generated via Google Gemini API with day themes, timed activities, category tags, and approximate expense estimates.
- 💰 **Smart Budget Breakdown**: Dynamic financial allocation across Accommodation, Food & Dining, Transportation, Activities, and Miscellaneous.
- 💬 **Context-Aware AI Travel Assistant**: Interactive chat concierge answering queries regarding packing lists, local customs, and schedule adjustments tailored to your current trip.
- ✏️ **Trip Management & Customization**: Add, edit, or delete individual activities in any day's plan, update travel styles, or regenerate the entire itinerary.
- 🌍 **Destination Explorer**: Browse popular travel spots with category filters, insider travel tips, approximate budgets, and one-click trip planning.
- 📊 **Traveler Dashboard**: Overview of total trips, upcoming vacations, completed journeys, and cumulative planned travel expenditure.
- 📱 **Responsive SaaS UI**: Built with React, Tailwind CSS, Lucide icons, glassmorphic headers, and smooth micro-animations.

---

## Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM (v6)
- **HTTP Client**: Axios with JWT interceptors
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Server Framework**: Express.js
- **Database ORM**: Mongoose
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Logging**: Morgan

### Database
- **MongoDB Atlas** or Local MongoDB

### Artificial Intelligence
- **Google Generative AI (Gemini API)**
- Smart development fallback when running in offline/testing environments

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Client (Vite)                      │
│   Landing | Auth | Dashboard | Plan Trip | Explore | Details│
└──────────────────────────────┬──────────────────────────────┘
                               │ REST / JSON (Axios)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Express.js Server (Node)                  │
│       JWT Auth Middleware | Controllers | Error Handler     │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
      ┌─────────────────┐           ┌──────────────────┐
      │  MongoDB Atlas  │           │ Google Gemini AI │
      │ Users, Trips,   │           │ Structured JSON  │
      │ Destinations    │           │ & Chat Concierge │
      └─────────────────┘           └──────────────────┘
```

---

## Project Structure

```
tripgenie/
│
├── client/
│   ├── src/
│   │   ├── components/       # Button, Input, Modal, TripCard, BudgetBreakdown, etc.
│   │   ├── pages/            # LandingPage, Dashboard, PlanTrip, TripDetails, Explore, etc.
│   │   ├── context/          # AuthContext, ToastContext
│   │   ├── services/         # api.js, authService, tripService, destinationService, aiService
│   │   ├── index.css         # Tailwind directives & design tokens
│   │   ├── App.jsx           # App routes
│   │   └── main.jsx          # React DOM entrypoint
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── .env
│
├── server/
│   ├── config/
│   │   └── db.js             # Mongoose connection
│   ├── controllers/          # auth, trip, destination, ai controllers
│   ├── middleware/           # authMiddleware, errorMiddleware
│   ├── models/               # User, Trip, Destination schemas
│   ├── routes/               # Express REST route endpoints
│   ├── services/             # Gemini AI integration service
│   ├── utils/                # seedDestinations.js script
│   ├── server.js             # Express app entrypoint
│   ├── package.json
│   └── .env
│
├── .gitignore
├── README.md
└── package.json              # Root concurrently scripts
```

---

## Environment Variables

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/tripgenie
JWT_SECRET=your_jwt_secret_key
GEMINI_API_KEY=your_gemini_api_key
NODE_ENV=development
```

### Client (`client/.env`)
```env
VITE_API_URL=/api
```

---

## Installation & Setup

### 1. Clone & Install All Dependencies
From the project root:
```bash
npm run install:all
```
*(Or run `npm install` inside root, `server/`, and `client/` respectively).*

### 2. Configure Environment Variables
Create `.env` in `server/` with your MongoDB URI and Gemini API Key (a template is provided in `server/.env.example`).

### 3. Seed Destination Data
To populate popular destination highlights:
```bash
npm run seed
```
*(Note: The server also auto-seeds destinations on initial startup if the collection is empty).*

---

## Running the Application

### Option A: Run Both Frontend & Backend Concurrently (Recommended)
```bash
npm run dev
```

### Option B: Run Services Separately
**Backend Server:**
```bash
cd server
npm run dev
# Running on http://localhost:5000
```

**Frontend Client:**
```bash
cd client
npm run dev
# Running on http://localhost:3000
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve current authenticated profile

### Trips
- `GET /api/trips` — Fetch user's saved trips and summary metrics
- `POST /api/trips` — Save a newly generated or custom trip
- `GET /api/trips/:id` — Retrieve single trip details
- `PUT /api/trips/:id` — Update trip details or regenerate schedule
- `DELETE /api/trips/:id` — Delete a trip
- `POST /api/trips/:id/days/:dayNumber/activities` — Add activity to a day
- `PUT /api/trips/:id/days/:dayNumber/activities/:activityId` — Edit activity
- `DELETE /api/trips/:id/days/:dayNumber/activities/:activityId` — Remove activity

### AI Services
- `POST /api/ai/generate-itinerary` — Generate structured JSON travel itinerary
- `POST /api/ai/travel-assistant` — Query AI Travel Assistant with trip context

### Destinations
- `GET /api/destinations` — Get all popular destinations (supports `search` and `category` query params)
- `GET /api/destinations/:id` — Get single destination details

---

## Screenshots Placeholder

| Landing Page | Trip Planner |
|:---:|:---:|
| ![Landing Page Preview](https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=600&q=80) | ![Trip Planner Preview](https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80) |

| Itinerary & Assistant | Budget Breakdown |
|:---:|:---:|
| ![Itinerary Preview](https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80) | ![Budget Preview](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80) |

---

## Future Enhancements
- 🗺️ Interactive map route visualization with Mapbox / Leaflet.
- 🌦️ Real-time live weather forecasts for travel dates.
- 📄 Export itinerary to PDF or Apple Wallet / Google Calendar.
- 👥 Multi-user collaborative trip planning with invite links.

---

## Author
Built with ❤️ for travelers by the **TripGenie Team**.
