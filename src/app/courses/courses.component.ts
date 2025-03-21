import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated, selectIsProfessor, selectIsStudent, selectSuccessMessage, selectUser } from '../auth/store/auth.selectors';
import { selectAllCourses, selectCoursesError } from './store/courses.selectors';
import * as CourseActions from './store/courses.actions';
import { StudentsPopupComponent } from "./students-popup/students-popup.component";
import { DatabaseService } from '../database/database.service';

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
  successMessage$ = this.store.select(selectSuccessMessage);
  errorMessage$ = this.store.select(selectCoursesError);
  successMessage: string | null = null;
  errorMessage: string | null = null;
  showFilter = false;
  currentUserId: string | null = null;
  userEnrollments: string[] = [];
  constructor(private store: Store, private router: Router, private dbService: DatabaseService) { }

  ngOnInit(): void {
    this.store.dispatch(CourseActions.loadCourses());
    this.store.select(selectUser).subscribe(user => {
      if (user) {
        this.currentUserId = user.id;
        this.dbService.getEnrollmentsForStudent(user.id).subscribe(enrollments => {
          this.userEnrollments = enrollments.map(e => e.courseId);
        });
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


  enroll(courseId: string) {
    if (!this.currentUserId) return;
    this.dbService.enrollStudent(courseId, this.currentUserId).subscribe({
      next: () => {
        this.successMessage = 'Student enrolled successfully!';
        this.clearMessagesAfterDelay();
      },
      error: () => {
        this.errorMessage = 'Error enrolling student.';
        this.clearMessagesAfterDelay();
      }
    });
  }

  unenroll(courseId: string) {
    if (!this.currentUserId) return;
    this.dbService.leaveCourse(courseId, this.currentUserId).subscribe({
      next: () => {
        this.successMessage = 'Student unenrolled successfully!';
        this.clearMessagesAfterDelay();
      },
      error: () => {
        this.errorMessage = 'Error unenrolling student.';
        this.clearMessagesAfterDelay();
      }
    });
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
