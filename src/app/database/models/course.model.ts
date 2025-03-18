export class Course {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public professorId: string,
        public createdAt: Date
    ) {}

    isOwnedBy(professorId: string): boolean {
        return this.professorId === professorId;
    }
}
