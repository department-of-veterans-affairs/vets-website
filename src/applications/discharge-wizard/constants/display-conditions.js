import { range } from 'lodash';
import { RESPONSES } from './question-data-map';

const get15YearsPast = () => `${new Date().getFullYear() - 15}`;
const currentYear = new Date().getFullYear();
const yearResponses = range(currentYear - 1992).map(i => {
  const year = currentYear - i;
  return year.toString();
});
const {
  ARMY,
  NAVY,
  AIR_FORCE,
  COAST_GUARD,
  MARINE_CORPS,
  REASON_1,
  REASON_2,
  REASON_3,
  REASON_4,
  REASON_5,
  REASON_8,
  REASON_6,
  REASON_7,
  COURT_MARTIAL_1,
  COURT_MARTIAL_2,
  COURT_MARTIAL_3,
  PREV_APPLICATION_1,
  PREV_APPLICATION_2,
  //   DISCHARGE_TYPE_1,
  DISCHARGE_TYPE_2,
  PREV_APPLICATION_YEAR_1A,
  PREV_APPLICATION_YEAR_1B,
  PREV_APPLICATION_YEAR_1C,
  PREV_APPLICATION_YEAR_2A,
  PREV_APPLICATION_YEAR_2B,
  PREV_APPLICATION_YEAR_2C,
} = RESPONSES;

export const DISPLAY_CONDITIONS = Object.freeze({
  SERVICE_BRANCH: {},
  DISCHARGE_YEAR: {
    SERVICE_BRANCH: [ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS],
  },
  DISCHARGE_MONTH: {
    SERVICE_BRANCH: [ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS],
    DISCHARGE_YEAR: [get15YearsPast()],
  },
  REASON: {
    SERVICE_BRANCH: [ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS],
    DISCHARGE_YEAR: yearResponses,
    DISCHARGE_MONTH: [],
  },
  DISCHARGE_TYPE: {
    SERVICE_BRANCH: [ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS],
    DISCHARGE_YEAR: yearResponses,
    DISCHARGE_MONTH: [],
    REASON: [REASON_3],
  },
  INTENTION: {
    SERVICE_BRANCH: [ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS],
    DISCHARGE_YEAR: yearResponses,
    DISCHARGE_MONTH: [],
    REASON: [REASON_1, REASON_2, REASON_3, REASON_4, REASON_6, REASON_7],
  },
  COURT_MARTIAL: {
    SERVICE_BRANCH: [ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS],
    DISCHARGE_YEAR: yearResponses,
    DISCHARGE_MONTH: [],
    REASON: [
      REASON_5,
      REASON_1,
      REASON_2,
      REASON_3,
      REASON_4,
      REASON_6,
      REASON_7,
    ],
  },
  PREV_APPLICATION: {
    SERVICE_BRANCH: [ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS],
    DISCHARGE_YEAR: yearResponses,
    DISCHARGE_MONTH: [],
    REASON: [
      REASON_5,
      REASON_1,
      REASON_2,
      REASON_3,
      REASON_4,
      REASON_6,
      REASON_7,
    ],
    COURT_MARTIAL: [COURT_MARTIAL_1, COURT_MARTIAL_2, COURT_MARTIAL_3],
  },
  PREV_APPLICATION_YEAR: {
    SERVICE_BRANCH: [ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS],
    DISCHARGE_YEAR: yearResponses,
    DISCHARGE_MONTH: [],
    REASON: [REASON_1, REASON_2, REASON_3, REASON_4],
    COURT_MARTIAL: [COURT_MARTIAL_1, COURT_MARTIAL_2, COURT_MARTIAL_3],
    PREV_APPLICATION: [PREV_APPLICATION_1],
  },
  PREV_APPLICATION_TYPE: {
    FORK: {
      0: {
        SERVICE_BRANCH: [ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS],
        DISCHARGE_YEAR: yearResponses,
        DISCHARGE_MONTH: [],
        REASON: [REASON_8],
      },
      1: {
        SERVICE_BRANCH: [ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS],
        DISCHARGE_YEAR: yearResponses,
        DISCHARGE_MONTH: [],
        REASON: [
          REASON_1,
          REASON_2,
          REASON_3,
          REASON_4,
          REASON_5,
          REASON_6,
          REASON_7,
          REASON_8,
        ],
        PREV_APPLICATION_YEAR: [
          PREV_APPLICATION_YEAR_2A,
          PREV_APPLICATION_YEAR_2B,
          PREV_APPLICATION_YEAR_2C,
        ],
      },
    },
  },
  PRIOR_SERVICE: {
    FORK: {
      0: {
        SERVICE_BRANCH: [ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS],
        DISCHARGE_YEAR: yearResponses,
        DISCHARGE_MONTH: [],
        REASON: [
          REASON_1,
          REASON_2,
          REASON_3,
          REASON_4,
          REASON_6,
          REASON_7,
          REASON_8,
        ],
        DISCHARGE_TYPE: [DISCHARGE_TYPE_2],
        PREV_APPLICATION: [PREV_APPLICATION_2],
      },
      1: {
        SERVICE_BRANCH: [ARMY, NAVY, AIR_FORCE, COAST_GUARD, MARINE_CORPS],
        DISCHARGE_YEAR: yearResponses,
        DISCHARGE_MONTH: [],
        REASON: [
          REASON_1,
          REASON_2,
          REASON_3,
          REASON_4,
          REASON_6,
          REASON_7,
          REASON_8,
        ],
        DISCHARGE_TYPE: [DISCHARGE_TYPE_2],
        PREV_APPLICATION_YEAR: [
          PREV_APPLICATION_YEAR_1A,
          PREV_APPLICATION_YEAR_1B,
          PREV_APPLICATION_YEAR_1C,
        ],
      },
    },
  },
});
