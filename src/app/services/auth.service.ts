import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;

  constructor() {
    const storedUser = localStorage.getItem('currentUser');
    this.currentUserSubject = new BehaviorSubject<User | null>(
      storedUser ? JSON.parse(storedUser) : null
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  loginAsAdmin(email: string, name: string): User {
    const token = this.generateStubToken(email, name, 'admin');
    const ssoData = this.generateGoogleSSOData(email, name);
    const user: User = { email, name, role: 'admin', token, authType: 'google_sso', authData: ssoData };
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return user;
  }

  loginAsSupport(email: string, name: string): User {
    const token = this.generateStubToken(email, name, 'support');
    const kerberosData = this.generateKerberosData(email, name);
    const user: User = { email, name, role: 'support', token, authType: 'kerberos', authData: kerberosData };
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
    return user;
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return this.currentUserValue !== null;
  }

  isAdmin(): boolean {
    return this.currentUserValue?.role === 'admin';
  }

  isSupport(): boolean {
    return this.currentUserValue?.role === 'support';
  }

  private generateStubToken(email: string, name: string, role: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      email,
      name,
      role,
      iat: Date.now(),
      exp: Date.now() + 24 * 60 * 60 * 1000
    }));
    const signature = btoa(Math.random().toString(36).substring(2, 15));
    return `${header}.${payload}.${signature}`;
  }

  private generateGoogleSSOData(email: string, name: string): any {
    return {
      id_token: this.generateStubToken(email, name, 'admin'),
      access_token: 'ya29.' + btoa(Math.random().toString(36).substring(2, 50)),
      refresh_token: '1//' + btoa(Math.random().toString(36).substring(2, 50)),
      token_type: 'Bearer',
      expires_in: 3600,
      scope: 'openid email profile',
      id_token_claims: {
        iss: 'https://accounts.google.com',
        azp: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
        aud: '123456789-abcdefghijklmnop.apps.googleusercontent.com',
        sub: btoa(email).substring(0, 21),
        email: email,
        email_verified: true,
        name: name,
        picture: 'https://lh3.googleusercontent.com/a/default-user',
        given_name: name.split(' ')[0],
        family_name: name.split(' ')[1] || '',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600
      }
    };
  }

  private generateKerberosData(email: string, name: string): any {
    const realm = 'STORE.LOCAL';
    const principal = `${email.split('@')[0]}@${realm}`;
    return {
      principal: principal,
      realm: realm,
      ticket: {
        kvno: 2,
        enctype: 18,
        ticket_data: 'YII' + btoa(Math.random().toString(36).repeat(10)),
        session_key: btoa(Math.random().toString(36).substring(2, 32))
      },
      auth_time: Math.floor(Date.now() / 1000),
      start_time: Math.floor(Date.now() / 1000),
      end_time: Math.floor(Date.now() / 1000) + 36000,
      renew_till: Math.floor(Date.now() / 1000) + 604800,
      flags: ['forwardable', 'renewable', 'initial', 'pre-authent']
    };
  }
}
