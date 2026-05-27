import { Routes, Router } from '@angular/router';
import { LibraryComponent } from './components/library/library.component';
import { Auth } from './components/auth/auth';
import { inject } from '@angular/core';

const authGuard = () => {
  const router = inject(Router);
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    return true;
  }
  router.navigate(['/']);
  return false;
};

const loginGuard = () => {
  const router = inject(Router);
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    router.navigate(['/library']);
    return false;
  }
  return true;
};

export const routes: Routes = [
  { path: '', component: Auth, canActivate: [loginGuard] },
  { path: 'library', component: LibraryComponent, canActivate: [authGuard] }
];
