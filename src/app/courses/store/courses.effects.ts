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
  ) {}

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
          mergeMap((courseId) =>
            this.dbService.getUserById(course.professorId).pipe(
              map((user) => {
                const fullCourse: Course = {
                  id: courseId,
                  ...course,
                  createdAt: new Date()
                };
  
                const email = user?.email || course.professorId;
  
                this.logService.log(
                  `Course "${course.title}" created by ${email}`,
                  email,
                  LogActionType.CREATE_COURSE,
                  { courseId }
                );
  
                return CourseActions.addCourseSuccess({ course: fullCourse });
              })
            )
          ),
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
        this.dbService.getCourseById(courseId).pipe(
          mergeMap((existingCourse) => {
            if (!existingCourse) {
              this.logService.log(
                `Attempted to update course "${courseId}", but it was not found.`,
                'system',
                LogActionType.UPDATE_COURSE_FAILED,
                { courseId }
              );
              return of(CourseActions.updateCourseFail({ error: 'Course not found' }));
            }
  
            return this.dbService.getUserById(existingCourse.professorId).pipe(
              mergeMap((user) =>
                from(this.dbService.updateCourse(courseId, course)).pipe(
                  map(() => {
                    const email = user?.email || existingCourse.professorId;
  
                    this.logService.log(
                      `Course "${existingCourse.title}" updated by ${email}`,
                      email,
                      LogActionType.UPDATE_COURSE,
                      { courseId, updates: course }
                    );
  
                    return CourseActions.updateCourseSuccess({ courseId, course });
                  })
                )
              )
            );
          }),
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
              this.logService.log(
                `Attempted to delete course "${courseId}", but it was not found.`,
                'system',
                LogActionType.DELETE_COURSE_FAILED,
                { courseId }
              );
              return of(CourseActions.deleteCourseFail({ error: 'Course not found' }));
            }
  
            return this.dbService.getUserById(course.professorId).pipe(
              mergeMap((user) =>
                this.dbService.deleteCourse(courseId).pipe(
                  map(() => {
                    const email = user?.email || course.professorId;
  
                    this.logService.log(
                      `Course "${course.title}" deleted by ${email}.`,
                      email,
                      LogActionType.DELETE_COURSE,
                      { courseId }
                    );
  
                    return CourseActions.deleteCourseSuccess({ courseId });
                  })
                )
              )
            );
          }),
          catchError((err) =>
            of(CourseActions.deleteCourseFail({ error: err.message }))
          )
        )
      )
    )
  );
  
  
  
  
}
