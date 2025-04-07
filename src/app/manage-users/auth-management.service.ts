// auth-management.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthManagementService {
  private apiKey = 'AIzaSyCCfSeX7KbzeSLcD6z9sKJ8BJ4gxGJlTn0'; 

  constructor(private http: HttpClient) {}

  deleteUserFromAuth(userId: string): Observable<void> {
    const deleteUrl = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${this.apiKey}`;
    console.log('Attempting to delete user with idToken:', userId);
    return this.http.post<any>(deleteUrl, { idToken: userId }).pipe(
      tap(() => console.log('User deleted from Firebase Authentication')),
      catchError(this.handleError) 
    );
  }

  private handleError(error: any) {
    console.error('Error in AuthManagementService', error);
    return throwError(() => new Error('Error deleting user from Firebase Authentication'));
  }
}