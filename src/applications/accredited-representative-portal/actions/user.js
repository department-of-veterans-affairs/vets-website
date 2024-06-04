import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '~/platform/utilities/environment';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export function fetchUser() {
  return async dispatch => {
    dispatch({ type: FETCH_USER });
    try {
      const response = await apiRequest(
        `${environment.API_URL}/accredited_representative_portal/v0/user`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const profile = response?.data?.attributes?.profile;

      if (profile) {
        dispatch({
          type: FETCH_USER_SUCCESS,
          payload: profile,
        });
      } else {
        dispatch({ type: FETCH_USER_FAILURE });
      }
    } catch (error) {
      dispatch({ type: FETCH_USER_FAILURE });
    }
  };
}
