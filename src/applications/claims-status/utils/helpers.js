import React from 'react';
import merge from 'lodash/merge';
import { format, isValid, parseISO } from 'date-fns';
import environment from '@department-of-veterans-affairs/platform-utilities/environment';
import { apiRequest } from '@department-of-veterans-affairs/platform-utilities/api';
import { scrollAndFocus, scrollToTop } from 'platform/utilities/scroll';
import titleCase from 'platform/utilities/data/titleCase';
import { setUpPage, isTab } from './page';
import { SET_UNAUTHORIZED } from '../actions/types';
import {
  ANCHOR_LINKS,
  DATE_FORMATS,
  disabilityCompensationClaimTypeCodes,
  pensionClaimTypeCodes,
  addOrRemoveDependentClaimTypeCodes,
  survivorsPensionClaimTypeCodes,
  DICClaimTypeCodes,
  veteransPensionClaimTypeCodes,
} from '../constants';

// Adding !! so that we convert this to a boolean
export const claimAvailable = claim =>
  !!(claim && claim.attributes && Object.keys(claim.attributes).length !== 0);

// Using a Map instead of the typical Object because
// we want to guarantee that the key insertion order
// is maintained when converting to an array of keys
export const getStatusMap = () => {
  const map = new Map();
  map.set('CLAIM_RECEIVED', 'CLAIM_RECEIVED');
  map.set('UNDER_REVIEW', 'UNDER_REVIEW');
  map.set('GATHERING_OF_EVIDENCE', 'GATHERING_OF_EVIDENCE');
  map.set('REVIEW_OF_EVIDENCE', 'REVIEW_OF_EVIDENCE');
  map.set('PREPARATION_FOR_DECISION', 'PREPARATION_FOR_DECISION');
  map.set('PENDING_DECISION_APPROVAL', 'PENDING_DECISION_APPROVAL');
  map.set('PREPARATION_FOR_NOTIFICATION', 'PREPARATION_FOR_NOTIFICATION');
  map.set('COMPLETE', 'COMPLETE');
  return map;
};

const statusStepMap = {
  CLAIM_RECEIVED: 'Step 1 of 5: Claim received',
  INITIAL_REVIEW: 'Step 2 of 5: Initial review',
  EVIDENCE_GATHERING_REVIEW_DECISION:
    'Step 3 of 5: Evidence gathering, review, and decision',
  PREPARATION_FOR_NOTIFICATION: 'Step 4 of 5: Preparation for notification',
  COMPLETE: 'Step 5 of 5: Closed',
};

export function getStatusDescription(status) {
  return statusStepMap[status];
}

const claimPhaseTypeStepMap = {
  CLAIM_RECEIVED: 'Step 1 of 8: Claim received',
  UNDER_REVIEW: 'Step 2 of 8: Initial review',
  GATHERING_OF_EVIDENCE: 'Step 3 of 8: Evidence gathering',
  REVIEW_OF_EVIDENCE: 'Step 4 of 8: Evidence review',
  PREPARATION_FOR_DECISION: 'Step 5 of 8: Rating',
  PENDING_DECISION_APPROVAL: 'Step 6 of 8: Preparing decision letter',
  PREPARATION_FOR_NOTIFICATION: 'Step 7 of 8: Final review',
  COMPLETE: 'Step 8 of 8: Claim decided',
};

export function getClaimPhaseTypeHeaderText(claimPhaseType) {
  return claimPhaseTypeStepMap[claimPhaseType];
}

const phase8ItemTextMap = {
  1: 'We received your claim in our system',
  2: 'Step 2: Initial review',
  3: 'Step 3: Evidence gathering',
  4: 'Step 4: Evidence review',
  5: 'Step 5: Rating',
  6: 'Step 6: Preparing decision letter',
  7: 'Step 7: Final review',
  8: 'Your claim was decided',
};

const phase5ItemTextMap = {
  1: 'Step 1: Claim received',
  2: 'Step 2: Initial review',
  3: 'Step 3: Evidence gathering, review, and decision',
  4: 'Step 3: Evidence gathering, review, and decision',
  5: 'Step 3: Evidence gathering, review, and decision',
  6: 'Step 3: Evidence gathering, review, and decision',
  7: 'Step 4: Preparation for notification',
  8: 'Step 5: Closed',
};

export function getPhaseItemText(phase, showEightPhases = false) {
  return showEightPhases ? phase8ItemTextMap[phase] : phase5ItemTextMap[phase];
}

const claimPhaseTypeDescriptionMap = {
  CLAIM_RECEIVED: 'We received your claim in our system.',
  UNDER_REVIEW:
    'We’re checking your claim for basic information, like your name and Social Security number. If information is missing, we’ll contact you.',
  GATHERING_OF_EVIDENCE:
    'We’re reviewing your claim to make sure we have all the evidence and information we need. If we need anything else, we’ll contact you.',
  REVIEW_OF_EVIDENCE:
    'We’re reviewing all the evidence for your claim. If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
  PREPARATION_FOR_DECISION:
    'We’re deciding your claim and determining your disability rating. If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
  PENDING_DECISION_APPROVAL:
    'We’re preparing your decision letter. If we need more evidence or you submit more evidence, your claim will go back to Step 3: Evidence gathering.',
  PREPARATION_FOR_NOTIFICATION:
    'A senior reviewer is doing a final review of your claim and the decision letter.',
  COMPLETE:
    'You can view and download your decision letter. We also sent you a copy by mail.',
};

