import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../Services/token.service';
import { AuthService } from '../Services/auth.service';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, from } from 'rxjs';

let isRefreshing = false;

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/refresh-token') && !req.url.includes('/login')) {
        if (!isRefreshing) {
          isRefreshing = true;
          const refreshToken = tokenService.getRefreshToken();
          
          if (refreshToken) {
            return authService.refreshToken().pipe(
              switchMap(() => {
                isRefreshing = false;
                const newToken = tokenService.getAccessToken();
                if (newToken) {
                  const clonedReq = req.clone({
                    setHeaders: {
                      Authorization: `Bearer ${newToken}`
                    }
                  });
                  return next(clonedReq);
                }
                return throwError(() => error);
              }),
              catchError((refreshError) => {
                isRefreshing = false;
                authService.logout();
                return throwError(() => refreshError);
              })
            );
          } else {
            isRefreshing = false;
            authService.logout();
          }
        }
      }
      return throwError(() => error);
    })
  );
};
