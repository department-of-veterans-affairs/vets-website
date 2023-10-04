import { RESPONSES } from '../../constants/question-data-map';

const { DURING_BOTH_PERIODS, EIGHTYNINE_OR_EARLIER, NO, NOT_SURE } = RESPONSES;

const RADIATION_2_3_B_LOCATIONS = [
  RESPONSES.ENEWETAK_ATOLL,
  RESPONSES.SPAIN_PALOMARES,
  RESPONSES.GREENLAND_THULE,
];

// Refer to the README in this directory for an explanation of display conditions
export const lejeuneDCs = {
  LEJEUNE_2_4: {
    SERVICE_PERIOD_SELECTION: {
      [EIGHTYNINE_OR_EARLIER]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
            RADIATION_2_3_B: RADIATION_2_3_B_LOCATIONS,
          },
          LONG: {
            SERVICE_PERIOD: [EIGHTYNINE_OR_EARLIER],
            RADIATION_2_3_A: [NO, NOT_SURE],
          },
        },
      },
      [DURING_BOTH_PERIODS]: {
        FORK: {
          SHORT: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            RADIATION_2_3_B: RADIATION_2_3_B_LOCATIONS,
          },
          LONG: {
            SERVICE_PERIOD: [DURING_BOTH_PERIODS],
            RADIATION_2_3_A: [NO, NOT_SURE],
          },
        },
      },
    },
  },
};