export function getClaimPhaseTypeDescription(claimPhaseType) {
  return claimPhaseTypeDescriptionMap[claimPhaseType];
}

const statusDescriptionMap = {
  CLAIM_RECEIVED:
    'We received your claim. We haven’t assigned the claim to a reviewer yet.',
  INITIAL_REVIEW:
    'We assigned your claim to a reviewer. The reviewer will determine if we need any more information from you.',
  EVIDENCE_GATHERING_REVIEW_DECISION:
    'We’re getting evidence from you, your health care providers, government agencies, and other sources. We’ll review the evidence and make a decision.',
  PREPARATION_FOR_NOTIFICATION:
    'We’ve made a decision on your claim. We’re getting your decision letter ready to mail to you.',
  COMPLETE:
    'We’ve made a decision about your claim. If available, you can view your decision letter. We’ll also send you your letter by U.S. mail.',
};

export function getClaimStatusDescription(status) {
  return statusDescriptionMap[status];
}

export function isDisabilityCompensationClaim(claimTypeCode) {
  return disabilityCompensationClaimTypeCodes.includes(claimTypeCode);
}
export function isPensionClaim(claimTypeCode) {
  return pensionClaimTypeCodes.includes(claimTypeCode);
}
// When feature flag cstClaimPhases is enabled and claim type code is for a disability
// compensation claim we show 8 phases instead of 5 with updated description, link text
// and statuses, we are also showing 8 phases for pension claim
export function getShowEightPhases(claimTypeCode, cstClaimPhasesEnabled) {
  return (
    cstClaimPhasesEnabled &&
    (isDisabilityCompensationClaim(claimTypeCode) ||
      isPensionClaim(claimTypeCode))
  );
}

export function isClaimOpen(status, closeDate) {
  const STATUSES = getStatusMap();
  return status !== STATUSES.get('COMPLETE') && closeDate === null;
}

const evidenceGathering = 'Evidence gathering, review, and decision';

const phaseMap = {
  1: 'Claim received',
  2: 'Initial review',
  3: evidenceGathering,
  4: evidenceGathering,
  5: evidenceGathering,
  6: evidenceGathering,
  7: 'Preparation for notification',
  8: 'Complete',
};

// Gets the user phase for LH or EVSS claim
export function getPhaseDescription(phase) {
  return phaseMap[phase];
}

export function getUserPhaseDescription(phase) {
  if (phase < 3) {
    return phaseMap[phase];
  }
  if (phase === 3) {
    return evidenceGathering;
  }

  return phaseMap[phase + 3];
}

export function getUserPhase(phase) {
  if (phase < 3) {
    return phase;
  }
  if (phase >= 3 && phase < 7) {
    return 3;
  }

  return phase - 3;
}

function isInEvidenceGathering(claim) {
  const allowedClaimTypes = ['evss_claims', 'claim'];
  const isEvssClaim = claim.type === 'evss_claims';
  const isLighthouseClaim = claim.type === 'claim';

  if (!allowedClaimTypes.includes(claim.type)) {
    return false;
  }

  if (isEvssClaim) return claim.attributes.phase === 3;
  if (isLighthouseClaim) {
    return claim.attributes.status === 'EVIDENCE_GATHERING_REVIEW_DECISION';
  }

  return false;
}

/**
 * Filter evidence submissions for failed uploads within the last 30 days
 * acknowledgementDate is set to 30 days after the submission failed (backend logic)
 * @param {Array} evidenceSubmissions - Array of evidence submission objects
 * @returns {Array} Filtered array of failed submissions within last 30 days
 */
export function getFailedSubmissionsWithinLast30Days(evidenceSubmissions) {
  if (!evidenceSubmissions || !Array.isArray(evidenceSubmissions)) {
    return [];
  }

  return evidenceSubmissions.filter(
    submission =>
      submission.uploadStatus === 'FAILED' &&
      submission.acknowledgementDate &&
      new Date().toISOString() <= submission.acknowledgementDate,
  );
}

export function getItemDate(item) {
  // Tracked item that has been marked received.
  // status is either INITIAL_REVIEW_COMPLETE,
  // or ACCEPTED
  if (item.receivedDate) {
    return item.receivedDate;
  }

  // Tracked item that has documents but has not been marked received.
  // status is SUBMITTED_AWAITING_REVIEW
  if (item.documents && item.documents.length) {
    return item.documents[item.documents.length - 1].uploadDate;
  }

  // Supporting document.
  // uploadDate is sometimes null
  if (item.type === 'other_documents_list' && item.uploadDate) {
    return item.uploadDate;
  }

  // Most likely this is a tracked item that has a status
  // of NEEDED
  return item.date;
}

