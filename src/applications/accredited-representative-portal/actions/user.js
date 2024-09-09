import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import environment from '~/platform/utilities/environment';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

const fetchUserStart = () => ({ type: FETCH_USER });
const fetchUserSuccess = profile => ({
  type: FETCH_USER_SUCCESS,
  payload: profile,
});
const fetchUserFailure = error => ({ type: FETCH_USER_FAILURE, error });

const requestUserProfile = () => {
  return apiRequest(
    `${environment.API_URL}/accredited_representative_portal/v0/user`,
  );
};

export const fetchUser = () => async dispatch => {
  dispatch(fetchUserStart());

  try {
    // NOTE: accredited_representative_portal/v0/user returns a flat profile object.
    // see: https://github.com/department-of-veterans-affairs/vets-api/blob/master/modules/accredited_representative_portal/app/controllers/accredited_representative_portal/v0/representative_users_controller.rb
    // TODO: consider nesting the ARP user profile data in a profile object to match: https://github.com/department-of-veterans-affairs/vets-api/blob/master/app/controllers/v0/users_controller.rb
    const profile = await requestUserProfile();
    if (profile) {
      dispatch(fetchUserSuccess(profile));
    } else {
      dispatch(fetchUserFailure('Profile not found'));
    }
  } catch (error) {
    dispatch(fetchUserFailure(error.message || 'Unknown error'));
  }
};
