import { Injectable} from "@angular/core";
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "@angular/fire/firestore";
import { Observable, catchError, from, map, mergeMap, tap, throwError } from "rxjs";
import { User } from "./models/user.model";
import { Course } from "./models/course.model";
import { Enrollment } from "./models/enrollment.model";
import { AuthManagementService } from "../manage-users/auth-management.service";


@Injectable({ providedIn: 'root' })
export class DatabaseService {
  constructor(private firestore: Firestore, private authService: AuthManagementService) {}

  // USERS MANAGEMENT

  createUser(user: User): Observable<void> {
    const userRef = doc(this.firestore, `users/${user.id}`);
    return from(setDoc(userRef, { 
      email: user.email, 
      roles: user.roles, 
      createdAt: new Date() 
    }));
  }

  saveUserProfile(userId: string, email: string, hashedPassword: string): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(setDoc(userRef, {
      email,
      hashedPassword,
      roles: ['STUDENT'], // de exemplu, implicit toți utilizatorii noi pot avea rolul student
      createdAt: new Date()
    })).pipe(
      tap(() => console.log(`User profile saved for ${email}`))
    );
  }

  getUserProfile(userId: string): Observable<any> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userRef)).pipe(
      map((docSnap) => (docSnap.exists() ? docSnap.data() : null))
    );
  }

  deleteUser(userId: string): Observable<void> {
    // Șterge utilizatorul din Firestore
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(deleteDoc(userRef)).pipe(
      tap(() => {
        console.log(`User ${userId} deleted from Firestore`);
        // Șterge utilizatorul și din Firebase Authentication
        this.authService.deleteUserFromAuth(userId).subscribe({
          next: () => console.log(`User ${userId} deleted from Firebase Authentication`),
          error: (err) => console.error('Error deleting from Firebase Authentication', err)
        });
      }),
      catchError((err) => {
        console.error('Error deleting user from Firestore', err);
        return throwError(() => new Error('Error deleting user.'));
      })
    );
  }
  
  deleteEnrollmentsForStudent(studentId: string): Observable<void> {
    const enrollmentsRef = collection(this.firestore, 'enrollments');
    const q = query(enrollmentsRef, where('studentId', '==', studentId));
  
    return from(getDocs(q)).pipe(
      mergeMap(snapshot => {
        const deletions = snapshot.docs.map(docSnap =>
          deleteDoc(docSnap.ref)
        );
        return from(Promise.all(deletions)).pipe(map(() => void 0));
      }),
      tap(() => console.log(`Toate enrollments-urile pentru studentId ${studentId} au fost șterse.`))
    );
  }

  assignRoles(userId: string, roles: string[]): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, { roles })).pipe(
      tap(async () => {
        // Dacă utilizatorul nu mai are rolul STUDENT, șterge enrollments
        if (!roles.includes('STUDENT')) {
          console.log(`User ${userId} nu mai este student. Se șterg enrollments.`);
          await this.deleteEnrollmentsForStudent(userId).toPromise();
        }
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'id' }).pipe(
      map(users => users.map(u => new User(
        u['email'],
        u['id'],
        '',  // Token is not stored in Firestore
        new Date(),
        u['roles']
      )))
    );
  }

  updateUserPassword(userId: string, newPassword: string): Observable<void> {
    const hashedPassword = btoa(newPassword);
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, { hashedPassword }));
  }

  getUserById(userId: string): Observable<User | null> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(getDoc(userRef)).pipe(
      map(snapshot => snapshot.exists() ? new User(
        snapshot.data()['email'],
        userId,
        '',
        new Date(),
        snapshot.data()['roles']
      ) : null)
    );
  }
  

  
  // COURSES MANAGEMENT


  createCourse(course: Course): Observable<string> {
    const coursesRef = collection(this.firestore, 'courses');
    return from(addDoc(coursesRef, {
      title: course.title,
      description: course.description,
      professorId: course.professorId,
      createdAt: new Date()
    })).pipe(
      map(docRef => docRef.id)
    );
  }

  updateCourse(courseId: string, courseData: Partial<Course>): Observable<void> {
    const courseRef = doc(this.firestore, `courses/${courseId}`);
    return from(updateDoc(courseRef, courseData));
  }

  deleteCourse(courseId: string): Observable<void> {
    const courseRef = doc(this.firestore, `courses/${courseId}`);
    return from(deleteDoc(courseRef));
  }

  getAllCourses(): Observable<Course[]> {
    const coursesRef = collection(this.firestore, 'courses');
    return collectionData(coursesRef, { idField: 'id' }).pipe(
      map(courses => courses.map(c => new Course(
        c['id'],
        c['title'],
        c['description'],
        c['professorId'],
        c['createdAt'].toDate()
      )))
    );
  }

  getCoursesByProfessor(professorId: string): Observable<Course[]> {
    const coursesRef = collection(this.firestore, 'courses');
    const q = query(coursesRef, where('professorId', '==', professorId));
    return collectionData(q, { idField: 'id' }) as Observable<Course[]>;
  }

  
  // ENROLLMENTS MANAGEMENT


  enrollStudent(courseId: string, studentId: string): Observable<string> {
    const enrollmentsRef = collection(this.firestore, 'enrollments');
    return from(addDoc(enrollmentsRef, {
      courseId,
      studentId,
      enrolledAt: new Date()
    })).pipe(
      tap((ref) => console.log(`Student ${studentId} enrolled in course ${courseId}, enrollmentId: ${ref.id}`)),
      map((ref) => ref.id) // returnezi ID-ul generat de Firebase
    );
  }

  leaveCourse(courseId: string, studentId: string): Observable<void> {
    const enrollmentsRef = collection(this.firestore, 'enrollments');
    const q = query(enrollmentsRef, where('courseId', '==', courseId), where('studentId', '==', studentId));
    return from(getDocs(q)).pipe(
      tap(snapshot => {
        snapshot.forEach(docSnap => deleteDoc(docSnap.ref));
      }),
      map(() => void 0)
    );
  }

  getEnrollmentsForCourse(courseId: string): Observable<Enrollment[]> {
    const enrollmentsRef = collection(this.firestore, 'enrollments');
    const q = query(enrollmentsRef, where('courseId', '==', courseId));
    return collectionData(q, { idField: 'id' }).pipe(
      map(enrollments => enrollments.map(e => new Enrollment(
        e['id'],
        e['courseId'],
        e['studentId'],
        e['enrolledAt'].toDate(),
        e['grade']
      )))
    );
  }

  getEnrollmentsForStudent(studentId: string): Observable<Enrollment[]> {
    const enrollmentsRef = collection(this.firestore, 'enrollments');
    const q = query(enrollmentsRef, where('studentId', '==', studentId));
    return collectionData(q, { idField: 'id' }) as Observable<Enrollment[]>;
  }

  updateGrade(courseId: string, studentId: string, grade: number): Observable<void> {
    const enrollmentsRef = collection(this.firestore, 'enrollments');
    const q = query(enrollmentsRef, where('courseId', '==', courseId), where('studentId', '==', studentId));
    return from(getDocs(q)).pipe(
      mergeMap(snapshot => {
        const batchUpdates = snapshot.docs.map(docSnap =>
          updateDoc(docSnap.ref, { grade })
        );
        return from(Promise.all(batchUpdates)).pipe(map(() => void 0));
      })
    );
  }
  
  getAllEnrollments(): Observable<Enrollment[]> {
    const enrollmentsRef = collection(this.firestore, 'enrollments');
    return collectionData(enrollmentsRef, { idField: 'id' }).pipe(
      map(enrollments => enrollments.map(e => new Enrollment(
        e['id'],
        e['courseId'],
        e['studentId'],
        e['enrolledAt'].toDate(),
        e['grade']
      )))
    );
  }
  
  unenrollById(enrollmentId: string): Observable<void> {
    const enrollmentRef = doc(this.firestore, `enrollments/${enrollmentId}`);
    return from(deleteDoc(enrollmentRef));
  }
  
  assignGrade(enrollmentId: string, grade: number): Observable<void> {
    const enrollmentRef = doc(this.firestore, `enrollments/${enrollmentId}`);
    return from(updateDoc(enrollmentRef, { grade }));
  }


  logAction(message: string, userEmail: string, actionType: string, metadata?: any): Observable<void> {
    const logsRef = collection(this.firestore, 'logs');
    return from(addDoc(logsRef, {
      message,
      userEmail,
      timestamp: new Date(),
      actionType,
      metadata
    })).pipe(
      tap(() => console.log(`[LOG] ${message}`)),
      map(() => void 0)
    );
  }
  
  
}
