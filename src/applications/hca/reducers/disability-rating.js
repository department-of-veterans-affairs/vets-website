import {
  DISABILITY_RATING_ACTIONS,
  DISABILITY_RATING_INIT_STATE,
} from '../utils/constants';

/**
 * Map proper data values to disability rating actions
 * @param {Object} state - initial data object to map
 * @param {Object} action - dispatched action to perform
 * @returns {Boolean} - mapped data object or initial state object if action type is
 * not relevant to this function
 */
function disabilityRating(state = DISABILITY_RATING_INIT_STATE, action) {
  const { response = {}, error = null, type } = action;
  const {
    FETCH_DISABILITY_RATING_STARTED,
    FETCH_DISABILITY_RATING_FAILED,
    FETCH_DISABILITY_RATING_SUCCEEDED,
  } = DISABILITY_RATING_ACTIONS;

  const actionMap = {
    [FETCH_DISABILITY_RATING_STARTED]: () => ({ ...state, loading: true }),
    [FETCH_DISABILITY_RATING_FAILED]: () => ({ ...state, error }),
    [FETCH_DISABILITY_RATING_SUCCEEDED]: () => {
      const { userPercentOfDisability: totalDisabilityRating } = response;
      return { ...state, totalDisabilityRating };
    },
  };

  return actionMap[type] ? actionMap[type]() : state;
}

export default disabilityRating;
