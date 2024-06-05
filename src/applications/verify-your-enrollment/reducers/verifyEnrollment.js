import {
  VERIFY_ENROLLMENT,
  VERIFY_ENROLLMENT_FAILURE,
  VERIFY_ENROLLMENT_SUCCESS,
} from '../actions';

const initialState = {
  loading: false,
  data: null,
  error: null,
};

const verifyEnrollment = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_ENROLLMENT:
      return {
        ...state,
        loading: true,
        error: null,
      };
    case VERIFY_ENROLLMENT_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.response,
      };
    case VERIFY_ENROLLMENT_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.errors,
      };

    default:
      return state;
  }
};
export default verifyEnrollment;
