import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '~/platform/utilities/environment';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export function fetchUser() {
  return async dispatch => {
    dispatch({
      type: FETCH_USER,
    });

    try {
      const path = '/accredited_representative_portal/v0/user';
      const user = await apiRequest(`${environment.API_URL}${path}`);

      /**
       * This is an even stricter success condition than having a user. We
       * additionally require what is needed for access token refreshing to
       * function.
       */
      const serviceName = user?.profile?.signIn?.serviceName;

      if (serviceName) {
        // Needed for access token refreshing to function.
        sessionStorage.setItem('serviceName', serviceName);

        dispatch({
          type: FETCH_USER_SUCCESS,
          payload: user,
        });
      } else {
        dispatch({
          type: FETCH_USER_FAILURE,
          error: 'User not found',
        });
      }
    } catch (error) {
      dispatch({
        type: FETCH_USER_FAILURE,
        error: error.errors || 'Unknown error',
      });
    }
  };
}
