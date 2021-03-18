import {
  DEPENDENCY_VERIFICATION_CALL_SUCCESS,
  DEPENDENCY_VERIFICATION_CALL_FAILED,
} from '../actions';

const initialState = {
  loading: true, // app starts in loading state
  error: null,
  verifiableDependents: null,
};

function verifyDependents(state = initialState, action) {
  switch (action.type) {
    case DEPENDENCY_VERIFICATION_CALL_SUCCESS:
      return {
        ...state,
        loading: false,
        verifiableDependents: action.response.dependencyVerifications,
      };
    case DEPENDENCY_VERIFICATION_CALL_FAILED:
      return {
        ...state,
        loading: false,
        error: {
          code: action.response.errors[0].status,
        },
      };
    default:
      return state;
  }
}

export default { verifyDependents };
