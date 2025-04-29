export const DW_UPDATE_FIELD = 'discharge-wizard/UPDATE_FIELD';

export const venueWarning =
  "You answered that you weren't sure where you applied for an upgrade before. The instructions below are for Veterans who have never applied for a discharge upgrade, so your process may be different. For more reliable information on your discharge upgrade process, review your records to find out which board you sent your earlier application to, and complete the questions again.";

import { SHORT_NAME_MAP } from './question-data-map';

export const DUW_VIEWED_INTRO_PAGE =
  'discharge-upgrade-wizard/DUW_VIEWED_INTRO_PAGE';
export const DUW_UPDATE_FORM_STORE =
  'discharge-upgrade-wizard/DUW_UPDATE_FORM_STORE';
export const DUW_UPDATE_SERVICE_BRANCH =
  'discharge-upgrade-wizard/DUW_UPDATE_SERVICE_BRANCH';
export const DUW_UPDATE_DISCHARGE_YEAR =
  'discharge-upgrade-wizard/DUW_UPDATE_DISCHARGE_YEAR';
export const DUW_UPDATE_DISCHARGE_MONTH =
  'discharge-upgrade-wizard/DUW_UPDATE_DISCHARGE_MONTH';
export const DUW_UPDATE_REASON = 'discharge-upgrade-wizard/DUW_UPDATE_REASON';
export const DUW_UPDATE_DISCHARGE_TYPE =
  'discharge-upgrade-wizard/DUW_UPDATE_DISCHARGE_TYPE';
export const DUW_UPDATE_COURT_MARTIAL =
  'discharge-upgrade-wizard/DUW_UPDATE_COURT_MARTIAL';
export const DUW_UPDATE_INTENTION =
  'discharge-upgrade-wizard/DUW_UPDATE_INTENTION';
export const DUW_UPDATE_PREV_APPLICATION =
  'discharge-upgrade-wizard/DUW_UPDATE_PREV_APPLICATION';
export const DUW_UPDATE_PREV_APPLICATION_TYPE =
  'discharge-upgrade-wizard/DUW_UPDATE_PREV_APPLICATION_TYPE';
export const DUW_UPDATE_PREV_APPLICATION_YEAR =
  'discharge-upgrade-wizard/DUW_UPDATE_PREV_APPLICATION_YEAR';
export const DUW_UPDATE_PRIOR_SERVICE =
  'discharge-upgrade-wizard/DUW_UPDATE_PREV_PRIOR_SERVICE';
export const DUW_UPDATE_FAILURE_TO_EXHAUST =
  'discharge-upgrade-wizard/DUW_UPDATE_FAILURE_TO_EXHAUST';
export const DUW_EDIT_MODE = 'discharge-upgrade-wizard/DUW_EDIT_MODE';
export const DUW_QUESTION_SELECTED_TO_EDIT =
  'discharge-upgrade-wizard/DUW_QUESTION_SELECTED_TO_EDIT';
export const DUW_QUESTION_FLOW_CHANGED =
  'discharge-upgrade-wizard/DUW_QUESTION_FLOW_CHANGED';
export const DUW_ANSWER_CHANGED = 'discharge-upgrade-wizard/DUW_ANSWER_CHANGED';
export const DUW_ROUTE_MAP = 'discharge-upgrade-wizard/DUW_ROUTE_MAP';

export const DRB = 'DRB';
export const BCMR = 'BCMR';
export const BCNR = 'BCNR';
export const AFDRB = 'AFDRB';

export const ROUTES = Object.freeze({
  HOME: 'introduction',
  SERVICE_BRANCH: 'service-branch',
  DISCHARGE_YEAR: 'discharge-year',
  DISCHARGE_MONTH: 'discharge-month',
  REASON: 'reason',
  DISCHARGE_TYPE: 'discharge-type',
  COURT_MARTIAL: 'court-martial',
  INTENTION: 'intention',
  PREV_APPLICATION: 'prev-application',
  PREV_APPLICATION_TYPE: 'prev-application-type',
  PREV_APPLICATION_YEAR: 'prev-application-year',
  PRIOR_SERVICE: 'prior-service',
  FAILURE_TO_EXHAUST: 'failure-to-exhaust',
  REVIEW: 'review',
  RESULTS: 'results',
  DD214: 'request-dd214',
});

export const questionsToClearMap = Object.freeze({
  SERVICE_BRANCH: [SHORT_NAME_MAP.PREV_APPLICATION_TYPE],
  DISCHARGE_YEAR: [
    SHORT_NAME_MAP.DISCHARGE_MONTH,
    SHORT_NAME_MAP.FAILURE_TO_EXHAUST,
  ],
  DISCHARGE_MONTH: [SHORT_NAME_MAP.FAILURE_TO_EXHAUST],
  REASON: [
    SHORT_NAME_MAP.DISCHARGE_TYPE,
    SHORT_NAME_MAP.COURT_MARTIAL,
    SHORT_NAME_MAP.INTENTION,
    SHORT_NAME_MAP.PREV_APPLICATION,
    SHORT_NAME_MAP.PREV_APPLICATION_TYPE,
    SHORT_NAME_MAP.PREV_APPLICATION_YEAR,
    SHORT_NAME_MAP.PRIOR_SERVICE,
    SHORT_NAME_MAP.FAILURE_TO_EXHAUST,
  ],
  DISCHARGE_TYPE: [SHORT_NAME_MAP.PRIOR_SERVICE],
  COURT_MARTIAL: [SHORT_NAME_MAP.FAILURE_TO_EXHAUST],
  INTENTION: [],
  PREV_APPLICATION: [
    SHORT_NAME_MAP.PREV_APPLICATION_TYPE,
    SHORT_NAME_MAP.PREV_APPLICATION_YEAR,
    SHORT_NAME_MAP.PRIOR_SERVICE,
    SHORT_NAME_MAP.FAILURE_TO_EXHAUST,
  ],
  PREV_APPLICATION_TYPE: [
    SHORT_NAME_MAP.PRIOR_SERVICE,
    SHORT_NAME_MAP.FAILURE_TO_EXHAUST,
  ],
  PREV_APPLICATION_YEAR: [
    SHORT_NAME_MAP.PREV_APPLICATION_TYPE,
    SHORT_NAME_MAP.FAILURE_TO_EXHAUST,
    SHORT_NAME_MAP.PRIOR_SERVICE,
  ],
  PRIOR_SERVICE: [],
  FAILURE_TO_EXHAUST: [],
});

export const forkableQuestions = [
  SHORT_NAME_MAP.DISCHARGE_YEAR,
  SHORT_NAME_MAP.DISCHARGE_MONTH,
  SHORT_NAME_MAP.REASON,
  SHORT_NAME_MAP.COURT_MARTIAL,
  SHORT_NAME_MAP.DISCHARGE_TYPE,
  SHORT_NAME_MAP.PREV_APPLICATION,
  SHORT_NAME_MAP.PREV_APPLICATION_TYPE,
  SHORT_NAME_MAP.PREV_APPLICATION_YEAR,
];

export const errorTextMap = Object.freeze({
  SERVICE_BRANCH: 'Select a branch.',
  DISCHARGE_YEAR: 'Enter a valid 4 digit year.',
  DISCHARGE_MONTH: 'Select a month.',
  REASON: 'Select a reason.',
});

export const labelTextMap = Object.freeze({
  DISCHARGE_YEAR: 'Year',
  DISCHARGE_MONTH: 'Month',
});

export const monthLabelMap = Object.freeze({
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
});
