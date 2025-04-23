import {
  FETCH_NATIONAL_EXAMS_STARTED,
  FETCH_NATIONAL_EXAMS_FAILED,
  FETCH_NATIONAL_EXAMS_SUCCEEDED,
  FETCH_NATIONAL_EXAM_DETAILS_STARTED,
  FETCH_NATIONAL_EXAM_DETAILS_FAILED,
  FETCH_NATIONAL_EXAM_DETAILS_SUCCEEDED,
} from '../actions';

const INITIAL_STATE = {
  nationalExams: [],
  examDetails: null,
  loading: false,
  loadingDetails: false,
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
    case FETCH_NATIONAL_EXAM_DETAILS_STARTED:
      return { ...state, loadingDetails: true, error: null };
    case FETCH_NATIONAL_EXAM_DETAILS_FAILED:
      return { ...state, loadingDetails: false, error: action.payload };
    case FETCH_NATIONAL_EXAM_DETAILS_SUCCEEDED:
      return {
        ...state,
        loadingDetails: false,
        examDetails: action.payload,
        error: null,
      };
    default:
      return state;
  }
};

export default nationalExamsReducer;
