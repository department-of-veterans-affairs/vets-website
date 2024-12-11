import {
  FETCH_NATIONAL_EXAMS_STARTED,
  FETCH_NATIONAL_EXAMS_FAILED,
  FETCH_NATIONAL_EXAMS_SUCCEEDED,
} from '../actions';

const INITIAL_STATE = {
  nationalExams: [],
  loading: false,
  error: null,
};

const nationalExamsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_NATIONAL_EXAMS_STARTED:
      return { ...state, loading: true, error: null };

    case FETCH_NATIONAL_EXAMS_FAILED:
      return { ...state, loading: false, error: action.payload };

    case FETCH_NATIONAL_EXAMS_SUCCEEDED:
      return {
        ...state,
        loading: false,
        nationalExams: action.payload,
        error: null,
      };

    default:
      return state;
  }
};

export default nationalExamsReducer;
