import { createAction, props } from '@ngrx/store';
import { Enrollment } from '../../../database/models/enrollment.model';

export const loadEnrollments = createAction(
    '[Enrollments] Load Enrollments'
);
export const loadEnrollmentsSuccess = createAction(
    '[Enrollments] Load Enrollments Success',
    props<{ enrollments: Enrollment[]

    }>());
export const loadEnrollmentsFail = createAction(
    '[Enrollments] Load Enrollments Fail', 
    props<{ error: string }>()
);

export const loadEnrollmentsForStudent = createAction(
    '[Enrollments] Load Enrollments For Student',
    props<{ studentId: string }>()
  );
  
  export const loadEnrollmentsForStudentSuccess = createAction(
    '[Enrollments] Load Enrollments For Student Success',
    props<{ enrollments: Enrollment[] }>()
  );
  
  export const loadEnrollmentsForStudentFail = createAction(
    '[Enrollments] Load Enrollments For Student Fail',
    props<{ error: string }>()
  );

export const enrollStudent = createAction(
    '[Enrollments] Enroll Student',
    props<{ courseId: string; studentId: string }>()
);
export const enrollStudentSuccess = createAction(
    '[Enrollments] Enroll Student Success',
     props<{ enrollment: Enrollment }>()
    
);
export const enrollStudentFail = createAction(
    '[Enrollments] Enroll Student Fail',
     props<{ error: string }>()
);

export const unenrollStudent = createAction(
    '[Enrollments] Unenroll Student',
    props<{ enrollmentId: string }>()
  );
  
  export const unenrollStudentSuccess = createAction(
    '[Enrollments] Unenroll Student Success',
    props<{ enrollmentId: string; studentId: string; courseId: string }>()
  );
  
export const unenrollStudentFail = createAction(
    '[Enrollments] Unenroll Student Fail', 
    props<{ error: string }>()
);

export const assignGrade = createAction(
    '[Enrollments] Assign Grade',
     props<{ enrollmentId: string; grade: number }>()
);
export const assignGradeSuccess = createAction(
  '[Enrollments] Assign Grade Success',
  props<{ enrollmentId: string; grade: number; studentId: string; courseId: string }>()
);
export const assignGradeFail = createAction(
    '[Enrollments] Assign Grade Fail',
    props<{ error: string }>()
);


export const setEnrollmentSuccessMessage = createAction(
  '[Enrollments] Set Success Message',
  props<{ message: string }>()
);

export const setEnrollmentErrorMessage = createAction(
  '[Enrollments] Set Error Message',
  props<{ error: string }>()
);