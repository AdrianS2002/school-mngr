import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { ContactComponent } from './contact/contact.component';
import { CoursesComponent } from './courses/courses.component';
import { HomeComponent } from './home/home.component';
import { AddEditCourseComponent } from './courses/add-edit-courses/add-edit-courses.component';


export const routes: Routes = [
    { path: 'auth', component: AuthComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: '', redirectTo: '/auth', pathMatch: 'full' },
    { path: 'contact', component: ContactComponent },
    { path: 'courses', component: CoursesComponent },
    { path: 'home', component: HomeComponent }
    { path: 'add-course', component:  AddEditCourseComponent},
    { path: 'edit-course/:id', component: AddEditCourseComponent },
];
