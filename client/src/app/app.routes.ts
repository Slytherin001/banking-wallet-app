import { Routes } from '@angular/router';
import { Login } from './common/login/login';
import { Layout } from './components/layout/layout';
import { authGuard } from './guard/auth/auth-guard';
import { roleGuard } from './guard/role/role-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },

  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: 'owner',
        canActivate: [roleGuard],
        data: { role: 'OWNER' },
        loadChildren: () => import('./pages/owner/owner-module').then((m) => m.OwnerModule),
      },
      {
        path: 'admin',
        canActivate: [roleGuard],
        data: { role: 'ADMIN' },
        loadChildren: () => import('./pages/admin/admin-module').then((m) => m.AdminModule),
      },
      {
        path: 'user',
        canActivate: [roleGuard],
        data: { role: 'USER' },
        loadChildren: () => import('./pages/user/user-module').then((m) => m.UserModule),
      },
    ],
  },

  {
    path: '**',
    redirectTo: '/login',
  },
];
