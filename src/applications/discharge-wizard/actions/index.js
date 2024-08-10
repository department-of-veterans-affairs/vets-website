import {
  DW_UPDATE_FIELD,
  // v2 actions
  DUW_UPDATE_FORM_STORE,
  DUW_VIEWED_INTRO_PAGE,
  DUW_UPDATE_SERVICE_BRANCH,
  DUW_UPDATE_DISCHARGE_YEAR,
  DUW_UPDATE_DISCHARGE_MONTH,
  DUW_UPDATE_REASON,
  DUW_UPDATE_DISCHARGE_TYPE,
  DUW_UPDATE_COURT_MARTIAL,
  DUW_UPDATE_INTENTION,
  DUW_UPDATE_PREV_APPLICATION,
  DUW_UPDATE_PREV_APPLICATION_TYPE,
  DUW_UPDATE_PREV_APPLICATION_YEAR,
  DUW_UPDATE_PRIOR_SERVICE,
  DUW_UPDATE_FAILURE_TO_EXHAUST,
  DUW_EDIT_MODE,
  DUW_QUESTION_FLOW_CHANGED,
} from '../constants';

export const updateField = (key, value) => {
  return {
    type: DW_UPDATE_FIELD,
    key,
    value,
  };
};

export const updateFormStore = value => {
  return {
    type: DUW_UPDATE_FORM_STORE,
    payload: value,
  };
};

export const updateIntroPageViewed = value => {
  return {
    type: DUW_VIEWED_INTRO_PAGE,
    payload: value,
  };
};

export const updateEditMode = value => {
  return {
    type: DUW_EDIT_MODE,
    payload: value,
  };
};

export const updateQuestionFlowChanged = value => {
  return {
    type: DUW_QUESTION_FLOW_CHANGED,
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

export const updateReason = value => {
  return {
    type: DUW_UPDATE_REASON,
    payload: value,
  };
};

export const updateCourtMartial = value => {
  return {
    type: DUW_UPDATE_COURT_MARTIAL,
    payload: value,
  };
};

export const updateIntention = value => {
  return {
    type: DUW_UPDATE_INTENTION,
    payload: value,
  };
};

export const updateDischargeType = value => {
  return {
    type: DUW_UPDATE_DISCHARGE_TYPE,
    payload: value,
  };
};

export const updatePrevApplication = value => {
  return {
    type: DUW_UPDATE_PREV_APPLICATION,
    payload: value,
  };
};

export const updatePrevApplicationType = value => {
  return {
    type: DUW_UPDATE_PREV_APPLICATION_TYPE,
    payload: value,
  };
};

export const updatePrevApplicationYear = value => {
  return {
    type: DUW_UPDATE_PREV_APPLICATION_YEAR,
    payload: value,
  };
};

export const updatePriorService = value => {
  return {
    type: DUW_UPDATE_PRIOR_SERVICE,
    payload: value,
  };
};

export const updateFailureToExhaust = value => {
  return {
    type: DUW_UPDATE_FAILURE_TO_EXHAUST,
    payload: value,
  };
};
