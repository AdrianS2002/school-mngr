import { createReducer, on } from '@ngrx/store';
import * as EnrollmentActions from './enrollments.actions';
import { Enrollment } from '../../../database/models/enrollment.model';

export interface EnrollmentsState {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
  successMessage?: string;
}

const initialState: EnrollmentsState = {
  enrollments: [],
  loading: false,
  error: null
};

export const enrollmentsReducer = createReducer(
  initialState,
  on(EnrollmentActions.loadEnrollments, state => ({ ...state, loading: true })),
  on(EnrollmentActions.loadEnrollmentsSuccess, (state, { enrollments }) => ({
    ...state,
    enrollments,
    loading: false
  })),
  on(EnrollmentActions.loadEnrollmentsFail, (state, { error }) => ({ ...state, loading: false, error })),

  on(EnrollmentActions.enrollStudentSuccess, (state, { enrollment }) => ({
    ...state,
    enrollments: [...state.enrollments, enrollment]
  })),

  on(EnrollmentActions.unenrollStudentSuccess, (state, { enrollmentId }) => ({
    ...state,
    enrollments: state.enrollments.filter(e => e.id !== enrollmentId)
  })),
  on(EnrollmentActions.loadEnrollmentsForStudent, state => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(EnrollmentActions.loadEnrollmentsForStudentSuccess, (state, { enrollments }) => ({
    ...state,
    enrollments,
    loading: false
  })),
  
  on(EnrollmentActions.loadEnrollmentsForStudentFail, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),  

  on(EnrollmentActions.assignGradeSuccess, (state, { enrollmentId, grade }) => ({
    ...state,
    enrollments: state.enrollments.map(e =>
      e.id === enrollmentId
        ? new Enrollment(e.id, e.courseId, e.studentId, e.enrolledAt, grade)
        : e
    )
  })),

  on(EnrollmentActions.setEnrollmentSuccessMessage, (state, { message }) => ({
    ...state,
    successMessage: message
  })),
  on(EnrollmentActions.setEnrollmentErrorMessage, (state, { error }) => ({
    ...state,
    error: error
  }))
  
);
