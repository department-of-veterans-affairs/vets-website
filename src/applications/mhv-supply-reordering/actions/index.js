import { apiRequest } from 'platform/utilities/api';
import { MDOT_API_STATES, MDOT_API_URL } from '../constants';

/**
 * Generate a data object for an API error to send as part of the dispatch.
 * @param {string} statusCode the error status code (e.g. 500)
 * @param {string} errorCode  the error code (e.g. MDOT_INVALID)
 * @returns object to send to dispatch
 */
export const handleError = (statusCode, errorCode) => ({
  type: MDOT_API_STATES.ERROR,
  statusCode,
  errorCode,
});

/**
 * Generate a data object for an API success to send as part of the dispatch.
 * @param {Object} data the response from the API
 * @returns object to send to dispatch
 */
export const handleSuccess = data => ({
  type: MDOT_API_STATES.SUCCESS,
  statusCode: '200',
  data,
});

/**
 * Generate a data object for an API request pending to send as part of the dispatch.
 * @returns object to send to dispatch
 */
export const initiateApiCall = () => ({
  type: MDOT_API_STATES.PENDING,
});

/**
 * Fetch MDOT data. The data or errors are stored as part of the dispatch payload.
 * @returns a dispatch
 */
// TODO: Report errors
export const fetchMdotData = () => async dispatch => {
  dispatch(initiateApiCall());
  apiRequest(MDOT_API_URL)
    .then(body => {
      if (body.errors && body.errors.length > 0) {
        const mdotError = body.errors[0];
        return dispatch(handleError(mdotError.status, mdotError.code));
      }
      return dispatch(handleSuccess(body.formData));
    })
    .catch(error => {
      if (error.errors && error.errors.length > 0) {
        const mdotError = error.errors[0];
        return dispatch(handleError(mdotError.status, mdotError.code));
      }
      // We don't have error information from the API, so assume a server error.
      return dispatch(handleError('500', 'MDOT_SERVER_ERROR'));
    });
  return null;
};
