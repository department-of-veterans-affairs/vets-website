// This file serves to be the source of truth for question text and response text
// to make content edits simpler and keep responses DRY
export const QUESTION_MAP = {
  SERVICE_PERIOD: 'When did you serve in the U.S. military?',
  BURN_PIT_2_1: 'Burn pit S2.1, did you serve in any of these locations?',
  BURN_PIT_2_1_1: 'Burn pit S2.1.1, did you serve in any of these locations?',
  BURN_PIT_2_1_2: 'Burn pit S2.1.2, did you serve in any of these locations?',
};

// Left side must match routes in constants/index.js (ROUTES)
export const SHORT_NAME_MAP = {
  SERVICE_PERIOD: 'SERVICE_PERIOD',
  BURN_PIT_2_1: 'BURN_PIT_2_1',
  BURN_PIT_2_1_1: 'BURN_PIT_2_1_1',
  BURN_PIT_2_1_2: 'BURN_PIT_2_1_2',
};

export const RESPONSES = {
  DURING_BOTH_PERIODS: 'During both of these time periods',
  EIGHTYNINE_OR_EARLIER: '1989 or earlier',
  NINETY_OR_LATER: '1990 or later',
  NO: 'No',
  NOT_SURE: `I'm not sure`,
  YES: 'Yes',
};
