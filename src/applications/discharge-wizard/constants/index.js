export const DW_UPDATE_FIELD = 'discharge-wizard/UPDATE_FIELD';

export const venueWarning =
  "You answered that you weren't sure where you applied for an upgrade before. The instructions below are for Veterans who have never applied for a discharge upgrade, so your process may be different. For more reliable information on your discharge upgrade process, please review your records to find out which board you sent your earlier application to, and complete the questions again.";

export const upgradeVenueWarning =
  "You answered that you weren't sure where you applied for an upgrade before. The instructions below are for Veterans who had a successful upgrade application reviewed by the [branch of service] Discharge Review Board (DRB). For more reliable information, please review your records to find out which board you sent your earlier application to, and complete the questions again.";

/* eslint-disable quote-props */
export const questionLabels = {
  '4_reason': {
    '1':
      'I suffered from an undiagnosed, misdiagnosed, or untreated mental health condition, including posttraumatic stress disorder (PTSD), while in the service. I was discharged for reasons related to this condition.',
    '2':
      'I suffered from an undiagnosed, misdiagnosed, or untreated Traumatic Brain Injury (TBI) while in the service. I was discharged for reasons related to this condition.',
    '3':
      'I was discharged due to my sexual orientation (including under the Don’t Ask, Don’t Tell policy).',
    '4':
      'I was the victim of sexual assault or harassment in the service, and was discharged for reasons related to this incident.',
    '5':
      'I am transgender, and my discharge shows my birth name instead of my current name.',
    '6': 'There is an error on my discharge paperwork for other reasons.',
    '7':
      'My discharge is unjust, and this is not related to any of the reasons listed above.',
    '8':
      'I received a discharge upgrade or correction, but my upgrade came in the form of a DD215 and I want an updated DD214.',
  },
  '5_dischargeType': {
    '1':
      'My discharge is honorable or general under honorable conditions, and I want only my narrative reason for discharge, separation code, or re-enlistment code changed.',
    '2': 'My discharge is not honorable or under honorable conditions.',
  },
  '6_intention': {
    '1':
      "I want to change my name, discharge date, or something written in the “other remarks” section of my DD214. (This isn't common).",
    '2':
      'I want to change only my characterization of discharge, re-enlistment code, separation code, and/or narrative reason for discharge.',
  },
  '2_dischargeYear': {},
  '3_dischargeMonth': {},
  '7_courtMartial': {
    '1': 'My discharge was the outcome of a general court-martial.',
    '2':
      'My discharge was administrative or the outcome of a special or summary court-martial.',
    '3':
      "I'm not sure if my discharge was the outcome of a general court-martial.",
  },
  '1_branchOfService': {
    army: 'Army',
    navy: 'Navy',
    airForce: 'Air Force',
    coastGuard: 'Coast Guard',
    marines: 'Marine Corps',
  },
  '8_prevApplication': {
    '1':
      'I have previously applied for a discharge upgrade for this period of service.',
    '2':
      'I have not previously applied for a discharge upgrade for this period of service.',
  },
  '9_prevApplicationYear': {
    '1': 'or earlier',
    '2': 'after',
  },
  '10_prevApplicationType': {
    '1':
      'I applied to a Discharge Review Board (DRB) for a Documentary Review.',
    '2':
      'I applied to a Discharge Review Board (DRB) for a Personal Appearance Review in Washington, DC.',
    '3':
      'I applied to a Board for Correction of Military/Naval Records (BCMR/BCNR).',
    '4':
      "I'm not sure what kind of discharge upgrade application I previously made.",
  },
  '11_failureToExhaust': {
    '1':
      'The BCMR/BCNR denied my application due to “failure to exhaust other remedies.”',
    '2':
      'The BCMR/BCNR denied my application for other reasons, such as not agreeing with the evidence in my application.',
  },
  '12_priorService': {
    '1':
      'I have discharge paperwork documenting a discharge that is honorable or under honorable conditions.',
    '2':
      'I completed a prior period of service, but I did not receive discharge paperwork from that period.',
    '3': 'I did not complete an earlier period of service.',
  },
};
/* eslint-enable quote-props */

export const prevApplicationYearCutoff = {
  1: 2014,
  2: 2014,
  3: 2011,
  4: 2017,
};

// v2 constants
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
export const DUW_QUESTION_FLOW_CHANGED =
  'discharge-upgrade-wizard/DUW_QUESTION_FLOW_CHANGED';
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
  RESULT: 'result',
});

export const questionsToClearMap = Object.freeze({
  SERVICE_BRANCH: [],
  DISCHARGE_YEAR: [SHORT_NAME_MAP.DISCHARGE_MONTH],
  DISCHARGE_MONTH: [],
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
  DISCHARGE_TYPE: [],
  COURT_MARTIAL: [],
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
  SHORT_NAME_MAP.REASON,
  SHORT_NAME_MAP.PREV_APPLICATION,
  SHORT_NAME_MAP.PREV_APPLICATION_TYPE,
  SHORT_NAME_MAP.PREV_APPLICATION_YEAR,
];

export const errorTextMap = Object.freeze({
  SERVICE_BRANCH: 'Select a branch.',
  DISCHARGE_YEAR: 'Select a year.',
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
