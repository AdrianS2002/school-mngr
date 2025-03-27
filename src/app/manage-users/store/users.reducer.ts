import { createReducer, on } from '@ngrx/store';
import * as UserActions from './users.actions';
import { User } from '../../database/models/user.model';

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

export const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  successMessage: null
};

export const usersReducer = createReducer(
  initialState,
  
  on(UserActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
 
  on(UserActions.loadUsersFail, (state, { error }) => ({
    ...state,
    error,
    loading: false
  })),

  on(UserActions.deleteUserSuccess, (state, { userId }) => ({
    ...state,
    users: state.users.filter(u => u.id !== userId),
    successMessage: 'User deleted successfully!'
  })),
  on(UserActions.deleteUserFail, (state, { error }) => ({
    ...state,
    error
  })),

  on(UserActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users: users.map(u => new User(
      u.email,
      u.id,
      '', 
      new Date(), 
      u.roles
    )),
    loading: false
  })),
  on(UserActions.assignRoleFail, (state, { error }) => ({
    ...state,
    error
  })),

  on(UserActions.setSuccessMessage, (state, { message }) => ({
    ...state,
    successMessage: message
  })),
  on(UserActions.setErrorMessage, (state, { message }) => ({
    ...state,
    error: message
  })),
  on(UserActions.clearMessages, (state) => ({
    ...state,
    successMessage: null,
    error: null
  }))
);
