import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '~/platform/utilities/environment';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const fetchUser = () => async dispatch => {
  dispatch({ type: FETCH_USER });
  try {
    const response = await apiRequest(
      `${environment.API_URL}/accredited_representative_portal/v0/user`,
    );

    // NOTE: accredited_representative_portal/v0/user returns a flat profile object.
    // see: https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/accredited_representative_portal/app/controllers/accredited_representative_portal/v0/representative_users_controller.rb
    // TODO: consider nesting the ARP user profile data in a profile object to match: https://github.com/department-of-veterans-affairs/vets-api/blob/master/app/controllers/v0/users_controller.rb
    const profile = response;

    if (profile) {
      dispatch({
        type: FETCH_USER_SUCCESS,
        payload: profile,
      });
    } else {
      dispatch({ type: FETCH_USER_FAILURE, error: 'Profile not found' });
    }
  } catch (error) {
    dispatch({
      type: FETCH_USER_FAILURE,
      error: error.message || 'Unknown error',
    });
  }
};
