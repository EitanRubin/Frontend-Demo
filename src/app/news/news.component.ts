import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { environment } from '../../environments/environment';

interface WeatherData {
  location: string;
  temperature: number;
  unit: string;
  condition: string;
  humidity: number;
  windSpeed: number;
  windUnit: string;
  forecast: Array<{ day: string; high: number; low: number; condition: string }>;
  lastUpdated: string;
}

interface TimeData {
  utc: string;
  timestamp: number;
  timezone: string;
  localTime: string;
  formatted: {
    date: string;
    time: string;
    iso: string;
  };
}

interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

interface ReviewsData {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
  ratingDistribution: { [key: string]: number };
}

interface SystemStatus {
  status: string;
  uptime: string;
  services: Array<{ name: string; status: string; responseTime: string }>;
  incidents: any[];
  lastChecked: string;
}

interface Announcement {
  id: number;
  title: string;
  summary: string;
  date: string;
  priority: string;
  category: string;
}

interface Stats {
  totalUsers: number;
  totalUploads: number;
  totalStorageGB: number;
  activeUsers24h: number;
  uploadsToday: number;
  averageUploadSize: string;
  popularCategories: Array<{ name: string; count: number }>;
}

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="news-container">
      <header class="news-header">
        <div class="header-content">
          <h1>News & Information Hub</h1>
          <p>Real-time updates, statistics, and platform information</p>
          <a routerLink="/" class="back-btn">← Back to Home</a>
        </div>
      </header>

      <div class="content">
        <div class="section weather-section">
          <h2>🌤️ Weather</h2>
          <div *ngIf="weather" class="weather-card">
            <div class="weather-current">
              <div class="temp">{{ weather.temperature }}°{{ weather.unit.charAt(0).toUpperCase() }}</div>
              <div class="condition">{{ weather.condition }}</div>
              <div class="location">{{ weather.location }}</div>
            </div>
            <div class="weather-details">
              <div class="detail">
                <span class="label">Humidity</span>
                <span class="value">{{ weather.humidity }}%</span>
              </div>
              <div class="detail">
                <span class="label">Wind</span>
                <span class="value">{{ weather.windSpeed }} {{ weather.windUnit }}</span>
              </div>
            </div>
            <div class="forecast">
              <h3>3-Day Forecast</h3>
              <div class="forecast-days">
                <div *ngFor="let day of weather.forecast" class="forecast-day">
                  <div class="day-name">{{ day.day }}</div>
                  <div class="day-condition">{{ day.condition }}</div>
                  <div class="day-temp">{{ day.high }}° / {{ day.low }}°</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section time-section">
          <h2>🕐 Current Time</h2>
          <div *ngIf="time" class="time-card">
            <div class="time-display">{{ time.formatted.time }}</div>
            <div class="date-display">{{ time.formatted.date }}</div>
            <div class="timezone">{{ time.timezone }}</div>
          </div>
        </div>

        <div class="section status-section">
          <h2>📊 System Status</h2>
          <div *ngIf="status" class="status-card">
            <div class="status-overview">
              <div class="status-badge" [class.operational]="status.status === 'operational'">
                {{ status.status | uppercase }}
              </div>
              <div class="uptime">Uptime: {{ status.uptime }}</div>
            </div>
            <div class="services">
              <div *ngFor="let service of status.services" class="service">
                <div class="service-name">{{ service.name }}</div>
                <div class="service-status">
                  <span class="status-dot" [class.operational]="service.status === 'operational'"></span>
                  {{ service.responseTime }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="section reviews-section">
          <h2>⭐ Reviews</h2>
          <div *ngIf="reviews" class="reviews-card">
            <div class="reviews-header">
              <div class="rating-summary">
                <div class="avg-rating">{{ reviews.averageRating }}</div>
                <div class="stars">★★★★★</div>
                <div class="total">{{ reviews.totalReviews }} reviews</div>
              </div>
            </div>
            <div class="reviews-list">
              <div *ngFor="let review of reviews.reviews" class="review">
                <div class="review-header">
                  <span class="author">{{ review.author }}</span>
                  <span class="verified" *ngIf="review.verified">✓ Verified</span>
                  <span class="rating">{{ review.rating }}★</span>
                </div>
                <div class="review-comment">{{ review.comment }}</div>
                <div class="review-date">{{ review.date }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="section announcements-section">
          <h2>📢 Announcements</h2>
          <div *ngIf="announcements" class="announcements-list">
            <div *ngFor="let announcement of announcements"
                 class="announcement"
                 [class.high-priority]="announcement.priority === 'high'">
              <div class="announcement-header">
                <span class="category">{{ announcement.category | uppercase }}</span>
                <span class="date">{{ announcement.date }}</span>
              </div>
              <h3>{{ announcement.title }}</h3>
              <p>{{ announcement.summary }}</p>
            </div>
          </div>
        </div>

        <div class="section stats-section">
          <h2>📈 Platform Statistics</h2>
          <div *ngIf="stats" class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ stats.totalUsers.toLocaleString() }}</div>
              <div class="stat-label">Total Users</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ stats.totalUploads.toLocaleString() }}</div>
              <div class="stat-label">Total Uploads</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ stats.totalStorageGB.toLocaleString() }} GB</div>
              <div class="stat-label">Storage Used</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ stats.activeUsers24h.toLocaleString() }}</div>
              <div class="stat-label">Active Users (24h)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .news-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    }

    .news-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 3rem 2rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .news-header h1 {
      margin: 0 0 0.5rem;
      font-size: 2.5rem;
      font-weight: 700;
    }

    .news-header p {
      margin: 0 0 1rem;
      font-size: 1.1rem;
      opacity: 0.9;
    }

    .back-btn {
      display: inline-block;
      color: white;
      text-decoration: none;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      transition: background 0.3s ease;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .section {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .section:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .section h2 {
      margin: 0 0 1.5rem;
      color: #333;
      font-size: 1.5rem;
      font-weight: 600;
    }

    .weather-card {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .weather-current {
      text-align: center;
    }

    .temp {
      font-size: 3rem;
      font-weight: 700;
      color: #667eea;
    }

    .condition {
      font-size: 1.25rem;
      color: #666;
      margin: 0.5rem 0;
    }

    .location {
      color: #999;
    }

    .weather-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    .detail {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .detail .label {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .detail .value {
      font-size: 1.25rem;
      font-weight: 600;
      color: #333;
    }

    .forecast h3 {
      font-size: 1rem;
      margin: 0 0 1rem;
      color: #666;
    }

    .forecast-days {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }

    .forecast-day {
      text-align: center;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .day-name {
      font-weight: 600;
      color: #333;
      margin-bottom: 0.5rem;
    }

    .day-condition {
      font-size: 0.875rem;
      color: #666;
      margin-bottom: 0.25rem;
    }

    .day-temp {
      font-size: 0.875rem;
      color: #667eea;
    }

    .time-card {
      text-align: center;
      padding: 2rem;
    }

    .time-display {
      font-size: 3rem;
      font-weight: 700;
      color: #667eea;
      margin-bottom: 0.5rem;
    }

    .date-display {
      font-size: 1.25rem;
      color: #666;
      margin-bottom: 0.5rem;
    }

    .timezone {
      color: #999;
    }

    .status-card {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .status-overview {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .status-badge {
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 600;
      font-size: 0.875rem;
    }

    .status-badge.operational {
      background: #d4edda;
      color: #155724;
    }

    .uptime {
      color: #666;
      font-size: 0.875rem;
    }

    .services {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .service {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .service-name {
      font-weight: 600;
      color: #333;
    }

    .service-status {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #666;
      font-size: 0.875rem;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #ccc;
    }

    .status-dot.operational {
      background: #28a745;
    }

    .reviews-card {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .rating-summary {
      text-align: center;
      padding: 1.5rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .avg-rating {
      font-size: 3rem;
      font-weight: 700;
      color: #667eea;
    }

    .stars {
      color: #ffc107;
      font-size: 1.5rem;
      margin: 0.5rem 0;
    }

    .total {
      color: #666;
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .review {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .review-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .author {
      font-weight: 600;
      color: #333;
    }

    .verified {
      color: #28a745;
      font-size: 0.875rem;
    }

    .rating {
      color: #ffc107;
      margin-left: auto;
    }

    .review-comment {
      color: #666;
      margin-bottom: 0.5rem;
    }

    .review-date {
      font-size: 0.875rem;
      color: #999;
    }

    .announcements-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .announcement {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
    }

    .announcement.high-priority {
      border-left-color: #dc3545;
    }

    .announcement-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }

    .category {
      font-size: 0.75rem;
      font-weight: 600;
      color: #667eea;
    }

    .date {
      font-size: 0.875rem;
      color: #999;
    }

    .announcement h3 {
      margin: 0 0 0.5rem;
      color: #333;
      font-size: 1rem;
    }

    .announcement p {
      margin: 0;
      color: #666;
      font-size: 0.875rem;
    }

    .stats-section {
      grid-column: 1 / -1;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      text-align: center;
      padding: 2rem;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 8px;
      color: white;
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }

    .stat-label {
      font-size: 0.875rem;
      opacity: 0.9;
    }

    @media (max-width: 768px) {
      .news-header h1 {
        font-size: 1.75rem;
      }

      .content {
        grid-template-columns: 1fr;
        padding: 1rem;
      }

      .forecast-days {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `]
})
export class NewsComponent implements OnInit {
  private baseUrl = `${environment.supabaseUrl}/functions/v1/news-api`;

  weather: WeatherData | null = null;
  time: TimeData | null = null;
  reviews: ReviewsData | null = null;
  status: SystemStatus | null = null;
  announcements: Announcement[] = [];
  stats: Stats | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadWeather();
    this.loadTime();
    this.loadReviews();
    this.loadStatus();
    this.loadAnnouncements();
    this.loadStats();
  }

  private loadWeather() {
    this.http.get<WeatherData>(`${this.baseUrl}/weather`).subscribe({
      next: (data) => this.weather = data,
      error: (err) => console.error('Error loading weather:', err)
    });
  }

  private loadTime() {
    this.http.get<TimeData>(`${this.baseUrl}/time`).subscribe({
      next: (data) => this.time = data,
      error: (err) => console.error('Error loading time:', err)
    });
  }

  private loadReviews() {
    this.http.get<ReviewsData>(`${this.baseUrl}/reviews`).subscribe({
      next: (data) => this.reviews = data,
      error: (err) => console.error('Error loading reviews:', err)
    });
  }

  private loadStatus() {
    this.http.get<SystemStatus>(`${this.baseUrl}/status`).subscribe({
      next: (data) => this.status = data,
      error: (err) => console.error('Error loading status:', err)
    });
  }

  private loadAnnouncements() {
    this.http.get<{ announcements: Announcement[] }>(`${this.baseUrl}/announcements`).subscribe({
      next: (data) => this.announcements = data.announcements,
      error: (err) => console.error('Error loading announcements:', err)
    });
  }

  private loadStats() {
    this.http.get<Stats>(`${this.baseUrl}/stats`).subscribe({
      next: (data) => this.stats = data,
      error: (err) => console.error('Error loading stats:', err)
    });
  }
}
