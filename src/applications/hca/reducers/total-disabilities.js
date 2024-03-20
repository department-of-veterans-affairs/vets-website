import { DISABILITY_RATING_ACTIONS } from '../utils/constants';

const initialState = {
  loading: true, // app starts in loading state
  error: null,
  totalDisabilityRating: null,
  disabilityDecisionTypeName: null,
};

function totalRating(state = initialState, action) {
  const { response = {}, error = null, type } = action;
  const {
    FETCH_TOTAL_RATING_STARTED,
    FETCH_TOTAL_RATING_FAILED,
    FETCH_TOTAL_RATING_SUCCEEDED,
  } = DISABILITY_RATING_ACTIONS;

  const actionMap = {
    [FETCH_TOTAL_RATING_STARTED]: { ...initialState },
    [FETCH_TOTAL_RATING_FAILED]: {
      ...state,
      loading: false,
      error,
    },
    [FETCH_TOTAL_RATING_SUCCEEDED]: {
      ...state,
      loading: false,
      totalDisabilityRating: response.userPercentOfDisability,
      disabilityDecisionTypeName: response.disabilityDecisionTypeName,
    },
  };

  return actionMap[type] || state;
}

export default totalRating;
