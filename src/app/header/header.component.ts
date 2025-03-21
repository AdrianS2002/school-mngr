import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../database/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authSubscription = this.authService.user.subscribe((user: User | null) => {
      this.isLoggedIn = !!user;   
      console.log('Header login state changed: ', this.isLoggedIn, user);
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']);
  }

  navigateToLogin() {
    this.router.navigate(['/auth']);
  }

  navigateToHome() {
    this.router.navigate(['/home']);
  }

  navigateToCourses() {
    this.router.navigate(['/courses']);
  }

  navigateToContact() {
    this.router.navigate(['/contact']);
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
