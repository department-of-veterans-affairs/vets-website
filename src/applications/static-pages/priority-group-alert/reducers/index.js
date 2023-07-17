import {
  FETCH_ENROLLMENT_STATUS_FAILED,
  FETCH_ENROLLMENT_STATUS_STARTED,
  FETCH_ENROLLMENT_STATUS_SUCCEEDED,
} from '../actions';

export const initialState = {
  data: {},
  error: false,
  loading: false,
};

export const enrollmentStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ENROLLMENT_STATUS_STARTED:
      return { ...state, data: {}, loading: true, error: false };
    case FETCH_ENROLLMENT_STATUS_SUCCEEDED:
      return { ...state, data: action.data, loading: false, error: false };
    case FETCH_ENROLLMENT_STATUS_FAILED:
      return { ...state, data: {}, loading: false, error: true };
    default:
      return state;
  }
};