function getPhaseNumber(phase) {
  return parseInt(phase.replace('phase', ''), 10);
}

function isEventOrPrimaryPhase(event) {
  if (event.type === 'phase_entered') {
    return event.phase <= 3 || event.phase >= 7;
  }

  return !!getItemDate(event);
}

export function groupTimelineActivity(events) {
  const phases = {};
  let activity = [];

  const phaseEvents = events
    .map(event => {
      if (event.type.startsWith('phase')) {
        return {
          type: 'phase_entered',
          phase: getPhaseNumber(event.type) + 1,
          date: event.date,
        };
      }

      return event;
    })
    .filter(isEventOrPrimaryPhase);

  phaseEvents.forEach(event => {
    if (event.type.startsWith('phase')) {
      activity.push(event);
      phases[getUserPhase(event.phase)] = activity;
      activity = [];
    } else {
      activity.push(event);
    }
  });

  if (activity.length > 0) {
    phases[1] = activity;
  }

  return phases;
}

export function displayFileSize(size) {
  if (size < 1024) {
    return `${size}B`;
  }

  const kbSize = size / 1024;
  if (kbSize < 1024) {
    return `${Math.round(kbSize)}KB`;
  }

  const mbSize = kbSize / 1024;
  return `${Math.round(mbSize)}MB`;
}

export function groupClaimsByDocsNeeded(list) {
  const groupingPredicate = c => {
    return c.attributes.documentsNeeded && isInEvidenceGathering(c);
  };

  const claimsWithOpenRequests = list.filter(groupingPredicate);

  const claimsWithoutOpenRequests = list.filter(
    claim => !groupingPredicate(claim),
  );

  return claimsWithOpenRequests.concat(claimsWithoutOpenRequests);
}

export const DOC_TYPES = [
  {
    value: 'L014',
    label: 'Birth Certificate',
  },
  {
    value: 'L029',
    label: 'Copy of a DD214',
  },
  {
    value: 'L418',
    label: 'Court papers / documents',
  },
  {
    value: 'L033',
    label: 'Death Certificate',
  },
  {
    value: 'L702',
    label: 'Disability Benefits Questionnaire (DBQ)',
  },
  {
    value: 'L037',
    label: 'Divorce Decree',
  },
  {
    value: 'L703',
    label: 'Goldmann Perimetry Chart/Field Of Vision Chart',
  },
  {
    value: 'L051',
    label: 'Marriage Certificate',
  },
  {
    value: 'L049',
    label: 'Medical Treatment Record - Non-Government Facility',
  },
  {
    value: 'L034',
    label: 'Military Personnel Record',
  },
  {
    value: 'L070',
    label: 'Photographs',
  },
  {
    value: 'L139',
    label: 'VA Form 21-686c - Declaration of Status of Dependents',
  },
  {
    value: 'L133',
    label: 'VA Form 21-674 - Request for Approval of School Attendance',
  },
  {
    value: 'L107',
    label: 'VA Form 21-4142 - Authorization To Disclose Information',
  },
  {
    value: 'L827',
    label:
      'VA Form 21-4142a - General Release for Medical Provider Information',
  },
  {
    value: 'L117',
    label:
      'VA Form 21-4502 - Application for Automobile or Other Conveyance and Adaptive Equipment Under 38 U.S.C. 3901-3904',
  },
  {
    value: 'L149',
    label:
      'VA Form 21-8940 - Veterans Application for Increased Compensation Based on Un-employability',
  },
  {
    value: 'L159',
    label:
      'VA Form 26-4555 - Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant',
  },
  {
    value: 'L115',
    label:
      'VA Form 21-4192 - Request for Employment Information in Connection with Claim for Disability',
  },
  {
    value: 'L222',
    label:
      'VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid & Attendance',
  },
  {
    value: 'L102',
    label:
      'VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid & Attendance',
  },
  {
    value: 'L228',
    label:
      'VA Form 21-0781 - Statement in Support of Claimed Mental Health Disorder(s) Due to an In-Service Traumatic Event(s)',
  },
  {
    value: 'L229',
    label:
      'VA Form 21-0781a - Statement in Support of Claim for PTSD Secondary to Personal Assault',
  },
  {
    value: 'L023',
    label: 'Other Correspondence',
  },
  {
    value: 'L450',
    label: 'STR - Dental - Photocopy',
  },
  {
    value: 'L451',
    label: 'STR - Medical - Photocopy',
  },
];

export function getDocTypeDescription(docType) {
  return DOC_TYPES.filter(type => type.value === docType)[0].label;
}

export const isPopulatedClaim = ({ claimDate, claimType, contentions }) =>
  !!claimType && contentions && !!contentions.length && !!claimDate;

export function stripEscapedChars(text) {
  return text && text.replace(/\\(n|r|t)/gm, '');
}

