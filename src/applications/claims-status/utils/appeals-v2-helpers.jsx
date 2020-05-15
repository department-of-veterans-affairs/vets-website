import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import * as Sentry from '@sentry/browser';
import { Link } from 'react-router';
import Decision from '../components/appeals-v2/Decision';

// This literally determines how many rows are displayed per page on the v2 index page
export const ROWS_PER_PAGE = 10;

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

const appealTypes = Object.values(APPEAL_TYPES);

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

// TO DO: Replace these properties and content with real versions once finalized.
export const STATUS_TYPES = {
  pendingSoc: 'pending_soc',
  pendingForm9: 'pending_form9',
  pendingCertification: 'pending_certification',
  pendingCertificationSsoc: 'pending_certification_ssoc',
  remandSsoc: 'remand_ssoc',
  pendingHearingScheduling: 'pending_hearing_scheduling',
  scheduledHearing: 'scheduled_hearing',
  onDocket: 'on_docket',
  atVso: 'at_vso',
  decisionInProgress: 'decision_in_progress',
  bvaDevelopment: 'bva_development',
  stayed: 'stayed',
  remand: 'remand',
  merged: 'merged',
  bvaDecision: 'bva_decision',
  fieldGrant: 'field_grant',
  withdrawn: 'withdrawn',
  ftr: 'ftr',
  ramp: 'ramp',
  reconsideration: 'reconsideration',
  death: 'death',
  otherClose: 'other_close',
  evidentiaryPeriod: 'evidentiary_period',
  amaRemand: 'ama_remand',
  postBvaDtaDecision: 'post_bva_dta_decision',
  bvaDecisionEffectuation: 'bva_decision_effectuation',
  scReceived: 'sc_received',
  scDecision: 'sc_decision',
  scClosed: 'sc_closed',
  hlrReceived: 'hlr_received',
  hlrDtaError: 'hlr_dta_error',
  hlrDecision: 'hlr_decision',
  hlrClosed: 'hlr_closed',
  statutoryOptIn: 'statutory_opt_in',
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
    state.disability.status.claimsV2.appeals,
    a => a.id === id || (_.get(a, 'attributes.appealIds') || []).includes(id),
  );
}

export function formatDate(date) {
  return moment(date, 'YYYY-MM-DD').format('MMMM DD, YYYY');
}

function getHearingType(type) {
  const typeMaps = {
    video: 'videoconference',
    travel_board: 'travel board', // eslint-disable-line camelcase
    central_office: 'Washington, DC central office', // eslint-disable-line camelcase
  };

  return typeMaps[type] || type;
}

/**
 * Grabs the matching title and dynamically-generated description for a given current status type
 * @typedef {Object} Contents
 * @property {string} title a current status type's title
 * @property {HTMLElement} description details about the current status, can be any element
 * ----------------------------------------------------------------------------------------------
 * @typedef {Object} Name
 * @property {string} [first] first name
 * @property {string} [middle] middle name
 * @property {string} [last] last
 * @param {Object} appeal
 * @param {Name} [name] used for death status type, includes first/middle/last properties
 * @returns {Contents}
 */
