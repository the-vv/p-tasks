import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks-list',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: '', redirectTo: 'tasks-list', pathMatch: 'full',
  },
];
