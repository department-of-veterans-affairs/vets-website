import {
  DISABILITY_RATING_ACTIONS,
  DISABILITY_RATING_INIT_STATE,
} from '../utils/constants';

function disabilityRating(state = DISABILITY_RATING_INIT_STATE, action) {
  const { response = {}, error = null, type } = action;
  const {
    FETCH_DISABILITY_RATING_STARTED,
    FETCH_DISABILITY_RATING_FAILED,
    FETCH_DISABILITY_RATING_SUCCEEDED,
  } = DISABILITY_RATING_ACTIONS;

  const actionMap = {
    [FETCH_DISABILITY_RATING_STARTED]: () => ({
      ...DISABILITY_RATING_INIT_STATE,
    }),
    [FETCH_DISABILITY_RATING_FAILED]: () => ({
      ...state,
      loading: false,
      error,
    }),
    [FETCH_DISABILITY_RATING_SUCCEEDED]: () => {
      const { userPercentOfDisability: totalRating } = response;
      return { ...state, loading: false, totalRating };
    },
  };

  return actionMap[type] ? actionMap[type]() : state;
}

export default disabilityRating;
