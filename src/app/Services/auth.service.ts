import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, AuthResponse, User } from '../Models/auth.models';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  
  private apiUrl = `${environment.apiUrl}/api/auth`;
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  login(email: string, password: string): Observable<AuthResponse> {
    const request: LoginRequest = { email, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, request).pipe(
      tap(response => {
        this.tokenService.setTokens(
          response.accessToken,
          response.refreshToken.tokenString,
          response.refreshToken.expireAt
        );
        this.currentUserSubject.next({
          email: response.refreshToken.userName
        });
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { tokenString: refreshToken }).pipe(
      tap(response => {
        this.tokenService.setTokens(
          response.accessToken,
          response.refreshToken.tokenString,
          response.refreshToken.expireAt
        );
      })
    );
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