// strip escaped html entities that have made its way into the desc
export function stripHtml(text) {
  return text && text.replace(/[<>]|&\w+;/g, '');
}

export function scrubDescription(text) {
  return stripEscapedChars(stripHtml(text ? text.trim() : ''));
}

export function isClaimComplete(claim) {
  return claim.attributes.decisionLetterSent || claim.attributes.phase === 8;
}

export function makeAuthRequest(
  url,
  userOptions,
  dispatch,
  onSuccess,
  onError,
) {
  const options = merge(
    {},
    {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
      responseType: 'json',
    },
    userOptions,
  );

  return apiRequest(`${environment.API_URL}${url}`, options)
    .then(onSuccess)
    .catch(resp => {
      if (resp.status === 401) {
        dispatch({
          type: SET_UNAUTHORIZED,
        });
      } else {
        onError(resp);
      }
    });
}

export function getClaimType(claim) {
  if (claim?.attributes?.claimType) {
    const { claimType } = claim.attributes;
    return claimType === 'Death'
      ? 'expenses related to death or burial'
      : claimType;
  }
  return 'Disability Compensation';
}

export const mockData = {
  data: [
    {
      // Status: Review your statement of the case - pending_form9
      id: '7387389',
      type: 'legacyAppeal',
      attributes: {
        appealIds: ['7387389', '123'],
        updated: '2018-01-03T09:30:15-05:00',
        active: true,
        incompleteHistory: true,
        aoj: 'vba',
        programArea: 'compensation',
        description:
          'Service connection for tinnitus, hearing loss, and two more',
        type: 'original',
        aod: false,
        location: 'aoj',
        status: {
          type: 'pending_soc',
          details: {
            lastSocDate: '2015-09-12',
            certificationTimeliness: [1, 4],
            socTimeliness: [2, 16],
          },
        },
        docket: null,
        issues: [
          {
            active: true,
            description: 'Service connection for tinnitus',
            lastAction: 'null',
            date: '2016-05-30',
          },
        ],
        alerts: [
          {
            type: 'form9_needed',
            details: {
              date: '2018-01-28',
            },
          },
          {
            type: 'ramp_eligible',
            details: {
              date: '2016-05-30',
            },
          },
          {
            type: 'decision_soon',
            details: {},
          },
        ],
        events: [
          {
            type: 'claim',
            date: '2016-05-30',
            details: {},
          },
          {
            type: 'nod',
            date: '2016-06-10',
            details: {},
          },
          {
            type: 'form9',
            date: '2016-09-12',
            details: {},
          },
          {
            type: 'soc',
            date: '2016-12-15',
            details: {},
          },
        ],
        evidence: [
          {
            description: 'Service treatment records',
            date: '2017-09-30',
          },
        ],
      },
    },
    {
      // Status: Waiting to be assigned to a judge - on_docket
      id: '7387390',
      type: 'legacyAppeal',
      attributes: {
        appealIds: ['7387390', '456'],
        updated: '2018-01-03T09:30:15-05:00',
        active: true,
        incompleteHistory: false,
        aoj: 'vba',
        programArea: 'compensation',
        description:
          'Service connection for tinnitus, hearing loss, and two more',
        type: 'original',
        aod: false,
        location: 'aoj',
        status: {
          type: 'on_docket',
          details: {
            regionalOffice: 'Chicago Regional Office',
          },
        },
        docket: {
          front: false,
          total: 206900,
          ahead: 109203,
          ready: 22109,
          month: '2016-08-01',
          docketMonth: '2016-04-01',
          eta: null,
        },
        issues: [
          {
            active: true,
            description: 'Service connection for tinnitus',
            lastAction: null,
            date: '2016-05-30',
          },
        ],
        alerts: [],
        events: [
          {
            type: 'claim',
            date: '2010-05-30',
            details: {},
          },
          {
            type: 'nod',
            date: '2012-06-10',
            details: {},
          },
          {
            type: 'soc',
            date: '2013-06-01',
            details: {},
          },
          {
            type: 'form9',
            date: '2014-06-12',
            details: {},
          },
          {
            type: 'certified',
            date: '2014-09-21',
            details: {},
          },
          {
            type: 'hearing_held',
            date: '2015-05-06',
            details: {
              regionalOffice: 'Chicago',
            },
          },
        ],
        evidence: [
          {
            description: 'Service treatment records',
            date: '2017-09-30',
          },
        ],
      },
    },
    {
      // Status: The Board has made a decision on your appeal - bva_decision
      id: '7387391',
      type: 'legacyAppeal',
      attributes: {
        appealIds: ['7387391', '789'],
        updated: '2018-01-03T09:30:15-05:00',
        active: true,
        incompleteHistory: false,
        aoj: 'vba',
        programArea: 'compensation',
        description:
          'Service connection for tinnitus, hearing loss, and two more',
        type: 'original',
        aod: false,
        location: 'aoj',
        status: {
          type: 'bva_decision',
          details: {
            regionalOffice: 'Chicago Regional Office',
            issues: [
              {
                description: 'Heel, increased rating',
                disposition: 'allowed',
                date: '2016-05-30',
              },
              {
                description: 'Knee, increased rating',
                disposition: 'allowed',
                date: '2016-05-30',
              },
              {
                description: 'Tinnitus, increased rating',
                disposition: 'denied',
                date: '2016-05-30',
              },
              {
                description: 'Leg, service connection',
                disposition: 'denied',
                date: '2016-05-30',
              },
              {
                description: 'Diabetes, service connection',
                disposition: 'remand',
                date: '2016-05-30',
              },
              {
                description: 'Shoulder, service connection',
                disposition: 'remand',
                date: '2016-05-30',
              },
            ],
          },
        },
        docket: {
          front: false,
          total: 206900,
          ahead: 109203,
          ready: 22109,
          eta: '2019-08-31',
        },
        issues: [
          {
            active: true,
            description: 'Tinnitus, service connection',
            lastAction: null,
            date: '2016-05-30',
          },
          {
            active: true,
            description: 'Head, increased rating',
            lastAction: null,
            date: '2016-05-30',
          },
          {
            active: true,
            description: 'Shoulder, increased rating',
            lastAction: null,
            date: '2016-05-30',
          },
          {
            active: true,
            description: 'Knee, service connection',
            lastAction: 'field_grant',
            date: '2016-05-30',
          },
          {
            active: false,
            description: 'Toe, service connection',
            lastAction: 'withdrawn',
            date: '2016-05-30',
          },
          {
            active: true,
            description: 'Tinnitus, service connection',
            lastAction: 'allowed',
            date: '2016-05-30',
          },
          {
            active: false,
            description: 'Tinnitus, service connection',
            lastAction: 'denied',
            date: '2016-05-30',
          },
          {
            active: true,
            description: 'Tinnitus, service connection',
            lastAction: 'remand',
            date: '2016-05-30',
          },
          {
            active: false,
            description: 'Tinnitus, service connection',
            lastAction: 'cavc_remand',
            date: '2016-05-30',
          },
        ],
        alerts: [],
        events: [
          {
            type: 'claim',
            date: '2010-05-30',
            details: {},
          },
          {
            type: 'nod',
            date: '2011-06-10',
            details: {},
          },
          {
            type: 'soc',
            date: '2012-06-10',
            details: {},
          },
          {
            type: 'form9',
            date: '2013-06-10',
            details: {},
          },
          {
            type: 'certified',
            date: '2014-06-10',
            details: {},
          },
          {
            type: 'hearing_held',
            date: '2015-06-10',
            details: {
              regionalOffice: 'Chicago',
            },
          },
          {
            type: 'bva_decision',
            date: '2016-06-10',
            details: {},
          },
        ],
        evidence: [
          {
            description: 'Service treatment records',
            date: '2017-09-30',
          },
        ],
      },
    },
    {
      id: 'SC105',
      type: 'supplementalClaim',
      attributes: {
        appealIds: ['SC105'],
        updated: '2019-05-29T19:38:48-04:00',
        incompleteHistory: false,
        active: true,
        description: 'Eligibility for dental treatment',
        location: 'aoj',
        aoj: 'vha',
        programArea: 'medical',
        status: {
          type: 'sc_received',
          details: {},
        },
        alerts: [],
        issues: [
          {
            description: 'Eligibility for dental treatment',
            diagnosticCode: null,
            active: true,
            lastAction: null,
            date: null,
          },
        ],
        events: [
          {
            type: 'sc_request',
            date: '2019-02-19',
          },
        ],
      },
    },
    {
      id: 'HLR101',
      type: 'higherLevelReview',
      attributes: {
        appealIds: ['HLR101'],
        updated: '2019-08-29T19:38:48-04:00',
        incompleteHistory: false,
        active: true,
        description:
          'Severance of service connection, hypothyroidism, and 1 other',
        location: 'aoj',
        aoj: 'vba',
        programArea: 'compensation',
        status: {
          type: 'hlr_dta_error',
          details: {
            issues: [
              {
                description: 'Service connection, sciatic nerve paralysis',
                disposition: 'denied',
              },
              {
                description: 'Severance of service connection, hypothyroidism',
                disposition: 'allowed',
              },
            ],
          },
        },
        alerts: [
          {
            type: 'ama_post_decision',
            details: {
              decisionDate: '2019-08-05',
              availableOptions: [
                'supplemental_claim',
                'higher_level_review',
                'board_appeal',
              ],
              dueDate: '2020-08-04',
              cavcDueDate: '2019-12-02',
            },
          },
        ],
        issues: [
          {
            description: 'Service connection, sciatic nerve paralysis',
            diagnosticCode: '8520',
            active: false,
            lastAction: 'denied',
            date: '2019-08-05',
          },
          {
            description: 'Severance of service connection, hypothyroidism',
            diagnosticCode: '7903',
            active: false,
            lastAction: 'allowed',
            date: '2019-08-05',
          },
        ],
        events: [
          {
            type: 'hlr_request',
            date: '2019-02-19',
          },
          {
            type: 'hlr_dta_error',
            date: '2019-06-01',
          },
          {
            type: 'hlr_decision',
            date: '2019-08-05',
          },
        ],
      },
    },
    {
      id: 'A102',
      type: 'appeal',
      attributes: {
        appealIds: ['A102'],
        updated: '2019-05-29T19:38:44-04:00',
        incompleteHistory: false,
        type: 'original',
        active: true,
        description:
          'Service connection, malignant skin neoplasm, and 2 others',
        aod: false,
        location: 'bva',
        aoj: 'vba',
        programArea: 'compensation',
        status: {
          type: 'pending_hearing_scheduling',
          details: {
            type: 'video',
          },
        },
        alerts: [],
        docket: {
          type: 'hearing',
          month: '2019-02-01',
          switchDueDate: '2019-06-05',
          eligibleToSwitch: true,
        },
        issues: [
          {
            description: 'Service connection, malignant skin neoplasm',
            diagnosticCode: '7818',
            active: true,
            lastAction: null,
            date: null,
          },
          {
            description: 'Service connection, coronary artery disease',
            diagnosticCode: '7005',
            active: true,
            lastAction: null,
            date: null,
          },
          {
            description: 'Service connection, diabetes',
            diagnosticCode: '7913',
            active: true,
            lastAction: null,
            date: null,
          },
        ],
        events: [
          {
            type: 'ama_nod',
            date: '2019-02-23',
          },
        ],
      },
    },
    {
      id: 'A106',
      type: 'appeal',
      attributes: {
        appealIds: ['A106'],
        updated: '2021-02-29T19:38:44-04:00',
        incompleteHistory: false,
        type: 'original',
        active: false,
        description: 'Reasonableness of attorney fees',
        aod: false,
        location: 'bva',
        aoj: 'other',
        programArea: 'other',
        status: {
          type: 'bva_decision',
          details: {
            issues: [
              {
                description: 'Reasonableness of attorney fees',
                disposition: 'allowed',
              },
            ],
          },
        },
        alerts: [
          {
            type: 'ama_post_decision',
            details: {
              decisionDate: '2021-02-20',
              availableOptions: ['supplemental_claim', 'cavc'],
              dueDate: '2022-02-19',
              cavcDueDate: '2021-06-19',
            },
          },
        ],
        docket: {
          type: 'hearing',
          month: '2019-02-01',
          switchDueDate: '2019-06-05',
          eligibleToSwitch: false,
        },
        issues: [
          {
            description: 'Reasonableness of attorney fees',
            diagnosticCode: null,
            active: false,
            lastAction: 'allowed',
            date: '2021-02-20',
          },
        ],
        events: [
          {
            type: 'ama_nod',
            date: '2019-02-23',
          },
          {
            type: 'hearing_no_show',
            date: '2020-05-21',
          },
          {
            type: 'hearing_held',
            date: '2020-10-21',
          },
          {
            type: 'bva_decision',
            date: '2021-02-20',
          },
        ],
      },
    },
  ],
};

