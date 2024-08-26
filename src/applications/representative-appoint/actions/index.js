import { apiRequest } from 'platform/utilities/api';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { REPRESENTATIVES_API } from '../constants/api';

export const FETCH_REPRESENTATIVES_INIT = 'FETCH_REPRESENTATIVES_INIT';
export const FETCH_REPRESENTATIVES_SUCCEEDED =
  'FETCH_REPRESENTATIVES_SUCCEEDED';
export const FETCH_REPRESENTATIVES_FAILED = 'FETCH_REPRESENTATIVES_FAILED';

export const getRepresentatives = () => {
  return dispatch => {
    dispatch({ type: FETCH_REPRESENTATIVES_INIT });

    return apiRequest(`${environment.BASE_URL}${REPRESENTATIVES_API}`)
      .then(response => {
        dispatch({ type: FETCH_REPRESENTATIVES_SUCCEEDED, response });
      })
      .catch(errors => {
        dispatch({ type: FETCH_REPRESENTATIVES_FAILED, errors });
      });
  };
};
