import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../../database/database.service';
import { User } from '../../database/models/user.model';
import { Observable, pipe, take } from 'rxjs';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as EnrollmentActions from '../store/enrollments/enrollments.actions';
import { Store } from '@ngrx/store';
import { LogService } from '../../log.service';
import { LogActionType } from '../../log-action-type.enum';

@Component({
  selector: 'app-students-popup',
  standalone: true,
  imports: [CommonModule, NgFor, FormsModule],
  templateUrl: './students-popup.component.html',
  styleUrl: './students-popup.component.css'
})
export class StudentsPopupComponent  {
  @Input() courseId!: string;
  @Output() close = new EventEmitter<void>();
  successMessage: string | null = null;
  errorMessage: string | null = null;
  students: User[] = [];
  grades: { [studentId: string]: number } = {};
  enrolledStudent: { enrollmentId: string; studentId: string; grade?: number }[] = [];

  constructor(private dbService: DatabaseService, private store: Store, private logService: LogService) {}

  ngOnInit() {
    if (this.courseId) {
      console.log('Popup deschis pentru courseId:', this.courseId);
      this.loadStudents();
    }
  }
  loadStudents() {
    console.log('Loading students and enrollments...');
    this.dbService.getAllUsers().subscribe(users => {
      this.students = users.filter(u => u.roles.includes('STUDENT'));
      console.log('Students:', this.students);
    });

    this.dbService.getEnrollmentsForCourse(this.courseId).subscribe(enrollments => {
      console.log('Enrollments for course:', enrollments);
      this.enrolledStudent = enrollments.map(e => ({
        enrollmentId: e.id,
        studentId: e.studentId,
        grade: e.grade
      }));

      this.grades = {};
      enrollments.forEach(e => {
        if (e.grade !== undefined && e.grade !== null) {
          this.grades[e.studentId] = e.grade;
          console.log(`Setat grade pentru studentId ${e.studentId}:`, e.grade);
        }
      });

      console.log('Grades object după populare:', this.grades);
    });
  }

  enrollStudent(studentId: string) {
    this.dbService.enrollStudent(this.courseId, studentId).subscribe({
      next: (enrollmentId) => {
        // Obține emailul și titlul cursului
        this.dbService.getUserById(studentId).subscribe((user) => {
          const email = user?.email || studentId;
  
          this.dbService.getCourseById(this.courseId).subscribe((course) => {
            const courseTitle = course?.title || this.courseId;
  
            this.logService.log(
              `Student ${email} enrolled in course "${courseTitle}"`,
              email,
              LogActionType.ENROLL,
              { enrollmentId, courseId: this.courseId, courseTitle }
            );
          });
        });
  
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
    const enrollment = this.enrolledStudent.find(e => e.studentId === studentId);
    if (!enrollment) {
      this.errorMessage = 'Enrollment not found for this student.';
      this.clearMessagesAfterDelay();
      return;
    }
  
    this.dbService.unenrollById(enrollment.enrollmentId).subscribe({
      next: () => {
        this.dbService.getUserById(studentId).subscribe((user) => {
          const email = user?.email || studentId;
  
          this.dbService.getCourseById(this.courseId).subscribe((course) => {
            const courseTitle = course?.title || this.courseId;
  
            this.logService.log(
              `Student ${email} unenrolled from course "${courseTitle}"`,
              email,
              LogActionType.UNENROLL,
              {
                enrollmentId: enrollment.enrollmentId,
                courseId: this.courseId,
                courseTitle
              }
            );
          });
        });
  
        this.successMessage = 'Student unenrolled successfully!';
        this.clearMessagesAfterDelay();
        this.loadStudents();
      },
      error: () => {
        this.errorMessage = 'Error unenrolling student.';
        this.clearMessagesAfterDelay();
      }
    });
  }
  

  assignGradeToStudent(studentId: string) {
    const enrollment = this.enrolledStudent.find(e => e.studentId === studentId);
    if (!enrollment) {
      this.errorMessage = 'Enrollment not found for this student.';
      this.clearMessagesAfterDelay();
      return;
    }
  
    const enrollmentId = enrollment.enrollmentId;
    const grade = this.grades[studentId];
  
    if (grade < 1 || grade > 10) {
      this.errorMessage = "Grade must be between 1 and 10.";
      this.clearMessagesAfterDelay();
      return;
    }
  
    this.store.dispatch(
      EnrollmentActions.assignGrade({ enrollmentId, grade })
    );
    this.successMessage = `Grade ${grade} assigned successfully.`;
    this.clearMessagesAfterDelay();
  }
  

  isStudentEnrolled(studentId: string): boolean {
    return this.enrolledStudent.some(e => e.studentId === studentId);
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
