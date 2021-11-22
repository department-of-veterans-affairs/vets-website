import { apiRequest } from 'platform/utilities/api';
// import { isServerError, isClientError } from '../utils';

const DEPENDENCY_VERIFICATION_URI = '/dependents_verifications';

export const DEPENDENCY_VERIFICATION_CALL_SUCCESS =
  'DEPENDENCY_VERIFICATION_CALL_SUCCESS';
export const DEPENDENCY_VERIFICATION_CALL_FAILED =
  'DEPENDENCY_VERIFICATION_CALL_FAILED';
export const UPDATE_DIARIES_STARTED = 'UPDATE_DIARIES_STARTED';
export const UPDATE_DIARIES_SUCCESS = 'UPDATE_DIARIES_SUCCESS';
export const UPDATE_DIARIES_FAILED = 'UPDATE_DIARIES_FAILED';
export const UPDATE_DIARIES_SKIP = 'UPDATE_DIARIES_SKIP';

const getDependentsVerificationStatus = async () => {
  try {
    const response = await apiRequest(DEPENDENCY_VERIFICATION_URI);
    return response.data.attributes;
  } catch (error) {
    return error;
  }
};

export function getDependencyVerifications() {
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

export function updateDiariesService(shouldUpdate) {
  return async dispatch => {
    if (!shouldUpdate) {
      dispatch({
        type: UPDATE_DIARIES_SKIP,
      });
    } else {
      dispatch({
        type: UPDATE_DIARIES_STARTED,
      });
      try {
        const response = await apiRequest(DEPENDENCY_VERIFICATION_URI, {
          method: 'POST',
          body: JSON.stringify({
            dependencyVerificationClaim: { form: { updateDiaries: 'true' } },
          }),
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': localStorage.getItem('csrfToken'),
          },
        });
        dispatch({
          type: UPDATE_DIARIES_SUCCESS,
          response,
        });
      } catch (error) {
        dispatch({
          type: UPDATE_DIARIES_FAILED,
          error,
        });
      }
    }
  };
}
