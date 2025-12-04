# About

This application tries to mimic a "store app" frontend - an app that manages a store inventory.

It has two main sections - the admin portal for managing the store, and the support portal to answer tickets.

It was vibe-coded via bolt.

# How to Run

This app is a standard angular app (e.g. install packages with `npm install`, serve with `ng serve`).

The app needs a backend - currently using bolt for this (also for the database).
To connect to the backend, change the `src/environments/environments.ts` file. This has the backend URL, which is currently
`https://juaogodstdjfllmdepop.supabase.co`

(Note - the backend has currently no authentication whatsoever, and anyone can access it).

# Backend APIs

All the backend APIs go to `https://juaogodstdjfllmdepop.supabase.co`.

## Admin API (/functions/v1/admin-api)

These routes use SSO-like authorization - and have authorization header that starts with something like `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHN0b3JlLmNvbSIsIm5hbWUiOiJBZG1pbiBVc2VyIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzY0ODYxMDUxOTU2LCJleHAiOjE3NjQ5NDc0NTE5NTZ9.YW5nam14dXdrYnY=`. The token is being generated in the `generateStubToken` method in the `src\app\services\auth.service.ts` file, and is stored in local storage and being re-used every login.

**Endpoints:**
- GET / - List all items
- GET /:id - Get single item
- POST / - Create item
- PUT /:id - Update item
- DELETE /:id - Delete item

## Support API (/functions/v1/support-api)

These routes use Kerberos-like authentication - and have authorization headers that starts with `Negotiate - YII...`. The token is being generated in the `generateKerberosData` method in the `src\app\services\auth.service.ts` file, and is also stored in local storage and being re-used in every login.

**Endpoints:**
- GET /tickets?status=open - List tickets
- GET /tickets/:id - Get ticket with messages
- PUT /tickets/:id/status - Update ticket status
- POST /tickets/:id/messages - Add message to ticket

## News API (/functions/v1/news-api)

This is a public API that requires no authentication. It provides access to weather, time, reviews, system status, announcements, and platform statistics. All endpoints return stub/demo data.

**Endpoints:**
- GET /weather - Get current weather and 3-day forecast
- GET /time - Get current time in various formats
- GET /reviews - Get platform reviews and ratings
- GET /status - Get system status and service health
- GET /announcements - Get latest platform announcements
- GET /stats - Get platform usage statistics
- GET / - Get complete API documentation

