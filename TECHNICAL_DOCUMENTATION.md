# Technical Documentation: FrontEndStrwaberry

## Project Overview
FrontEndStrwaberry is a professional Angular-based frontend application designed to provide a robust interface for managing users, authentication, authorization, and communication services. The application implements a Role-Based Access Control (RBAC) system, ensuring that sensitive operations (like user and role management) are restricted to administrators, while general features remain available to authenticated users.

The project is architected as a Single Page Application (SPA) that interacts with a RESTful backend API, utilizing JWT (JSON Web Tokens) for secure authentication and an interceptor-based approach for seamless token refreshing.

---

## Technologies Used

### Core Stack
- **Programming Language:** TypeScript (~5.9.2)
- **Framework:** Angular (^21.1.0)
- **Runtime Environment:** Node.js (managed via npm 10.9.2)
- **Build Tool:** Angular CLI (^21.1.2)

### Styling & UI
- **CSS Framework:** Tailwind CSS (^4.2.1)
- **CSS Processing:** PostCSS (^8.5.8)
- **Design Philosophy:** Utility-first CSS for responsive and maintainable UI components.

### Asynchronous Programming
- **Library:** RxJS (~7.8.0)
- **Implementation:** Extensive use of Observables and operators for handling API requests and state updates.

---

## Libraries and Dependencies

### Angular Ecosystem
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `@angular/core` | `^21.1.0` | Core framework functionality |
| `@angular/common` | `^21.1.0` | Common Angular directives and pipes |
| `@angular/forms` | `^21.1.0` | Reactive and Template-driven forms |
| `@angular/router` | `^21.1.0` | Client-side routing and navigation |
| `@angular/platform-browser` | `^21.1.0` | Browser platform integration |

### Third-Party Packages
| Package | Version | Purpose |
| :--- | :--- | :--- |
| `tailwindcss` | `^4.2.1` | Utility-first CSS framework for rapid styling |
| `postcss` | `^8.5.8` | Tool for transforming CSS with JavaScript plugins |
| `@tailwindcss/postcss` | `^4.2.1` | PostCSS plugin for Tailwind CSS integration |
| `rxjs` | `~7.8.0` | Reactive extensions for asynchronous data streams |
| `tslib` | `^2.3.0` | TypeScript runtime helper library |

---

## Installation Guide

### Prerequisites
- **Node.js:** Ensure you have the latest LTS version of Node.js installed.
- **npm:** Comes bundled with Node.js.
- **Angular CLI:** Install globally via `npm install -g @angular/cli`.

### Setup Steps
1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd FrontEnd_Strwaberry
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   ng serve
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:4200/`.

---

## Usage Instructions

### Development Workflow
- **Run Application:** `npm start` or `ng serve`. The application will automatically reload on changes.
- **Build for Production:** `ng build`. This generates optimized artifacts in the `dist/` directory.
- **Unit Testing:** `ng test`. Executes the test suite to ensure code stability.
- **Code Generation:** Use the Angular CLI for scaffolding:
  - Component: `ng generate component <name>`
  - Service: `ng generate service <name>`
  - Guard: `ng generate guard <name>`

### Application Architecture
The project follows a modular structure under `src/app/`:
- **Core/**: Singleton services and components used globally (e.g., Header).
- **Services/**: Business logic and API communication layers.
- **Models/**: TypeScript interfaces and types for data consistency.
- **Guards/**: Route protection based on authentication and roles.
- **Interceptors/**: HTTP request/response modifications (e.g., adding JWT tokens, handling 401 refresh).
- **Components/**: Feature-specific UI elements.

---

## API Reference

The application integrates with a backend API located at `https://localhost:7001`.

### 1. Authentication (`/api/Authentication`)
Handles user identity and session management.
- **Sign In:** `POST /SignIn` - Authenticates user and returns JWT.
- **Token Refresh:** `POST /Refresh-Token` - Exchanges refresh token for a new access token.
- **Password Reset:** `POST /SendResetPasswordCode` and `POST /ResetPassword`.

### 2. User Management (`/api/User`)
Admin-centric endpoints for managing user profiles.
- **User CRUD:** `POST /Create`, `GET /Paginated`, `GET /{id}`, `PUT /Edit`, `DELETE /{id}`.
- **Security:** `PUT /Change-Password`.

### 3. Authorization (`/api/AuthorizationRouting`)
Manages roles and permissions.
- **Role Management:** Create, Edit, Delete, and List roles.
- **Assignments:** Update user roles and claims (`PUT /Roles/Update-User-Roles`, `PUT /Claims/Update-User-Claims`).

### 4. Email Service (`/api/EmailsRoute`)
Utility for sending communications.
- **Send Email:** `POST /SendEmail` (Supports plain text and HTML).

---

## Contribution Guidelines

### Coding Standards
- **TypeScript:** Use strict typing. Avoid `any` wherever possible.
- **Styling:** Use Tailwind CSS utility classes. Avoid writing custom CSS unless absolutely necessary.
- **Naming:** Follow camelCase for variables/functions and PascalCase for classes/components.

### Development Process
1. **Branching:** Create a feature branch from `main` (e.g., `feature/user-profile-update`).
2. **Implementation:** Follow the existing project structure. Place logic in Services and UI in Components.
3. **Verification:** Run `ng test` and perform manual verification.
4. **Linting:** Ensure code adheres to the project's Prettier configuration.
5. **Pull Request:** Submit a PR with a clear description of changes and screenshots if applicable.
