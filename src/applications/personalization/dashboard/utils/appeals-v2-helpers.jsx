import React from 'react';
import { format, isBefore, isAfter } from 'date-fns';
import _ from 'lodash';
import * as Sentry from '@sentry/browser';
import { ITEMS_PER_PAGE } from './constants';

// This literally determines how many rows are displayed per page on the index page
export const DECISION_REVIEW_URL = '/decision-reviews';

export const APPEAL_ACTIONS = {
  original: 'original',
  postRemand: 'post_remand',
  postCavcRemand: 'post_cavc_remand',
  reconsideration: 'reconsideration',
  cue: 'cue',
  other: 'other',
};

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
export const FETCH_CLAIMS_PENDING = 'FETCH_CLAIMS_PENDING';
export const FETCH_CLAIMS_SUCCESS = 'FETCH_CLAIMS_SUCCESS';
export const FETCH_CLAIMS_ERROR = 'FETCH_CLAIMS_ERROR';
export const CHANGE_INDEX_PAGE = 'CHANGE_INDEX_PAGE';

export const claimsAvailability = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
};

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

/**
 * Takes an array of appeals and returns another array of issue descriptions
 * and where in the appeal lifecycle each issue is (open, remand, granted, denied)
 * @typedef {Object} issue an individual issue - many issues can be a part of a single appeal
 * @property {bool} active indicates whether an appeal is open or closed
 * @property {string} description more info about the specific injury in the issue
 * @property {string} diagnosticCode a codified version of the description
 * @property {('field_grant'|'withdrawn'|'allowed'|'denied'|'remand'|'cavc_remand')} lastAction
 * @property {string} date TO-DO: unsure of what this date siginifies
 * ------------------------------------------------------------------------------------------------
 * @typedef {Object} segmentedIssue issue with descriptor and status information
 * @property {('granted'|'remand'|'allowed'|'denied'|'withdrawn')} status lifecycle stage of an issue
 * @property {string} description pass-through for the description info of passed in issue object
 * ------------------------------------------------------------------------------------------------
 * @param {issue[]} issues all the individual issues that are attached to an appeal
 * @returns {segmentedIssue[]} an array of issue objects with statuses and descriptions
 */
export function addStatusToIssues(issues) {
  return issues.map(issue => {
    let status = '';
    switch (issue.lastAction) {
      case ISSUE_STATUS.fieldGrant:
        status = 'granted';
        break;
      case ISSUE_STATUS.withdrawn:
        status = 'withdrawn';
        break;
      case ISSUE_STATUS.allowed:
        status = 'granted';
        break;
      case ISSUE_STATUS.denied:
        status = 'denied';
        break;
      case ISSUE_STATUS.remand:
        status = 'remand';
        break;
      case ISSUE_STATUS.cavcRemand:
        status = 'remand';
        break;
      default:
        // if an issue's lastAction isn't one of the above, it's null,
        // which signifies that it's still open
        status = 'open';
        break;
    }
    return { status, description: issue.description };
  });
}

/**
 * Finds an appeal from the Redux store with ID matching arg ID.
 * `id` may be a v1 id or a v2 id.
 *
 * @param {object} state Full redux store state tree
 * @param {string} id Appeal ID of the appeal to find
 * @returns {object} One appeal object or undefined if not found in the array
 */
export function isolateAppeal(state, id) {
  return _.find(
    state.claims.claimsV2.appeals,
    a => a.id === id || (_.get(a, 'attributes.appealIds') || []).includes(id),
  );
}

export function formatDate(date) {
  return format(new Date(date, 'MMMM dd, yyyy'));
}

export function getHearingType(type) {
  const typeMaps = {
    video: 'videoconference',
    travel_board: 'travel board', // eslint-disable-line camelcase
    central_office: 'Washington, DC central office', // eslint-disable-line camelcase
  };

  return typeMaps[type] || type;
}

/**
 * Translates an array of two ints into a string that conveys a duration estimate
 * @typedef {Object} durationText contains strings to fill in time snippets in NextEvents
 * @property {string} header formatted time string to be used in the duration card header
 * @property {string} description formatted time string to be used in the duration card description
 * @param {number[]} timeliness two integers that represent the low and high time durations
 * (in months) of a given thing
 * @returns {durationText} formatted to convey the estimated duration range, in months
 */
