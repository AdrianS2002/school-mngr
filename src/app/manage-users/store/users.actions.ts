import { createAction, props } from '@ngrx/store';
import { User } from '../../database/models/user.model';

export const loadUsers = createAction(
    '[Admin Users] Load Users'
);
export const loadUsersSuccess = createAction(
    '[Admin Users] Load Users Success',
    props<{ users: User[] }>()
);
export const loadUsersFail = createAction(
    '[Admin Users] Load Users Fail',
    props<{ error: string }>()
);

export const deleteUser = createAction(
    '[Admin Users] Delete User',
    props<{ userId: string }>()
);
export const deleteUserSuccess = createAction(
    '[Admin Users] Delete User Success',
    props<{ userId: string }>()
);
export const deleteUserFail = createAction(
    '[Admin Users] Delete User Fail',
    props<{ error: string }>()
);

export const assignRole = createAction(
    '[Admin Users] Assign Role',
    props<{ userId: string; roles: string[] }>()
);
export const assignRoleSuccess = createAction(
    '[Admin Users] Assign Role Success',
    props<{ userId: string; roles: string[] }>()
);
export const assignRoleFail = createAction(
    '[Admin Users] Assign Role Fail',
    props<{ error: string }>()
);

export const setSuccessMessage = createAction(
    '[Admin Users] Set Success Message',
    props<{ message: string }>()
);
export const setErrorMessage = createAction(
    '[Admin Users] Set Error Message',
    props<{ message: string }>()
);
export const clearMessages = createAction(
    '[Admin Users] Clear Messages'
);


