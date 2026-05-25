export interface CreateUserRequest {
  fullName: string;
  userName: string;
  email: string;
  address?: string;
  country?: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
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

export interface PaginatedUserResponse {
  items: UserResponse[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
