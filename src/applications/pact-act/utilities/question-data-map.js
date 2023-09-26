// This file serves to be the source of truth for question text and response text
// to make content edits simpler and keep responses DRY
export const QUESTION_MAP = {
  SERVICE_PERIOD: 'When did you serve in the U.S. military?',
  BURN_PIT_2_1: 'Burn pit S2.1, did you serve in any of these locations?',
  BURN_PIT_2_1_1: 'Burn pit S2.1.1, did you serve in any of these locations?',
  BURN_PIT_2_1_2: 'Burn pit S2.1.2, did you serve in any of these locations?',
  ORANGE_2_2_A: 'Agent orange S2.2A, did you serve in any of these locations?',
  ORANGE_2_2_B: 'Agent orange S2.2B, which locations did you serve in?',
  ORANGE_2_2_1_A:
    'Agent orange S2.2.1A, did you serve in any of these locations?',
  ORANGE_2_2_1_B: 'Agent orange S2.2.1B, which locations did you serve in?',
  ORANGE_2_2_2:
    'Agent orange S2.2.2, did you have repeated contact with C-123 airplanes?',
  ORANGE_2_2_3:
    'Agent orange S2.2.3, did you help transport, test, store, or use Agent Orange?',
};

// Left side must match routes in constants/index.js (ROUTES)
export const SHORT_NAME_MAP = {
  SERVICE_PERIOD: 'SERVICE_PERIOD',
  BURN_PIT_2_1: 'BURN_PIT_2_1',
  BURN_PIT_2_1_1: 'BURN_PIT_2_1_1',
  BURN_PIT_2_1_2: 'BURN_PIT_2_1_2',
  ORANGE_2_2_B: 'ORANGE_2_2_B',
  ORANGE_2_2_1_A: 'ORANGE_2_2_1_A',
  ORANGE_2_2_1_B: 'ORANGE_2_2_1_B',
  ORANGE_2_2_2: 'ORANGE_2_2_2',
  ORANGE_2_2_3: 'ORANGE_2_2_3',
};

export const RESPONSES = {
  DURING_BOTH_PERIODS: 'During both of these time periods',
  EIGHTYNINE_OR_EARLIER: '1989 or earlier',
  NINETY_OR_LATER: '1990 or later',
  NO: 'No',
  NOT_SURE: `I'm not sure`,
  YES: 'Yes',
};
