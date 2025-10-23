import { FILTER_BEFORE_RESULTS } from '../actions';

const INITIAL_STATE = {
  showFiltersBeforeResult: true,
};

const filterBeforeResultsReducer = (state = INITIAL_STATE, action) => {
  if (action.type === FILTER_BEFORE_RESULTS) {
    return {
      ...state,
      showFiltersBeforeResult: false,
    };
  }
  return state;
};
export default filterBeforeResultsReducer;
