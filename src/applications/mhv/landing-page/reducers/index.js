import {
  FETCH_ENROLLMENT_STATUS_BEGIN,
  FETCH_ENROLLMENT_STATUS_ERROR,
  FETCH_ENROLLMENT_STATUS_SUCCESS,
} from '../actions';

export const initialState = {
  priorityGroup: {
    data: {},
    error: false,
    loading: false,
  },
};

export const enrollmentStatusReducer = (state = initialState, action) => {
  const { payload, type } = action;
  switch (type) {
    case FETCH_ENROLLMENT_STATUS_BEGIN:
      return {
        ...state,
        priorityGroup: {
          ...state.priorityGroup,
          loading: true,
        },
      };
    case FETCH_ENROLLMENT_STATUS_SUCCESS:
      return {
        ...state,
        priorityGroup: {
          ...state.priorityGroup,
          data: payload,
          error: false,
          loading: false,
        },
      };
    case FETCH_ENROLLMENT_STATUS_ERROR:
      return {
        ...state,
        priorityGroup: {
          ...state.priorityGroup,
          data: payload,
          error: true,
          loading: false,
        },
      };
    default:
      return state;
  }
};

export default enrollmentStatusReducer;
