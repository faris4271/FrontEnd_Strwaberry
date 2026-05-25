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
  accessToken: string;
  refreshToken: string;
}

export interface User {
  email: string;
  userName?: string;
  roles?: string[];
}

export interface SendResetPasswordRequest {
  email: string;
}

export interface ConfirmResetPasswordRequest {
  email: string;
  code: string;
}

export interface ResetPasswordRequest {
  email: string;
  code: string;
  Password: string;
}
