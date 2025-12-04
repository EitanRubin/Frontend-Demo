import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="home-container">
      <div class="hero">
        <h1>Store Management System</h1>
        <p>Choose your portal to get started</p>

        <div class="portals">
          <div class="portal-card">
            <div class="portal-icon">📰</div>
            <h2>News & Info</h2>
            <p>View weather, time, reviews, and platform updates</p>
            <a routerLink="/news" class="portal-btn news">View News Hub</a>
          </div>

          <div class="portal-card">
            <div class="portal-icon">🔐</div>
            <h2>Admin Portal</h2>
            <p>Manage inventory, add items, and track stock levels</p>
            <a routerLink="/admin/login" class="portal-btn admin">Access Admin Portal</a>
          </div>

          <div class="portal-card">
            <div class="portal-icon">🎫</div>
            <h2>Support Portal</h2>
            <p>Handle customer tickets and provide assistance</p>
            <a routerLink="/support/login" class="portal-btn support">Access Support Portal</a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #11998e 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }

    .hero {
      text-align: center;
      color: white;
    }

    .hero h1 {
      font-size: 3rem;
      margin: 0 0 1rem;
      font-weight: 700;
    }

    .hero > p {
      font-size: 1.25rem;
      margin: 0 0 3rem;
      opacity: 0.9;
    }

    .portals {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .portal-card {
      background: white;
      padding: 2.5rem;
      border-radius: 16px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .portal-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 50px rgba(0, 0, 0, 0.2);
    }

    .portal-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .portal-card h2 {
      margin: 0 0 1rem;
      color: #333;
      font-size: 1.75rem;
    }

    .portal-card p {
      color: #666;
      margin: 0 0 2rem;
      line-height: 1.6;
    }

    .portal-btn {
      display: inline-block;
      padding: 0.875rem 2rem;
      border-radius: 8px;
      font-weight: 600;
      text-decoration: none;
      color: white;
      transition: all 0.3s ease;
    }

    .portal-btn.admin {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .portal-btn.admin:hover {
      background: linear-gradient(135deg, #5568d3 0%, #653a8b 100%);
    }

    .portal-btn.news {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }

    .portal-btn.news:hover {
      background: linear-gradient(135deg, #d67be2 0%, #dc3e53 100%);
    }

    .portal-btn.support {
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }

    .portal-btn.support:hover {
      background: linear-gradient(135deg, #0e8377 0%, #2dd667 100%);
    }

    @media (max-width: 768px) {
      .hero h1 {
        font-size: 2rem;
      }

      .hero > p {
        font-size: 1rem;
      }

      .portals {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent {}
