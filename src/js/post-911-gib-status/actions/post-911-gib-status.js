import { apiRequest } from '../utils/helpers';

export function getEnrollmentData() {
  return (dispatch) => {
    apiRequest(
      '/post911_gi_bill_status',
      null,
      (response) => {
        return dispatch({
          type: 'GET_ENROLLMENT_DATA_SUCCESS',
          data: response.data.attributes,
        });
      },
      (response) => {
        if (response.status === 422 || response.status === 504) {
          // Either an EVSS partner service is down or EVSS is down or times out.
          return dispatch({ type: 'BACKEND_SERVICE_ERROR' });
        }
        if (response.status === 403) {
          // Backend authentication problem
          return dispatch({ type: 'BACKEND_AUTHENTICATION_ERROR' });
        }
        if (response.status === 404) {
          // EVSS has no record of this user
          return dispatch({ type: 'NO_CHAPTER33_RECORD_AVAILABLE' });
        }
        return dispatch({ type: 'GET_ENROLLMENT_DATA_FAILURE' });
      });
  };
}
