import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as CourseActions from './courses.actions';
import { catchError, from, map, mergeMap, of, tap } from 'rxjs';
import { DatabaseService } from '../../database/database.service';
import { Router } from '@angular/router';
import { Course } from '../../database/models/course.model';
import { LogService } from '../../log.service';
import { LogActionType } from '../../log-action-type.enum';

@Injectable()
export class CoursesEffects {
  constructor(
    private actions$: Actions,
    private dbService: DatabaseService,
    private router: Router,
    private logService: LogService
  ) { }

  loadCourses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.loadCourses),
      mergeMap(() =>
        this.dbService.getAllCourses().pipe(
          map((courses) => CourseActions.loadCoursesSuccess({ courses })),
          catchError((err) =>
            of(CourseActions.loadCoursesFail({ error: err.message }))
          )
        )
      )
    )
  );

  addCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.addCourse),
      mergeMap(({ course }) =>
        this.dbService.createCourse({ ...course, createdAt: new Date() } as Course).pipe(
          map((courseId) => {
            const fullCourse: Course = {
              id: courseId,
              ...course,
              createdAt: new Date()
            };
            return CourseActions.addCourseSuccess({ course: fullCourse });
          }),
          tap(() => this.router.navigate(['/courses'])),
          catchError((err) =>
            of(CourseActions.addCourseFail({ error: err.message }))
          )
        )
      )
    )
  );

  updateCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.updateCourse),
      mergeMap(({ courseId, course }) =>
        from(this.dbService.updateCourse(courseId, course)).pipe(
          map(() => CourseActions.updateCourseSuccess({ courseId, course })),
          tap(() => this.router.navigate(['/courses'])),
          catchError((err) =>
            of(CourseActions.updateCourseFail({ error: err.message }))
          )
        )
      )
    )
  );

  deleteCourse$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourseActions.deleteCourse),
      mergeMap(({ courseId }) =>
        this.dbService.getCourseById(courseId).pipe(
          mergeMap((course) => {
            if (!course) {
              return of(CourseActions.deleteCourseFail({ error: 'Course not found' }));
            }
            return this.dbService.deleteCourse(courseId).pipe(
              map(() => CourseActions.deleteCourseSuccess({ courseId, course }))
            );
          })
        )
      )
    )
  );
}
