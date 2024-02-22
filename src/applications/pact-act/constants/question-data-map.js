// This file serves to be the source of truth for question text and response text
// to make content edits simpler and keep responses DRY
const DID_YOU_SERVE =
  'Did you serve in any of these locations for any amount of time?';
const WHICH_LOCATIONS = 'Which locations did you serve in?';

export const QUESTION_MAP = Object.freeze({
  HOME: 'Learn how the PACT Act may affect you',
  SERVICE_PERIOD:
    'When did you serve in the U.S. military (including time spent in training)?',
  BURN_PIT_2_1: DID_YOU_SERVE,
  BURN_PIT_2_1_1: DID_YOU_SERVE,
  BURN_PIT_2_1_2: DID_YOU_SERVE,
  ORANGE_2_2_A: DID_YOU_SERVE,
  ORANGE_2_2_B: WHICH_LOCATIONS,
  ORANGE_2_2_1_A: DID_YOU_SERVE,
  ORANGE_2_2_1_B: WHICH_LOCATIONS,
  ORANGE_2_2_2: 'Did you have repeated contact with C-123 airplanes?',
  ORANGE_2_2_3: 'Did you help transport, test, store, or use Agent Orange?',
  RADIATION_2_3_A: 'Did you take part in any of these response efforts?',
  RADIATION_2_3_B: 'Which response efforts did you take part in?',
  LEJEUNE_2_4: 'Did you spend time at either of these bases in North Carolina?',
  RESULTS_1_1: 'You may be eligible for VA benefits',
  RESULTS_1_2: 'Apply for VA benefits now',
  RESULTS_2: 'Learn more about Camp Lejeune and VA benefits',
  RESULTS_3: 'Learn more about VA benefit eligibility',
});

// Left side must match routes in constants/index.js (ROUTES)
export const SHORT_NAME_MAP = Object.freeze({
  HOME: 'HOME',
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
  RESULTS_1_1: 'RESULTS_1_1',
  RESULTS_1_2: 'RESULTS_1_2',
  RESULTS_2: 'RESULTS_2',
  RESULTS_3: 'RESULTS_3',
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
  DURING_BOTH_PERIODS: 'During both these time periods',
  EIGHTYNINE_OR_EARLIER: 'Anytime in 1989 or earlier',
  ENEWETAK_ATOLL: 'The cleanup of Enewetak Atoll',
  GREENLAND_THULE:
    'The response to an Air Force B-52 bomber fire near Thule Air Force Base in Greenland',
  GUAM: 'Guam or its territorial waters',
  JOHNSTON_ATOLL: 'Johnston Atoll or on a ship that called at Johnston Atoll',
  KOREA_DMZ: 'At or near the Korean Demilitarized Zone (DMZ)',
  LAOS: 'Laos',
  LEJEUNE_MARINE: 'Marine Corps Base Camp Lejeune',
  NEW_RIVER_MARINE: 'Marine Corps Air Station New River',
  NINETY_OR_LATER: 'Anytime from 1990 to the present',
  NO: 'No',
  NONE: 'None of these response efforts',
  NOT_SURE: `I'm not sure`,
  SPAIN_PALOMARES:
    'The cleanup of an Air Force B-52 bomber off the coast of Palomares, Spain',
  THAILAND: 'On a U.S. or Royal Thai military base in Thailand',
  VIETNAM_WATERS: 'On a military vessel in the waters in or around Vietnam',
  VIETNAM_REP: 'In the Republic of Vietnam',
  YES: 'Yes',
});
