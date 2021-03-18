import { apiRequest } from 'platform/utilities/api';
// import { isServerError, isClientError } from '../utils';

const DEPENDENCY_VERIFICATION_URI = '/dependents_verifications';

export const DEPENDENCY_VERIFICATION_CALL_SUCCESS =
  'DEPENDENCY_VERIFICATION_CALL_SUCCESS';
export const DEPENDENCY_VERIFICATION_CALL_FAILED =
  'DEPENDENCY_VERIFICATION_CALL_FAILED';

const getDependentsVerificationStatus = async () => {
  try {
    const response = await apiRequest(DEPENDENCY_VERIFICATION_URI);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
};

export function dependencyVerificationCall() {
  return async dispatch => {
    const response = await getDependentsVerificationStatus();
    if (response.errors) {
      dispatch({
        type: DEPENDENCY_VERIFICATION_CALL_FAILED,
        response,
      });
    } else {
      dispatch({
        type: DEPENDENCY_VERIFICATION_CALL_SUCCESS,
        response,
      });
    }
  };
}
