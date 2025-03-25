export class Enrollment {
    constructor(
        public id: string,
        public courseId: string,
        public studentId: string,
        public enrolledAt: Date,
        public grade?: number
    ) {}

    isForCourse(courseId: string): boolean {
        return this.courseId === courseId;
    }

    isForStudent(studentId: string): boolean {
        return this.studentId === studentId;
    }
}
