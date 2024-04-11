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
  //   REASON_8,
  REASON_6,
  REASON_7,
  //   INTENTION_1,
  //   INTENTION_2,
  //   COURT_MARTIAL_1,
  //   COURT_MARTIAL_2,
  //   COURT_MARTIAL_3,
  //   DISCHARGE_TYPE_1,
  //   DISCHARGE_TYPE_2,
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
});
