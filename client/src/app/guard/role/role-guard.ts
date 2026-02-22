import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthServices } from '../../services/auth/auth-services';
import { catchError, map, of } from 'rxjs';

export const roleGuard: CanActivateFn = (route) => {
  const authService = inject(AuthServices);
  const router = inject(Router);

  const expectedRole = route.data['role'];

  return authService.getMe().pipe(
    map((resp: any) => {
      if (resp.user?.role === expectedRole) {
        return true;
      }

      return router.createUrlTree(['/login']);
    }),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};


