import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as AuthActions from './auth.actions';
import { AuthService } from '../auth.service';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../../database/models/user.model';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {
    console.log('AuthEffects instantiated', this.actions$);
  }

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      tap(action => console.log("Login Action Dispatched", action)), // Debugging
      mergeMap(action =>
        this.authService.login(action.email, action.password).pipe(
          map(authRes => {
            console.log("Login Successful!", authRes); // Debugging
            const expirationDate = new Date(new Date().getTime() + +authRes.expiresIn * 1000);
            const user = new User(authRes.email, authRes.localId, authRes.idToken, expirationDate, []);
            return AuthActions.loginSuccess({ user });
          }),
          catchError(error => {
            console.error("Login Failed", error); // Debugging
            return of(AuthActions.loginFail({ error: error.message }));
          })
        )
      )
    )
  );
}
