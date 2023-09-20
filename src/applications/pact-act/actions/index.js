import {
  PAW_UPDATE_BURN_PIT_2_1,
  PAW_UPDATE_BURN_PIT_2_1_1,
  PAW_UPDATE_BURN_PIT_2_1_2,
  PAW_UPDATE_SERVICE_PERIOD,
  PAW_VIEWED_INTRO_PAGE,
  PAW_VIEWED_RESULTS_PAGE_1,
} from '../constants';

export const updateIntroPageViewed = value => {
  return {
    type: PAW_VIEWED_INTRO_PAGE,
    payload: value,
  };
};

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

export const updateBurnPit21 = value => {
  return {
    type: PAW_UPDATE_BURN_PIT_2_1,
    payload: value,
  };
};

export const updateBurnPit211 = value => {
  return {
    type: PAW_UPDATE_BURN_PIT_2_1_1,
    payload: value,
  };
};

export const updateBurnPit212 = value => {
  return {
    type: PAW_UPDATE_BURN_PIT_2_1_2,
    payload: value,
  };
};
