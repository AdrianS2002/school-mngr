import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated, selectIsProfessor, selectIsStudent, selectSuccessMessage } from '../auth/store/auth.selectors';
import { selectAllCourses, selectCoursesError } from './store/courses.selectors';
import * as CourseActions from './store/courses.actions';

@Component({
  selector: 'app-courses',
  imports: [NgFor, NgIf, CommonModule],
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

  showFilter = false;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    // Încarcă cursurile la inițializare
    this.store.dispatch(CourseActions.loadCourses());
  }

  goToLogin() {
    this.router.navigate(['/auth']);
  }

  toggleFilterPopup() {
    this.showFilter = !this.showFilter;
  }



  enroll(courseId: string) {
    // aici poți adăuga un dispatch de acțiune de enroll sau redirect către o pagină de detalii
    console.log(`Enroll in course with id: ${courseId}`);
  }

  unenroll(courseId: string) {
    // aici poți adăuga un dispatch de acțiune de unenroll
    console.log(`Unenroll from course with id: ${courseId}`);
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
  addStudents(courseId: string) {
  }
}
