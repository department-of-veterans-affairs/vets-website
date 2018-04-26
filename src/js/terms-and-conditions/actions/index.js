import recordEvent from '../../../platform/monitoring/record-event';
import { apiRequest } from '../../../platform/utilities/api';
import { getUserData } from '../../common/helpers/login-helpers';

export const FETCHING_LATEST_TERMS = 'FETCHING_LATEST_TERMS';
export const FETCH_LATEST_TERMS_SUCCESS = 'FETCH_LATEST_TERMS_SUCCESS';
export const FETCH_LATEST_TERMS_FAILURE = 'FETCH_LATEST_TERMS_FAILURE';
export const ACCEPTING_LATEST_TERMS = 'ACCEPTING_LATEST_TERMS';
export const ACCEPT_LATEST_TERMS_SUCCESS = 'ACCEPT_LATEST_TERMS_SUCCESS';
export const ACCEPT_LATEST_TERMS_FAILURE = 'ACCEPT_LATEST_TERMS_FAILURE';

export function fetchLatestTerms(termsName) {
  return dispatch => {
    dispatch({ type: FETCHING_LATEST_TERMS });

    apiRequest(
      `/terms_and_conditions/${termsName}/versions/latest`,
      null,
      ({ data }) => dispatch({ type: FETCH_LATEST_TERMS_SUCCESS, data }),
      errors => dispatch({ type: FETCH_LATEST_TERMS_FAILURE, errors })
    );
  };
}

export function acceptTerms(termsName) {
  return dispatch => {
    dispatch({ type: ACCEPTING_LATEST_TERMS });

    const settings = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: termsName, })
    };

    apiRequest(
      `/terms_and_conditions/${termsName}/versions/latest/user_data`,
      settings,
      () => {
        recordEvent({ event: 'terms-accepted' });
        dispatch({ type: ACCEPT_LATEST_TERMS_SUCCESS });
        getUserData(dispatch);
      },
      errors => dispatch({ type: ACCEPT_LATEST_TERMS_FAILURE, errors })
    );
  };
}