export const makeDurationText = timeliness => {
  const durationText = {
    header: '',
    description: '',
  };

  if (!timeliness || !Array.isArray(timeliness) || timeliness.length !== 2) {
    const durationError = new Error(
      'vets_appeals_v2_helpers_makeDurationText_bad_timeliness_input',
    );
    Sentry.captureException(durationError);
    return durationText;
  }

  const lowEst = timeliness[0];
  const highEst = timeliness[1];
  const estIsExact = lowEst === highEst;

  if (estIsExact && lowEst === 1) {
    durationText.header = '1 month';
    durationText.description = 'about 1 month';
  } else if (estIsExact) {
    durationText.header = `${lowEst} months`;
    durationText.description = `about ${lowEst} months`;
  } else {
    durationText.header = `${lowEst}–${highEst} months`;
    durationText.description = `between ${lowEst} and ${highEst} months`;
  }
  return durationText;
};

/**
 * Creates content reused throughout getNextEvents
 * @param {string} [isAma] Whether it is an AMA appeal
 * @param {string} [aoj] The agency of original jurisdiction
 * @param {string} [prop] Additional text to include at beginning of first paragraph
 * @returns {object} Decision review content
 */
export const makeDecisionReviewContent = ({
  isAma = false,
  aoj = AOJS.vba,
  prop = '',
} = {}) => (
  <div>
    <p>
      {prop}
      {prop ? ' The judge' : 'A Veterans Law Judge'} will review all of the
      available evidence and write a decision. For each issue you’re appealing,
      they can decide to:
    </p>
    <ul className="decision-review-list">
      <li>
        <strong>Grant:</strong> The judge disagrees with the original decision
        and decides in your favor.
      </li>
      <li>
        <strong>Deny:</strong> The judge agrees with the original decision.
      </li>
      <li>
        <strong>Remand:</strong> The judge sends the issue back to the{' '}
        {getAojDescription(aoj)} to{' '}
        {isAma
          ? 'correct an error'
          : 'gather more evidence or to fix a mistake before deciding whether to grant or deny'}
        .
      </li>
    </ul>
    {!isAma && (
      <p>
        <strong>Note:</strong> About 60% of all cases have at least 1 issue
        remanded.
      </p>
    )}
  </div>
);

/**
 * Gets 'what's next' content for a given current status type
 * @typedef {Object} nextEvent
 * @property {string} title header for each NextEvent
 * @property {HTMLElement} description formatted content for each NextEvent
 * @property {string} durationText descriptor of how long this NextEvent usually takes
 * @property {string} cardDescription info about why this NextEvent takes as long as it does
 * ----------------------------------------------------------------------------------------------
 * @typedef {Object} headerCard some NextEvent sections have one card displayed above the event list
 * @property {string} durationText descriptor of how long these NextEvents usually take
 * @property {string} cardDescription info about why these NextEvents take as long as they does
 * ----------------------------------------------------------------------------------------------
 * @typedef {Object} allNextEvents
 * @property {string} header a short description to introduce all of the nextEvents
 * @property {headerCard} [headerCard] containing info for top-level duration cards
 * @property {nextEvent[]} events each contain text content for a NextEvent component
 * ----------------------------------------------------------------------------------------------
 * @param {Object} appeal
 * @returns {allNextEvents} a section description and array containing all next event possibilities
 *                          for a given current status
 */
/**
 * ****** NOTE ******
 * Duration info (at the DurationCard level) has been hidden since 07/01/2020
 * https://github.com/department-of-veterans-affairs/va.gov-team/issues/10293
 */
