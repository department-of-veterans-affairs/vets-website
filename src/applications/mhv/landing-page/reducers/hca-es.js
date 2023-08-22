import {
  FETCH_HCA_ENROLLMENT_STATUS_FAILED,
  FETCH_HCA_ENROLLMENT_STATUS_STARTED,
  FETCH_HCA_ENROLLMENT_STATUS_SUCCEEDED,
} from '../actions';

export const initialState = {
  data: {},
  error: false,
  loading: false,
};

export const hcaEnrollmentStatusReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case FETCH_HCA_ENROLLMENT_STATUS_STARTED:
      return { ...state, loading: true };
    case FETCH_HCA_ENROLLMENT_STATUS_SUCCEEDED:
      return { ...state, data: payload, loading: false };
    case FETCH_HCA_ENROLLMENT_STATUS_FAILED:
      return { ...state, data: payload, error: true, loading: false };
    default:
      return state;
  }
};
