import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';
import { selectError, selectIsLoading } from './store/auth.selectors';
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

  constructor(private store: Store, private router: Router) {
    console.log("AuthComponent instantiated!"); // Debugging
  }

  ngOnInit() {
    this.isLoading$ = this.store.select(selectIsLoading);
    this.error$ = this.store.select(selectError);
  }

  onSubmit(form: NgForm) {
    if (!form.valid) return;
    const { email, password } = form.value;

    console.log("Dispatching Login Action", { email, password }); // Debugging
    this.store.dispatch(AuthActions.loginStart({ email, password }));
    
    form.reset();
  }
  onForgotPassword(emailInput: HTMLInputElement) {
    this.router.navigate(['/forgot-password']);
  }
  onSwitchMode(){}
}
