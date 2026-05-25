# User Management Endpoints

Base URL: `https://localhost:7001/api/User`

## Overview
User management endpoints for creating, reading, updating, and deleting users. Admin role required for most operations.

---

## 1. Create User
**POST** `/Create`

Creates a new user. Admin only.

### Request Body
```json
{
  "email": "user@example.com",
  "userName": "johndoe",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "User created successfully",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "userName": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "emailConfirmed": false,
    "roles": ["User"]
  },
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **400 Bad Request**: Invalid user data or user already exists
- **403 Forbidden**: Admin role required

---

## 2. Get Paginated Users
**GET** `/Paginated`

Retrieves a paginated list of users. Admin only.

### Query Parameters
- `page` (optional, default: 1): Page number
- `pageSize` (optional, default: 10): Items per page

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Users retrieved successfully",
  "data": {
    "items": [
      {
        "id": "user-id",
        "email": "user@example.com",
        "userName": "johndoe",
        "firstName": "John",
        "lastName": "Doe",
        "emailConfirmed": true,
        "roles": ["User"]
      }
    ],
    "page": 1,
    "pageSize": 10,
    "totalCount": 50,
    "totalPages": 5
  },
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **403 Forbidden**: Admin role required

---

## 3. Get User by ID
**GET** `/{id}`

Retrieves a specific user by ID. Admin or own profile.

### Path Parameters
- `id`: User ID

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "User retrieved successfully",
  "data": {
    "id": "user-id",
    "email": "user@example.com",
    "userName": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "emailConfirmed": true,
    "roles": ["User"]
  },
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **404 Not Found**: User not found
- **403 Forbidden**: Access denied

---

## 4. Edit User
**PUT** `/Edit`

Updates user information. Admin or own profile.

### Request Body
```json
{
  "id": "user-id",
  "email": "newemail@example.com",
  "userName": "newusername",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "User updated successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **400 Bad Request**: Invalid user data
- **404 Not Found**: User not found

---

## 5. Delete User
**DELETE** `/{id}`

Deletes a user by ID. Admin only.

### Path Parameters
- `id`: User ID

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "User deleted successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **404 Not Found**: User not found
- **403 Forbidden**: Admin role required

---

## 6. Change Password
**PUT** `/Change-Password`

Changes user's password. Admin or own profile.

### Request Body
```json
{
  "currentPassword": "OldPassword123!",
  "newPassword": "NewPassword123!",
  "confirmNewPassword": "NewPassword123!"
}
```

### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Password changed successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

### Errors
- **400 Bad Request**: Invalid password data
- **401 Unauthorized**: Current password is incorrect

---

## Angular Integration

### Using UserService
```typescript
// Inject the service
constructor(private userService: UserService) {}

// Create user
createUser() {
  const request: CreateUserRequest = {
    email: 'newuser@example.com',
    userName: 'newuser',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    firstName: 'New',
    lastName: 'User'
  };
  
  this.userService.createUser(request).subscribe({
    next: (response) => console.log('User created', response),
    error: (error) => console.error('Error', error)
  });
}

// Get paginated users
getUsers(page: number = 1) {
  this.userService.getUsers(page, 10).subscribe({
    next: (response) => {
      if (response.succeeded) {
        console.log('Users:', response.data.items);
      }
    }
  });
}

// Change password
changePassword() {
  const request: ChangePasswordRequest = {
    currentPassword: 'oldPass',
    newPassword: 'newPass',
    confirmNewPassword: 'newPass'
  };
  
  this.userService.changePassword(request).subscribe({
    next: () => console.log('Password changed'),
    error: (error) => console.error('Error', error)
  });
}
```
