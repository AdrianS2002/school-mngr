import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EnrollmentsState } from './enrollments.reducer';

export const selectEnrollmentsState = createFeatureSelector<EnrollmentsState>('enrollments');

export const selectAllEnrollments = createSelector(
  selectEnrollmentsState,
  (state) => state.enrollments
);

export const selectEnrollmentsLoading = createSelector(
  selectEnrollmentsState,
  (state) => state.loading
);

export const selectEnrollmentsError = createSelector(
  selectEnrollmentsState,
  (state) => state.error
);

export const selectEnrollmentsForCurrentUser = createSelector(
  selectAllEnrollments,
  (enrollments) => enrollments
);
export const selectEnrollmentSuccessMessage = createSelector(
  selectEnrollmentsState,
  (state) => state.successMessage
);

export const selectEnrollmentErrorMessage = createSelector(
  selectEnrollmentsState,
  (state) => state.error
);