import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';
import { selectError, selectIsLoading, selectSuccessMessage } from './store/auth.selectors';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  successMessage$!: Observable<string | null>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit() {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectError);
    this.successMessage$ = this.store.select(selectSuccessMessage);
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode) {
      this.store.dispatch(AuthActions.loginStart({ email, password }));
    } else {
      const confirmPassword = form.value.confirmPassword;
      if (password.trim() !== confirmPassword.trim()) {
        alert('Passwords do not match.');
        return;
      }
      if (!password || password.trim() === '') {
        alert('Please enter a password.');
        return;
      }
      this.store.dispatch(AuthActions.signupStart({ email, password }));
    }
    form.reset();
  }

  onForgotPassword(emailInput: HTMLInputElement) {
    this.router.navigate(['/forgot-password']);
  }
}
