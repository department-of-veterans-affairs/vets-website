import { apiRequest } from '~/platform/utilities/api';

export const FETCH_POWER_OF_ATTORNEY_STARTED =
  'FETCH_POWER_OF_ATTORNEY_STARTED';
export const FETCH_POWER_OF_ATTORNEY_SUCCEEDED =
  'FETCH_POWER_OF_ATTORNEY_SUCCEEDED';
export const FETCH_POWER_OF_ATTORNEY_FAILED = 'FETCH_POWER_OF_ATTORNEY_FAILED';

export const fetchPowerOfAttorneyStarted = () => ({
  type: FETCH_POWER_OF_ATTORNEY_STARTED,
});

export const fetchPowerOfAttorneySucceeded = payload => ({
  type: FETCH_POWER_OF_ATTORNEY_SUCCEEDED,
  payload,
});

export const fetchPowerOfAttorneyFailed = payload => ({
  type: FETCH_POWER_OF_ATTORNEY_FAILED,
  payload,
});

export const POA_PATH = '/representation_management/v0/power_of_attorney';

export const fetchPowerOfAttorney = () => dispatch => {
  dispatch(fetchPowerOfAttorneyStarted());
  return apiRequest(POA_PATH)
    .then(payload => dispatch(fetchPowerOfAttorneySucceeded(payload)))
    .catch(err => {
      dispatch(fetchPowerOfAttorneyFailed(err));
    });
};
