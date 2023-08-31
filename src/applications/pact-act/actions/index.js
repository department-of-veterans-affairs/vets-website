import {
  PAW_UPDATE_BURN_PIT_210,
  PAW_UPDATE_SERVICE_PERIOD,
  PAW_VIEWED_RESULTS_PAGE_1,
} from '../constants';

export const updateResultsPage1Viewed = value => {
  return {
    type: PAW_VIEWED_RESULTS_PAGE_1,
    payload: value,
  };
};

export const updateServicePeriod = value => {
  return {
    type: PAW_UPDATE_SERVICE_PERIOD,
    payload: value,
  };
};

export const updateBurnPit210 = value => {
  return {
    type: PAW_UPDATE_BURN_PIT_210,
    payload: value,
  };
};
