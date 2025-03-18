import { createReducer, on } from '@ngrx/store';
import { User } from '../../database/models/user.model';
import * as AuthActions from './auth.actions';

export interface AuthState {
  user: User | null;
  authError: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  authError: null,
  loading: false
};

export const authReducer = createReducer(
  initialState,
  on(AuthActions.loginStart, (state) => {
    console.log("Reducer: Login Start"); // Debugging
    return { ...state, authError: null, loading: true };
  }),
  on(AuthActions.loginSuccess, (state, action) => {
    console.log("Reducer: Login Success", action.user); // Debugging
    return { ...state, user: action.user, authError: null, loading: false };
  }),
  on(AuthActions.loginFail, (state, action) => {
    console.error("Reducer: Login Fail", action.error); // Debugging
    return { ...state, authError: action.error, loading: false };
  })
);
