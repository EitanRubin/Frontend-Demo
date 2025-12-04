# News API Documentation

A public API for accessing news, weather, time, reviews, and platform information. No authentication required.

## Base URL

```
https://[your-supabase-url]/functions/v1/news-api
```

## Authentication

None required. All endpoints are publicly accessible.

## Endpoints

### 1. Get Weather Information

Returns current weather and forecast data.

**Endpoint:** `GET /weather`

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

**Example:**
```bash
curl https://[your-supabase-url]/functions/v1/news-api/weather
```

---

### 2. Get Current Time

Returns current time in various formats and timezones.

**Endpoint:** `GET /time`

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

**Example:**
```bash
curl https://[your-supabase-url]/functions/v1/news-api/time
```

---

### 3. Get Platform Reviews

Returns user reviews and ratings for the platform.

**Endpoint:** `GET /reviews`

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

**Example:**
```bash
curl https://[your-supabase-url]/functions/v1/news-api/reviews
```

---

### 4. Get System Status

Returns current system status and service health.

**Endpoint:** `GET /status`

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

**Example:**
```bash
curl https://[your-supabase-url]/functions/v1/news-api/status
```

---

### 5. Get Announcements

Returns latest platform announcements and updates.

**Endpoint:** `GET /announcements`

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

**Example:**
```bash
curl https://[your-supabase-url]/functions/v1/news-api/announcements
```

---

### 6. Get Platform Statistics

Returns overall platform usage statistics.

**Endpoint:** `GET /stats`

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

**Example:**
```bash
curl https://[your-supabase-url]/functions/v1/news-api/stats
```

---

### 7. Get API Documentation

Returns interactive API documentation in JSON format.

**Endpoint:** `GET /`

**Response:**
Returns complete API documentation including all endpoints, methods, and examples.

**Example:**
```bash
curl https://[your-supabase-url]/functions/v1/news-api
```

---

## Usage in Frontend

### JavaScript/TypeScript Example

```typescript
const NEWS_API_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/news-api`;

// Get weather
const weather = await fetch(`${NEWS_API_URL}/weather`).then(r => r.json());

// Get time
const time = await fetch(`${NEWS_API_URL}/time`).then(r => r.json());

// Get reviews
const reviews = await fetch(`${NEWS_API_URL}/reviews`).then(r => r.json());

// Get status
const status = await fetch(`${NEWS_API_URL}/status`).then(r => r.json());

// Get announcements
const announcements = await fetch(`${NEWS_API_URL}/announcements`).then(r => r.json());

// Get stats
const stats = await fetch(`${NEWS_API_URL}/stats`).then(r => r.json());
```

### Angular Example

```typescript
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

export class NewsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.supabaseUrl}/functions/v1/news-api`;

  getWeather() {
    return this.http.get(`${this.baseUrl}/weather`);
  }

  getTime() {
    return this.http.get(`${this.baseUrl}/time`);
  }

  getReviews() {
    return this.http.get(`${this.baseUrl}/reviews`);
  }

  getStatus() {
    return this.http.get(`${this.baseUrl}/status`);
  }

  getAnnouncements() {
    return this.http.get(`${this.baseUrl}/announcements`);
  }

  getStats() {
    return this.http.get(`${this.baseUrl}/stats`);
  }
}
```

## Error Responses

All endpoints return standard HTTP status codes:

- `200 OK` - Request successful
- `404 Not Found` - Endpoint not found
- `405 Method Not Allowed` - Wrong HTTP method used
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "error": "Error message here",
  "message": "Additional details (if applicable)"
}
```

## CORS

All endpoints support CORS with the following headers:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Authorization, X-Client-Info, Apikey`

## Rate Limiting

No rate limiting currently implemented. All endpoints return stub data and are safe for frequent requests.

## Notes

- All data returned is stub/demo data
- Timestamps are generated in real-time
- No authentication or API keys required
- All endpoints are read-only (GET only)
