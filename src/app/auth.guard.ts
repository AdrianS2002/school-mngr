import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { take, map, tap } from 'rxjs/operators';
import { AuthService } from '../app/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.user.pipe(
      take(1),
      map(user => {
        // Verifică dacă utilizatorul este autentificat și are rolul 'ADMIN'
        if (user && user.roles.includes('ADMIN')) {
          return true; // Permite accesul
        } else {
          return this.router.createUrlTree(['/auth']); // Redirecționează spre autentificare
        }
      }),
      tap(isAdmin => {
        if (isAdmin === true) {
          return;
        }
      })
    );
  }
}
