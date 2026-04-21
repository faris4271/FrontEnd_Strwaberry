export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenData {
  userName: string;
  tokenString: string;
  expireAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: RefreshTokenData;
}

export interface RefreshTokenRequest {
  tokenString: string;
}

export interface User {
  email: string;
  userName?: string;
}
