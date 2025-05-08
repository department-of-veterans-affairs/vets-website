import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { API_ENDPOINTS, DISABILITY_RATING_ACTIONS } from '../constants';
import { parseResponseErrors } from '../helpers';

/**
 * Action to fetch users total disability rating
 * @returns {Promise} - resolves to calling the reducer to set the
 * correct state variables for disability rating
 */
export const fetchTotalDisabilityRating = () => async dispatch => {
  const {
    FETCH_DISABILITY_RATING_STARTED,
    FETCH_DISABILITY_RATING_FAILED,
    FETCH_DISABILITY_RATING_SUCCEEDED,
  } = DISABILITY_RATING_ACTIONS;

  dispatch({ type: FETCH_DISABILITY_RATING_STARTED });

  try {
    const { data } = await apiRequest(API_ENDPOINTS.ratingInfo);
    dispatch({
      type: FETCH_DISABILITY_RATING_SUCCEEDED,
      response: data.attributes,
    });
  } catch (error) {
    const { code, detail } = parseResponseErrors(error);
    dispatch({
      type: FETCH_DISABILITY_RATING_FAILED,
      error: { code, detail },
    });
  }
};
