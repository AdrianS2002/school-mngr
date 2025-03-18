import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ContactComponent } from './contact/contact.component';

export const routes: Routes = [
    { path: 'auth', component: AuthComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: 'contact', component: ContactComponent },
];
