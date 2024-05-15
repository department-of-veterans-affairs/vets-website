import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export function fetchUser() {
  return async dispatch => {
    dispatch({ type: FETCH_USER });

    try {
      const response = await apiRequest(
        'accredited_representative_portal/v0/user',
        {
          method: 'GET',
          // credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      // console.log("response is: ", response);
      dispatch({
        type: FETCH_USER_SUCCESS,
        payload: response.data.attributes.profile,
      });
    } catch (error) {
      dispatch({ type: FETCH_USER_FAILURE });
    }
  };
}
