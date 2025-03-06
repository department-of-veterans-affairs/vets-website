import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import set from 'lodash/set';
import { apiRequest } from '../../../utilities/api';
import { API_ROUTES } from '../vap-svc/constants';
import {
  VAP_SERVICE_TRANSACTION_REQUESTED,
  VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED,
  VAP_SERVICE_TRANSACTION_REQUEST_FAILED,
  clearTransaction,
} from '../vap-svc/actions';

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
        payload: response.data.attributes,
      });
    } catch (error) {
      dispatch({
        type: FETCH_MESSAGING_SIGNATURE,
        payload: {
          error: error.message || 'Failed to retrieve messaging signature',
        },
      });
    }
  };
};
/**
 * Update message signature from user preferences.
 * @returns {Object} signature object {data: {signatureName, includeSignature, signatureTitle}, errors:{}, metadata: {}}
 */
export const updateMessagingSignature = (
  signature,
  fieldName,
  method = 'POST',
) => {
  return async dispatch => {
    try {
      dispatch({
        type: VAP_SERVICE_TRANSACTION_REQUESTED,
        fieldName,
        method,
      });

      const response = await apiRequest(
        `${myHealthApiBasePath}${API_ROUTES.MESSAGING_SIGNATURE}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(signature),
        },
      );

      // clearTransaction uses this transactionId in a lookup to remove it
      set(
        response,
        'data.attributes.transactionId',
        `${fieldName}_${response?.attributes?.[fieldName].sourceDate}`,
      );

      dispatch({
        type: VAP_SERVICE_TRANSACTION_REQUEST_SUCCEEDED,
        fieldName,
        transaction: response,
      });

      dispatch({
        type: FETCH_MESSAGING_SIGNATURE,
        payload: response.data.attributes,
      });

      dispatch(clearTransaction(response));
    } catch (error) {
      dispatch({
        type: VAP_SERVICE_TRANSACTION_REQUEST_FAILED,
        error,
        fieldName,
      });
    }
  };
};
