import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiration: Date | null = null;

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  setTokens(accessToken: string, refreshTokenString: string, expireAt?: string): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshTokenString;
    if (expireAt) {
      this.tokenExpiration = new Date(expireAt);
    }
    this.isAuthenticatedSubject.next(true);
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    this.tokenExpiration = null;
    this.isAuthenticatedSubject.next(false);
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
}
