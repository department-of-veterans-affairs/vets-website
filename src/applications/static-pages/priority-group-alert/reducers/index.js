import {
  FETCH_ENROLLMENT_STATUS_BEGIN,
  FETCH_ENROLLMENT_STATUS_ERROR,
  FETCH_ENROLLMENT_STATUS_SUCCESS,
} from '../actions';

export const initialState = {
  data: {},
  error: false,
  loading: false,
};

export const enrollmentStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ENROLLMENT_STATUS_BEGIN:
      return { ...state, loading: true };
    case FETCH_ENROLLMENT_STATUS_SUCCESS:
      return { ...state, data: action.payload, error: false, loading: false };
    case FETCH_ENROLLMENT_STATUS_ERROR:
      return { ...state, data: action.payload, error: true, loading: false };
    default:
      return state;
  }
};
