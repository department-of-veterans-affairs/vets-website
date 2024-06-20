import { RESPONSES } from '../question-data-map';
import { BATCHES } from '../question-batches';

const { BURN_PITS, ORANGE, RADIATION, CAMP_LEJEUNE } = BATCHES;
export const NONE = 'None';

const {
  DURING_BOTH_PERIODS,
  EIGHTYNINE_OR_EARLIER,
  NINETY_OR_LATER,
} = RESPONSES;

// Refer to the README in this directory for an explanation of display conditions
export const resultsDCs = Object.freeze({
  RESULTS: {
    RESULTS_1_1: {
      SERVICE_PERIOD_SELECTION: {
        [NINETY_OR_LATER]: {
          ONLY: [BURN_PITS],
        },
        [EIGHTYNINE_OR_EARLIER]: {
          YES: [ORANGE, RADIATION],
        },
        [DURING_BOTH_PERIODS]: {
          YES: [BURN_PITS, ORANGE, RADIATION],
        },
      },
    },
    RESULTS_2: {
      SERVICE_PERIOD_SELECTION: {
        [EIGHTYNINE_OR_EARLIER]: {
          ONLY: [CAMP_LEJEUNE],
        },
        [DURING_BOTH_PERIODS]: {
          ONLY: [CAMP_LEJEUNE],
        },
      },
    },
    RESULTS_3: {
      SERVICE_PERIOD_SELECTION: {
        [NINETY_OR_LATER]: {
          YES: NONE,
        },
        [EIGHTYNINE_OR_EARLIER]: {
          YES: NONE,
        },
        [DURING_BOTH_PERIODS]: {
          YES: NONE,
        },
      },
    },
  },
});
