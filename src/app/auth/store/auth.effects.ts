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
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loginStart),
      mergeMap((action) =>
        this.authService.login(action.email, action.password).pipe(
          map((authRes) => {
            const expirationDate = new Date(new Date().getTime() + +authRes.expiresIn * 1000);
            const user = new User(authRes.email, authRes.localId, authRes.idToken, expirationDate, []);
            return AuthActions.loginSuccess({ user });
          }),
          catchError((error) => of(AuthActions.loginFail({ error: error.message })))
        )
      )
    )
  );

  loginRedirect$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.router.navigate(['/home']))
      ),
    { dispatch: false }
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signupStart),
      mergeMap((action) =>
        this.authService.signup(action.email, action.password).pipe(
          tap((res) => console.log('Signup effect received:', res)),
          map(() =>
            AuthActions.signupSuccess({ message: 'Verification email sent! Please check your inbox.' })
          ),
          catchError((error) => {
            console.error('Signup effect error:', error);
            return of(AuthActions.signupFail({ error: error.message }));
          })
        )
      )
    )
  );
  
  resetPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.resetPasswordStart),
      mergeMap(action =>
        this.authService.resetPassword(action.email).pipe(
          map(() =>
            AuthActions.resetPasswordSuccess({ message: 'If an account exists with this email, a reset link has been sent. Check your inbox!' })
          ),
          catchError((error) => of(AuthActions.resetPasswordFail({ error: error.message })))
        )
      )
    )
  );
  
}
