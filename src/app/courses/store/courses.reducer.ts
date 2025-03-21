import { createReducer, on } from '@ngrx/store';
import * as CourseActions from './courses.actions';
import { Course } from '../../database/models/course.model';

export interface CoursesState {
    courses: Course[];
    loading: boolean;
    error: string | null;
}

const initialState: CoursesState = {
    courses: [],
    loading: false,
    error: null
};

export const coursesReducer = createReducer(
    initialState,
    on(CourseActions.loadCourses, state => ({ ...state, loading: true })),
    on(CourseActions.loadCoursesSuccess, (state, { courses }) => ({
        ...state,
        courses,
        loading: false
    })),
    on(CourseActions.loadCoursesFail, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),
    on(CourseActions.addCourseSuccess, (state, { course }) => ({
        ...state,
        courses: [...state.courses, course]
    })),

    on(CourseActions.deleteCourseSuccess, (state, { courseId }) => ({
        ...state,
        courses: state.courses.filter(c => c.id !== courseId)
    })),
    on(CourseActions.addCourse, CourseActions.updateCourse, state => ({
        ...state,
        loading: true
    })),
    on(
        CourseActions.addCourseSuccess,
        CourseActions.addCourseFail,
        CourseActions.updateCourseSuccess,
        CourseActions.updateCourseFail,
        (state) => ({
            ...state,
            loading: false
        })
    ),

);
