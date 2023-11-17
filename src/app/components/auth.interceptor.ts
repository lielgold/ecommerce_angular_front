import {
    HttpRequest,
    HttpEvent,
    HttpHandlerFn,
  } from '@angular/common/http';
  
  import { Observable } from 'rxjs';
  
  export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
    // Inject the current `AuthService` and use it to get an authentication token:
    var authToken = localStorage.getItem('token');
    if(authToken===null) authToken = "";
    // Clone the request to add the authentication header.  
    const reqWithHeader = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });
    return next(reqWithHeader);
  }