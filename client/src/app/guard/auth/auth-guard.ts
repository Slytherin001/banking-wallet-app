import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServices } from '../../services/auth/auth-services';
import { catchError, map, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthServices);
  const router = inject(Router);

  // 🔥 If user already loaded, don't call API again
  if (authService.currentUser) {
    return of(true);
  }

  return authService.getMe().pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
