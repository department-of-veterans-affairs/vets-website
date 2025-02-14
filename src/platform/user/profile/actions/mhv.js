import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '../../../utilities/api';
import { API_ROUTES } from '../vap-svc/constants';

export const FETCHING_MHV_ACCOUNT = 'FETCHING_MHV_ACCOUNT';
export const FETCH_MHV_ACCOUNT_FAILURE = 'FETCH_MHV_ACCOUNT_FAILURE';
export const FETCH_MHV_ACCOUNT_SUCCESS = 'FETCH_MHV_ACCOUNT_SUCCESS';
export const FETCH_MESSAGING_SIGNATURE = 'FETCH_MESSAGING_SIGNATURE';

const baseUrl = '/mhv_account';
const myHealthApiBasePath = `${environment.API_URL}/my_health/v1`;

export function fetchMHVAccount() {
  return dispatch => {
    dispatch({ type: FETCHING_MHV_ACCOUNT });

    apiRequest(baseUrl)
      .then(({ data }) => dispatch({ type: FETCH_MHV_ACCOUNT_SUCCESS, data }))
      .catch(({ errors = {} }) =>
        dispatch({ type: FETCH_MHV_ACCOUNT_FAILURE, errors }),
      );
  };
}

/**
 * Get message signature from user preferences.
 * @returns {Object} signature object {data: {signatureName, includeSignature, signatureTitle}, errors:{}, metadata: {}}
 */
export const getMessagingSignature = () => {
  return async dispatch => {
    try {
      const response = await apiRequest(
        `${myHealthApiBasePath}${API_ROUTES.MESSAGING_SIGNATURE}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      dispatch({
        type: FETCH_MESSAGING_SIGNATURE,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: FETCH_MESSAGING_SIGNATURE,
        payload: {
          message: error.message || 'Failed to retrieve messaging signature',
        },
      });
    }
  };
};