// returns the value rounded to the nearest interval
// ex: roundToNearest({interval: 5000, value: 13000}) => 15000
// ex: roundToNearest({interval: 5000, value: 6500}) => 5000
export function roundToNearest({ interval, value }) {
  return Math.round(value / interval) * interval;
}

export const setDocumentTitle = title => {
  document.title = `${title} | Veterans Affairs`;
};

// Takes a format string and returns a function that formats the given date
// `date` must be in ISO format ex. 2020-01-28
export const buildDateFormatter = (formatString = DATE_FORMATS.LONG_DATE) => {
  return date => {
    const parsedDate = parseISO(date);

    return isValid(parsedDate)
      ? format(parsedDate, formatString)
      : 'Invalid date';
  };
};

// Helper: Format time in VA.gov standard (h:mm a.m./p.m.)
const formatTimeVaStyle = date => {
  const time = format(date, 'h:mm a').toLowerCase();
  // Use case-insensitive replacement to handle any case variations
  return time.replace(/am/i, 'a.m.').replace(/pm/i, 'p.m.');
};

// Helper: Get timezone abbreviation
const getTimezoneAbbr = date => {
  return date
    .toLocaleString('en-US', { timeZoneName: 'short' })
    .split(' ')
    .pop();
};

// Helper: Validate date input
const isValidDateInput = date => {
  return date && date instanceof Date && isValid(date);
};

