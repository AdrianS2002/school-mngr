import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as EnrollmentActions from './enrollments.actions';
import { DatabaseService } from '../../../database/database.service';
import { catchError, map, mergeMap, of } from 'rxjs';
import { Enrollment } from '../../../database/models/enrollment.model';
import { LogService } from '../../../log.service';
import { LogActionType } from '../../../log-action-type.enum';

@Injectable()
export class EnrollmentsEffects {
  constructor(private actions$: Actions, private dbService: DatabaseService, private logService: LogService) {}

  loadEnrollments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentActions.loadEnrollments),
      mergeMap(() =>
        this.dbService.getAllEnrollments().pipe(
          map(enrollments => EnrollmentActions.loadEnrollmentsSuccess({ enrollments })),
          catchError(error => of(EnrollmentActions.loadEnrollmentsFail({ error: error.message })))
        )
      )
    )
  );

  enrollStudent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentActions.enrollStudent),
      mergeMap(({ courseId, studentId }) =>
        this.dbService.enrollStudent(courseId, studentId).pipe(
          map((enrollmentId) =>
            EnrollmentActions.enrollStudentSuccess({
              enrollment: new Enrollment(
                enrollmentId,
                courseId,
                studentId,
                new Date()
              )
            })
          ),
          catchError(error =>
            of(EnrollmentActions.enrollStudentFail({ error: error.message }))
          )
        )
      )
    )
  );
  
  
  

  unenrollStudent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentActions.unenrollStudent),
      mergeMap(({ enrollmentId }) =>
        this.dbService.getEnrollmentById(enrollmentId).pipe(
          mergeMap((enrollment) => {
            if (!enrollment) {
              return of(EnrollmentActions.unenrollStudentFail({ error: 'Enrollment not found.' }));
            }
  
            return this.dbService.unenrollById(enrollmentId).pipe(
              map(() =>
                EnrollmentActions.unenrollStudentSuccess({
                  enrollmentId,
                  studentId: enrollment.studentId,
                  courseId: enrollment.courseId
                })
              )
            );
          }),
          catchError(error =>
            of(EnrollmentActions.unenrollStudentFail({ error: error.message }))
          )
        )
      )
    )
  );
  
  
  

  loadEnrollmentsForStudent$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentActions.loadEnrollmentsForStudent),
      mergeMap(({ studentId }) =>
        this.dbService.getEnrollmentsForStudent(studentId).pipe(
          map(enrollments =>
            EnrollmentActions.loadEnrollmentsForStudentSuccess({ enrollments })
          ),
          catchError(error =>
            of(EnrollmentActions.loadEnrollmentsForStudentFail({ error: error.message }))
          )
        )
      )
    )
  );

  assignGrade$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentActions.assignGrade),
      mergeMap(({ enrollmentId, grade }) =>
        this.dbService.getEnrollmentById(enrollmentId).pipe(
          mergeMap((enrollment) => {
            if (!enrollment) {
              return of(
                EnrollmentActions.assignGradeFail({ error: 'Enrollment not found' })
              );
            }
  
            return this.dbService.assignGrade(enrollmentId, grade).pipe(
              map(() =>
                EnrollmentActions.assignGradeSuccess({
                  enrollmentId,
                  grade,
                  studentId: enrollment.studentId,
                  courseId: enrollment.courseId
                })
              )
            );
          }),
          catchError(error =>
            of(EnrollmentActions.assignGradeFail({ error: error.message }))
          )
        )
      )
    )
  );
  
  
  

  enrollStudentSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentActions.enrollStudentSuccess),
      map(() => EnrollmentActions.setEnrollmentSuccessMessage({ message: 'Student enrolled successfully!' }))
    )
  );
  
  enrollStudentFailMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentActions.enrollStudentFail),
      map(({ error }) => EnrollmentActions.setEnrollmentErrorMessage({ error }))
    )
  );
  
  unenrollStudentSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentActions.unenrollStudentSuccess),
      map(() => EnrollmentActions.setEnrollmentSuccessMessage({ message: 'Student unenrolled successfully!' }))
    )
  );
  
  unenrollStudentFailMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EnrollmentActions.unenrollStudentFail),
      map(({ error }) => EnrollmentActions.setEnrollmentErrorMessage({ error }))
    )
  );
  
}
