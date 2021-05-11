import { CALLSTATUS } from '../utils';

import {
  DEPENDENCY_VERIFICATION_CALL_SUCCESS,
  DEPENDENCY_VERIFICATION_CALL_FAILED,
  UPDATE_DIARIES_STARTED,
  UPDATE_DIARIES_SUCCESS,
  UPDATE_DIARIES_FAILED,
  UPDATE_DIARIES_SKIP,
} from '../actions';

const initialState = {
  getDependencyVerificationStatus: 'pending',
  updateDiariesStatus: null,
  error: null,
  verifiableDependents: null,
};

function verifyDependents(state = initialState, action) {
  switch (action.type) {
    case DEPENDENCY_VERIFICATION_CALL_SUCCESS:
      return {
        ...state,
        getDependencyVerificationStatus: action.response.promptRenewal
          ? CALLSTATUS.success
          : CALLSTATUS.pending,
        verifiableDependents: action.response.dependencyVerifications,
      };
    case DEPENDENCY_VERIFICATION_CALL_FAILED:
      return {
        ...state,
        getDependencyVerificationStatus: CALLSTATUS.failed,
        error: {
          code: action.response.errors[0].status,
        },
      };
    case UPDATE_DIARIES_STARTED:
      return {
        ...state,
        getDependencyVerificationStatus: CALLSTATUS.pending,
        updateDiariesStatus: CALLSTATUS.pending,
      };
    case UPDATE_DIARIES_SUCCESS: {
      return {
        ...state,
        getDependencyVerificationStatus: CALLSTATUS.pending,
        updateDiariesStatus: CALLSTATUS.success,
      };
    }
    case UPDATE_DIARIES_FAILED: {
      return {
        ...state,
        getDependencyVerificationStatus: CALLSTATUS.pending,
        updateDiariesStatus: CALLSTATUS.failed,
      };
    }
    case UPDATE_DIARIES_SKIP: {
      return {
        ...state,
        getDependencyVerificationStatus: CALLSTATUS.pending,
        updateDiariesStatus: CALLSTATUS.skip,
      };
    }
    default:
      return state;
  }
}

export default { verifyDependents };
