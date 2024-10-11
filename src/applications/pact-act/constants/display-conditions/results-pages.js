import { RESPONSES, SHORT_NAME_MAP } from '../question-data-map';
import { BATCHES } from '../question-batches';

const { BURN_PITS, ORANGE, RADIATION, CAMP_LEJEUNE } = BATCHES;
const { BURN_PIT_2_1, MAIN_FLOW_2_5 } = SHORT_NAME_MAP;
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
    // Because results page 4 requires answers to specific questions rather than any answer in a batch,
    // it must be evaluated first when determining the results page as other results pages'
    // display conditions may also be true
    RESULTS_4: {
      SERVICE_PERIOD_SELECTION: {
        [NINETY_OR_LATER]: {
          YES: [BURN_PIT_2_1, MAIN_FLOW_2_5],
        },
        [EIGHTYNINE_OR_EARLIER]: {
          YES: [BURN_PIT_2_1, MAIN_FLOW_2_5],
        },
        [DURING_BOTH_PERIODS]: {
          YES: [BURN_PIT_2_1, MAIN_FLOW_2_5],
        },
      },
    },
  },
});
