import { RESPONSES } from '../../constants/question-data-map';

const {
  DURING_BOTH_PERIODS,
  EIGHTYNINE_OR_EARLIER,
  NO,
  NOT_SURE,
  YES,
} = RESPONSES;

// Refer to the README in this directory for an explanation of display conditions
export const orangeDCs = {
  ORANGE_2_2_A: {
    PATHS: {
      [EIGHTYNINE_OR_EARLIER]: {
        SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
      },
      [DURING_BOTH_PERIODS]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            ONE_OF: {
              BURN_PIT_2_1: [YES],
              BURN_PIT_2_1_1: [YES],
            },
          },
          LONG: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            BURN_PIT_2_1: [NO, NOT_SURE],
            BURN_PIT_2_1_1: [NO, NOT_SURE],
            BURN_PIT_2_1_2: [YES, NO, NOT_SURE],
          },
        },
      },
    },
  },
  ORANGE_2_2_B: {
    PATHS: {
      [EIGHTYNINE_OR_EARLIER]: {
        SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
        ORANGE_2_2_A: [YES],
      },
      [DURING_BOTH_PERIODS]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            ORANGE_2_2_A: [YES],
            ONE_OF: {
              BURN_PIT_2_1: [YES],
              BURN_PIT_2_1_1: [YES],
            },
          },
          LONG: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            BURN_PIT_2_1: [NO, NOT_SURE],
            BURN_PIT_2_1_1: [NO, NOT_SURE],
            BURN_PIT_2_1_2: [YES, NO, NOT_SURE],
            ORANGE_2_2_A: [YES],
          },
        },
      },
    },
  },
  ORANGE_2_2_1_A: {
    PATHS: {
      [EIGHTYNINE_OR_EARLIER]: {
        SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
        ORANGE_2_2_A: [NO, NOT_SURE],
      },
      [DURING_BOTH_PERIODS]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            ORANGE_2_2_A: [NO, NOT_SURE],
            ONE_OF: {
              BURN_PIT_2_1: [YES],
              BURN_PIT_2_1_1: [YES],
            },
          },
          LONG: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            BURN_PIT_2_1: [NO, NOT_SURE],
            BURN_PIT_2_1_1: [NO, NOT_SURE],
            BURN_PIT_2_1_2: [YES, NO, NOT_SURE],
            ORANGE_2_2_A: [NO, NOT_SURE],
          },
        },
      },
    },
  },
  ORANGE_2_2_1_B: {
    PATHS: {
      [EIGHTYNINE_OR_EARLIER]: {
        SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
        ORANGE_2_2_A: [NO, NOT_SURE],
        ORANGE_2_2_1_A: [YES],
      },
      [DURING_BOTH_PERIODS]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            ORANGE_2_2_A: [NO, NOT_SURE],
            ORANGE_2_2_1_A: [YES],
            ONE_OF: {
              BURN_PIT_2_1: [YES],
              BURN_PIT_2_1_1: [YES],
            },
          },
          LONG: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            BURN_PIT_2_1: [NO, NOT_SURE],
            BURN_PIT_2_1_1: [NO, NOT_SURE],
            BURN_PIT_2_1_2: [YES, NO, NOT_SURE],
            ORANGE_2_2_A: [NO, NOT_SURE],
            ORANGE_2_2_1_A: [YES],
          },
        },
      },
    },
  },
  ORANGE_2_2_2: {
    PATHS: {
      [EIGHTYNINE_OR_EARLIER]: {
        SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
        ORANGE_2_2_A: [NO, NOT_SURE],
        ORANGE_2_2_1_A: [NO, NOT_SURE],
      },
      [DURING_BOTH_PERIODS]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            ORANGE_2_2_A: [NO, NOT_SURE],
            ORANGE_2_2_1_A: [NO, NOT_SURE],
            ONE_OF: {
              BURN_PIT_2_1: [YES],
              BURN_PIT_2_1_1: [YES],
            },
          },
          LONG: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            BURN_PIT_2_1: [NO, NOT_SURE],
            BURN_PIT_2_1_1: [NO, NOT_SURE],
            BURN_PIT_2_1_2: [YES, NO, NOT_SURE],
            ORANGE_2_2_A: [NO, NOT_SURE],
            ORANGE_2_2_1_A: [NO, NOT_SURE],
          },
        },
      },
    },
  },
  ORANGE_2_2_3: {
    PATHS: {
      [EIGHTYNINE_OR_EARLIER]: {
        SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
        ORANGE_2_2_A: [NO, NOT_SURE],
        ORANGE_2_2_1_A: [NO, NOT_SURE],
        ORANGE_2_2_2: [NO, NOT_SURE],
      },
      [DURING_BOTH_PERIODS]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            ONE_OF: {
              BURN_PIT_2_1: [YES],
              BURN_PIT_2_1_1: [YES],
            },
            ORANGE_2_2_A: [NO, NOT_SURE],
            ORANGE_2_2_1_A: [NO, NOT_SURE],
            ORANGE_2_2_2: [NO, NOT_SURE],
          },
          LONG: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            BURN_PIT_2_1: [NO, NOT_SURE],
            BURN_PIT_2_1_1: [NO, NOT_SURE],
            BURN_PIT_2_1_2: [YES, NO, NOT_SURE],
            ORANGE_2_2_A: [NO, NOT_SURE],
            ORANGE_2_2_1_A: [NO, NOT_SURE],
            ORANGE_2_2_2: [NO, NOT_SURE],
          },
        },
      },
    },
  },
};
