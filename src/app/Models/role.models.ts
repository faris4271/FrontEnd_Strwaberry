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
  users: string[];
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
