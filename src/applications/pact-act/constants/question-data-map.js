// This file serves to be the source of truth for question text and response text
// to make content edits simpler and keep responses DRY
export const QUESTION_MAP = Object.freeze({
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
  RADIATION_2_3_A:
    'Radiation S2.3.A, did you take part in any of these response efforts?',
  RADIATION_2_3_B:
    'Radiation S2.3.B, which response efforts did you participate in?',
  LEJEUNE_2_4:
    'Camp lejeune S2.4, did you spend time at either of these bases in North Carolina?',
});

// Left side must match routes in constants/index.js (ROUTES)
export const SHORT_NAME_MAP = Object.freeze({
  SERVICE_PERIOD: 'SERVICE_PERIOD',
  BURN_PIT_2_1: 'BURN_PIT_2_1',
  BURN_PIT_2_1_1: 'BURN_PIT_2_1_1',
  BURN_PIT_2_1_2: 'BURN_PIT_2_1_2',
  ORANGE_2_2_A: 'ORANGE_2_2_A',
  ORANGE_2_2_B: 'ORANGE_2_2_B',
  ORANGE_2_2_1_A: 'ORANGE_2_2_1_A',
  ORANGE_2_2_1_B: 'ORANGE_2_2_1_B',
  ORANGE_2_2_2: 'ORANGE_2_2_2',
  ORANGE_2_2_3: 'ORANGE_2_2_3',
  RADIATION_2_3_A: 'RADIATION_2_3_A',
  RADIATION_2_3_B: 'RADIATION_2_3_B',
  LEJEUNE_2_4: 'LEJEUNE_2_4',
});

// Left side must match the keys in resultsDcs in constants/display-conditions
export const RESULTS_NAME_MAP = Object.freeze({
  RESULTS_1: 'RESULTS_1',
  RESULTS_2: 'RESULTS_2',
  RESULTS_3: 'RESULTS_3',
});

export const RESPONSES = Object.freeze({
  AMERICAN_SAMOA: 'American Samoa or its territorial waters',
  CAMBODIA: 'Cambodia at Mimot or Krek, Kampong Cham Province',
  DURING_BOTH_PERIODS: 'During both of these time periods',
  EIGHTYNINE_OR_EARLIER: '1989 or earlier',
  ENEWETAK_ATOLL: 'The cleanup of Enewetak Atoll',
  GREENLAND_THULE:
    'The response to an Air Force B-52 bomber fire near Thule Air Force Base in Greenland',
  GUAM: 'Guam or its territorial waters',
  JOHNSTON_ATOLL: 'Johnston Atoll or on a ship that called at Johnston Atoll',
  KOREA_DMZ: 'At or near the Korean Demilitarized Zone (DMZ)',
  LAOS: 'Laos',
  LEJEUNE_MARINE: 'Marine Corps Base Camp Lejeune',
  NEW_RIVER_MARINE: 'Marine Corps Air Station New River',
  NINETY_OR_LATER: '1990 or later',
  NO: 'No',
  NOT_SURE: `I'm not sure`,
  SPAIN_PALOMARES:
    'The cleanup of an Air Force B-52 bomber off the coast of Palomares, Spain',
  THAILAND: 'On a U.S. or Royal Thai military base in Thailand',
  VIETNAM_WATERS: 'The waters in or around Vietnam',
  VIETNAM_REP: 'The Republic of Vietnam',
  YES: 'Yes',
});
