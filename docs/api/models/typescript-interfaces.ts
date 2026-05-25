// ============================================================================
// SchoolProject API - TypeScript Interfaces
// Generated from OpenAPI 3.0 specification
// ============================================================================

// ---------------------------------------------------------------------------
// Base Response Types
// ---------------------------------------------------------------------------

export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
  errors: string[] | null;
  statusCode: number;
}

// ---------------------------------------------------------------------------
// Authentication Models
// ---------------------------------------------------------------------------

export interface SignInRequest {
  email: string;
  password: string;
}

export interface RefreshTokenData {
  userName: string;
  tokenString: string;
  expireAt: string; // ISO date string
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: RefreshTokenData;
}

export interface RefreshTokenRequest {
  tokenString: string;
}

export interface ValidateTokenResponse {
  isValid: boolean;
  userId: string;
  email: string;
}

export interface SendResetPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  userId: string;
  code: string;
  newPassword: string;
}

// ---------------------------------------------------------------------------
// User Models
// ---------------------------------------------------------------------------

export interface CreateUserRequest {
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface EditUserRequest {
  id: string;
  email: string;
  userName: string;
  firstName?: string;
  lastName?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  userName: string;
  firstName?: string;
  lastName?: string;
  emailConfirmed: boolean;
  roles: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// ---------------------------------------------------------------------------
// Pagination Models
// ---------------------------------------------------------------------------

export interface PaginationRequest {
  page?: number;
  pageSize?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginatedUserResponse {
  items: UserResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Authorization Models
// ---------------------------------------------------------------------------

export interface CreateRoleRequest {
  roleName: string;
}

export interface EditRoleRequest {
  id: string;
  roleName: string;
}

export interface RoleResponse {
  id: string;
  roleName: string;
  users: string[]; // List of user IDs
}

export interface UpdateUserRolesRequest {
  userId: string;
  roles: string[];
}

export interface UserRolesResponse {
  userId: string;
  roles: string[];
}

export interface ClaimItem {
  type: string;
  value: string;
}

export interface UpdateUserClaimsRequest {
  userId: string;
  claims: ClaimItem[];
}

export interface UserClaimsResponse {
  userId: string;
  claims: ClaimItem[];
}

// ---------------------------------------------------------------------------
// Email Models
// ---------------------------------------------------------------------------

export interface SendEmailRequest {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

// ---------------------------------------------------------------------------
// Error Models
// ---------------------------------------------------------------------------

export interface ErrorResponse {
  succeeded: boolean;
  message: string;
  data: null;
  errors: string[];
  statusCode: number;
}

// ---------------------------------------------------------------------------
// Utility Types
// ---------------------------------------------------------------------------

export type UserRole = 'Admin' | 'User';

export interface CurrentUser {
  id: string;
  email: string;
  userName: string;
  roles: string[];
  firstName?: string;
  lastName?: string;
}
