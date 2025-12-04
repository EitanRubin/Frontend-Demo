import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Admin Portal</h1>
        <p>Sign in to access inventory management</p>
        <button class="google-btn" (click)="loginWithGoogle()">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .login-card {
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      text-align: center;
      max-width: 400px;
      width: 100%;
    }

    h1 {
      margin: 0 0 0.5rem;
      color: #333;
      font-size: 2rem;
    }

    p {
      color: #666;
      margin: 0 0 2rem;
    }

    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      width: 100%;
      padding: 12px 24px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      color: #444;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .google-btn:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-color: #ccc;
    }
  `]
})
export class AdminLoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginWithGoogle(): void {
    this.authService.loginAsAdmin('admin@store.com', 'Admin User');
    this.router.navigate(['/admin/dashboard']);
  }
}