// Helper: Calculate the cutoff time when uploads cross day boundaries
const calculateCutoffTime = timezoneOffsetMinutes => {
  const totalMinutes = Math.abs(timezoneOffsetMinutes);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  // Cutoff hour is when local time crosses to different UTC day
  const cutoffHour = timezoneOffsetMinutes > 0 ? 24 - hours : hours;

  // Create date representing cutoff time (immutable pattern)
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    cutoffHour,
    minutes,
    0,
    0,
  );
};

// Helper: Format UTC date as ISO date string
const formatUtcDateString = date => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Returns a message warning that files uploaded near midnight may show different dates in UTC.
// Static mode (no uploadDate): Returns "next/previous day's date" for page headers.
// Dynamic mode (with uploadDate): Returns specific UTC date like "August 16, 2025" for upload alerts.
// Returns empty string for UTC timezone (offset = 0) or invalid inputs.
export const getTimezoneDiscrepancyMessage = (
  timezoneOffsetMinutes,
  uploadDate = null,
) => {
  // Handle invalid inputs
  if (
    timezoneOffsetMinutes == null ||
    Number.isNaN(timezoneOffsetMinutes) ||
    timezoneOffsetMinutes === 0
  ) {
    return '';
  }

  const cutoffDate = calculateCutoffTime(timezoneOffsetMinutes);
  const timeStr = formatTimeVaStyle(cutoffDate);
  const tzAbbr = getTimezoneAbbr(cutoffDate);

  const beforeAfter = timezoneOffsetMinutes > 0 ? 'after' : 'before';

  // If uploadDate is provided, calculate the specific UTC date
  let dateText;
  if (isValidDateInput(uploadDate)) {
    // Convert local upload time to UTC and format the UTC date
    const utcDateStr = formatUtcDateString(uploadDate);
    const formattedDate = format(parseISO(utcDateStr), 'MMMM d, yyyy');
    // "Files uploaded after 8:00 p.m. EDT will show as August 16, 2025."
    dateText = `as ${formattedDate}`;
  } else {
    // No uploadDate provided - use generic "next/previous day's date" language
    const nextPrevious = timezoneOffsetMinutes > 0 ? 'next' : 'previous';
    // "Files uploaded after 8:00 p.m. EDT will show with the next day’s date."
    dateText = `with the ${nextPrevious} day's date`;
  }
  return `Files uploaded ${beforeAfter} ${timeStr} ${tzAbbr} will show ${dateText}.`;
};

