import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storedUser = localStorage.getItem('currentUser');

  if (storedUser) {
    const user = JSON.parse(storedUser);
    let headers: { [key: string]: string } = {
    };

    if (user.authType === 'google_sso' && user.authData) {
      headers['Authorization'] = `Bearer ${user.token}`;
    } else if (user.authType === 'kerberos' && user.authData) {
      headers['Authorization'] = `Negotiate ${user.authData.ticket.ticket_data}`;
    }

    const clonedReq = req.clone({ setHeaders: headers });
    return next(clonedReq);
  }

  return next(req);
};
