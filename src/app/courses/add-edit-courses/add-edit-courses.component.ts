import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { Store } from '@ngrx/store';
import { Router, ActivatedRoute } from '@angular/router';
import { selectUser } from '../../auth/store/auth.selectors';
import { selectAllCourses } from '../store/courses.selectors';
import * as CoursesActions from '../store/courses.actions';
import { Course } from '../../database/models/course.model';
import { FormsModule } from '@angular/forms';
import { selectIsLoading } from '../store/courses.selectors';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-edit-course',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-courses.component.html',
  styleUrl: './add-edit-courses.component.css'
})
export class AddEditCourseComponent implements OnInit {
  course = {
    title: '',
    description: '',
    professorId: ''
  };
  isEditMode = false;
  isLoading$!: Observable<boolean>;
  private courseId: string | null = null;

  constructor(private store: Store, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.route.paramMap.subscribe(params => {
      this.courseId = params.get('id');
      if (this.courseId) {
        this.isEditMode = true;
        // Caută cursul în store și setează valorile în form
        this.store.select(selectAllCourses).subscribe(courses => {
          const foundCourse = courses.find(c => c.id === this.courseId);
          if (foundCourse) {
            this.course.title = foundCourse.title;
            this.course.description = foundCourse.description;
            this.course.professorId = foundCourse.professorId;
          }
        });
      }
    });

    // Setăm professorId la inițializare
    this.store.select(selectUser).subscribe(user => {
      if (user) {
        this.course.professorId = user.id;
      }
    });
  }

  cancel() {
    this.router.navigate(['/courses']);
  }

  saveCourse() {
    console.log('Save course', this.course);
    if (this.course.title && this.course.description && this.course.professorId) {
      if (this.isEditMode && this.courseId) {
        // Dispatch update action
        this.store.dispatch(
          CoursesActions.updateCourse({
            courseId: this.courseId,
            course: {
              title: this.course.title,
              description: this.course.description
            }
          })
        );
      } else {
        this.store.dispatch(
          CoursesActions.addCourse({
            course: {
              title: this.course.title,
              description: this.course.description,
              professorId: this.course.professorId,
              isOwnedBy: function (professorId: string): boolean {
                throw new Error('Function not implemented.');
              }
            }
          })
        );
      }
    }
  }

  
}
