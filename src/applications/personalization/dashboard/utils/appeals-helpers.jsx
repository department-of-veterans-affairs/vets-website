import * as Sentry from '@sentry/browser';
import { format } from 'date-fns';

// This literally determines how many rows are displayed per page on the index page
export const DECISION_REVIEW_URL = '/decision-reviews';

export const APPEAL_TYPES = {
  legacy: 'legacyAppeal',
  supplementalClaim: 'supplementalClaim',
  higherLevelReview: 'higherLevelReview',
  appeal: 'appeal',
};

export const appealTypes = Object.values(APPEAL_TYPES);

export const programAreaMap = {
  compensation: 'disability compensation',
  pension: 'pension',
  insurance: 'insurance',
  loan_guaranty: 'loan guaranty', // eslint-disable-line camelcase
  education: 'education',
  vre: 'vocational rehabilitation and employment',
  medical: 'health care',
  burial: 'burial benefits',
  fiduciary: 'fiduciary',
};

/**
 * Returns a string with the formatted name of the type of appeal.
 * @param {Object} appeal
 * @returns {string}
 */
export function getTypeName(appeal) {
  switch (appeal.type) {
    case APPEAL_TYPES.supplementalClaim:
      return 'supplemental claim';
    case APPEAL_TYPES.higherLevelReview:
      return 'higher-level review';
    case APPEAL_TYPES.legacy:
    case APPEAL_TYPES.appeal:
      return 'appeal';
    default:
      Sentry.withScope(scope => {
        scope.setExtra('type', appeal.type);
        Sentry.captureMessage('appeals-unknown-type');
      });
      return null;
  }
}

export const DOCKET_TYPES = {
  directReview: 'directReview',
  evidenceSubmission: 'evidenceSubmission',
  hearingRequest: 'hearingRequest',
};

/**
 * Returns a string with the formatted name of the AMA docket.
 * @param {string} docket
 * @returns {string}
 */
export function getDocketName(docket) {
  switch (docket) {
    case DOCKET_TYPES.directReview:
      return 'Direct Review';
    case DOCKET_TYPES.evidenceSubmission:
      return 'Evidence Submission';
    case DOCKET_TYPES.hearingRequest:
      return 'Hearing Request';
    default:
      return docket;
  }
}

export const AOJS = {
  vba: 'vba',
  vha: 'vha',
  nca: 'nca',
  other: 'other',
};

export function getAojDescription(aoj) {
  switch (aoj) {
    case AOJS.vba:
      return 'Veterans Benefits Administration';
    case AOJS.vha:
      return 'Veterans Health Administration';
    case AOJS.nca:
      return 'National Cemetery Administration';
    default:
      return 'Agency of Original Jurisdiction';
  }
}

export const EVENT_TYPES = {
  claimDecision: 'claim_decision',
  nod: 'nod',
  soc: 'soc',
  form9: 'form9',
  ssoc: 'ssoc',
  certified: 'certified',
  hearingHeld: 'hearing_held',
  hearingNoShow: 'hearing_no_show',
  transcript: 'transcript',
  bvaDecision: 'bva_decision',
  cavcDecision: 'cavc_decision',
  remandReturn: 'remand_return',
  rampNotice: 'ramp_notice',
  fieldGrant: 'field_grant',
  withdrawn: 'withdrawn',
  failureToRespond: 'ftr',
  rampOptIn: 'ramp',
  death: 'death',
  merged: 'merged',
  reconsideration: 'reconsideration',
  vacated: 'vacated',
  otherClose: 'other_close',
  amaNod: 'ama_nod',
  docketChange: 'docket_change',
  distributedToVlj: 'distributed_to_vlj',
  bvaDecisionEffectuation: 'bva_decision_effectuation',
  dtaDecision: 'dta_decision',
  scRequest: 'sc_request',
  scDecision: 'sc_decision',
  scOtherClose: 'sc_other_close',
  hlrRequest: 'hlr_request',
  hlrDecision: 'hlr_decision',
  hlrDtaError: 'hlr_dta_error',
  hlrOtherClose: 'hlr_other_close',
  statutoryOptIn: 'statutory_opt_in',
};

