export const ACTION_TYPES = {
  ONRAMP_VIEWED_INTRO_PAGE: 'ONRAMP_VIEWED_INTRO_PAGE',
  ONRAMP_UPDATE_Q_1_1_CLAIM_DECISION: 'ONRAMP_UPDATE_Q_1_1_CLAIM_DECISION',
};

export const updateIntroPageViewed = value => {
  return {
    type: ACTION_TYPES.ONRAMP_VIEWED_INTRO_PAGE,
    payload: value,
  };
};
