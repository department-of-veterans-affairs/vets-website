import { apiRequest } from 'platform/utilities/api';
import head from 'lodash/head';
import { MDOT_API_STATES, MDOT_API_URL } from '../constants';

export const handleError = (statusCode, errorCode) => ({
  type: MDOT_API_STATES.ERROR,
  statusCode,
  errorCode,
});

export const handleSuccess = data => ({
  type: MDOT_API_STATES.SUCCESS,
  statusCode: '200',
  data,
});

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
      if (body.errors) {
        const mdotError = head(body.errors);
        return dispatch(handleError(mdotError.status, mdotError.code));
      }
      return dispatch(handleSuccess(body.formData));
    })
    .catch(error => {
      if (error.errors) {
        const mdotError = head(error.errors);
        return dispatch(handleError(mdotError.status, mdotError.code));
      }
      // We don't have error information from the API, so assume a server error.
      return dispatch(handleError('500', 'MDOT_SERVER_ERROR'));
    });
  return null;
};