// TO DO: Replace these properties and content with real versions once finalized.
export const STATUS_TYPES = {
  amaRemand: 'ama_remand',
  atVso: 'at_vso',
  bvaDecision: 'bva_decision',
  bvaDecisionEffectuation: 'bva_decision_effectuation',
  bvaDevelopment: 'bva_development',
  death: 'death',
  decisionInProgress: 'decision_in_progress',
  evidentiaryPeriod: 'evidentiary_period',
  fieldGrant: 'field_grant',
  ftr: 'ftr',
  hlrClosed: 'hlr_closed',
  hlrDtaError: 'hlr_dta_error',
  hlrDecision: 'hlr_decision',
  hlrReceived: 'hlr_received',
  merged: 'merged',
  onDocket: 'on_docket',
  otherClose: 'other_close',
  pendingCertification: 'pending_certification',
  pendingCertificationSsoc: 'pending_certification_ssoc',
  pendingForm9: 'pending_form9',
  pendingHearingScheduling: 'pending_hearing_scheduling',
  pendingSoc: 'pending_soc',
  postBvaDtaDecision: 'post_bva_dta_decision',
  ramp: 'ramp',
  reconsideration: 'reconsideration',
  remand: 'remand',
  remandReturn: 'remand_return',
  remandSsoc: 'remand_ssoc',
  scClosed: 'sc_closed',
  scDecision: 'sc_decision',
  scReceived: 'sc_received',
  scheduledHearing: 'scheduled_hearing',
  statutoryOptIn: 'statutory_opt_in',
  stayed: 'stayed',
  withdrawn: 'withdrawn',
};

export const ISSUE_STATUS = {
  fieldGrant: 'field_grant',
  withdrawn: 'withdrawn',
  allowed: 'allowed',
  denied: 'denied',
  remand: 'remand',
  cavcRemand: 'cavc_remand',
};

// Action Types & Availability statuses
// TO-DO: Separate action types and availability statuses
// Note: excludes FETCH_APPEALS_SUCCESS because there are defined in actions
// and used in v1 as well
export const FETCH_APPEALS_PENDING = 'FETCH_APPEALS_PENDING';
export const FETCH_APPEALS_SUCCESS = 'FETCH_APPEALS_SUCCESS';
export const USER_FORBIDDEN_ERROR = 'USER_FORBIDDEN_ERROR';
export const RECORD_NOT_FOUND_ERROR = 'RECORD_NOT_FOUND_ERROR';
export const VALIDATION_ERROR = 'VALIDATION_ERROR';
export const BACKEND_SERVICE_ERROR = 'BACKEND_SERVICE_ERROR';
export const FETCH_APPEALS_ERROR = 'FETCH_APPEALS_ERROR';
export const AVAILABLE = 'AVAILABLE';

// TO-DO: Ensure availability refs point to this instead of the actions above
export const appealsAvailability = {
  USER_FORBIDDEN_ERROR: 'USER_FORBIDDEN_ERROR',
  RECORD_NOT_FOUND_ERROR: 'RECORD_NOT_FOUND_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  BACKEND_SERVICE_ERROR: 'BACKEND_SERVICE_ERROR',
  FETCH_APPEALS_ERROR: 'FETCH_APPEALS_ERROR',
  AVAILABLE: 'AVAILABLE',
};

export const ALERT_TYPES = {
  form9Needed: 'form9_needed',
  scheduledHearing: 'scheduled_hearing',
  hearingNoShow: 'hearing_no_show',
  heldForEvidence: 'held_for_evidence',
  cavcOption: 'cavc_option',
  rampEligible: 'ramp_eligible',
  rampIneligible: 'ramp_ineligible',
  decisionSoon: 'decision_soon',
  blockedByVso: 'blocked_by_vso',
  evidentiaryPeriod: 'evidentiary_period',
  amaPostDecision: 'ama_post_decision',
};

export function formatDate(date) {
  return format(new Date(date), 'MMMM dd, yyyy');
}

export function getHearingType(type) {
  const typeMaps = {
    video: 'videoconference',
    travel_board: 'travel board', // eslint-disable-line camelcase
    central_office: 'Washington, DC central office', // eslint-disable-line camelcase
  };

  return typeMaps[type] || type;
}

export const UNKNOWN_STATUS = 'unknown';

/**
 * Tests an http error response for an errors array and status property for the
 * first error in the array. Returns the status code or 'unknown'
 * @param {Object} response error response object from vets-api
 * @returns {string} status code or 'unknown'
 */
export const getErrorStatus = response => {
  if (response instanceof Error) {
    Sentry.withScope(scope => {
      scope.setTag('location', 'getStatus');
      Sentry.captureException(response);
    });
  }
  return response?.errors?.[0]?.status ?? UNKNOWN_STATUS;
};
