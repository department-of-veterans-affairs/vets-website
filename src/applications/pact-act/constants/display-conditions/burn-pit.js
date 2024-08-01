import { RESPONSES } from '../question-data-map';

const { DURING_BOTH_PERIODS, NINETY_OR_LATER, NO, NOT_SURE, YES } = RESPONSES;

// Refer to the README in this directory for an explanation of display conditions
export const burnPitDCs = Object.freeze({
  BURN_PIT_2_1: {
    SERVICE_PERIOD_SELECTION: {
      [NINETY_OR_LATER]: {
        SERVICE_PERIOD: [NINETY_OR_LATER],
      },
      [DURING_BOTH_PERIODS]: {
        SERVICE_PERIOD: [DURING_BOTH_PERIODS],
      },
    },
  },
  BURN_PIT_2_1_1: {
    SERVICE_PERIOD_SELECTION: {
      [NINETY_OR_LATER]: {
        SERVICE_PERIOD: [NINETY_OR_LATER],
        BURN_PIT_2_1: [YES, NO, NOT_SURE],
      },
      [DURING_BOTH_PERIODS]: {
        SERVICE_PERIOD: [DURING_BOTH_PERIODS],
        BURN_PIT_2_1: [YES, NO, NOT_SURE],
      },
    },
  },
  BURN_PIT_2_1_2: {
    SERVICE_PERIOD_SELECTION: {
      [NINETY_OR_LATER]: {
        SERVICE_PERIOD: [NINETY_OR_LATER],
        BURN_PIT_2_1: [YES, NO, NOT_SURE],
        BURN_PIT_2_1_1: [NO, NOT_SURE],
      },
      [DURING_BOTH_PERIODS]: {
        SERVICE_PERIOD: [DURING_BOTH_PERIODS],
        BURN_PIT_2_1: [YES, NO, NOT_SURE],
        BURN_PIT_2_1_1: [NO, NOT_SURE],
      },
    },
  },
  BURN_PIT_2_1_3: {
    SERVICE_PERIOD_SELECTION: {
      [NINETY_OR_LATER]: {
        SERVICE_PERIOD: [NINETY_OR_LATER],
        BURN_PIT_2_1: [YES, NO, NOT_SURE],
        BURN_PIT_2_1_1: [NO, NOT_SURE],
        BURN_PIT_2_1_2: [NO, NOT_SURE],
      },
      [DURING_BOTH_PERIODS]: {
        SERVICE_PERIOD: [DURING_BOTH_PERIODS],
        BURN_PIT_2_1: [YES, NO, NOT_SURE],
        BURN_PIT_2_1_1: [NO, NOT_SURE],
        BURN_PIT_2_1_2: [NO, NOT_SURE],
      },
    },
  },
});
