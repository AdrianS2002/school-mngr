import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../database/models/user.model';
import { Store } from '@ngrx/store';
import { selectIsAdmin, selectIsAuthenticated, selectIsProfessor, selectIsStudent, selectUser } from '../auth/store/auth.selectors';
import { Course } from '../database/models/course.model';
import { Router } from '@angular/router';
import { DatabaseService } from '../database/database.service';

@Component({
  selector: 'app-home',
  imports: [NgIf, CommonModule],
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit  {
  user$!: Observable<User | null>;
  
  isAuthenticated$!: Observable<boolean>;
  isProfessor$!: Observable<boolean>;
  isAdmin$!: Observable<boolean>;
  isStudent$!: Observable<boolean>;
  enrolledCourses: { course: Course, grade?: number }[] = [];

  constructor(
    private router: Router,
    private store: Store,
    private dbService: DatabaseService
  ) {}

  ngOnInit() {
    this.isAuthenticated$ = this.store.select(selectIsAuthenticated);
    this.isProfessor$ = this.store.select(selectIsProfessor);
    this.isStudent$ = this.store.select(selectIsStudent);
    this.isAdmin$ = this.store.select(selectIsAdmin);
    this.user$ = this.store.select(selectUser);
  
    this.store.select(selectUser).subscribe(user => {
      if (user) {
        this.dbService.getEnrollmentsForStudent(user.id).subscribe(enrollments => {
          const courseIds = enrollments.map(e => e.courseId);
          this.dbService.getAllCourses().subscribe(courses => {
            this.enrolledCourses = courses
              .filter(c => courseIds.includes(c.id))
              .map(course => {
                const enrollment = enrollments.find(e => e.courseId === course.id);
                return { course, grade: enrollment?.grade };
              });
          });
        });
      }
    });
  }
  

  navigateToLogin() {
    this.router.navigate(['/auth']);
  }

  navigateToCreateCourse() {
    this.router.navigate(['/add-course']);
  }

  navigateToCourses() {
    this.router.navigate(['/courses']);
  }

  navigateToManageUsers() {
    this.router.navigate(['/manage-users']);
  }
}


 

