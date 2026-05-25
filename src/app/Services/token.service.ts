import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from '../Models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiration: Date | null = null;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.loadTokensFromStorage();
  }

  private loadTokensFromStorage(): void {
    const storedAccessToken = localStorage.getItem('accessToken');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedExpireAt = localStorage.getItem('tokenExpiration');
    const storedCurrentUser = localStorage.getItem('currentUser');

    if (storedAccessToken && storedRefreshToken) {
      this.accessToken = storedAccessToken;
      this.refreshToken = storedRefreshToken;
      if (storedExpireAt) {
        this.tokenExpiration = new Date(storedExpireAt);
      }
      this.isAuthenticatedSubject.next(true);
      
      if (storedCurrentUser) {
        try {
          const user: User = JSON.parse(storedCurrentUser);
          this.currentUserSubject.next(user);
        } catch (error) {
          console.error('Failed to parse currentUser from localStorage:', error);
        }
      }
    }
  }

  setTokens(accessToken: string, refreshTokenString: string, expireAt?: string, user?: User): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshTokenString;
    if (expireAt) {
      this.tokenExpiration = new Date(expireAt);
    }
    this.isAuthenticatedSubject.next(true);

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshTokenString);
    if (expireAt) {
      localStorage.setItem('tokenExpiration', expireAt);
    }
    
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUserSubject.next(user);
    }
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiration = null;
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('currentUser');
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  hasValidToken(): boolean {
    return !!this.accessToken;
  }

  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  getTokenExpiration(): Date | null {
    return this.tokenExpiration;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
