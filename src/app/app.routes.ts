import { Routes } from '@angular/router';

export const routes: Routes = [

  {
    path: '',
    loadComponent: () =>
      import('./Pages/home/home').then(
        (m) => m.Home
      ),
  },

  {
    path: 'work',
    loadComponent: () =>
      import('./Pages/work/work').then(
        (m) => m.Work
      ),
  },

  {
    path: 'services',
    loadComponent: () =>
      import('./Pages/services/services').then(
        (m) => m.Services
      ),
  },

  {
    path: 'about',
    loadComponent: () =>
      import('./Pages/about/about').then(
        (m) => m.About
      ),
  },

  {
    path: 'contact',
    loadComponent: () =>
      import('./Pages/contact/contact').then(
        (m) => m.Contact
      ),
  },

  // 404
  {
    path: '**',
    loadComponent: () =>
      import('./Pages/notfound/notfound').then(
        (m) => m.Notfound
      ),
  },
];