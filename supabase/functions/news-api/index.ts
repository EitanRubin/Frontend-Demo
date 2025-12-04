import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/').filter(p => p);
    const method = req.method;

    if (method !== 'GET') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Only GET requests are supported.' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /news-api/weather - Get current weather
    if (pathParts.length === 2 && pathParts[1] === 'weather') {
      const weatherData = {
        location: 'San Francisco, CA',
        temperature: 68,
        unit: 'fahrenheit',
        condition: 'Partly Cloudy',
        humidity: 65,
        windSpeed: 12,
        windUnit: 'mph',
        forecast: [
          { day: 'Monday', high: 72, low: 58, condition: 'Sunny' },
          { day: 'Tuesday', high: 70, low: 56, condition: 'Cloudy' },
          { day: 'Wednesday', high: 68, low: 55, condition: 'Rainy' },
        ],
        lastUpdated: new Date().toISOString(),
      };

      return new Response(
        JSON.stringify(weatherData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /news-api/time - Get current time
    if (pathParts.length === 2 && pathParts[1] === 'time') {
      const timeData = {
        utc: new Date().toISOString(),
        timestamp: Date.now(),
        timezone: 'America/Los_Angeles',
        localTime: new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }),
        formatted: {
          date: new Date().toLocaleDateString('en-US'),
          time: new Date().toLocaleTimeString('en-US'),
          iso: new Date().toISOString(),
        },
      };

      return new Response(
        JSON.stringify(timeData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /news-api/reviews - Get upload reviews
    if (pathParts.length === 2 && pathParts[1] === 'reviews') {
      const reviewsData = {
        averageRating: 4.7,
        totalReviews: 1247,
        reviews: [
          {
            id: 1,
            author: 'John Smith',
            rating: 5,
            comment: 'Excellent service! Fast upload speeds and reliable storage.',
            date: '2024-12-01',
            verified: true,
          },
          {
            id: 2,
            author: 'Sarah Johnson',
            rating: 4,
            comment: 'Great platform, could use better mobile support.',
            date: '2024-11-28',
            verified: true,
          },
          {
            id: 3,
            author: 'Mike Davis',
            rating: 5,
            comment: 'Best upload service I have used. Highly recommended!',
            date: '2024-11-25',
            verified: false,
          },
        ],
        ratingDistribution: {
          5: 820,
          4: 310,
          3: 87,
          2: 20,
          1: 10,
        },
      };

      return new Response(
        JSON.stringify(reviewsData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /news-api/status - Get system status
    if (pathParts.length === 2 && pathParts[1] === 'status') {
      const statusData = {
        status: 'operational',
        uptime: '99.98%',
        services: [
          { name: 'API', status: 'operational', responseTime: '45ms' },
          { name: 'Database', status: 'operational', responseTime: '12ms' },
          { name: 'Storage', status: 'operational', responseTime: '89ms' },
          { name: 'Edge Functions', status: 'operational', responseTime: '32ms' },
        ],
        incidents: [],
        lastChecked: new Date().toISOString(),
      };

      return new Response(
        JSON.stringify(statusData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /news-api/announcements - Get latest announcements
    if (pathParts.length === 2 && pathParts[1] === 'announcements') {
      const announcementsData = {
        announcements: [
          {
            id: 1,
            title: 'New Feature: Batch Upload',
            summary: 'You can now upload multiple files at once with our new batch upload feature.',
            date: '2024-12-01',
            priority: 'high',
            category: 'feature',
          },
          {
            id: 2,
            title: 'Scheduled Maintenance',
            summary: 'System maintenance scheduled for December 10th at 2:00 AM UTC.',
            date: '2024-11-29',
            priority: 'medium',
            category: 'maintenance',
          },
          {
            id: 3,
            title: 'Security Update',
            summary: 'We have enhanced our security protocols to better protect your data.',
            date: '2024-11-20',
            priority: 'high',
            category: 'security',
          },
        ],
      };

      return new Response(
        JSON.stringify(announcementsData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /news-api/stats - Get platform statistics
    if (pathParts.length === 2 && pathParts[1] === 'stats') {
      const statsData = {
        totalUsers: 15420,
        totalUploads: 2847563,
        totalStorageGB: 18947,
        activeUsers24h: 3421,
        uploadsToday: 12483,
        averageUploadSize: '6.7 MB',
        popularCategories: [
          { name: 'Documents', count: 984532 },
          { name: 'Images', count: 756421 },
          { name: 'Videos', count: 423876 },
          { name: 'Other', count: 682734 },
        ],
      };

      return new Response(
        JSON.stringify(statsData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // GET /news-api - API documentation
    if (pathParts.length === 1) {
      const documentation = {
        name: 'News API',
        version: '1.0.0',
        description: 'Public API for accessing news, weather, time, reviews, and platform information',
        authentication: 'None required',
        baseUrl: url.origin + '/news-api',
        endpoints: [
          {
            path: '/weather',
            method: 'GET',
            description: 'Get current weather information and forecast',
            authentication: false,
            response: {
              location: 'string',
              temperature: 'number',
              condition: 'string',
              forecast: 'array',
            },
          },
          {
            path: '/time',
            method: 'GET',
            description: 'Get current time in various formats',
            authentication: false,
            response: {
              utc: 'string (ISO 8601)',
              timestamp: 'number',
              timezone: 'string',
            },
          },
          {
            path: '/reviews',
            method: 'GET',
            description: 'Get platform reviews and ratings',
            authentication: false,
            response: {
              averageRating: 'number',
              totalReviews: 'number',
              reviews: 'array',
            },
          },
          {
            path: '/status',
            method: 'GET',
            description: 'Get system status and uptime information',
            authentication: false,
            response: {
              status: 'string',
              uptime: 'string',
              services: 'array',
            },
          },
          {
            path: '/announcements',
            method: 'GET',
            description: 'Get latest platform announcements',
            authentication: false,
            response: {
              announcements: 'array',
            },
          },
          {
            path: '/stats',
            method: 'GET',
            description: 'Get platform statistics',
            authentication: false,
            response: {
              totalUsers: 'number',
              totalUploads: 'number',
              totalStorageGB: 'number',
            },
          },
        ],
        examples: [
          {
            description: 'Get weather information',
            request: 'GET /news-api/weather',
            curl: `curl ${url.origin}/news-api/weather`,
          },
          {
            description: 'Get current time',
            request: 'GET /news-api/time',
            curl: `curl ${url.origin}/news-api/time`,
          },
          {
            description: 'Get reviews',
            request: 'GET /news-api/reviews',
            curl: `curl ${url.origin}/news-api/reviews`,
          },
        ],
      };

      return new Response(
        JSON.stringify(documentation),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        error: 'Not found',
        message: 'Visit /news-api for API documentation',
      }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});