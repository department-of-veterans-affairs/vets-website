import recordEvent from 'platform/monitoring/record-event';
import { apiRequest } from 'platform/utilities/api';

import { DISABILITY_PREFIX, DISABILITY_RATING_ACTIONS } from '../constants';
import {
  isClientError,
  isServerError,
  parseResponseErrors,
} from '../helpers/disability-rating';

/**
 * Action to fetch users total disability rating
 * @returns {Promise} - resolves to calling the reducer to set the correct state variables
 * for disability rating
 */
export function fetchTotalDisabilityRating() {
  return dispatch => {
    const {
      FETCH_DISABILITY_RATING_STARTED,
      FETCH_DISABILITY_RATING_FAILED,
      FETCH_DISABILITY_RATING_SUCCEEDED,
    } = DISABILITY_RATING_ACTIONS;
    const requestUrl = `/health_care_applications/rating_info`;

    dispatch({ type: FETCH_DISABILITY_RATING_STARTED });

    return apiRequest(requestUrl)
      .then(result => {
        recordEvent({ event: `${DISABILITY_PREFIX}-combined-load-success` });
        const {
          data: { attributes: response },
        } = result;
        return dispatch({
          type: FETCH_DISABILITY_RATING_SUCCEEDED,
          response,
        });
      })
      .catch(result => {
        const { code, detail } = parseResponseErrors(result);
        let message;

        if (isServerError(code)) {
          message = `${code} internal error`;
        } else if (isClientError(code)) {
          message = `${code} no combined rating found`;
        }

        recordEvent({
          event: `${DISABILITY_PREFIX}-combined-load-failed`,
          'error-key': message,
        });
        return dispatch({
          type: FETCH_DISABILITY_RATING_FAILED,
          error: { code, detail },
        });
      });
  };
}