See [Appendix: News API Full Documentation](#appendix-news-api-full-documentation) for detailed request/response examples.

# Project Structure

```
src/
├── app/
│   ├── admin/           # Admin dashboard and login
│   ├── support/         # Support dashboard and login
│   ├── news/            # Public news and information page
│   ├── guards/          # Route guards for auth
│   ├── models/          # TypeScript interfaces
│   └── services/        # HTTP services and auth
├── environments/        # Environment configuration
└── global_styles.css    # Global styles

supabase/
├── functions/           # Edge functions
│   ├── admin-api/       # Admin API backend
│   ├── support-api/     # Support API backend
│   └── news-api/        # Public news API
└── migrations/          # Database migrations
```

# Features

- **Admin Portal**: Manage store inventory with full CRUD operations
- **Support Portal**: Handle customer support tickets and messaging
- **News Hub**: Public page with weather, time, reviews, status, announcements, and statistics
- **Authentication**: Different auth methods for admin (SSO-like) and support (Kerberos-like)
- **Database**: Supabase backend with Row Level Security policies

# Tech Stack

- **Frontend**: Angular 20
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: Supabase PostgreSQL
- **Styling**: CSS with component-scoped styles

---

# Appendix: News API Full Documentation

## Base URL
```
https://juaogodstdjfllmdepop.supabase.co/functions/v1/news-api
```

## Authentication
None required. All endpoints are publicly accessible.

## Endpoints

### GET /weather
Returns current weather information and 3-day forecast.

**Response:**
```json
{
  "location": "San Francisco, CA",
  "temperature": 68,
  "unit": "fahrenheit",
  "condition": "Partly Cloudy",
  "humidity": 65,
  "windSpeed": 12,
  "windUnit": "mph",
  "forecast": [
    { "day": "Monday", "high": 72, "low": 58, "condition": "Sunny" },
    { "day": "Tuesday", "high": 70, "low": 56, "condition": "Cloudy" },
    { "day": "Wednesday", "high": 68, "low": 55, "condition": "Rainy" }
  ],
  "lastUpdated": "2024-12-04T10:30:00.000Z"
}
```

### GET /time
Returns current time in various formats and timezones.

**Response:**
```json
{
  "utc": "2024-12-04T10:30:00.000Z",
  "timestamp": 1733310600000,
  "timezone": "America/Los_Angeles",
  "localTime": "12/4/2024, 2:30:00 AM",
  "formatted": {
    "date": "12/4/2024",
    "time": "2:30:00 AM",
    "iso": "2024-12-04T10:30:00.000Z"
  }
}
```

### GET /reviews
Returns platform reviews and ratings.

**Response:**
```json
{
  "averageRating": 4.7,
  "totalReviews": 1247,
  "reviews": [
    {
      "id": 1,
      "author": "John Smith",
      "rating": 5,
      "comment": "Excellent service! Fast upload speeds and reliable storage.",
      "date": "2024-12-01",
      "verified": true
    }
  ],
  "ratingDistribution": {
    "5": 820,
    "4": 310,
    "3": 87,
    "2": 20,
    "1": 10
  }
}
```

### GET /status
Returns system status and service health.

**Response:**
```json
{
  "status": "operational",
  "uptime": "99.98%",
  "services": [
    { "name": "API", "status": "operational", "responseTime": "45ms" },
    { "name": "Database", "status": "operational", "responseTime": "12ms" },
    { "name": "Storage", "status": "operational", "responseTime": "89ms" },
    { "name": "Edge Functions", "status": "operational", "responseTime": "32ms" }
  ],
  "incidents": [],
  "lastChecked": "2024-12-04T10:30:00.000Z"
}
```

### GET /announcements
Returns latest platform announcements.

**Response:**
```json
{
  "announcements": [
    {
      "id": 1,
      "title": "New Feature: Batch Upload",
      "summary": "You can now upload multiple files at once with our new batch upload feature.",
      "date": "2024-12-01",
      "priority": "high",
      "category": "feature"
    },
    {
      "id": 2,
      "title": "Scheduled Maintenance",
      "summary": "System maintenance scheduled for December 10th at 2:00 AM UTC.",
      "date": "2024-11-29",
      "priority": "medium",
      "category": "maintenance"
    }
  ]
}
```

### GET /stats
Returns platform usage statistics.

**Response:**
```json
{
  "totalUsers": 15420,
  "totalUploads": 2847563,
  "totalStorageGB": 18947,
  "activeUsers24h": 3421,
  "uploadsToday": 12483,
  "averageUploadSize": "6.7 MB",
  "popularCategories": [
    { "name": "Documents", "count": 984532 },
    { "name": "Images", "count": 756421 },
    { "name": "Videos", "count": 423876 },
    { "name": "Other", "count": 682734 }
  ]
}
```

### GET /
Returns complete API documentation in JSON format.

## Usage Examples

```bash
# Get weather
curl https://juaogodstdjfllmdepop.supabase.co/functions/v1/news-api/weather

# Get time
curl https://juaogodstdjfllmdepop.supabase.co/functions/v1/news-api/time

# Get reviews
curl https://juaogodstdjfllmdepop.supabase.co/functions/v1/news-api/reviews

# Get status
curl https://juaogodstdjfllmdepop.supabase.co/functions/v1/news-api/status

# Get announcements
curl https://juaogodstdjfllmdepop.supabase.co/functions/v1/news-api/announcements

# Get stats
curl https://juaogodstdjfllmdepop.supabase.co/functions/v1/news-api/stats
```

## Notes
- All data returned is stub/demo data
- Timestamps are generated in real-time
- No authentication or API keys required
- All endpoints are read-only (GET only)
- No rate limiting implemented
