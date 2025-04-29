import { RESPONSES } from '../question-data-map';

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

const {
  DURING_BOTH_PERIODS,
  EIGHTYNINE_OR_EARLIER,
  NO,
  NOT_SURE,
  YES,
} = RESPONSES;

// Refer to the README in this directory for an explanation of display conditions
export const radiationDCs = Object.freeze({
  RADIATION_2_3_A: {
    SERVICE_PERIOD_SELECTION: {
      [EIGHTYNINE_OR_EARLIER]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
            ONE_OF: {
              ORANGE_2_2_B: ORANGE_2_2_B_LOCATIONS,
              ORANGE_2_2_1_B: ORANGE_2_2_1_B_LOCATIONS,
              ORANGE_2_2_2: [YES],
            },
          },
          LONG: {
            SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
            ORANGE_2_2_A: [NO, NOT_SURE],
            ORANGE_2_2_1_A: [NO, NOT_SURE],
            ORANGE_2_2_2: [NO, NOT_SURE],
            ORANGE_2_2_3: [YES, NO, NOT_SURE],
          },
        },
      },
      [DURING_BOTH_PERIODS]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            BURN_PIT_2_1: [YES, NO, NOT_SURE],
            ONE_OF: {
              BURN_PIT_2_1_1: [YES],
              BURN_PIT_2_1_2: [YES],
              ORANGE_2_2_B: ORANGE_2_2_B_LOCATIONS,
              ORANGE_2_2_1_B: ORANGE_2_2_1_B_LOCATIONS,
              ORANGE_2_2_2: [YES],
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
          },
        },
      },
    },
  },
  RADIATION_2_3_B: {
    SERVICE_PERIOD_SELECTION: {
      [EIGHTYNINE_OR_EARLIER]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
            ONE_OF: {
              ORANGE_2_2_B: ORANGE_2_2_B_LOCATIONS,
              ORANGE_2_2_1_B: ORANGE_2_2_1_B_LOCATIONS,
              ORANGE_2_2_2: [YES],
            },
            RADIATION_2_3_A: [YES],
          },
          LONG: {
            SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
            ORANGE_2_2_A: [NO, NOT_SURE],
            ORANGE_2_2_1_A: [NO, NOT_SURE],
            ORANGE_2_2_2: [NO, NOT_SURE],
            ORANGE_2_2_3: [YES, NO, NOT_SURE],
            RADIATION_2_3_A: [YES],
          },
        },
      },
      [DURING_BOTH_PERIODS]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            BURN_PIT_2_1: [YES, NO, NOT_SURE],
            ONE_OF: {
              BURN_PIT_2_1_1: [YES],
              BURN_PIT_2_1_2: [YES],
              ORANGE_2_2_B: ORANGE_2_2_B_LOCATIONS,
              ORANGE_2_2_1_B: ORANGE_2_2_1_B_LOCATIONS,
              ORANGE_2_2_2: [YES],
            },
            RADIATION_2_3_A: [YES],
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
            RADIATION_2_3_A: [YES],
          },
        },
      },
    },
  },
});
