const ACTION_TYPES = {
  ONRAMP_VIEWED_INTRO_PAGE: 'ONRAMP_VIEWED_INTRO_PAGE',
};

export const updateIntroPageViewed = value => {
  return {
    type: ACTION_TYPES.ONRAMP_VIEWED_INTRO_PAGE,
    payload: value,
  };
};