export function getNextEvents(appeal) {
  const { type: currentStatus, details } = appeal.attributes.status;
  const appealType = appeal.type;

  switch (currentStatus) {
    case STATUS_TYPES.pendingSoc: {
      const socDuration = makeDurationText(details.socTimeliness);
      return {
        header: `What happens next depends on whether the Decision Review Officer has enough
          evidence to decide in your favor.`,
        headerCard: {
          durationText: socDuration.header,
          cardDescription: `The Veterans Benefits Administration typically takes ${
            socDuration.description
          } to review new appeals.`,
        },
        events: [
          {
            title:
              'The Veterans Benefits Administration will grant some or all of your appeal',
            description: (
              <p>
                <strong>
                  If the Decision Review Officer determines that there’s enough
                  evidence to grant one or more of the issues on your appeal,
                </strong>{' '}
                they’ll make a new decision. If this decision changes your
                disability rating or eligibility for VA benefits, you should
                expect this change to be made in 1 to 2 months.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          },
          {
            title:
              'The Veterans Benefits Administration will send you a Statement of the Case',
            description: (
              <p>
                <strong>
                  If the Decision Review Officer determines that there isn’t
                  enough evidence to fully grant your appeal,
                </strong>{' '}
                they’ll send you their findings in a document called a Statement
                of the Case. You can then decide whether to continue your appeal
                to the Board of Veterans’ Appeals, or{' '}
                <a href={DECISION_REVIEW_URL}>
                  opt in to one of the new decision review options
                </a>
                .
              </p>
            ),
            durationText: '',
            cardDescription: '',
          },
        ],
      };
    }
    case STATUS_TYPES.pendingForm9: {
      const certDuration = makeDurationText(details.certificationTimeliness);
      const ssocDuration = makeDurationText(details.ssocTimeliness);
      const formattedSocDate = format(
        new Date(details.lastSocDate),
        'MMMM d, yyyy',
      );
      return {
        header: `If you return VA Form 9 within 60 days, what happens next
          depends on whether you also submit new evidence and ask VA to review
          it before sending to the Board.`,
        events: [
          {
            title: 'Your appeal will be sent it to the Board',
            description: (
              <p>
                <strong>If you don’t submit new evidence</strong> after the
                Statement of the Case on {formattedSocDate}, the Decision Review
                Officer will finish their review and send your case to the Board
                of Veterans’ Appeals.
              </p>
            ),
            durationText: certDuration.header,
            cardDescription: `The Veterans Benefits Administration usually takes ${
              certDuration.description
            } to send cases to the Board.`,
          },
          {
            title:
              'The Veterans Benefits Administration will send you a Supplemental Statement of the Case',
            description: (
              <p>
                <strong>If you submit new evidence</strong> after the Statement
                of the Case on {formattedSocDate} <strong>and</strong> ask VA to
                review the evidence first, the Decision Review Officer (DRO)
                will need to write a Supplemental Statement of the Case before
                sending your case to the Board of Veterans’ Appeals. Otherwise,
                the DRO will send your appeal to the Board. Once your appeal has
                been sent, new evidence can be submitted directly to the Board
                and won’t be reviewed by the Veterans Benefits Administration.
              </p>
            ),
            durationText: ssocDuration.header,
            cardDescription: `The Veterans Benefits Administration usually takes ${
              ssocDuration.description
            } to write Supplemental Statements of the Case.`,
          },
        ],
      };
    }
    case STATUS_TYPES.pendingCertification: {
      const certDuration = makeDurationText(details.certificationTimeliness);
      const ssocDuration = makeDurationText(details.ssocTimeliness);
      const formattedSocDate = format(
        new Date(details.lastSocDate),
        'MMMM d, yyyy',
      );
      return {
        header: 'What happens next depends on whether you submit new evidence.',
        events: [
          {
            title: 'Your appeal will be sent to the Board',
            description: (
              <p>
                <strong>If you don’t submit new evidence</strong> after the
                Statement of the Case on {formattedSocDate}, the Decision Review
                Officer will finish their review and send your case to the Board
                of Veterans’ Appeals.
              </p>
            ),
            durationText: certDuration.header,
            cardDescription: `The Veterans Benefits Administration typically takes ${
              certDuration.description
            } to send cases to the Board.`,
          },
          {
            title:
              'The Veterans Benefits Administration will send you a Supplemental Statement of the Case',
            description: (
              <p>
                <strong>If you submit new evidence</strong> after the Statement
                of the Case on {formattedSocDate} <strong>and</strong> ask VA to
                review the evidence first, the Decision Review Officer (DRO)
                will need to write a Supplemental Statement of the Case before
                sending your case to the Board of Veterans’ Appeals. Otherwise,
                the DRO will send your appeal to the Board. Once your appeal has
                been sent, new evidence can be submitted directly to the Board
                and won’t be reviewed by the Veterans Benefits Administration.
              </p>
            ),
            durationText: ssocDuration.header,
            cardDescription: `The Veterans Benefits Administration usually takes ${
              ssocDuration.description
            } to write Supplemental Statements of the Case.`,
          },
        ],
      };
    }
    case STATUS_TYPES.pendingCertificationSsoc: {
      const certDuration = makeDurationText(details.certificationTimeliness);
      const ssocDuration = makeDurationText(details.ssocTimeliness);
      const formattedSocDate = format(
        new Date(details.lastSocDate),
        'MMMM d, yyyy',
      );
      return {
        header: 'What happens next depends on whether you submit new evidence.',
        events: [
          {
            title: 'Your appeal will be sent to the Board',
            description: (
              <p>
                <strong>If you don’t submit new evidence</strong> after the
                Supplemental Statement of the Case on {formattedSocDate}, the
                Decision Review Officer will finish their review and send your
                case to the Board of Veterans’ Appeals.
              </p>
            ),
            durationText: certDuration.header,
            cardDescription: `The Veterans Benefits Administration usually takes ${
              certDuration.description
            } to send cases to the Board.`,
          },
          {
            title:
              'The Veterans Benefits Administration will send you a Supplemental Statement of the Case',
            description: (
              <p>
                <strong>If you submit new evidence</strong> after the
                Supplemental Statement of the Case on {formattedSocDate}{' '}
                <strong>and</strong> ask VA to review the evidence first, the
                Decision Review Officer (DRO) will need to write a new
                Supplemental Statement of the Case before sending your case to
                the Board of Veterans’ Appeals. Otherwise, the DRO will send
                your appeal to the Board. Once your appeal has been sent, new
                evidence can be submitted directly to the Board and won’t be
                reviewed by the Veterans Benefits Administration.
              </p>
            ),
            durationText: ssocDuration.header,
            cardDescription: `The Veterans Benefits Administration usually takes ${
              ssocDuration.description
            } to write Supplemental Statements of the Case.`,
          },
        ],
      };
    }
    case STATUS_TYPES.remandSsoc: {
      const returnSsocDuration = makeDurationText(details.returnTimeliness);
      const remandSsocDuration = makeDurationText(details.remandSsocTimeliness);
      const formattedSocDate = format(
        new Date(details.lastSocDate),
        'MMMM d, yyyy',
      );
      return {
        header: 'What happens next depends on whether you submit new evidence.',
        events: [
          {
            title: 'Your appeal will be returned to the Board',
            description: (
              <p>
                <strong>If you don’t submit new evidence</strong> after the
                Supplemental Statement of the Case on {formattedSocDate}, the
                Veterans Benefits Administration will finish their work on the
                remand and return your case to the Board of Veterans’ Appeals.
              </p>
            ),
            durationText: returnSsocDuration.header,
            cardDescription: `The Veterans Benefits Administration usually takes ${
              returnSsocDuration.description
            } to return cases to the Board.`,
          },
          {
            title:
              'The Veterans Benefits Administration will send you a Supplemental Statement of the Case',
            description: (
              <p>
                <strong>If you submit new evidence</strong> after the
                Supplemental Statement of the Case on {formattedSocDate}{' '}
                <strong>and</strong> ask VA to review the evidence first, the
                Veterans Benefits Administration will need to write a new
                Supplemental Statement of the Case before returning your case to
                the Board of Veterans’ Appeals. Otherwise, the Decision Review
                Officer will send your appeal to the Board.
              </p>
            ),
            durationText: remandSsocDuration.header,
            cardDescription: `The Veterans Benefits Administration usually takes ${
              remandSsocDuration.description
            } to write Supplemental Statements of the Case.`,
          },
        ],
      };
    }
    case STATUS_TYPES.pendingHearingScheduling: {
      const eligibleToSwitch = _.get(
        appeal,
        'attributes.docket.eligibleToSwitch',
      );

      const eligibleDescription =
        'However, note that this won’t speed up your appeal unless you also switch to the Direct Review appeal option, which can only be done at certain times. See below for more information.';
      const ineligibleDescription =
        'However, note that this won’t speed up your appeal because your appeal will remain on the Hearing Request docket line and the deadline has passed for switching to a different docket.';

      return {
        header: '', // intentionally empty
        events: [
          {
            title: `You’ll have your ${getHearingType(details.type)} hearing`,
            description: (
              <div>
                <p>
                  At your hearing, you and a Veterans Law Judge will have a
                  conversation, and they’ll ask you questions about your appeal.
                  Your hearing will be transcribed and added to your appeal
                  file. The judge won’t make a decision about your appeal at the
                  hearing.{' '}
                  <a
                    href={
                      appealType === APPEAL_TYPES.appeal
                        ? '/decision-reviews/board-appeal/veterans-law-judge-hearing/'
                        : '/disability/file-an-appeal/board-of-veterans-appeals/'
                    }
                  >
                    Learn more about hearings.
                  </a>
                </p>
                {appeal.type === APPEAL_TYPES.appeal && (
                  <p>
                    If you’ve changed your mind about having a hearing, you can
                    write to the Board of Veterans’ Appeals to withdraw your
                    hearing request.{' '}
                    {eligibleToSwitch
                      ? eligibleDescription
                      : ineligibleDescription}
                  </p>
                )}
              </div>
            ),
            durationText: '',
            cardDescription: '',
          },
        ],
      };
    }
    case STATUS_TYPES.scheduledHearing: {
      return {
        header: '', // intentionally empty
        events: [
          {
            title: `You’ll have your ${getHearingType(details.type)} hearing`,
            description: (
              <p>
                At your hearing, you and a Veterans Law Judge will have a
                conversation, and they’ll ask you questions about your appeal.
                Your hearing will be transcribed and added to your appeal file.
                The judge won’t make a decision about your appeal at the
                hearing.{' '}
                <a
                  href={
                    appealType === APPEAL_TYPES.appeal
                      ? '/decision-reviews/board-appeal/veterans-law-judge-hearing/'
                      : '/disability/file-an-appeal/board-of-veterans-appeals/'
                  }
                >
                  Learn more about hearings
                </a>
                , including how to prepare for, reschedule, or cancel your
                hearing.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          },
        ],
      };
    }
    case STATUS_TYPES.onDocket: {
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The Board will make a decision',
            description: makeDecisionReviewContent({
              isAma: appeal.type === APPEAL_TYPES.appeal,
              aoj: appeal.attributes.aoj,
            }),
            durationText: '',
            cardDescription: '',
          },
        ],
      };
    }
    case STATUS_TYPES.evidentiaryPeriod: {
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The Board will make a decision',
            description: makeDecisionReviewContent({
              isAma: appeal.type === APPEAL_TYPES.appeal,
              aoj: appeal.attributes.aoj,
              prop:
                'Once the 90 day time period for submitting new evidence is closed, your case will be ready to go to a Veterans Law Judge. Before it’s reviewed by a judge, some Veterans Service Organizations will ask for time to make additional arguments in support of your case.',
            }),
            durationText: '',
            cardDescription: '',
          },
        ],
      };
    }
    case STATUS_TYPES.atVso: {
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The Board will make a decision',
            description: makeDecisionReviewContent({
              isAma: appeal.type === APPEAL_TYPES.appeal,
              aoj: appeal.attributes.aoj,
              prop:
                'Once your representative has completed their review, your case will be ready to go to a Veterans Law Judge.',
            }),
            durationText: '',
            cardDescription: '',
          },
        ],
      };
    }
    case STATUS_TYPES.decisionInProgress: {
      const decisionTimeliness = details.decisionTimeliness || [1, 2];
      const decisionDuration = makeDurationText(decisionTimeliness);
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The Board will make a decision',
            description: makeDecisionReviewContent({
              isAma: appeal.type === APPEAL_TYPES.appeal,
              aoj: appeal.attributes.aoj,
            }),
            durationText: decisionDuration.header,
            cardDescription: `The Board of Veterans’ Appeals usually takes ${
              decisionDuration.description
            } to decide appeals once a judge starts their review.`,
          },
        ],
      };
    }
    case STATUS_TYPES.bvaDevelopment:
    case STATUS_TYPES.stayed:
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The Board will make a decision',
            description: makeDecisionReviewContent(),
            durationText: '',
            cardDescription: '',
          },
        ],
      };
    case STATUS_TYPES.remand: {
      const remandDuration = makeDurationText(details.remandTimeliness);
      return {
        header: '', // intentionally empty
        events: [
          {
            title:
              'The Veterans Benefits Administration completes the remand instructions',
            description: (
              <p>
                They may contact you to request more evidence or medical exams
                as needed. When they’ve completed the remand instructions,
                they’ll determine whether or not they can grant your appeal. If
                not, your appeal will return to the Board of Veterans’ Appeals
                for a new decision.
              </p>
            ),
            durationText: remandDuration.header,
            cardDescription: `The Veterans Benefits Administration usually takes ${
              remandDuration.description
            } to complete remand instructions.`,
          },
        ],
      };
    }
    case STATUS_TYPES.amaRemand:
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'A reviewer will correct the error',
            description: (
              <p>
                Because the judge identified an error, a reviewer at the{' '}
                {getAojDescription(appeal.attributes.aoj)} will correct the
                error based on the judge’s instructions. You’ll receive a new
                decision in the mail. If needed, the reviewer may contact you to
                ask for more evidence or to schedule a new medical exam.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          },
        ],
      };
    case STATUS_TYPES.scReceived: {
      const duration = makeDurationText([4, 5]);
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The reviewer will make a new decision',
            description: (
              <p>
                The {getAojDescription(appeal.attributes.aoj)} will send you a
                new decision in the mail.
              </p>
            ),
            durationText: duration.header,
            cardDescription:
              'VA’s goal for completing Supplemental Claims is 125 days.',
          },
        ],
      };
    }
    case STATUS_TYPES.hlrReceived: {
      const duration = makeDurationText([4, 5]);
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The higher-level reviewer will make a new decision',
            description: (
              <p>
                The {getAojDescription(appeal.attributes.aoj)} will send you a
                new decision in the mail. Your review may take longer if VA
                needs to obtain records or schedule a new exam to correct an
                error.
              </p>
            ),
            durationText: duration.header,
            cardDescription:
              'VA’s goal for completing Higher-Level Reviews is 125 days.',
          },
        ],
      };
    }
    case STATUS_TYPES.hlrDtaError:
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'A reviewer will make a new decision',
            description: (
              <p>
                The {getAojDescription(appeal.attributes.aoj)} will send you a
                new decision in the mail. Your review may take longer than the
                expected 4–5 months because VA needs to correct an error before
                completing its review.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          },
        ],
      };
    default:
      return {
        header: '', // intentionally empty
        events: [],
      };
  }
}