export function getStatusContents(appeal, name = {}) {
  const { status, aoj, programArea } = appeal.attributes;
  const appealType = appeal.type;
  const statusType = status.type || status;
  const details = status.details || {};
  const amaDocket = _.get(appeal, 'attributes.docket.type');
  const aojDescription = getAojDescription(aoj);

  const contents = {};
  switch (statusType) {
    case STATUS_TYPES.pendingSoc:
      contents.title = 'A Decision Review Officer is reviewing your appeal';
      contents.description = (
        <p>
          The {aojDescription} received your Notice of Disagreement. A Decision
          Review Officer will review all of the evidence related to your appeal,
          including any new evidence you sent. The officer may contact you to
          ask for more evidence or medical exams as needed. When the officer has
          completed their review, they’ll determine whether or not they can
          grant your appeal.
        </p>
      );
      break;
    case STATUS_TYPES.pendingForm9: {
      const formattedSocDate = moment(details.lastSocDate, 'YYYY-MM-DD').format(
        'MMMM D, YYYY',
      );
      contents.title = 'Please review your Statement of the Case';
      contents.description = (
        <div>
          <p>
            The {aojDescription} sent you a Statement of the Case on{' '}
            {formattedSocDate}. The Statement of the Case explains the reasons
            why they couldn’t fully grant your appeal.
          </p>
          <p>
            If you don’t agree with the Statement of the Case, you can continue
            your appeal to the Board of Veterans’ Appeals. To do this, you must
            complete and return a VA Form 9 within 60 days.
          </p>
        </div>
      );
      break;
    }
    case STATUS_TYPES.pendingCertification:
      contents.title =
        'The Decision Review Officer is finishing their review of your appeal';
      contents.description = (
        <p>
          The {aojDescription} received your VA Form 9 and will send your appeal
          to the Board of Veterans’ Appeals. But first, the Decision Review
          Officer must certify that they have finished reviewing all of the
          evidence related to your appeal.
        </p>
      );
      break;
    case STATUS_TYPES.pendingCertificationSsoc: {
      const formattedSocDate = moment(details.lastSocDate, 'YYYY-MM-DD').format(
        'MMMM D, YYYY',
      );
      contents.title = 'Please review your Supplemental Statement of the Case';
      contents.description = (
        <div>
          <p>
            The {aojDescription} sent you a Supplemental Statement of the Case
            on {formattedSocDate}. This is because:
          </p>
          <ul>
            <li>
              You, your legal representative, your health care provider, or VA
              added new evidence to your appeal, and/or
            </li>
            <li>
              VA found it had further duty to assist you to develop your appeal,
              such as helping you get treatment records or giving you a physical
              exam if needed.
            </li>
          </ul>
        </div>
      );
      break;
    }
    case STATUS_TYPES.remandSsoc: {
      const formattedSocDate = moment(details.lastSocDate, 'YYYY-MM-DD').format(
        'MMMM D, YYYY',
      );
      contents.title = 'Please review your Supplemental Statement of the Case';
      contents.description = (
        <p>
          The {aojDescription} sent you a Supplemental Statement of the Case on{' '}
          {formattedSocDate} because, after completing the remand instructions
          from the Board, they couldn’t fully grant your appeal.
        </p>
      );
      break;
    }
    case STATUS_TYPES.pendingHearingScheduling:
      contents.title = 'You’re waiting for your hearing to be scheduled';
      contents.description = (
        <div>
          <p>
            You requested a {getHearingType(details.type)} hearing. When your
            hearing is scheduled, you’ll receive a notice in the mail at least
            30 days before the hearing date.
          </p>
          {appealType === APPEAL_TYPES.appeal && (
            <p>
              <strong>Note:</strong> If you have new evidence, you can only
              submit it at your hearing or within the 90 days after your
              hearing. Please don’t submit additional evidence now.
            </p>
          )}
        </div>
      );
      break;
    case STATUS_TYPES.scheduledHearing: {
      const formattedDate = moment(details.date, 'YYYY-MM-DD').format(
        'MMMM D, YYYY',
      );
      contents.title = 'Your hearing has been scheduled';
      contents.description = (
        <div>
          <p>
            Your {getHearingType(details.type)} hearing is scheduled for{' '}
            {formattedDate} at {details.location}.
          </p>
          {appealType === APPEAL_TYPES.appeal && (
            <p>
              <strong>Note:</strong> If you have new evidence, you can only
              submit it at your hearing or within the 90 days after your
              hearing. Please don’t submit additional evidence now.
            </p>
          )}
        </div>
      );
      break;
    }
    case STATUS_TYPES.onDocket:
      contents.title = 'Your appeal is waiting to be sent to a judge';
      contents.description = (
        <div>
          <p>
            Your appeal is at the Board of Veterans’ Appeals, waiting to be sent
            to a Veterans Law Judge. Staff at the Board will make sure your case
            is complete, accurate, and ready to be decided by a judge.
          </p>
          {appealType === APPEAL_TYPES.appeal && (
            <p>
              <strong>Note:</strong> Please don’t submit additional evidence.
              The judge will only consider evidence that VA already has.
            </p>
          )}
        </div>
      );
      break;
    case STATUS_TYPES.atVso:
      contents.title = 'Your appeal is with your Veterans Service Organization';
      contents.description = (
        <p>
          {details.vsoName} is reviewing your appeal to make additional
          arguments in support of your case. For more information, please
          contact {details.vsoName}.
        </p>
      );
      break;
    case STATUS_TYPES.decisionInProgress:
      contents.title = 'A judge is reviewing your appeal';
      contents.description = (
        <p>
          Your appeal is at the Board of Veterans’ Appeals being reviewed by a
          Veterans Law Judge.{' '}
          {appealType === APPEAL_TYPES.legacy &&
            'If you submit evidence that isn’t already included in your case, it may delay your appeal.'}
        </p>
      );
      break;
    case STATUS_TYPES.bvaDevelopment:
      contents.title =
        'The judge is seeking more information before making a decision';
      contents.description = (
        <p>
          The Board of Veterans’ Appeals is seeking evidence or an outside
          opinion from a legal, medical, or other professional in order to make
          a decision about your appeal.
        </p>
      );
      break;
    case STATUS_TYPES.stayed:
      contents.title =
        'The Board is waiting until a higher court makes a decision';
      contents.description = (
        <p>
          A higher court has asked the Board of Veterans’ Appeals to hold open a
          group of appeals awaiting review. Yours is one of the appeals held
          open. The higher court believes that a decision it will make on a
          different appeal could affect yours.
        </p>
      );
      break;
    case STATUS_TYPES.remand:
    case STATUS_TYPES.amaRemand:
    case STATUS_TYPES.bvaDecision:
      contents.title = 'The Board made a decision on your appeal';
      contents.description = (
        <div>
          <p>
            The Board of Veterans’ Appeals sent you a decision on your appeal.
            Here’s an overview:
          </p>
          <Decision
            issues={details.issues}
            aoj={aoj}
            ama={appealType === APPEAL_TYPES.appeal}
            boardDecision
          />
        </div>
      );
      break;
    case STATUS_TYPES.fieldGrant:
      contents.title = `The ${aojDescription} granted your appeal`;
      contents.description = (
        <p>
          The {aojDescription} agreed with you and decided to overturn the
          original decision. If this decision changes your disability rating or
          eligibility for VA benefits, you should see this change made in 1 to 2
          months.
        </p>
      );
      break;
    case STATUS_TYPES.withdrawn:
      contents.title = 'You withdrew your appeal';
      contents.description = (
        <p>
          You chose not to continue your appeal. If this information is
          incorrect, please contact your Veterans Service Organization or
          representative for more information.
        </p>
      );
      break;
    case STATUS_TYPES.ftr:
      contents.title = 'Your appeal was closed';
      contents.description = (
        <p>
          You didn’t take an action VA requested in order to continue your
          appeal. If this information is incorrect, or if you want to reopen
          your appeal, please contact your Veterans Service Organization or
          representative for more information.
        </p>
      );
      break;
    case STATUS_TYPES.ramp:
      contents.title =
        'You opted in to the Rapid Appeals Modernization Program (RAMP)';
      contents.description = (
        <p>
          You chose to participate in the new Supplemental Claim or Higher-Level
          Review lanes. This doesn’t mean that your appeal has been closed. If
          this information is incorrect, please contact your Veterans Service
          Organization or representative as soon as possible.
        </p>
      );
      break;
    case STATUS_TYPES.reconsideration:
      contents.title = 'Your Motion for Reconsideration was denied';
      contents.description = (
        <p>
          The Board of Veterans’ Appeals declined to reopen your appeal. Please
          contact your Veterans Service Organization or representative for more
          information.
        </p>
      );
      break;
    case STATUS_TYPES.death: {
      const { first, middle, last } = name;
      const nameString = `${first || ''} ${middle || ''} ${last || ''}`;
      contents.title = 'The appeal was closed';
      contents.description = (
        <p>
          VA records indicate that {_.startCase(_.toLower(nameString))} is
          deceased, so this appeal has been closed. If this information is
          incorrect, please contact your Veterans Service Organization or
          representative as soon as possible.
        </p>
      );
      break;
    }
    case STATUS_TYPES.otherClose:
      contents.title = 'Your appeal was closed';
      contents.description = (
        <p>
          Your appeal was dismissed or closed. Please contact your Veterans
          Service Organization or representative for more information.
        </p>
      );
      break;
    case STATUS_TYPES.merged:
      contents.title = 'Your appeal was merged';
      contents.description = (
        <div>
          <p>
            Your appeal was merged with another appeal. The Board of Veterans’
            Appeals merges appeals so that you can receive a single decision on
            as many appealed issues as possible. This appeal was merged with an
            older appeal that was closest to receiving a Board decision.
          </p>
          <p>
            Check <Link to="/your-claims">Your claims and appeals</Link> for the
            appeal that contains the issues merged from this appeal.
          </p>
        </div>
      );
      break;
    case STATUS_TYPES.statutoryOptIn:
      contents.title =
        'You requested a decision review under the Appeals Modernization Act';
      contents.description = (
        <div>
          <p>
            A new law, the Veterans Appeals Improvement and Modernization Act,
            took effect on February 19, 2019. Although your appeal started
            before the new law took effect, you asked for it to be converted
            into one of the new decision review options.
          </p>
          <p>
            Check <Link to="/your-claims">Your claims and appeals</Link> for the
            decision review that contains the issues from this appeal, or learn
            more about{' '}
            <a href="/decision-reviews">
              decision reviews under the Appeals Modernization Act
            </a>
            .
          </p>
        </div>
      );
      break;
    case STATUS_TYPES.evidentiaryPeriod:
      contents.title = 'Your appeals file is open for new evidence';
      contents.description = (
        <div>
          <p>
            Because you requested the {getDocketName(amaDocket)} appeal option,
            the Board of Veterans’ Appeals will hold your case open for new
            evidence for 90 days. You can send new evidence to the Board at:
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
      );
      break;
    case STATUS_TYPES.postBvaDtaDecision: {
      const formattedBvaDecisionDate = moment(
        details.bvaDecisionDate,
        'YYYY-MM-DD',
      ).format('MMMM D, YYYY');
      const formattedAojDecisionDate = moment(
        details.aojDecisionDate,
        'YYYY-MM-DD',
      ).format('MMMM D, YYYY');
      contents.title = `The ${aojDescription} corrected an error`;
      contents.description = (
        <div>
          <p>
            In the {formattedBvaDecisionDate} decision, a judge at the Board of
            Veterans’ Appeals identified an error that needed to be corrected. A
            reviewer at the {aojDescription} completed the judge’s instructions
            and sent you a new decision on {formattedAojDecisionDate}. Here's an
            overview:
          </p>
          <Decision issues={details.issues} aoj={aoj} />
          <p>
            If you disagree with either the Board decision or the{' '}
            {aojDescription} decision, you can request another review. The
            review options available to you depend on which decision you
            disagree with.
          </p>
        </div>
      );
      break;
    }
    case STATUS_TYPES.bvaDecisionEffectuation: {
      const formattedBvaDecisionDate = moment(
        details.bvaDecisionDate,
        'YYYY-MM-DD',
      ).format('MMMM D, YYYY');
      const formattedAojDecisionDate = moment(
        details.aojDecisionDate,
        'YYYY-MM-DD',
      ).format('MMMM D, YYYY');
      contents.title = `The ${aojDescription} corrected an error`;
      contents.description = (
        <div>
          <p>
            On {formattedBvaDecisionDate}, a judge at the Board of Veterans’
            Appeals made a decision that changes your disability rating or
            eligibility for benefits. On {formattedAojDecisionDate}, the{' '}
            {aojDescription} sent you a new decision that updates your benefits.
          </p>
          <p>
            If you disagree with either the Board decision or the{' '}
            {aojDescription} decision, you can request another review. The
            review options available to you depend on which decision you
            disagree with.
          </p>
        </div>
      );
      break;
    }
    case STATUS_TYPES.scReceived:
      contents.title = 'A reviewer is examining your new evidence';
      contents.description = (
        <div>
          <p>
            A Supplemental Claim allows you to add new and relevant evidence to
            your case. When you filed a Supplemental Claim, you included new
            evidence or identified evidence that the {aojDescription} should
            obtain.
          </p>
          {programArea !== 'compensation' && (
            <p>
              If you have more evidence to submit, you should do so as soon as
              possible.
            </p>
          )}
          {programArea === 'compensation' && (
            <div>
              <p>
                If you have more evidence to submit, you should do so as soon as
                possible. You can send new evidence to the {aojDescription} at:
              </p>
              <p className="va-address-block">
                Department of Veterans Affairs
                <br />
                Evidence Intake Center
                <br />
                PO Box 4444
                <br />
                Janesville, WI 53547-4444
                <br />
                Fax 844-531-7818
              </p>
            </div>
          )}
          <p>
            A reviewer will look at this new evidence, as well as evidence VA
            already had, and determine whether it changes the decision. If
            needed, they may contact you to ask for more evidence or to schedule
            a new medical exam.
          </p>
        </div>
      );
      break;
    case STATUS_TYPES.hlrReceived:
      contents.title = 'A senior reviewer is taking a new look at your case';
      contents.description = (
        <div>
          <p>
            By requesting a Higher-Level Review, you asked for a senior reviewer
            at the {aojDescription} to look at your case and determine whether
            they can change the decision based on a difference of opinion or
            because VA made an error.
          </p>
          {details.informalConference && (
            <p>
              You requested an informal conference. The reviewer will contact
              you at the phone number you provided to schedule a time to speak
              to you and/or your representative. When you speak to the reviewer,
              you can say why you think the decision should be changed and
              identify errors.
            </p>
          )}
          <p>
            <strong>Note:</strong> Please don’t submit additional evidence. The
            reviewer will only consider evidence that VA already has.
          </p>
        </div>
      );
      break;
    case STATUS_TYPES.scDecision:
      contents.title = `The ${aojDescription} made a decision`;
      contents.description = (
        <div>
          <p>
            The {aojDescription} sent you a decision on your Supplemental Claim.
            Here’s an overview:
          </p>
          <Decision issues={details.issues} aoj={aoj} />
        </div>
      );
      break;
    case STATUS_TYPES.hlrDecision:
      contents.title = `The ${aojDescription} made a decision`;
      contents.description = (
        <div>
          <p>
            The {aojDescription} sent you a decision on your Higher-Level
            Review. Here’s an overview:
          </p>
          <Decision issues={details.issues} aoj={aoj} />
        </div>
      );
      break;
    case STATUS_TYPES.hlrDtaError:
      contents.title = `The ${aojDescription} is correcting an error`;
      contents.description = (
        <p>
          During their review, the senior reviewer identified an error that must
          be corrected before deciding your case. If needed, the reviewer may
          contact you to ask for more evidence or to schedule a new medical
          exam.
        </p>
      );
      break;
    case STATUS_TYPES.scClosed:
      contents.title = 'Your Supplemental Claim was closed';
      contents.description = (
        <p>
          Your Supplemental Claim was closed. Please contact VA or your Veterans
          Service Organization or representative for more information.
        </p>
      );
      break;
    case STATUS_TYPES.hlrClosed:
      contents.title = 'Your Higher-Level Review was closed';
      contents.description = (
        <p>
          Your Higher-Level Review was closed. Please contact VA or your
          Veterans Service Organization or representative for more information.
        </p>
      );
      break;
    default:
      contents.title = 'We don’t know your status';
      contents.description = (
        <p>We’re sorry, VA.gov will soon be updated to show your status.</p>
      );
  }

  return contents;
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

/**
 * Returns an object with the content used in the timeline.
 * @param {Object} event
 * @returns {Object}
 */
export function getEventContent(event) {
  switch (event.type) {
    case EVENT_TYPES.claimDecision:
      return {
        title: 'VA sent you a claim decision',
        description: '',
      };
    case EVENT_TYPES.nod:
      return {
        title: 'VA received your Notice of Disagreement',
        description: '',
      };
    case EVENT_TYPES.soc:
      return {
        title: 'VA sent you a Statement of the Case',
        description: '',
      };
    case EVENT_TYPES.form9:
      return {
        title: 'VA recieved your Form 9',
        description: '',
      };
    case EVENT_TYPES.ssoc:
      return {
        title: 'VA sent you a Supplemental Statement of the Case',
        description: '',
      };
    case EVENT_TYPES.certified:
      return {
        title: 'Your appeal was sent to the Board of Veterans’ Appeals',
        description: '',
      };
    case EVENT_TYPES.hearingHeld:
      return {
        title: 'You attended a hearing with a Veterans Law Judge',
        description: '',
      };
    case EVENT_TYPES.hearingNoShow:
      return {
        title: 'You missed your hearing with a Veterans Law Judge',
        description: '',
      };
    case EVENT_TYPES.transcript:
      return {
        title: 'VA sent you a transcript of your hearing',
        description: '',
      };
    case EVENT_TYPES.bvaDecision:
      return {
        title: 'Board of Veterans’ Appeals made a decision',
        description: '',
      };
    case EVENT_TYPES.cavcDecision:
      return {
        title: 'U.S. Court of Appeals for Veterans Claims made a decision',
        description: '',
      };
    case EVENT_TYPES.remandReturn:
      return {
        title: 'Your appeal was returned to the Board of Veterans’ Appeals',
        description: '',
      };
    case EVENT_TYPES.rampNotice:
      return {
        title:
          'VA sent you a letter about the Rapid Appeals Modernization Program',
        description: '',
      };
    case EVENT_TYPES.fieldGrant:
      return {
        title: 'VA granted one or more issues',
        description: '',
      };
    case EVENT_TYPES.withdrawn:
      return {
        title: 'You withdrew your appeal',
        description: '',
      };
    case EVENT_TYPES.failureToRespond:
    case EVENT_TYPES.otherClose:
      return {
        title: 'Your appeal was closed',
        description: '',
      };
    case EVENT_TYPES.rampOptIn:
      return {
        title: 'You opted in to the Rapid Appeals Modernization Program',
        description: '',
      };
    case EVENT_TYPES.death:
      return {
        title: 'The appeal was closed',
        description: '',
      };
    case EVENT_TYPES.merged:
      return {
        title: 'Your appeals were merged',
        description: '',
      };
    case EVENT_TYPES.reconsideration:
      return {
        title: 'Your Motion for Reconsideration was denied',
        description: '',
      };
    case EVENT_TYPES.vacated:
      return {
        title: 'Board of Veterans’ Appeals vacated a previous decision',
        description: '',
      };
    case EVENT_TYPES.amaNod:
      return {
        title: 'Board of Veterans’ Appeals received your appeal',
        description: '',
      };
    case EVENT_TYPES.docketChange:
      return {
        title: 'You switched appeal options',
        description: '',
      };
    case EVENT_TYPES.distributedToVlj:
      return {
        title: 'Your appeal was distributed to a Veterans Law Judge',
        description: '',
      };
    case EVENT_TYPES.bvaDecisionEffectuation:
      return {
        title: 'VA updated your benefits to reflect the Board’s decision',
        description: '',
      };
    case EVENT_TYPES.dtaDecision:
      return {
        title: 'VA corrected an error and made a new decision',
        description: '',
      };
    case EVENT_TYPES.scRequest:
      return {
        title: 'VA received your Supplemental Claim request',
        description: '',
      };
    case EVENT_TYPES.scDecision:
    case EVENT_TYPES.hlrDecision:
      return {
        title: 'VA made a new decision',
        description: '',
      };
    case EVENT_TYPES.scOtherClose:
      return {
        title: 'Your Supplemental Claim was closed',
        description: '',
      };
    case EVENT_TYPES.hlrRequest:
      return {
        title: 'VA received your Higher-Level Review request',
        description: '',
      };
    case EVENT_TYPES.hlrDtaError:
      return {
        title: 'VA identified an error that must be corrected',
        description: '',
      };
    case EVENT_TYPES.hlrOtherClose:
      return {
        title: 'Your Higher-Level Review was closed',
        description: '',
      };
    case EVENT_TYPES.statutoryOptIn:
      return {
        title:
          'You requested a decision review under the Appeals Modernization Act',
        description: '',
      };
    default:
      Sentry.withScope(scope => {
        scope.setExtra('eventType', event.type);
        Sentry.captureMessage('appeals-unknown-event');
      });
      return null;
  }
}

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
                to the Board of Veterans’ Appeals.
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
      const formattedSocDate = moment(details.lastSocDate, 'YYYY-MM-DD').format(
        'MMMM D, YYYY',
      );
      return {
        header: `If you return a VA Form 9 within 60 days, what happens next depends on whether you
          also submit new evidence.`,
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
                of the Case on {formattedSocDate}, the Decision Review Officer
                will need to write a Supplemental Statement of the Case before
                sending your case to the Board of Veterans’ Appeals. Once your
                appeal has been sent, new evidence can be submitted directly to
                the Board and won’t be reviewed by the Veterans Benefits
                Administration.
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
      const formattedSocDate = moment(details.lastSocDate, 'YYYY-MM-DD').format(
        'MMMM D, YYYY',
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
                of the Case on {formattedSocDate}, the Decision Review Officer
                will need to write a Supplemental Statement of the Case before
                sending your case to the Board of Veterans’ Appeals. Once your
                appeal has been sent, new evidence can be submitted directly to
                the Board and won’t be reviewed by the Veterans Benefits
                Administration.
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
      const formattedSocDate = moment(details.lastSocDate, 'YYYY-MM-DD').format(
        'MMMM D, YYYY',
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
                Supplemental Statement of the Case on {formattedSocDate}, the
                Decision Review Officer will need to write a new Supplemental
                Statement of the Case before sending your case to the Board of
                Veterans’ Appeals. Once your appeal has been sent, new evidence
                can be submitted directly to the Board and won’t be reviewed by
                the Veterans Benefits Administration.
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
      const formattedSocDate = moment(details.lastSocDate, 'YYYY-MM-DD').format(
        'MMMM D, YYYY',
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
                Supplemental Statement of the Case on {formattedSocDate}, the
                Veterans Benefits Administration will need to write a new
                Supplemental Statement of the Case before returning your case to
                the Board of Veterans’ Appeals.
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
            title: 'The senior reviewer will make a new decision',
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
                expected 4–5 months because the reviewer needs to correct an
                error before completing their review.
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
        title: `Return the VA Form 9 by ${formattedDueDate} in order to continue your appeal`,
        description: (
          <div>
            <p>
              A VA Form 9 was included with your Statement of the Case. By
              completing and returning the form, you continue your appeal to the
              Board of Veterans’ Appeals. On this form, you can request a
              hearing with a Veterans Law Judge, if you’d like one.
            </p>
            <p>
              If you need help understanding your Statement of the Case or
              completing the VA Form 9, contact your Veterans Service
              Organization or representative.
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
              "lanes" for review before the new law takes effect. For more
              information, review the fact sheet that was enclosed with the
              letter.
            </p>
            <p>
              In order to take part in this program, you must return the RAMP
              Opt-in Election form. If you choose to participate in RAMP, VA
              will withdraw all of your eligible appeals and instead review your
              case using the lane you select. If you don’t want to participate
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
                  <h3>Ask for a new look from a senior reviewer</h3>
                  <p>
                    A senior reviewer will look at your case and determine
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
                  Ask for a new look from a senior reviewer (Higher-Level
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
              <a href="/decision-reviews">
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
  return response.errors && response.errors.length
    ? response.errors[0].status
    : UNKNOWN_STATUS;
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

  if (moment(lastUpdatedDate1).isAfter(lastUpdatedDate2)) {
    return -1;
  } else if (moment(lastUpdatedDate1).isBefore(lastUpdatedDate2)) {
    return 1;
  }
  return 0;
}

export function getVisibleRows(list, currentPage) {
  const currentIndex = (currentPage - 1) * ROWS_PER_PAGE;
  if (!list.length) {
    return list;
  }
  return list.slice(currentIndex, currentIndex + ROWS_PER_PAGE);
}
