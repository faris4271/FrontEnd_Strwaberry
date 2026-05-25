import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '../Services/token.service';
import { AuthService } from '../Services/auth.service';
import { catchError, switchMap, throwError, BehaviorSubject, filter, take } from 'rxjs';
import { User } from '../Models/auth.models';

// متغيرات للتحكم في حالة التجديد وطابور الانتظار
let isRefreshing = false;
const refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const refreshTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const url = req.url.toLowerCase();
      
      // التحقق من الخطأ 401 واستثناء روابط المصادقة
      if (error.status === 401 && !url.includes('/login') && !url.includes('/refresh-token')) {
        
        if (!isRefreshing) {
          isRefreshing = true;
          refreshTokenSubject.next(null); // تصغير قيمة الـ Subject للانتظار

          return authService.refreshToken().pipe(
            switchMap(() => {
              isRefreshing = false;
              const newToken = tokenService.getAccessToken();
              
              refreshTokenSubject.next(newToken); // إرسال التوكن الجديد لكل المنتظرين

              return next(req.clone({
                setHeaders: { Authorization: `Bearer ${newToken}` }
              }));
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          // إذا كان هناك عملية تجديد قائمة، انتظر حتى يكتمل التوكن الجديد
          return refreshTokenSubject.pipe(
            filter(token => token !== null), // انتظر حتى لا تكون القيمة null
            take(1), // خذ أول قيمة صالحة فقط
            switchMap((token) => {
              return next(req.clone({
                setHeaders: { Authorization: `Bearer ${token}` }
              }));
            })
          );
        }
      }
      return throwError(() => error);
    })
  );
};