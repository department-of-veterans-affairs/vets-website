import { ALL_QUESTIONS } from '../constants';

export const FORM_ACTION_TYPES = {
  ONRAMP_VIEWED_INTRO_PAGE: 'ONRAMP_VIEWED_INTRO_PAGE',
  ONRAMP_UPDATE_FORM_STORE: 'ONRAMP_UPDATE_FORM_STORE',
};

/**
 * Dynamically generate action types based on the list of questions in SHORT_NAMES
 * Example: {
 *  ONRAMP_UPDATE_Q_1_1_CLAIM_DECISION: 'ONRAMP_UPDATE_Q_1_1_CLAIM_DECISION',
 *  ONRAMP_UPDATE_Q_1_1A_SUBMITTED_526: 'ONRAMP_UPDATE_Q_1_1A_SUBMITTED_526',
 * }
 */
export const makeQuestionActionTypes = () => {
  const actionTypes = {};

  ALL_QUESTIONS.forEach(question => {
    const template = `ONRAMP_UPDATE_${question}`;

    actionTypes[template] = template;
  });

  return actionTypes;
};

export const QUESTION_ACTION_TYPES = makeQuestionActionTypes();

export const updateIntroPageViewed = value => {
  return {
    type: FORM_ACTION_TYPES.ONRAMP_VIEWED_INTRO_PAGE,
    payload: value,
  };
};

export const updateFormStore = value => {
  return {
    type: FORM_ACTION_TYPES.ONRAMP_UPDATE_FORM_STORE,
    payload: value,
  };
};

export const updateQuestionValue = (SHORT_NAME, value) => {
  return {
    type: QUESTION_ACTION_TYPES[`ONRAMP_UPDATE_${SHORT_NAME}`],
    payload: value,
  };
};
