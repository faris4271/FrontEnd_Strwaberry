import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';
import { User } from '../Models/auth.models';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = (route.data['roles'] as string[]) || [];
  
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const currentUser: User | null = authService.getCurrentUser();
  
  if (!currentUser) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  if (!currentUser.roles || currentUser.roles.length === 0) {
    router.navigate(['/unauthorized']);
    return false;
  }

  const hasRequiredRole = requiredRoles.some(role => 
    currentUser.roles!.includes(role)
  );

  if (!hasRequiredRole) {
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};
