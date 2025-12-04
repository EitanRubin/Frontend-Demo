export interface User {
  email: string;
  name: string;
  role: 'admin' | 'support';
  token: string;
  authType?: 'google_sso' | 'kerberos';
  authData?: any;
}
