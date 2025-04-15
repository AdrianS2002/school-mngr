import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { User } from '../database/models/user.model';
import { DatabaseService } from '../database/database.service';
import { Course } from '../database/models/course.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;

  searchQuery = '';
  allCourses: Course[] = [];
  filteredCourses: Course[] = [];

  constructor(private authService: AuthService, private router: Router, private dbService: DatabaseService) { 
    this.dbService.getAllCourses().subscribe(courses => {
      this.allCourses = courses;
    });
  }

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
  onSearchChange() {
    const query = this.searchQuery.toLowerCase().trim();
    if (query.length === 0) {
      this.filteredCourses = [];
      return;
    }

    this.filteredCourses = this.allCourses.filter(course =>
      course.title.toLowerCase().includes(query)
    );
  }

  navigateToCourse(courseId: string) {
    this.router.navigate(['/courses', courseId]);
    this.filteredCourses = [];
    this.searchQuery = '';
  }
}
