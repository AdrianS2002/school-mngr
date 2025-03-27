import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as UserActions from './users.actions';
import { DatabaseService } from '../../database/database.service';
import { catchError, delay, map, mergeMap, of, tap } from 'rxjs';

@Injectable()
export class UsersEffects {
  constructor(private actions$: Actions, private dbService: DatabaseService) {}

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.loadUsers),
      mergeMap(() =>
        this.dbService.getAllUsers().pipe(
          map(users => UserActions.loadUsersSuccess({ users })),
          catchError(error => of(UserActions.loadUsersFail({ error: error.message })))
        )
      )
    )
  );

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUser),
      mergeMap(({ userId }) =>
        this.dbService.deleteUser(userId).pipe(
          map(() => UserActions.deleteUserSuccess({ userId })),
          catchError(error => of(UserActions.deleteUserFail({ error: error.message })))
        )
      )
    )
  );

  assignRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.assignRole),
      mergeMap(({ userId, roles }) =>
        this.dbService.assignRoles(userId, roles).pipe(
          map(() => UserActions.assignRoleSuccess({ userId, roles })),
          catchError(error => of(UserActions.assignRoleFail({ error: error.message })))
        )
      )
    )
  );

  deleteUserSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.deleteUserSuccess),
      map(() => UserActions.setSuccessMessage({ message: 'User deleted successfully!' }))
    )
  );

  assignRoleSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.assignRoleSuccess),
      map(() => UserActions.setSuccessMessage({ message: 'Role updated successfully!' }))
    )
  );
  clearMessagesAfterDelay$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UserActions.setSuccessMessage, UserActions.setErrorMessage),
      delay(3000),
      map(() => UserActions.clearMessages())
    )
  );
}
