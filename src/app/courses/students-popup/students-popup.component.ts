import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../database/database.service';
import { User } from '../../database/models/user.model';
import { Observable, pipe, take } from 'rxjs';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-students-popup',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './students-popup.component.html',
  styleUrl: './students-popup.component.css'
})
export class StudentsPopupComponent  {
  @Input() courseId!: string;
  @Output() close = new EventEmitter<void>();
  successMessage: string | null = null;
  errorMessage: string | null = null;
  students: User[] = [];
  enrolledStudent: string[] = [];

  constructor(private dbService: DatabaseService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['courseId'] && this.courseId) {
      this.loadStudents();
    }
  }
  loadStudents() {
    this.dbService.getAllUsers().subscribe(users => {
      this.students = users.filter(u => u.roles.includes('STUDENT'));
    });

    this.dbService.getEnrollmentsForCourse(this.courseId).subscribe(enrollments => {
      this.enrolledStudent = enrollments.map(e => e.studentId);
    });
  }
 

  enrollStudent(studentId: string) {
    this.dbService.enrollStudent(this.courseId, studentId).subscribe({
      next: () => {
        this.successMessage = 'Student enrolled successfully!';
        this.clearMessagesAfterDelay();
      },
      error: () => {
        this.errorMessage = 'Error enrolling student.';
        this.clearMessagesAfterDelay();
      }
    });
  }

  unenrollStudent(studentId: string) {
    this.dbService.leaveCourse(this.courseId, studentId).subscribe({
      next: () => {
        this.successMessage = 'Student unenrolled successfully!';
        this.clearMessagesAfterDelay();
      },
      error: () => {
        this.errorMessage = 'Error unenrolling student.';
        this.clearMessagesAfterDelay();
      }
    });
  }


  clearMessagesAfterDelay() {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 3000);
  }

  closePopup() {
    this.close.emit();
  }
}
