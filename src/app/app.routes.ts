import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./components/users/users.component').then(m => m.UsersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'rick-morty',
    loadComponent: () => import('./components/rick-morty/rick-morty-new.component').then(m => m.RickMortyComponent),
    canActivate: [authGuard]
  },
  // Redirecciones para compatibilidad
  {
    path: 'dashboard',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
