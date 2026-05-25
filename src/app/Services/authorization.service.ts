import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../Models/api-response.model';
import { 
  CreateRoleRequest,
  EditRoleRequest,
  RoleResponse,
  UpdateUserRolesRequest,
  UserRolesResponse,
  UpdateUserClaimsRequest,
  UserClaimsResponse
} from '../Models/role.models';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/AuthorizationRouting`;

  // Role Management
  createRole(request: CreateRoleRequest): Observable<ApiResponse<RoleResponse>> {
    return this.http.post<ApiResponse<RoleResponse>>(`${this.apiUrl}/Roles/Create`, request).pipe(
      catchError(error => {
        console.error('Error creating role:', error);
        return throwError(() => error);
      })
    );
  }

  editRole(request: EditRoleRequest): Observable<ApiResponse<RoleResponse>> {
    return this.http.post<ApiResponse<RoleResponse>>(`${this.apiUrl}/Roles/Edit`, request).pipe(
      catchError(error => {
        console.error('Error editing role:', error);
        return throwError(() => error);
      })
    );
  }

  deleteRole(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/Roles/Delete/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting role:', error);
        return throwError(() => error);
      })
    );
  }

  getRoles(): Observable<ApiResponse<RoleResponse[]>> {
    return this.http.get<ApiResponse<RoleResponse[]>>(`${this.apiUrl}/Roles/Role-List`).pipe(
      catchError(error => {
        console.error('Error fetching roles:', error);
        return throwError(() => error);
      })
    );
  }

  getRoleById(id: string): Observable<ApiResponse<RoleResponse>> {
    return this.http.get<ApiResponse<RoleResponse>>(`${this.apiUrl}/Roles/Role-By-Id/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching role:', error);
        return throwError(() => error);
      })
    );
  }

  // User Roles Management
  getUserRoles(userId: string): Observable<ApiResponse<UserRolesResponse>> {
    return this.http.get<ApiResponse<UserRolesResponse>>(`${this.apiUrl}/Roles/Manage-User-Roles/${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching user roles:', error);
        return throwError(() => error);
      })
    );
  }

  updateUserRoles(request: UpdateUserRolesRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/Roles/Update-User-Roles`, request).pipe(
      catchError(error => {
        console.error('Error updating user roles:', error);
        return throwError(() => error);
      })
    );
  }

  // User Claims Management
  getUserClaims(userId: string): Observable<ApiResponse<UserClaimsResponse>> {
    return this.http.get<ApiResponse<UserClaimsResponse>>(`${this.apiUrl}/Claims/Manage-User-Claims/${userId}`).pipe(
      catchError(error => {
        console.error('Error fetching user claims:', error);
        return throwError(() => error);
      })
    );
  }

  updateUserClaims(request: UpdateUserClaimsRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/Claims/Update-User-Claims`, request).pipe(
      catchError(error => {
        console.error('Error updating user claims:', error);
        return throwError(() => error);
      })
    );
  }
}
