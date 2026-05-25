import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { TokenService } from './token.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthInitializerService {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private translateService: TranslateService
  ) {}

  initialize(): Observable<boolean> {
    return this.translateService.use('en').pipe(
      switchMap(() => {
        const accessToken = this.tokenService.getAccessToken();
        const refreshToken = this.tokenService.getRefreshToken();

        if (!accessToken) {
          return of(false);
        }

        // 2. محاولة التحقق من التوكن
        return this.authService.validateToken().pipe(
          tap(isValid => {
            if (isValid) {
              console.log('Token is valid');
            } else {
              console.warn('Token is invalid');
            }
          }),
          switchMap(isValid => {
            if (isValid) {
              return of(true);
            }
            
            // If token is invalid but we have a refresh token, try to refresh
            if (refreshToken) {
              console.warn('Token invalid or expired, attempting refresh...');
              return this.handleRefresh();
            }
            
            return this.clearAndFail();
          }),
          catchError((error) => {
            if (refreshToken) {
              console.warn('Token validation error, attempting refresh...');
              return this.handleRefresh();
            }
            return this.clearAndFail();
          })
        );

      })
    );
  }

  private handleRefresh(): Observable<boolean> {

    return this.authService.refreshToken().pipe(
      map(() => {
        console.log('Token refreshed successfully during initialization');
        return true;
      }),
      catchError(() => this.clearAndFail())
    );
  }

  private clearAndFail(): Observable<boolean> {
    this.tokenService.clearTokens();
    console.error('Authentication initialization failed');
    return of(false);
  }
}