import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as AuthActions from '../store/auth.actions';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectError, selectIsLoading, selectSuccessMessage } from '../store/auth.selectors';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent implements OnInit {
  email = '';
  error$!: Observable<string | null>;
  successMessage$!: Observable<string | null>;
  isLoading$!: Observable<boolean>;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    this.error$ = this.store.select(selectError);
    this.successMessage$ = this.store.select(selectSuccessMessage);
    this.isLoading$ = this.store.select(selectIsLoading);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;

    this.store.dispatch(AuthActions.resetPasswordStart({ email: this.email }));
  }

  onBackToLogin() {
    this.router.navigate(['/auth']);
  }
}