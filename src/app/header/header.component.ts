import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
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

    // this.authSubscription = this.authService.authStatus$.subscribe(status => {
    //   this.isLoggedIn = status;
    // });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth']); // Redirecționează către login
  }

  // Verifică dacă utilizatorul este logat
  checkLoginStatus() {
    
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
    this.authSubscription.unsubscribe(); // Evită memory leaks
  }
}