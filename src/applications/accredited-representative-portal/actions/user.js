import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '~/platform/utilities/environment';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export function fetchUser() {
  return async dispatch => {
    dispatch({ type: FETCH_USER });

    try {
      // const response = await apiRequest(
      //   '/accredited_representative_portal/v0/user',
      //   {
      //     method: 'GET',
      //     // credentials: 'include',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //   },
      // );
      const response = await apiRequest(
        `${environment.API_URL}/accredited_representative_portal/v0/user`,
        {
          method: 'GET',
          // credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('fetchUser response is: ', response);

      const profile = response?.data?.attributes?.profile;

      if (profile) {
        console.log('Dispatching FETCH_USER_SUCCESS with profile:', profile);
        dispatch({
          type: FETCH_USER_SUCCESS,
          payload: profile,
        });
      } else {
        console.error('User profile not found in the response:', response);
        dispatch({ type: FETCH_USER_FAILURE });
      }
    } catch (error) {
      console.error('Error fetching user:', error.message);
      console.error('Error stack trace:', error.stack);
      dispatch({ type: FETCH_USER_FAILURE });
    }
  };
}
