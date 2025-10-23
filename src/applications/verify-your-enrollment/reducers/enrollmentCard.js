import {
  TOGGLE_ENROLLMENT_ERROR_STATEMENT,
  UPDATE_TOGGLE_ENROLLMENT_SUCCESS,
  UPDATE_TOGGLE_ENROLLMENT_ERROR,
} from '../actions';

const initialState = {
  toggleEnrollmentErrorStatement: false,
  toggleEnrollmentSuccess: false,
  toggleEnrollmentError: false,
};

const getEnrollmentCardReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_ENROLLMENT_ERROR_STATEMENT:
      return {
        ...state,
        toggleEnrollmentErrorStatement: action.payload,
      };
    case UPDATE_TOGGLE_ENROLLMENT_SUCCESS:
      return {
        ...state,
        toggleEnrollmentSuccess: action.payload,
      };
    case UPDATE_TOGGLE_ENROLLMENT_ERROR:
      return {
        ...state,
        toggleEnrollmentError: action.payload,
      };
    default:
      return state;
  }
};

export default getEnrollmentCardReducer;
