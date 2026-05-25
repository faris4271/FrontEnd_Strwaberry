# Authorization & Roles Endpoints

Base URL: `https://localhost:7001/api/AuthorizationRouting`

## Overview
Authorization endpoints handle role and claim management. All endpoints require Admin role.

---

## Role Management

### 1. Create Role
**POST** `/Roles/Create`

Creates a new role. Admin only.

#### Request Body
```json
{
  "roleName": "Administrator"
}
```

#### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Role created successfully",
  "data": {
    "id": "role-id",
    "roleName": "Administrator",
    "users": []
  },
  "errors": null,
  "statusCode": 200
}
```

#### Errors
- **400 Bad Request**: Invalid role name or role already exists
- **403 Forbidden**: Admin role required

---

### 2. Edit Role
**POST** `/Roles/Edit`

Updates an existing role. Admin only.

#### Request Body
```json
{
  "id": "role-id",
  "roleName": "Updated Role Name"
}
```

#### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Role updated successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

#### Errors
- **400 Bad Request**: Role not found or invalid data
- **403 Forbidden**: Admin role required

---

### 3. Delete Role
**DELETE** `/Roles/Delete/{id}`

Deletes a role by ID. Admin only.

#### Path Parameters
- `id`: Role ID

#### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Role deleted successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

#### Errors
- **400 Bad Request**: Role not found
- **403 Forbidden**: Admin role required

---

### 4. List All Roles
**GET** `/Roles/Role-List`

Retrieves all roles. Admin only.

#### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Roles retrieved successfully",
  "data": [
    {
      "id": "role-id-1",
      "roleName": "Admin",
      "users": ["user-id-1", "user-id-2"]
    },
    {
      "id": "role-id-2",
      "roleName": "User",
      "users": ["user-id-3", "user-id-4"]
    }
  ],
  "errors": null,
  "statusCode": 200
}
```

#### Errors
- **403 Forbidden**: Admin role required

---

### 5. Get Role by ID
**GET** `/Roles/Role-By-Id/{id}`

Retrieves a specific role by ID. Admin only.

#### Path Parameters
- `id`: Role ID

#### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "Role retrieved successfully",
  "data": {
    "id": "role-id",
    "roleName": "Admin",
    "users": ["user-id-1"]
  },
  "errors": null,
  "statusCode": 200
}
```

#### Errors
- **404 Not Found**: Role not found
- **403 Forbidden**: Admin role required

---

## User Roles Management

### 6. Get User Roles
**GET** `/Roles/Manage-User-Roles/{userId}`

Retrieves all roles assigned to a user. Admin only.

#### Path Parameters
- `userId`: User ID

#### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "User roles retrieved successfully",
  "data": {
    "userId": "user-id",
    "roles": ["Admin", "User"]
  },
  "errors": null,
  "statusCode": 200
}
```

#### Errors
- **404 Not Found**: User not found
- **403 Forbidden**: Admin role required

---

### 7. Update User Roles
**PUT** `/Roles/Update-User-Roles`

Updates roles for a user. Admin only.

#### Request Body
```json
{
  "userId": "user-id",
  "roles": ["Admin", "User"]
}
```

#### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "User roles updated successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

#### Errors
- **400 Bad Request**: Invalid request
- **403 Forbidden**: Admin role required

---

## User Claims Management

### 8. Get User Claims
**GET** `/Claims/Manage-User-Claims/{userId}`

Retrieves all claims assigned to a user. Admin only.

#### Path Parameters
- `userId`: User ID

#### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "User claims retrieved successfully",
  "data": {
    "userId": "user-id",
    "claims": [
      {
        "type": "Permission",
        "value": "CanEditUsers"
      },
      {
        "type": "Permission",
        "value": "CanDeleteUsers"
      }
    ]
  },
  "errors": null,
  "statusCode": 200
}
```

#### Errors
- **404 Not Found**: User not found
- **403 Forbidden**: Admin role required

---

### 9. Update User Claims
**PUT** `/Claims/Update-User-Claims`

Updates claims for a user. Admin only.

#### Request Body
```json
{
  "userId": "user-id",
  "claims": [
    {
      "type": "Permission",
      "value": "CanEditUsers"
    },
    {
      "type": "Permission",
      "value": "CanViewReports"
    }
  ]
}
```

#### Response (200 OK)
```json
{
  "succeeded": true,
  "message": "User claims updated successfully",
  "data": null,
  "errors": null,
  "statusCode": 200
}
```

#### Errors
- **400 Bad Request**: Invalid request
- **403 Forbidden**: Admin role required

---

## Angular Integration

### Using AuthorizationService
```typescript
// Inject the service
constructor(private authzService: AuthorizationService) {}

// Create a role
createRole() {
  const request: CreateRoleRequest = { roleName: 'Manager' };
  this.authzService.createRole(request).subscribe({
    next: (response) => console.log('Role created', response),
    error: (error) => console.error('Error', error)
  });
}

// Get all roles
getRoles() {
  this.authzService.getRoles().subscribe({
    next: (response) => {
      if (response.succeeded) {
        console.log('Roles:', response.data);
      }
    }
  });
}

// Update user roles
updateUserRoles() {
  const request: UpdateUserRolesRequest = {
    userId: 'user-id',
    roles: ['Admin', 'User']
  };
  this.authzService.updateUserRoles(request).subscribe({
    next: () => console.log('Roles updated'),
    error: (error) => console.error('Error', error)
  });
}

// Update user claims
updateUserClaims() {
  const request: UpdateUserClaimsRequest = {
    userId: 'user-id',
    claims: [
      { type: 'Permission', value: 'CanEditUsers' }
    ]
  };
  this.authzService.updateUserClaims(request).subscribe({
    next: () => console.log('Claims updated'),
    error: (error) => console.error('Error', error)
  });
}
```

### Using RoleGuard
```typescript
// In your routes
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [RoleGuard],
  data: { roles: ['Admin'] }
}
```
