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
          mergeMap((enrollmentId) =>
            this.dbService.getUserById(studentId).pipe(
              mergeMap((user) =>
                this.dbService.getCourseById(courseId).pipe(
                  map((course) => {
                    const email = user?.email || studentId;
                    const courseTitle = course?.title || courseId;
  
                    this.logService.log(
                      `Student ${email} enrolled in course "${courseTitle}"`,
                      email,
                      LogActionType.ENROLL,
                      { courseId, enrollmentId, courseTitle }
                    );
  
                    return EnrollmentActions.enrollStudentSuccess({
                      enrollment: new Enrollment(
                        enrollmentId,
                        courseId,
                        studentId,
                        new Date()
                      )
                    });
                  })
                )
              )
            )
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
              this.logService.log(
                `Tried to unenroll, but enrollment ${enrollmentId} was not found.`,
                'system',
                LogActionType.UNENROLL_FAILED,
                { enrollmentId }
              );
              return of(EnrollmentActions.unenrollStudentFail({ error: 'Enrollment not found' }));
            }
            return this.dbService.getUserById(enrollment.studentId).pipe(
              mergeMap((user) =>
                this.dbService.getCourseById(enrollment.courseId).pipe(
                  mergeMap((course) =>
                    this.dbService.unenrollById(enrollmentId).pipe(
                      map(() => {
                        const email = user?.email || enrollment.studentId;
                        const courseTitle = course?.title || enrollment.courseId;
  
                        this.logService.log(
                          `Student ${email} unenrolled from course "${courseTitle}"`,
                          email,
                          LogActionType.UNENROLL,
                          {
                            enrollmentId,
                            courseId: enrollment.courseId,
                            courseTitle
                          }
                        );
  
                        return EnrollmentActions.unenrollStudentSuccess({ enrollmentId });
                      })
                    )
                  )
                )
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
              this.logService.log(
                `Tried to assign grade ${grade}, but enrollment ${enrollmentId} was not found.`,
                'system',
                LogActionType.ASSIGN_GRADE_FAILED,
                { enrollmentId, grade }
              );
              return of(
                EnrollmentActions.assignGradeFail({ error: 'Enrollment not found' })
              );
            }
  
            return this.dbService.getUserById(enrollment.studentId).pipe(
              mergeMap((student) =>
                this.dbService.getCourseById(enrollment.courseId).pipe(
                  mergeMap((course) =>
                    this.dbService.assignGrade(enrollmentId, grade).pipe(
                      map(() => {
                        const courseTitle = course?.title || enrollment.courseId;
                        const studentEmail = student?.email || enrollment.studentId;
  
                        const userDataStr = localStorage.getItem('userData');
                        const professorEmail = userDataStr ? JSON.parse(userDataStr).email : 'unknown';
  
                        this.logService.log(
                          `Grade ${grade} assigned to ${studentEmail} for course "${courseTitle}" by ${professorEmail}`,
                          professorEmail,
                          LogActionType.ASSIGN_GRADE,
                          {
                            enrollmentId,
                            studentId: enrollment.studentId,
                            studentEmail,
                            courseId: enrollment.courseId,
                            courseTitle,
                            grade
                          }
                        );
  
                        return EnrollmentActions.assignGradeSuccess({ enrollmentId, grade });
                      })
                    )
                  )
                )
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
