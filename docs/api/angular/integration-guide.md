# Angular Integration Guide

Complete step-by-step guide for integrating Angular frontend with SchoolProject API.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Authentication Setup](#authentication-setup)
4. [HTTP Interceptors](#http-interceptors)
5. [Services Implementation](#services-implementation)
6. [Route Guards](#route-guards)
7. [Component Examples](#component-examples)
8. [Error Handling](#error-handling)
9. [Environment Configuration](#environment-configuration)

---

## Prerequisites

- Node.js (v18+ recommended)
- Angular CLI (`npm install -g @angular/cli`)
- SchoolProject API running at `https://localhost:7001`

---

## Project Setup

### 1. Install Required Packages
```bash
npm install
```

### 2. Project Structure
```
src/app/
├── Models/
│   ├── auth.models.ts
│   ├── user.models.ts
│   ├── role.models.ts
│   ├── email.models.ts
│   └── api-response.model.ts
├── Services/
│   ├── auth.service.ts
│   ├── token.service.ts
│   ├── user.service.ts
│   ├── authorization.service.ts
│   └── email.service.ts
├── Interceptors/
│   ├── auth.interceptor.ts
│   └── refresh-token.interceptor.ts
├── Guards/
│   ├── auth.guard.ts
│   └── role.guard.ts
└── ...
```

---

## Authentication Setup

### 1. Update Environment Configuration

**src/environments/environment.ts**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001'
};
```

**src/environments/environment.prod.ts**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.schoolproject.com'
};
```

### 2. Token Service (Already exists)

The `TokenService` handles storing and retrieving tokens from memory.

### 3. Auth Service Usage

```typescript
// In your login component
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onLogin()">
      <div>
        <label>Email:</label>
        <input formControlName="email" type="email" placeholder="email@example.com">
      </div>
      <div>
        <label>Password:</label>
        <input formControlName="password" type="password">
      </div>
      <button type="submit" [disabled]="loginForm.invalid">Login</button>
    </form>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onLogin() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authService.login(email!, password!).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Login failed', error);
          alert('Login failed: ' + error.message);
        }
      });
    }
  }
}
```

---

## HTTP Interceptors

### 1. Auth Interceptor (Already exists)

Adds Bearer token to all HTTP requests.

### 2. Refresh Token Interceptor (Already exists)

Handles automatic token refresh on 401 Unauthorized responses.

### 3. Register Interceptors

**src/app/app.config.ts**
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Interceptors/auth.interceptor';
import { refreshTokenInterceptor } from './Interceptors/refresh-token.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, refreshTokenInterceptor])
    )
  ]
};
```

---

## Services Implementation

### 1. User Service

Already created at `src/app/Services/user.service.ts`.

Usage example:
```typescript
// In your component
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { UserResponse } from '../../Models/user.models';

@Component({
  selector: 'app-user-list',
  template: `
    <div *ngFor="let user of users">
      {{ user.userName }} - {{ user.email }}
    </div>
  `
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  users: UserResponse[] = [];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers(1, 10).subscribe({
      next: (response) => {
        if (response.succeeded) {
          this.users = response.data.items;
        }
      },
      error: (error) => console.error('Error loading users', error)
    });
  }
}
```

### 2. Authorization Service

Already created at `src/app/Services/authorization.service.ts`.

### 3. Email Service

Already created at `src/app/Services/email.service.ts`.

---

## Route Guards

### 1. Auth Guard (Already exists)

Protects routes that require authentication.

### 2. Role Guard

Already created at `src/app/Guards/role.guard.ts`.

Usage in routes:
```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './Guards/auth.guard';
import { roleGuard } from './Guards/role.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'admin',
    component: AdminComponent,
    canActivate: [roleGuard],
    data: { roles: ['Admin'] }
  },
  { 
    path: 'users',
    component: UserListComponent,
    canActivate: [roleGuard],
    data: { roles: ['Admin'] }
  }
];
```

---

## Component Examples

### User Management Component

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../Services/user.service';
import { UserResponse } from '../../Models/user.models';
import { ApiResponse } from '../../Models/api-response.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Users</h2>
    <table>
      <tr *ngFor="let user of users">
        <td>{{ user.userName }}</td>
        <td>{{ user.email }}</td>
        <td>{{ user.roles.join(', ') }}</td>
        <td>
          <button (click)="deleteUser(user.id)">Delete</button>
        </td>
      </tr>
    </table>
    <div *ngIf="loading">Loading...</div>
  `
})
export class UserManagementComponent implements OnInit {
  private userService = inject(UserService);
  
  users: UserResponse[] = [];
  loading = false;

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.userService.getUsers(1, 10).subscribe({
      next: (response: ApiResponse<{items: UserResponse[]}>) => {
        if (response.succeeded) {
          this.users = response.data.items;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading users', error);
        this.loading = false;
      }
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          alert('User deleted successfully');
          this.loadUsers();
        },
        error: (error) => alert('Error deleting user: ' + error.message)
      });
    }
  }
}
```

---

## Error Handling

### Global Error Handling

Create an error interceptor for centralized error handling:

```typescript
// src/app/Interceptors/error.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      if (error.status === 401) {
        // Unauthorized - redirect to login
        router.navigate(['/login']);
      } else if (error.status === 403) {
        // Forbidden - redirect to unauthorized page
        router.navigate(['/unauthorized']);
      } else if (error.status === 500) {
        console.error('Server error:', error);
      }
      return throwError(() => error);
    })
  );
};
```

Register in `app.config.ts`:
```typescript
provideHttpClient(
  withInterceptors([
    authInterceptor, 
    refreshTokenInterceptor,
    errorInterceptor
  ])
)
```

---

## Environment Configuration

### Development Environment
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001'
};
```

### Production Environment
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.schoolproject.com'
};
```

### Using Environment Variables
```typescript
import { environment } from '../../environments/environment';

// In your service
private apiUrl = `${environment.apiUrl}/api/User`;
```

---

## Testing the Integration

### 1. Start the API
Ensure the SchoolProject API is running at `https://localhost:7001`.

### 2. Start Angular Dev Server
```bash
ng serve
```

### 3. Test Login Flow
1. Navigate to `http://localhost:4200/login`
2. Enter credentials: `admin@example.com` / `Password123!`
3. Should redirect to dashboard on success

### 4. Test API Calls
Open browser DevTools → Network tab to monitor API requests and responses.

---

## Common Issues & Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| CORS errors | API CORS not configured | Enable CORS in API with allowed origins |
| 401 Unauthorized | Token expired or invalid | Check token expiration, implement refresh |
| 403 Forbidden | Insufficient permissions | Verify user roles match required roles |
| Network error | API not running | Ensure API is running at configured URL |
| Null reference errors | Response data is null | Check API response structure, add null checks |

---

## Next Steps

1. Implement additional features (Student, Department, Instructor management)
2. Add form validation with reactive forms
3. Implement pagination component for list views
4. Add unit tests for services and components
5. Set up CI/CD pipeline for deployment
