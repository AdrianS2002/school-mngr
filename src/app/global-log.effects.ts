// global-log.effects.ts
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { LogService } from './log.service';
import { Enrollment } from './database/models/enrollment.model';
import { LogActionType } from './log-action-type.enum';
import * as AuthActions from './auth/store/auth.actions';
import * as CourseActions from './courses/store/courses.actions';
import * as EnrollmentActions from './courses/store/enrollments/enrollments.actions';
import { DatabaseService } from './database/database.service';
import { from, of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class GlobalLogEffects {
    constructor(private actions$: Actions, private logService: LogService, private dbService: DatabaseService, private router: Router) { }

    logLogin$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.loginSuccess),
            tap(({ user }) => {
                this.logService.log(
                    `User ${user.email} logged in`,
                    user.email,
                    LogActionType.LOGIN
                );
            })
        ),
        { dispatch: false }
    );

    logSignup$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.signupSuccess),
            tap(() => {
                const userDataStr = localStorage.getItem('userData');
                const userEmail = userDataStr ? JSON.parse(userDataStr).email : 'unknown';
                this.logService.log(
                    `User ${userEmail} signed up`,
                    userEmail,
                    LogActionType.SIGNUP
                );
            })
        ),
        { dispatch: false }
    );

    logResetPassword$ = createEffect(() =>
        this.actions$.pipe(
            ofType(AuthActions.resetPasswordSuccess),
            tap(() => {
                const userDataStr = localStorage.getItem('userData');
                const userEmail = userDataStr ? JSON.parse(userDataStr).email : 'unknown';
                this.logService.log(
                    `Password reset link sent to ${userEmail}`,
                    userEmail,
                    LogActionType.PASSWORD_RESET
                );
            })
        ),
        { dispatch: false }
    );

    logEnrollStudent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EnrollmentActions.enrollStudentSuccess),
            mergeMap(({ enrollment }) =>
                this.dbService.getUserById(enrollment.studentId).pipe(
                    mergeMap((user) =>
                        this.dbService.getCourseById(enrollment.courseId).pipe(
                            tap((course) => {
                                const email = user?.email || enrollment.studentId;
                                const courseTitle = course?.title || enrollment.courseId;

                                this.logService.log(
                                    `Student ${email} enrolled in course "${courseTitle}"`,
                                    email,
                                    LogActionType.ENROLL,
                                    {
                                        courseId: enrollment.courseId,
                                        enrollmentId: enrollment.id,
                                        courseTitle
                                    }
                                );
                            })
                        )
                    )
                )
            )
        ),
        { dispatch: false }
    );

    logUnenrollStudent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EnrollmentActions.unenrollStudentSuccess),
            mergeMap(({ enrollmentId, studentId, courseId }) =>
                this.dbService.getUserById(studentId).pipe(
                    mergeMap((user) =>
                        this.dbService.getCourseById(courseId).pipe(
                            tap((course) => {
                                const email = user?.email || studentId;
                                const courseTitle = course?.title || courseId;

                                this.logService.log(
                                    `Student ${email} unenrolled from course "${courseTitle}"`,
                                    email,
                                    LogActionType.UNENROLL,
                                    { enrollmentId, courseId, courseTitle }
                                );
                            })
                        )
                    )
                )
            )
        ),
        { dispatch: false }
    );

    logAssignGrade$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EnrollmentActions.assignGradeSuccess),
            mergeMap(({ enrollmentId, grade, studentId, courseId }) =>
                this.dbService.getUserById(studentId).pipe(
                    mergeMap((student) =>
                        this.dbService.getCourseById(courseId).pipe(
                            tap((course) => {
                                const studentEmail = student?.email || studentId;
                                const courseTitle = course?.title || courseId;

                                const userDataStr = localStorage.getItem('userData');
                                const professorEmail = userDataStr ? JSON.parse(userDataStr).email : 'unknown';

                                this.logService.log(
                                    `Grade ${grade} assigned to ${studentEmail} for course "${courseTitle}" by ${professorEmail}`,
                                    professorEmail,
                                    LogActionType.ASSIGN_GRADE,
                                    {
                                        enrollmentId,
                                        studentId,
                                        studentEmail,
                                        courseId,
                                        courseTitle,
                                        grade
                                    }
                                );
                            })
                        )
                    )
                )
            )
        ),
        { dispatch: false }
    );


    logAddCourse$ = createEffect(
        () =>
            this.actions$.pipe(
                ofType(CourseActions.addCourseSuccess),
                tap(({ course }) => {
                    this.dbService.getUserById(course.professorId).subscribe((user) => {
                        const email = user?.email || course.professorId;

                        this.logService.log(
                            `Course "${course.title}" created by ${email}`,
                            email,
                            LogActionType.CREATE_COURSE,
                            { courseId: course.id }
                        );
                    });
                })
            ),
        { dispatch: false }
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

    logDeleteCourse$ = createEffect(() =>
        this.actions$.pipe(
          ofType(CourseActions.deleteCourseSuccess),
          mergeMap(({ courseId, course }) =>
            this.dbService.getUserById(course.professorId).pipe(
              tap((user) => {
                const email = user?.email || course.professorId;
                this.logService.log(
                  `Course "${course.title}" deleted by ${email}.`,
                  email,
                  LogActionType.DELETE_COURSE,
                  { courseId, courseTitle: course.title }
                );
              })
            )
          )
        ),
        { dispatch: false }
      );

}
