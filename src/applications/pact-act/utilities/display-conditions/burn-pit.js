import { RESPONSES } from '../../constants/question-data-map';

const { DURING_BOTH_PERIODS, NINETY_OR_LATER, NO, NOT_SURE } = RESPONSES;

// Refer to the README in this directory for an explanation of display conditions
export const burnPitDCs = {
  BURN_PIT_2_1: {
    PATHS: {
      [NINETY_OR_LATER]: {
        SERVICE_PERIOD: [NINETY_OR_LATER],
      },
      [DURING_BOTH_PERIODS]: {
        SERVICE_PERIOD: [DURING_BOTH_PERIODS],
      },
    },
  },
  BURN_PIT_2_1_1: {
    PATHS: {
      [NINETY_OR_LATER]: {
        SERVICE_PERIOD: [NINETY_OR_LATER],
        BURN_PIT_2_1: [NO, NOT_SURE],
      },
      [DURING_BOTH_PERIODS]: {
        SERVICE_PERIOD: [DURING_BOTH_PERIODS],
        BURN_PIT_2_1: [NO, NOT_SURE],
      },
    },
  },
  BURN_PIT_2_1_2: {
    PATHS: {
      [NINETY_OR_LATER]: {
        SERVICE_PERIOD: [NINETY_OR_LATER],
        BURN_PIT_2_1: [NO, NOT_SURE],
        BURN_PIT_2_1_1: [NO, NOT_SURE],
      },
      [DURING_BOTH_PERIODS]: {
        SERVICE_PERIOD: [DURING_BOTH_PERIODS],
        BURN_PIT_2_1: [NO, NOT_SURE],
        BURN_PIT_2_1_1: [NO, NOT_SURE],
      },
    },
  },
};