export const showTimezoneDiscrepancyMessage = uploadDate => {
  // Handle invalid inputs
  if (!isValidDateInput(uploadDate)) {
    return false;
  }

  const localDay = uploadDate.getDate();
  const utcDay = uploadDate.getUTCDate();

  return localDay !== utcDay;
};

export const formatUploadDateTime = date => {
  // Validate input exists
  if (date == null) {
    throw new Error('formatUploadDateTime: date parameter is required');
  }

  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  // Throw error for invalid dates - this is a programming error, not a user error
  if (!isValid(parsedDate)) {
    throw new Error(
      `formatUploadDateTime: invalid date provided - ${JSON.stringify(date)}`,
    );
  }

  const dateStr = format(parsedDate, 'MMMM d, yyyy');
  const timeStr = formatTimeVaStyle(parsedDate);
  const tzAbbr = getTimezoneAbbr(parsedDate);

  return `${dateStr} at ${timeStr} ${tzAbbr}`;
};

// Capitalizes the first letter in a given string
export const sentenceCase = str => {
  return typeof str === 'string' && str.length > 0
    ? str[0].toUpperCase().concat(str.substring(1))
    : '';
};

// Handles server-generated claim titles (cst_use_claim_title_generator_web feature flag).
// When backend flag is ON, both displayTitle and claimTypeBase will be present.
//   - List/detail: uses displayTitle directly
//   - Breadcrumb/document: composes using claimTypeBase with tab name and date
export function generateServerClaimTitle(claim, placement, tab) {
  const { displayTitle, claimTypeBase, claimDate } = claim.attributes;

  // For list/detail views: use displayTitle directly (already formatted by backend)
  if (!placement || placement === 'detail') {
    return displayTitle;
  }

  // For breadcrumb/document: compose using claimTypeBase
  const tabPrefix = `${tab} ${tab === 'Files' ? 'for' : 'of'}`;

  if (placement === 'breadcrumb') {
    return `${tabPrefix} your ${claimTypeBase}`;
  }

  if (placement === 'document') {
    const formattedDate = buildDateFormatter()(claimDate);
    return titleCase(`${tabPrefix} ${formattedDate} ${claimTypeBase}`);
  }

  // Fallback to displayTitle for any unexpected placement
  return displayTitle;
}

