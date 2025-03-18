import { createAction, props } from '@ngrx/store';
import { User } from '../../database/models/user.model';

// Login
export const loginStart = createAction(
  '[Auth] Login Start',
  props<{ email: string; password: string }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);
export const loginFail = createAction(
  '[Auth] Login Fail',
  props<{ error: string }>()
);
