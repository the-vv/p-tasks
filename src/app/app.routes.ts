import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tasks-list',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: '', redirectTo: 'tasks-list', pathMatch: 'full',
  },
  {
    path: 'intro',
    loadComponent: () => import('./pages/intro/intro.page').then(m => m.IntroPage)
  },
];
