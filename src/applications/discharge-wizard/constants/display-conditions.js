import { RESPONSES } from './question-data-map';

const get15YearsPast = () => `${new Date().getFullYear() - 15}`;

const {
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
    SERVICE_BRANCH: [],
  },
  DISCHARGE_MONTH: {
    SERVICE_BRANCH: [],
    DISCHARGE_YEAR: [get15YearsPast()],
  },
  REASON: {
    SERVICE_BRANCH: [],
    DISCHARGE_YEAR: [],
    DISCHARGE_MONTH: [],
  },
  DISCHARGE_TYPE: {
    SERVICE_BRANCH: [],
    DISCHARGE_YEAR: [],
    DISCHARGE_MONTH: [],
    REASON: [REASON_3],
  },
  INTENTION: {
    SERVICE_BRANCH: [],
    DISCHARGE_YEAR: [],
    DISCHARGE_MONTH: [],
    REASON: [REASON_1, REASON_2, REASON_3, REASON_4, REASON_6, REASON_7],
  },
  COURT_MARTIAL: {
    SERVICE_BRANCH: [],
    DISCHARGE_YEAR: [],
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
