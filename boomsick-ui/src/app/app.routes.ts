import { Routes } from '@angular/router';
import { LibraryComponent} from './components/library/library.component';
import {Auth} from './components/auth/auth';

export const routes: Routes = [
  { path: '',component: Auth },
  { path: 'library', component: LibraryComponent }
];
