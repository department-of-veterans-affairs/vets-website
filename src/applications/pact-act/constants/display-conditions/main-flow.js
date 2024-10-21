import { RESPONSES } from '../question-data-map';

const {
  DURING_BOTH_PERIODS,
  EIGHTYNINE_OR_EARLIER,
  NINETY_OR_LATER,
  NO,
  NOT_SURE,
  YES,
} = RESPONSES;

const ORANGE_2_2_B_LOCATIONS = [
  RESPONSES.VIETNAM_REP,
  RESPONSES.VIETNAM_WATERS,
  RESPONSES.KOREA_DMZ,
];

const ORANGE_2_2_1_B_LOCATIONS = [
  RESPONSES.AMERICAN_SAMOA,
  RESPONSES.CAMBODIA,
  RESPONSES.GUAM,
  RESPONSES.JOHNSTON_ATOLL,
  RESPONSES.LAOS,
  RESPONSES.THAILAND,
];

const RADIATION_2_3_B_LOCATIONS = [
  RESPONSES.ENEWETAK_ATOLL,
  RESPONSES.SPAIN_PALOMARES,
  RESPONSES.GREENLAND_THULE,
];

// Refer to the README in this directory for an explanation of display conditions
export const mainFlowDCs = Object.freeze({
  MAIN_FLOW_2_5: {
    SERVICE_PERIOD_SELECTION: {
      [NINETY_OR_LATER]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [NINETY_OR_LATER],
            BURN_PIT_2_1: [YES, NO, NOT_SURE],
            ONE_OF: {
              BURN_PIT_2_1_1: [YES, NO, NOT_SURE],
              BURN_PIT_2_1_2: [YES, NO, NOT_SURE],
            },
          },
          LONG: {
            SERVICE_PERIOD: [NINETY_OR_LATER],
            BURN_PIT_2_1: [YES, NO, NOT_SURE],
            BURN_PIT_2_1_1: [NO, NOT_SURE],
            BURN_PIT_2_1_2: [NO, NOT_SURE],
            BURN_PIT_2_1_3: [YES, NO, NOT_SURE],
          },
        },
      },
      [EIGHTYNINE_OR_EARLIER]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
            LEJEUNE_2_4: [YES, NO, NOT_SURE],
            ONE_OF: {
              ORANGE_2_2_B: ORANGE_2_2_B_LOCATIONS,
              ORANGE_2_2_1_B: ORANGE_2_2_1_B_LOCATIONS,
              ORANGE_2_2_2: [YES],
              RADIATION_2_3_B: RADIATION_2_3_B_LOCATIONS,
            },
          },
          LONG: {
            SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
            ORANGE_2_2_A: [NO, NOT_SURE],
            ORANGE_2_2_1_A: [NO, NOT_SURE],
            ORANGE_2_2_2: [NO, NOT_SURE],
            ORANGE_2_2_3: [YES, NO, NOT_SURE],
            RADIATION_2_3_A: [NO, NOT_SURE],
            LEJEUNE_2_4: [YES, NO, NOT_SURE],
          },
        },
      },
      [DURING_BOTH_PERIODS]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            BURN_PIT_2_1: [YES, NO, NOT_SURE],
            LEJEUNE_2_4: [YES, NO, NOT_SURE],
            ONE_OF: {
              BURN_PIT_2_1_1: [YES],
              BURN_PIT_2_1_2: [YES],
              ORANGE_2_2_B: ORANGE_2_2_B_LOCATIONS,
              ORANGE_2_2_1_B: ORANGE_2_2_1_B_LOCATIONS,
              ORANGE_2_2_2: [YES],
              RADIATION_2_3_B: RADIATION_2_3_B_LOCATIONS,
            },
          },
          LONG: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            BURN_PIT_2_1: [YES, NO, NOT_SURE],
            BURN_PIT_2_1_1: [NO, NOT_SURE],
            BURN_PIT_2_1_2: [NO, NOT_SURE],
            BURN_PIT_2_1_3: [YES, NO, NOT_SURE],
            ORANGE_2_2_A: [NO, NOT_SURE],
            ORANGE_2_2_1_A: [NO, NOT_SURE],
            ORANGE_2_2_2: [NO, NOT_SURE],
            ORANGE_2_2_3: [YES, NO, NOT_SURE],
            RADIATION_2_3_A: [NO, NOT_SURE],
            LEJEUNE_2_4: [YES, NO, NOT_SURE],
          },
        },
      },
    },
  },
});
