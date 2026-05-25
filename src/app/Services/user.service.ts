import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../Models/api-response.model';
import { 
  CreateUserRequest, 
  EditUserRequest, 
  UserResponse, 
  ChangePasswordRequest,
  PaginatedUserResponse
} from '../Models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/User`;

  createUser(request: CreateUserRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.post<ApiResponse<UserResponse>>(`${this.apiUrl}/Create`, request).pipe(
      catchError(error => {
        console.error('Error creating user:', error);
        return throwError(() => error);
      })
    );
  }

  getUsers(page: number = 1, pageSize: number = 10): Observable<ApiResponse<PaginatedUserResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    return this.http.get<ApiResponse<PaginatedUserResponse>>(`${this.apiUrl}/Paginated`, { params }).pipe(
      catchError(error => {
        console.error('Error fetching users:', error);
        return throwError(() => error);
      })
    );
  }

  getUserById(id: string): Observable<ApiResponse<UserResponse>> {
    return this.http.get<ApiResponse<UserResponse>>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error fetching user:', error);
        return throwError(() => error);
      })
    );
  }

  updateUser(request: EditUserRequest): Observable<ApiResponse<UserResponse>> {
    return this.http.put<ApiResponse<UserResponse>>(`${this.apiUrl}/Edit`, request).pipe(
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      })
    );
  }

  deleteUser(id: string): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Error deleting user:', error);
        return throwError(() => error);
      })
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(`${this.apiUrl}/Change-Password`, request).pipe(
      catchError(error => {
        console.error('Error changing password:', error);
        return throwError(() => error);
      })
    );
  }
}
