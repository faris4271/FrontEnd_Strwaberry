import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, BehaviorSubject, map, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, AuthResponse, User, RefreshTokenRequest, ResetPasswordRequest, ConfirmResetPasswordRequest, SendResetPasswordRequest } from '../Models/auth.models';
import { CreateUserRequest } from '../Models/user.models';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { ApiResponse } from '../Models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
constructor() {
  const user = this.tokenService.getCurrentUser(); 
  if (user) {
    this.updateCurrentUser(user);
  }
}
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);
 currentUser = signal<User | null>(this.tokenService.getCurrentUser());
  private apiUrl = `${environment.apiUrl}`;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private updateCurrentUser(user: User | null) {
    this.currentUserSubject.next(user);
    this.currentUser.set(user);
  }

  login(email: string, password: string): Observable<ApiResponse<AuthResponse>> {
    const request: LoginRequest = { email, password };
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/Api/V1/Authentication/SignIn`, request).pipe(
      tap(response => {
        const user: User = {
          email: response.data.refreshToken.userName,
          userName: response.data.refreshToken.userName,
          roles: []
        };
        this.tokenService.setTokens(
          response.data.accessToken,
          response.data.refreshToken.tokenString,
          response.data.refreshToken.expireAt,
          user
        );
        this.updateCurrentUser(user);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.tokenService.getRefreshToken();
    const accessToken = this.tokenService.getAccessToken();
    if (!refreshToken || !accessToken) {
      return throwError(() => new Error('No tokens available'));
    }

    const request: RefreshTokenRequest = {
      accessToken,
      refreshToken
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/Api/V1/Authentication/Refresh-Token`, request).pipe(
      tap(response => {
        const user: User = {
          email: response.refreshToken.userName,
          userName: response.refreshToken.userName,
          roles: []
        };
        this.tokenService.setTokens(
          response.accessToken,
          response.refreshToken.tokenString,
          response.refreshToken.expireAt,
          user
        );
        this.updateCurrentUser(user);
      }),
      catchError(error => {
        console.error('Token refresh failed:', error);
        return throwError(() => error);
      })
    );
  }
validateToken(): Observable<boolean> {
    const accessToken = this.tokenService.getAccessToken();
    if (!accessToken) return of(false);

    return this.http.get<ApiResponse<string>>(
      `${this.apiUrl}/Api/V1/Authentication/Validate-Token`, 
      { params: { AccessToken: accessToken } }
    ).pipe(
      map(response => {
        const isValid = response.succeeded && response.data === 'NotExpired';
        
      
        if (isValid && !this.currentUserSubject.value) {
           const savedUser = this.tokenService.getCurrentUser();
           this.updateCurrentUser(savedUser);
        }
        
        return isValid;
      }),
      catchError(error => {
        console.warn('Token validation failed:', error.status);

        return of(false);
      })
    );
  }

  register(request: CreateUserRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/api/ApplicationUser/Api/V1/User/Create`, request).pipe(
      tap(response => {
        console.log('Registration response:', response);
        if (response.succeeded && response.data) {
          const user: User = {
            email: response.data.refreshToken.userName,
            userName: response.data.refreshToken.userName,
            roles: []
          };
          this.tokenService.setTokens(
            response.data.accessToken,
            response.data.refreshToken.tokenString,
            response.data.refreshToken.expireAt,
            user
          );
          this.updateCurrentUser(user);
        }
      }),
      catchError(error => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.tokenService.clearTokens();
    this.updateCurrentUser(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.tokenService.hasValidToken();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  sendResetPasswordCode(request: SendResetPasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/Api/V1/Authentication/SendResetPasswordCode`, request);
  }

  confirmResetPasswordCode(request: ConfirmResetPasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/Api/V1/Authentication/ConfirmResetPasswordCode`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.apiUrl}/Api/V1/Authentication/ResetPassword`, request);
  }
}
