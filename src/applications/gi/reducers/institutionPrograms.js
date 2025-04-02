import {
  FETCH_INSTITUTION_PROGRAMS_STARTED,
  FETCH_INSTITUTION_PROGRAMS_FAILED,
  FETCH_INSTITUTION_PROGRAMS_SUCCEEDED,
} from '../actions';

const INITIAL_STATE = {
  institutionPrograms: [],
  loading: false,
  error: null,
};

const institutionProgramsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case FETCH_INSTITUTION_PROGRAMS_STARTED:
      return { ...state, loading: true, error: null };

    case FETCH_INSTITUTION_PROGRAMS_FAILED:
      return { ...state, loading: false, error: action.payload };

    case FETCH_INSTITUTION_PROGRAMS_SUCCEEDED:
      return {
        ...state,
        loading: false,
        institutionPrograms: action.payload,
        error: null,
      };

    default:
      return state;
  }
};

export default institutionProgramsReducer;
