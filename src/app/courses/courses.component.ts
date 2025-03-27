import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated, selectIsProfessor, selectIsStudent, selectSuccessMessage, selectUser } from '../auth/store/auth.selectors';
import { selectAllCourses, selectCoursesError } from './store/courses.selectors';
import * as EnrollmentActions from './store/enrollments/enrollments.actions';
import * as CourseActions from './store/courses.actions';
import { StudentsPopupComponent } from "./students-popup/students-popup.component";
import { DatabaseService } from '../database/database.service';
import { Observable } from 'rxjs';
import { Enrollment } from '../database/models/enrollment.model';
import { selectEnrollmentErrorMessage, selectEnrollmentsForCurrentUser, selectEnrollmentSuccessMessage } from './store/enrollments/enrollments.selectors';

@Component({
  selector: 'app-courses',
  imports: [NgFor, NgIf, CommonModule, StudentsPopupComponent],
  standalone: true,
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  courses$ = this.store.select(selectAllCourses);
  isAuthenticated$ = this.store.select(selectIsAuthenticated);
  isStudent$ = this.store.select(selectIsStudent);
  isProfessor$ = this.store.select(selectIsProfessor);
  successMessage$ = this.store.select(selectEnrollmentSuccessMessage);
  errorMessage$ = this.store.select(selectEnrollmentErrorMessage);
  userEnrollments$ = this.store.select(selectEnrollmentsForCurrentUser) as Observable<Enrollment[]>;
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showFilter = false;
  currentUserId: string | null = null;

  constructor(private store: Store, private router: Router, private dbService: DatabaseService) { }

  ngOnInit(): void {
    this.store.dispatch(CourseActions.loadCourses());
    this.store.select(selectUser).subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        this.store.dispatch(EnrollmentActions.loadEnrollmentsForStudent({ studentId: user.id }));
      }
    });

    this.store.dispatch(CourseActions.loadCourses());
  }

  goToLogin() {
    this.router.navigate(['/auth']);
  }

  toggleFilterPopup() {
    this.showFilter = !this.showFilter;
  }


  isUserEnrolled(courseId: string, enrollments: any[]): boolean {
    return enrollments.some(e => e.courseId === courseId);
  }


  enroll(courseId: string) {
    console.log("courseId");
    if (!this.currentUserId) return;
    this.store.dispatch(
      EnrollmentActions.enrollStudent({ courseId, studentId: this.currentUserId })
    );
  }

  unenroll(enrollmentId: string | null) {
    if (!enrollmentId) return;
    this.store.dispatch(
      EnrollmentActions.unenrollStudent({ enrollmentId })
    );
  }


  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000);
  }

  editCourse(courseId: string) {
    this.router.navigate(['/edit-course', courseId]);
  }

  getEnrollmentId(courseId: string, enrollments: Enrollment[]): string | null {
    const enrollment = enrollments.find(e => e.courseId === courseId && e.studentId === this.currentUserId);
    return enrollment ? enrollment.id : null;
  }

  deleteCourse(courseId: string) {
    this.store.dispatch(CourseActions.deleteCourse({ courseId }));
  }

  addCourse() {
    this.router.navigate(['/add-course']);
  }
  showStudentsPopup = false;
  selectedCourseId: string | null = null;

  addStudents(courseId: string) {
    this.selectedCourseId = courseId;
    this.showStudentsPopup = true;
  }

  closeStudentsPopup() {
    this.showStudentsPopup = false;
  }

}
