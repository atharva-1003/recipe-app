import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'explorer',
    loadComponent: () => import('./features/explorer/explorer.component').then(m => m.ExplorerComponent)
  },
  {
    path: 'recipe/:id',
    loadComponent: () => import('./features/detail/detail.component').then(m => m.DetailComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
