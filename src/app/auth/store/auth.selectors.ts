import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(selectAuthState, (state) => {
  console.log("Selector: User Selected", state.user); // Debugging
  return state.user;
});

export const selectIsLoading = createSelector(selectAuthState, (state) => {
  console.log("Selector: Loading State", state.loading); // Debugging
  return state.loading;
});

export const selectError = createSelector(selectAuthState, (state) => {
  console.log("Selector: Error Selected", state.authError); // Debugging
  return state.authError;
});