const DECISION_REVIEW_OPTIONS = {
  supplementalClaim: 'supplemental_claim',
  higherLevelReview: 'higher_level_review',
  appeal: 'appeal',
  cavc: 'cavc',
};

/**
 * Takes an alert type and returns its display content and related CSS classes
 * @typedef {object} alertInput
 * @property {string} type one of ALERT_TYPES as returned by vets-api
 * @property {object} details necessary dynamic info for each alert type, properties vary per type
 * @param {alert} type each alert can have one of several types as defined by ALERT_TYPES
 * ------------------------------------------------------------------------------------------------
 * @typedef {object} alertOutput
 * @property {string} title Used for the alert header
 * @property {HTMLElement} description Some descriptive text for the alert body
 * @property {string} displayType Segments the alert into either 'take action' or 'info' buckets
 * @property {string} type Pass-through for the input type. Should be one of ALERT_TYPES
 * ------------------------------------------------------------------------------------------------
 * @param {alertInput} alert has some properties we match against to generate an alert's content
 * @returns {alertOutput} dynamically-generated title, description, and styling properties
 */
export function getAlertContent(alert, appealIsActive) {
  const { type, details } = alert;

  switch (type) {
    case ALERT_TYPES.form9Needed: {
      const formattedDueDate = formatDate(details.dueDate);
      return {
        title: `Return VA Form 9 by ${formattedDueDate} in order to continue your appeal`,
        description: (
          <div>
            <p>
              A blank VA Form 9 was included with your Statement of the Case.
              You can continue your appeal to the Board of Veterans’ Appeals by
              submitting this form. When you fill it out, you can also request a
              hearing with a Veterans Law Judge if you’d like one.
            </p>
            <p>
              If you need help understanding your Statement of the Case or
              completing the VA Form 9, contact your Veterans Service
              Organization or representative.
            </p>
            <p>
              You may also opt in to the new decision review process. You have
              60 days from the date on the Statement of the Case to{' '}
              <a href={DECISION_REVIEW_URL}>
                opt in to one of the new decision review options
              </a>
              .
            </p>
          </div>
        ),
        displayType: 'take_action',
        type,
      };
    }
    case ALERT_TYPES.scheduledHearing: {
      const formattedDate = formatDate(details.date);
      return {
        title: <span>Your hearing is scheduled for {formattedDate}</span>,
        description: '', // intentionally empty
        displayType: 'take_action',
        type,
      };
    }
    case ALERT_TYPES.hearingNoShow: {
      const formattedDate = formatDate(details.date);
      const formattedDueDate = formatDate(details.dueDate);
      return {
        title: `You missed your hearing on ${formattedDate}`,
        description: (
          <div>
            <p>
              You were scheduled for a hearing on {formattedDate}, but VA
              records show that you didn’t attend. If you want to request a new
              hearing, you’ll need to send the Board of Veterans’ Appeals a
              letter that explains why you didn’t go to the hearing. You’ll need
              to send this letter by {formattedDueDate}.
            </p>
            <p className="va-address-block">
              Board of Veterans’ Appeals
              <br />
              PO Box 27063
              <br />
              Washington, DC 20038
              <br />
              Fax 844-678-8979
            </p>
            <p>
              Please contact your Veterans Service Organization or
              representative for more information.
            </p>
          </div>
        ),
        displayType: 'take_action',
        type,
      };
    }
    case ALERT_TYPES.heldForEvidence: {
      const formattedDueDate = formatDate(details.dueDate);
      return {
        title: 'Your appeals case is being held open',
        description: (
          <div>
            <p>
              You or your representative asked the Board of Veterans’ Appeals to
              hold your case open while you gather more evidence to support your
              appeal. Please submit your evidence to the Board by{' '}
              {formattedDueDate}.
            </p>
            <p className="va-address-block">
              Board of Veterans’ Appeals
              <br />
              PO Box 27063
              <br />
              Washington, DC 20038
              <br />
              Fax 844-678-8979
            </p>
          </div>
        ),
        displayType: 'take_action',
        type,
      };
    }
    case ALERT_TYPES.evidentiaryPeriod: {
      const formattedDueDate = formatDate(details.dueDate);
      return {
        title: `Submit new evidence before ${formattedDueDate}`,
        description: (
          <p>
            If you have new evidence to submit, you must send it to the Board of
            Veterans’ Appeals by {formattedDueDate}. Evidence received after
            this date can’t be considered by the Veterans Law Judge.
          </p>
        ),
        displayType: 'take_action',
        type,
      };
    }
    case ALERT_TYPES.rampEligible: {
      const formattedDate = formatDate(details.date);
      return {
        title:
          'This appeal is eligible for the Rapid Appeals Modernization Program',
        description: (
          <div>
            <p>
              On {formattedDate}, VA sent you a letter to let you know about a
              new program called the Rapid Appeals Modernization Program (RAMP).
              The Veterans Appeals Improvement and Modernization Act will create
              new options in 2019 for Veterans seeking review of VA decisions.
              RAMP is a program that allows you to opt in to two of the new
              options for review before the new law takes effect. For more
              information, review the fact sheet that was enclosed with the
              letter.
            </p>
            <p>
              In order to take part in this program, you must return the RAMP
              Opt-in Election form. If you choose to participate in RAMP, VA
              will withdraw all of your eligible appeals and instead review your
              case using the option you select. If you don’t want to participate
              in RAMP and would like to continue your appeal under the existing
              process, you don’t need to take any action.
            </p>
          </div>
        ),
        displayType: 'info',
        type,
      };
    }
    case ALERT_TYPES.rampIneligible: {
      const statusDescription = appealIsActive
        ? 'is active at the Board of Veterans’ Appeals'
        : 'is closed';
      const formattedDate = formatDate(details.date);
      return {
        title:
          'This appeal is not eligible for the Rapid Appeals Modernization Program',
        description: (
          <p>
            On {formattedDate}, VA sent you a letter to let you know about a new
            program called the Rapid Appeals Modernization Program (RAMP).
            However, this appeal isn’t eligible for RAMP because it{' '}
            {statusDescription}. If you have other appeals, they may be eligible
            for RAMP.
          </p>
        ),
        displayType: 'info',
        type,
      };
    }
    case ALERT_TYPES.decisionSoon:
      return {
        title: 'Decision soon',
        description: (
          <p>
            Your appeal will soon receive a Board decision. Submitting new
            evidence at this time could delay review of your appeal. If you’ve
            moved recently, please make sure that VA has your up-to-date mailing
            address.
          </p>
        ),
        displayType: 'info',
        type,
      };
    case ALERT_TYPES.blockedByVso:
      return {
        title: 'A judge currently can’t review your appeal',
        description: (
          <p>
            Your appeal is eligible to be assigned to a judge based on its place
            in line, but they’re prevented from reviewing your appeal because
            your Veterans Service Organization, {details.vsoName}, is reviewing
            it right now. For more information, please contact your Veterans
            Service Organization or representative.
          </p>
        ),
        displayType: 'info',
        type,
      };
    case ALERT_TYPES.cavcOption: {
      const formattedDueDate = formatDate(details.dueDate);
      return {
        title: 'What if I disagree with my decision?',
        description: (
          <div>
            <p>
              If you disagree with the Board’s decision, you can appeal to the
              Court of Appeals for Veterans Claims. You’ll need to hire a
              VA-accredited attorney to represent you, or you may represent
              yourself. You’ll need to file your Court appeal by{' '}
              {formattedDueDate}. For more information, you can:
            </p>
            <ul>
              <li>
                Review the document “Your Rights to Appeal Our Decision”
                enclosed with the Board’s decision
              </li>
              <li>
                Visit the{' '}
                <a href="https://www.uscourts.cavc.gov/appeal.php">
                  Court’s website
                </a>
              </li>
              <li>
                Contact your Veterans Service Organization or representative.
              </li>
            </ul>
          </div>
        ),
        // displayType is blank because it doesn't apply; this gets pulled out and displayed as a
        //  non-alert after "What happens next?"
        displayType: '',
        type,
      };
    }
    case ALERT_TYPES.amaPostDecision: {
      const formattedDecisionDate = formatDate(details.decisionDate);
      const formattedDueDate = formatDate(details.dueDate);
      const formattedCavcDueDate = formatDate(details.cavcDueDate);
      return {
        title: `What if I disagree with the ${formattedDecisionDate} decision?`,
        description: (
          <div>
            <p>
              If you disagree with VA’s decision, you can choose one of the
              following review options to continue your case:
            </p>
            <ul className="appeals-next-list appeals-next-list-no-separator">
              {details.availableOptions.includes(
                DECISION_REVIEW_OPTIONS.supplementalClaim,
              ) && (
                <li className="next-event">
                  <h3>Add new and relevant evidence</h3>
                  <p>
                    A reviewer will determine whether the new evidence changes
                    the decision. This option is called a{' '}
                    <a href="/decision-reviews/supplemental-claim">
                      Supplemental Claim
                    </a>
                    . <strong>Available until {formattedDueDate}.</strong>
                  </p>
                </li>
              )}
              {details.availableOptions.includes(
                DECISION_REVIEW_OPTIONS.higherLevelReview,
              ) && (
                <li className="next-event">
                  <h3>Ask for a new look from a higher-level reviewer</h3>
                  <p>
                    A higher-level reviewer will look at your case and determine
                    whether the decision can be changed based on a difference of
                    opinion or because VA made an error. This option is called a
                    <a href="/decision-reviews/higher-level-review">
                      Higher-Level Review
                    </a>
                    . <strong>Available until {formattedDueDate}.</strong>
                  </p>
                </li>
              )}
              {details.availableOptions.includes(
                DECISION_REVIEW_OPTIONS.appeal,
              ) && (
                <li className="next-event">
                  <h3>Appeal to a Veterans Law Judge</h3>
                  <p>
                    Appeal to a Veterans Law Judge. A judge at the Board of
                    Veterans’ Appeals in Washington, D.C. will review your case.
                    This option is called a{' '}
                    <a href="/decision-reviews/board-appeal">Board Appeal</a>{' '}
                    <strong>Available until {formattedDueDate}.</strong>
                  </p>
                </li>
              )}
              {details.availableOptions.includes(
                DECISION_REVIEW_OPTIONS.cavc,
              ) && (
                <li className="next-event">
                  <h3>
                    Appeal to the U.S. Court of Appeals for Veterans Claims
                  </h3>
                  <p>
                    The court will review the Board’s decision. You can hire an
                    attorney to represent you, or you may represent yourself.{' '}
                    <strong>Available until {formattedCavcDueDate}.</strong>
                  </p>
                </li>
              )}
            </ul>
            <h4>Not available for this decision</h4>
            <ul>
              {!details.availableOptions.includes(
                DECISION_REVIEW_OPTIONS.supplementalClaim,
              ) && <li>Add new and relevant evidence (Supplemental Claim)</li>}
              {!details.availableOptions.includes(
                DECISION_REVIEW_OPTIONS.higherLevelReview,
              ) && (
                <li>
                  Ask for a new look from a higher-level reviewer (Higher-Level
                  Review)
                </li>
              )}
              {!details.availableOptions.includes(
                DECISION_REVIEW_OPTIONS.appeal,
              ) && <li>Appeal to a Veterans Law Judge (Board Appeal)</li>}
            </ul>
            {details.availableOptions.includes(
              DECISION_REVIEW_OPTIONS.cavc,
            ) && (
              <p>
                Your decision has information on additional ways you and/or your
                representative can address errors.
              </p>
            )}
            <p>
              <a href={DECISION_REVIEW_URL}>
                Learn more about your decision review options.
              </a>
            </p>
          </div>
        ),
        // displayType is blank because it doesn't apply; this gets pulled out and displayed as a
        //  non-alert after "What happens next?"
        displayType: '',
        type,
      };
    }
    default:
      return {
        title: '',
        description: null,
        displayType: '',
        type,
      };
  }
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

// Series of utility functions to sort claims and appeals by last updated date
/**
 *
 * @param {Object} appeal
 * @returns {string}
 */
const getAppealDate = appeal => {
  const { events } = appeal.attributes;
  return events && events.length ? events[events.length - 1].date : '0';
};

/**
 *
 * @param {Object} claim
 * @returns {string}
 */
const getClaimDate = claim => {
  const { phaseChangeDate } = claim.attributes;
  return phaseChangeDate || '0';
};

/**
 *
 * @param {Object} item
 * @returns {string}
 */
const getDate = item => {
  if (!item.attributes) {
    return '0';
  }

  return appealTypes.includes(item.type)
    ? getAppealDate(item)
    : getClaimDate(item);
};

/**
 *
 * @param {Object} item1
 * @param {Object} item2
 * @returns {-1|1|0}
 */
export function sortByLastUpdated(item1, item2) {
  const lastUpdatedDate1 = getDate(item1);
  const lastUpdatedDate2 = getDate(item2);

  if (isAfter(lastUpdatedDate1, lastUpdatedDate2)) {
    return -1;
  }
  if (isBefore(lastUpdatedDate1, lastUpdatedDate2)) {
    return 1;
  }
  return 0;
}

export function getVisibleRows(list, currentPage) {
  const currentIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  if (!list.length) {
    return list;
  }
  return list.slice(currentIndex, currentIndex + ITEMS_PER_PAGE);
}

/**
 * Calculate the item range based on the current page and number of rows/page.
 * This is used to
 * @param {Number} page - current page
 * @param {Number} totalItems - total number of entries
 * @returns
 */
export const getPageRange = (page, totalItems) => {
  const firstItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const itemsLeftToShow = totalItems - (page - 1) * ITEMS_PER_PAGE;
  const lastItem =
    itemsLeftToShow > ITEMS_PER_PAGE
      ? firstItem + ITEMS_PER_PAGE - 1
      : firstItem + itemsLeftToShow - 1;
  return {
    start: firstItem,
    end: lastItem,
  };
};
