import { PAW_VIEWED_RESULTS_PAGE_1 } from '../constants';

const initialState = {
  viewedResultsPage1: false,
};

const pactAct = (state = initialState, action) => {
  if (action.type === PAW_VIEWED_RESULTS_PAGE_1) {
    return {
      ...state,
      viewedResultsPage1: action.payload,
    };
  }

  return state;
};

export default {
  pactAct,
};
