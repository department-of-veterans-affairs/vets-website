import {
  PAW_VIEWED_INTRO_PAGE,
  PAW_UPDATE_SERVICE_PERIOD,
  PAW_UPDATE_BURN_PIT_2_1,
  PAW_UPDATE_BURN_PIT_2_1_1,
  PAW_UPDATE_BURN_PIT_2_1_2,
  PAW_UPDATE_ORANGE_2_2_A,
  PAW_UPDATE_ORANGE_2_2_B,
  PAW_UPDATE_ORANGE_2_2_1_A,
  PAW_UPDATE_ORANGE_2_2_1_B,
  PAW_UPDATE_ORANGE_2_2_2,
  PAW_UPDATE_ORANGE_2_2_3,
  PAW_UPDATE_RADIATION_2_3_A,
  PAW_UPDATE_RADIATION_2_3_B,
  PAW_UPDATE_LEJEUNE_2_4,
  PAW_UPDATE_FORM_STORE,
} from '../constants';

export const updateIntroPageViewed = value => {
  return {
    type: PAW_VIEWED_INTRO_PAGE,
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

export const updateOrange22A = value => {
  return {
    type: PAW_UPDATE_ORANGE_2_2_A,
    payload: value,
  };
};

export const updateOrange22B = value => {
  return {
    type: PAW_UPDATE_ORANGE_2_2_B,
    payload: value,
  };
};

export const updateOrange221A = value => {
  return {
    type: PAW_UPDATE_ORANGE_2_2_1_A,
    payload: value,
  };
};

export const updateOrange221B = value => {
  return {
    type: PAW_UPDATE_ORANGE_2_2_1_B,
    payload: value,
  };
};

export const updateOrange222 = value => {
  return {
    type: PAW_UPDATE_ORANGE_2_2_2,
    payload: value,
  };
};

export const updateOrange223 = value => {
  return {
    type: PAW_UPDATE_ORANGE_2_2_3,
    payload: value,
  };
};

export const updateRadiation23A = value => {
  return {
    type: PAW_UPDATE_RADIATION_2_3_A,
    payload: value,
  };
};

export const updateRadiation23B = value => {
  return {
    type: PAW_UPDATE_RADIATION_2_3_B,
    payload: value,
  };
};

export const updateLejeune24 = value => {
  return {
    type: PAW_UPDATE_LEJEUNE_2_4,
    payload: value,
  };
};

export const updateFormStore = value => {
  return {
    type: PAW_UPDATE_FORM_STORE,
    payload: value,
  };
};
