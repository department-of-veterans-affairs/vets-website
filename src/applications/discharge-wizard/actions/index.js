import {
  DW_UPDATE_FIELD,
  // v2 actions
  DUW_VIEWED_INTRO_PAGE,
  DUW_UPDATE_SERVICE_BRANCH,
  DUW_UPDATE_DISCHARGE_YEAR,
  DUW_UPDATE_DISCHARGE_MONTH,
  DUW_UPDATE_FORM_STORE,
} from '../constants';

export const updateField = (key, value) => {
  return {
    type: DW_UPDATE_FIELD,
    key,
    value,
  };
};

export const updateIntroPageViewed = value => {
  return {
    type: DUW_VIEWED_INTRO_PAGE,
    payload: value,
  };
};

export const updateServiceBranch = value => {
  return {
    type: DUW_UPDATE_SERVICE_BRANCH,
    payload: value,
  };
};

export const updateDischargeYear = value => {
  return {
    type: DUW_UPDATE_DISCHARGE_YEAR,
    payload: value,
  };
};

export const updateDischargeMonth = value => {
  return {
    type: DUW_UPDATE_DISCHARGE_MONTH,
    payload: value,
  };
};

export const updateFormStore = value => {
  return {
    type: DUW_UPDATE_FORM_STORE,
    payload: value,
  };
};