// Returns a title for a claim for the specified placement:
//   'detail' for the heading on the single page view
//   'breadcrumb' for the breadcrumbs on the single page view
//   'document' for the browser tab title on the single page view
//   the default return is for the list view (card heading)
export const generateClaimTitle = (claim, placement, tab) => {
  // Check if server provides title fields (feature flag ON)
  if (claim?.attributes?.displayTitle && claim?.attributes?.claimTypeBase) {
    return generateServerClaimTitle(claim, placement, tab);
  }

  // Legacy client-side title generation (feature flag OFF)
  // This will default to 'disability compensation'
  const claimType = getClaimType(claim).toLowerCase();
  const isRequestToAddOrRemoveDependent =
    addOrRemoveDependentClaimTypeCodes.includes(
      claim?.attributes?.claimTypeCode,
    );
  // Determine which word should follow the tab name.
  // "Files for...", "Status of...", "Details of...", "Overview of..."
  const tabPrefix = `${tab} ${tab === 'Files' ? 'for' : 'of'}`;
  // Use the following to (somewhat) cut down on repetition in the switch below.
  const addOrRemoveDependentClaimTitle = 'request to add or remove a dependent';
  const baseClaimTitle = isRequestToAddOrRemoveDependent
    ? addOrRemoveDependentClaimTitle
    : `${claimType} claim`;
  const renderTitle = () => {
    if (isRequestToAddOrRemoveDependent) {
      return sentenceCase(addOrRemoveDependentClaimTitle);
    }

    if (isPensionClaim(claim?.attributes?.claimTypeCode)) {
      const { claimTypeCode } = claim.attributes;
      if (survivorsPensionClaimTypeCodes.includes(claimTypeCode)) {
        return 'Claim for Survivors Pension';
      }
      if (DICClaimTypeCodes.includes(claimTypeCode)) {
        return 'Claim for Dependency and Indemnity Compensation';
      }
      if (veteransPensionClaimTypeCodes.includes(claimTypeCode)) {
        return 'Claim for Veterans Pension';
      }
      return 'Claim for pension';
    }
    return `Claim for ${claimType}`;
  };

  // This switch may not scale well; it might be better to create a map of the strings instead.
  // For examples of output given different parameters, see the unit tests.
  switch (placement) {
    case 'detail':
      return renderTitle();
    case 'breadcrumb':
      if (claimAvailable(claim)) {
        return `${tabPrefix} your ${baseClaimTitle}`;
      }
      // Default message if claim fails to load.
      return `${tabPrefix} your claim`;
    case 'document':
      if (claimAvailable(claim)) {
        const formattedDate = buildDateFormatter()(claim.attributes.claimDate);
        return titleCase(`${tabPrefix} ${formattedDate} ${baseClaimTitle}`);
      }
      // Default message if claim fails to load.
      return `${tabPrefix} Your Claim`;
    default:
      return renderTitle();
  }
};

// Used to set page title for the CST Tabs
export function setTabDocumentTitle(claim, tabName) {
  setDocumentTitle(generateClaimTitle(claim, 'document', tabName));
}

// Used to set the page focus on the CST Tabs
export function setPageFocus(lastPage, loading) {
  if (!isTab(lastPage)) {
    if (!loading) {
      setUpPage();
    } else {
      scrollToTop({ behavior: 'instant' });
    }
  } else {
    scrollAndFocus(document.querySelector('.tab-header'), {
      behavior: 'instant',
    });
  }
}

export const getUploadErrorMessage = (
  error,
  claimId,
  showDocumentUploadStatus = false,
) => {
  if (error?.errors?.[0]?.detail === 'DOC_UPLOAD_DUPLICATE') {
    const filesPath = `/track-claims/your-claims/${claimId}/files`;
    const isOnFilesPage = window.location.pathname === filesPath;
    const anchorLink = showDocumentUploadStatus
      ? ANCHOR_LINKS.filesReceived
      : ANCHOR_LINKS.documentsFiled;
    const linkHref = isOnFilesPage
      ? `#${anchorLink}`
      : `${filesPath}#${anchorLink}`;

    return {
      title: `You've already uploaded ${error?.fileName || 'files'}`,
      body: (
        <>
          It can take up to 2 days for the file to show up in{' '}
          <va-link text="your list of documents filed" href={linkHref} />. Try
          checking back later before uploading again.
        </>
      ),
      type: 'error',
    };
  }
  if (error?.errors?.[0]?.detail === 'DOC_UPLOAD_INVALID_CLAIMANT') {
    return {
      title: `You can’t upload files for this claim here`,
      body: (
        <>
          <>
            Only the Veteran with the claim can upload files on this page. We’re
            sorry for the inconvenience.
            <br />
            <va-link
              active
              text="Upload files with QuickSubmit"
              href="https://eauth.va.gov/accessva/?cspSelectFor=quicksubmit"
            />
          </>
        </>
      ),
      type: 'error',
    };
  }
  return {
    title: `Error uploading ${error?.fileName || 'files'}`,
    body:
      error?.errors?.[0]?.title ||
      'There was an error uploading your files. Please try again',
    type: 'error',
  };
};

/**
 * Gets the display name for an evidence submission
 * Evidence submissions are documents that have not yet been successfully created in Lighthouse.
 * @param {Object} evidenceSubmission - Evidence submission object with trackedItemId
 * @returns {string|null} Tracked item friendly name, display name, 'unknown', or null if no trackedItemId
 */
export const getTrackedItemDisplayNameFromEvidenceSubmission =
  evidenceSubmission => {
    if (evidenceSubmission.trackedItemId) {
      return (
        evidenceSubmission.trackedItemFriendlyName ||
        evidenceSubmission.trackedItemDisplayName ||
        'unknown'
      );
    }
    return null;
  };
