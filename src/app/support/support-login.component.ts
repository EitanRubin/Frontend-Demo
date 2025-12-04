import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-support-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h1>Support Portal</h1>
        <p>Sign in with Kerberos credentials</p>
        <form (submit)="login($event)">
          <div class="form-group">
            <label>Username</label>
            <input
              type="text"
              [(ngModel)]="username"
              name="username"
              placeholder="support@domain.com"
              required
            />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input
              type="password"
              [(ngModel)]="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" class="login-btn">Sign In</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
    }

    .login-card {
      background: white;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      max-width: 400px;
      width: 100%;
    }

    h1 {
      margin: 0 0 0.5rem;
      color: #333;
      font-size: 2rem;
      text-align: center;
    }

    p {
      color: #666;
      margin: 0 0 2rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #333;
    }

    input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    input:focus {
      outline: none;
      border-color: #11998e;
    }

    .login-btn {
      width: 100%;
      padding: 0.75rem;
      background: #11998e;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .login-btn:hover {
      background: #0e8377;
    }
  `]
})
export class SupportLoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  username = '';
  password = '';

  login(event: Event): void {
    event.preventDefault();
    this.authService.loginAsSupport(this.username || 'support@store.com', 'Support User');
    this.router.navigate(['/support/dashboard']);
  }
}
