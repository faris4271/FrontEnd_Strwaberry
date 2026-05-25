# Quick Start Guide - 5 Minutes to Integration

Get your Angular app connected to the SchoolProject API in under 5 minutes.

---

## Prerequisites Checklist

- [ ] Node.js installed (v18+)
- [ ] Angular CLI installed (`npm install -g @angular/cli`)
- [ ] SchoolProject API running at `https://localhost:7001`
- [ ] This Angular project set up

---

## Step 1: Verify Environment (30 seconds)

Check `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001'  // Ensure this matches your API URL
};
```

---

## Step 2: Verify Interceptors (30 seconds)

Check `src/app/app.config.ts` has the interceptors:
```typescript
import { authInterceptor } from './Interceptors/auth.interceptor';
import { refreshTokenInterceptor } from './Interceptors/refresh-token.interceptor';

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

## Step 3: Test Login (2 minutes)

Create a simple login component:

```typescript
// src/app/Components/login/login.component.ts
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input formControlName="email" type="email" placeholder="Email">
      <input formControlName="password" type="password" placeholder="Password">
      <button type="submit" [disabled]="form.invalid">Login</button>
    </form>
  `
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  onSubmit() {
    if (this.form.valid) {
      this.authService.login(this.form.value.email!, this.form.value.password!)
        .subscribe({
          next: () => this.router.navigate(['/dashboard']),
          error: (err) => alert('Login failed')
        });
    }
  }
}
```

---

## Step 4: Test API Call (2 minutes)

Create a test component to verify API connectivity:

```typescript
// src/app/Components/test-api/test-api.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';

@Component({
  selector: 'app-test-api',
  template: `
    <h2>API Test</h2>
    <button (click)="loadUsers()">Load Users</button>
    <div *ngIf="loading">Loading...</div>
    <ul>
      <li *ngFor="let user of users">{{ user.email }}</li>
    </ul>
    <div *ngIf="error" style="color: red">{{ error }}</div>
  `
})
export class TestApiComponent implements OnInit {
  private userService = inject(UserService);
  
  users: any[] = [];
  loading = false;
  error = '';

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.error = '';
    
    this.userService.getUsers(1, 10).subscribe({
      next: (response) => {
        if (response.succeeded) {
          this.users = response.data.items;
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users: ' + err.message;
        this.loading = false;
      }
    });
  }
}
```

---

## Step 5: Verify (1 minute)

1. Start the app: `ng serve`
2. Navigate to `http://localhost:4200`
3. Try logging in with valid credentials
4. Check browser DevTools → Network tab to see API requests

---

## Common Quick Fixes

### CORS Error?
Ensure API has CORS enabled:
```csharp
// In API Program.cs
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular",
        builder => builder
            .WithOrigins("http://localhost:4200")
            .AllowAnyMethod()
            .AllowAnyHeader());
});
```

### 401 Unauthorized?
- Check API is running
- Verify credentials are correct
- Check token is being sent in Authorization header

### Can't find services?
Run `ng serve` and check for compilation errors. Ensure all services are in `src/app/Services/`.

---

## You're Done!

Your Angular app is now integrated with the SchoolProject API. 

### Next Steps:
1. Explore the [Integration Guide](./integration-guide.md) for detailed patterns
2. Check the [API Documentation](../../endpoints/) for available endpoints
3. Review the [OpenAPI Spec](../../openapi.yaml) for complete API reference
