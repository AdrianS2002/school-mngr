import { createAction, props } from '@ngrx/store';
import { Course } from '../../database/models/course.model';

export const loadCourses = createAction('[Courses] Load Courses');
export const loadCoursesSuccess = createAction(
    '[Courses] Load Courses Success',
    props<{ courses: Course[] }>()
);
export const loadCoursesFail = createAction(
    '[Courses] Load Courses Fail',
    props<{ error: string }>()
);

export const addCourse = createAction(
    '[Courses] Add Course',
    props<{ course: Omit<Course, 'id' | 'createdAt'> }>()
);
export const addCourseSuccess = createAction(
    '[Courses] Add Course Success',
    props<{ course: Course }>()
);
export const addCourseFail = createAction(
    '[Courses] Add Course Fail',
    props<{ error: string }>()
);

export const deleteCourse = createAction(
    '[Courses] Delete Course',
    props<{ courseId: string }>()
);
export const deleteCourseSuccess = createAction(
    '[Courses] Delete Course Success',
    props<{ courseId: string, course: Course }>() 
  );
export const deleteCourseFail = createAction(
    '[Courses] Delete Course Fail',
    props<{ error: string }>()
);
export const updateCourse = createAction(
    '[Courses] Update Course',
    props<{ courseId: string; course: Partial<Course> }>()
);

export const updateCourseSuccess = createAction(
    '[Courses] Update Course Success',
    props<{ courseId: string; course: Partial<Course> }>()
);

export const updateCourseFail = createAction(
    '[Courses] Update Course Fail',
    props<{ error: string }>()
);