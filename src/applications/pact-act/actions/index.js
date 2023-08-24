import { PAW_VIEWED_RESULTS_PAGE_1 } from '../constants';

export const updateResultsPage1Viewed = value => {
  return {
    type: PAW_VIEWED_RESULTS_PAGE_1,
    payload: value,
  };
};
