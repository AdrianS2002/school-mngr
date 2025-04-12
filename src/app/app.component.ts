import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthEffects } from './auth/store/auth.effects';
import { HeaderComponent } from "./header/header.component";
import { Course } from './database/models/course.model';
import { CoursesEffects } from './courses/store/courses.effects';
import { Enrollment } from './database/models/enrollment.model';
import { EnrollmentsEffects } from './courses/store/enrollments/enrollments.effects';
import { User } from './database/models/user.model';
import { UsersEffects } from './manage-users/store/users.effects';
import { GlobalLogEffects } from './global-log.effects';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  providers: [AuthEffects, CoursesEffects, EnrollmentsEffects, UsersEffects, GlobalLogEffects],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'school-mngr';
}
