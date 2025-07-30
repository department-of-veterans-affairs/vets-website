export const ACTION_TYPES = {
  ONRAMP_VIEWED_INTRO_PAGE: 'ONRAMP_VIEWED_INTRO_PAGE',
  ONRAMP_UPDATE_CLAIM_DECISION_1_1: 'ONRAMP_UPDATE_CLAIM_DECISION_1_1',
};

export const updateIntroPageViewed = value => {
  return {
    type: ACTION_TYPES.ONRAMP_VIEWED_INTRO_PAGE,
    payload: value,
  };
};
