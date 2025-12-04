import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { AdminLoginComponent } from './admin/admin-login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard.component';
import { SupportLoginComponent } from './support/support-login.component';
import { SupportDashboardComponent } from './support/support-dashboard.component';
import { NewsComponent } from './news/news.component';
import { adminGuard } from './guards/admin.guard';
import { supportGuard } from './guards/support.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'news', component: NewsComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'support/login', component: SupportLoginComponent },
  { path: 'support/dashboard', component: SupportDashboardComponent, canActivate: [supportGuard] },
  { path: '**', redirectTo: '' }
];
