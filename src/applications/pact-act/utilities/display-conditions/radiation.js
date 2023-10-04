import { RESPONSES } from '../../constants/question-data-map';

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
export const radiationDCs = {
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
            ORANGE_2_2_3: [YES, NO, NOT_SURE],
          },
        },
      },
      [DURING_BOTH_PERIODS]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            ONE_OF: {
              ORANGE_2_2_B: ORANGE_2_2_B_LOCATIONS,
              ORANGE_2_2_1_B: ORANGE_2_2_1_B_LOCATIONS,
              ORANGE_2_2_2: [YES],
            },
          },
          LONG: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            ORANGE_2_2_3: [YES, NO, NOT_SURE],
          },
        },
      },
    },
  },
  RADIATION_2_3_B: {
    SERVICE_PERIOD_SELECTION: {
      [EIGHTYNINE_OR_EARLIER]: {
        SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
        RADIATION_2_3_A: [YES],
      },
      [DURING_BOTH_PERIODS]: {
        SERVICE_PERIOD: [DURING_BOTH_PERIODS],
        RADIATION_2_3_A: [YES],
      },
    },
  },
};
