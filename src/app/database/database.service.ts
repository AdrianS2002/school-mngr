import { Injectable } from "@angular/core";
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "@angular/fire/firestore";
import { Observable, from, map, tap, throwError } from "rxjs";
import { User } from "./models/user.model";
import { Course } from "./models/course.model";
import { Enrollment } from "./models/enrollment.model";


@Injectable({ providedIn: 'root' })
export class DatabaseService {
  constructor(private firestore: Firestore) {}

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
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(deleteDoc(userRef));
  }

  assignRoles(userId: string, roles: string[]): Observable<void> {
    const userRef = doc(this.firestore, `users/${userId}`);
    return from(updateDoc(userRef, { roles }));
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


  enrollStudent(courseId: string, studentId: string): Observable<void> {
    const enrollmentsRef = collection(this.firestore, 'enrollments');
    return from(addDoc(enrollmentsRef, {
      courseId,
      studentId,
      enrolledAt: new Date()
    })).pipe(
      tap((ref) => console.log(`Student ${studentId} enrolled in course ${courseId}, enrollmentId: ${ref.id}`)),
      map(() => void 0) // convertim rezultatul într-un void
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
        e['enrolledAt'].toDate()
      )))
    );
  }

  getEnrollmentsForStudent(studentId: string): Observable<Enrollment[]> {
    const enrollmentsRef = collection(this.firestore, 'enrollments');
    const q = query(enrollmentsRef, where('studentId', '==', studentId));
    return collectionData(q, { idField: 'id' }) as Observable<Enrollment[]>;
  }
}
