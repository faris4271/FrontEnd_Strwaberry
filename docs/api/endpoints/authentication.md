# Authentication Endpoints

Base URL: `https://localhost:7001/api/Authentication`

## Overview
Authentication endpoints handle user sign-in, token management, and password reset functionality. All endpoints return a standard `Response<T>` wrapper.

---

## 1. Sign In
**POST** `/SignIn`

Authenticates a user and returns JWT access token with refresh token.

### Request Body
```json
{
  "email": "string",
  "password": "string"
}
```

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": {
      "userName": "user@example.com",
      "tokenString": "refresh-token-guid",
      "expireAt": "2026-04-25T15:30:00Z"
    }
  },
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **400 Bad Request**: Invalid request body
- **401 Unauthorized**: Invalid email or password

---

## 2. Refresh Token
**POST** `/Refresh-Token`

Uses refresh token to obtain a new access token.

### Request Body
```json
{
  "tokenString": "string"
}
```

### Response (200 OK)
Same as Sign In response.

### Errors
- **400 Bad Request**: Invalid refresh token
- **401 Unauthorized**: Refresh token expired or invalid

---

## 3. Validate Token
**GET** `/Validate-Token`

Validates if the current JWT token is valid. Requires Bearer token in Authorization header.

### Headers
```
Authorization: Bearer {accessToken}
```

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Token is valid",
  "data": {
    "isValid": true,
    "userId": "user-id",
    "email": "user@example.com"
  },
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **401 Unauthorized**: Token is invalid or expired

---

## 4. Confirm Email
**GET** `/ConfirmEmail`

Confirms user's email address using token.

### Query Parameters
- `userId` (required): User ID
- `token` (required): Email confirmation token

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Email confirmed successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **400 Bad Request**: Invalid token or user ID

---

## 5. Send Reset Password Code
**POST** `/SendResetPasswordCode`

Sends a password reset code to user's email.

### Request Body
```json
{
  "email": "user@example.com"
}
```

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Reset code sent successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **400 Bad Request**: User not found

---

## 6. Confirm Reset Password Code
**GET** `/ConfirmResetPasswordCode`

Validates the password reset code.

### Query Parameters
- `userId` (required): User ID
- `code` (required): Reset code

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Code confirmed successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **400 Bad Request**: Invalid code

---

## 7. Reset Password
**POST** `/ResetPassword`

Resets user's password using the confirmed code.

### Request Body
```json
{
  "userId": "string",
  "code": "string",
  "newPassword": "string"
}
```

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Password reset successful",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **400 Bad Request**: Invalid request

---

## Angular Integration

### Login Flow
```typescript
// In your login component
this.authService.login(email, password).subscribe({
  next: (response) => {
    console.log('Login successful', response);
    this.router.navigate(['/dashboard']);
  },
  error: (error) => {
    console.error('Login failed', error);
  }
});
```

### Token Refresh Flow
The `refresh-token.interceptor.ts` handles automatic token refresh on 401 errors.

### Logout Flow
```typescript
// In your component
this.authService.logout();
```
