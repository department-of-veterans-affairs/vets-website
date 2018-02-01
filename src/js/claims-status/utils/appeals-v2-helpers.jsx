import React from 'react';
import moment from 'moment';
import _ from 'lodash';

// TO DO: Replace made up properties and content with real versions once finalized.
export const STATUS_TYPES = {
  // Open Statuses:
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
  // Closed Statuses:
  bvaDecision: 'bva_decision',
  fieldGrant: 'field_grant',
  withdrawn: 'withdrawn',
  ftr: 'ftr',
  ramp: 'ramp',
  reconsideration: 'reconsideration',
  death: 'death',
  otherClose: 'other_close',
};

export const ISSUE_STATUS = {
  fieldGrant: 'field_grant',
  withdrawn: 'withdrawn',
  allowed: 'allowed',
  denied: 'denied',
  remand: 'remand',
  cavcRemand: 'cavc_remand',
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
  scheduledDroHearing: 'scheduled_dro_hearing',
  droHearingNoShow: 'dro_hearing_no_show',
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
 * @returns {segmentedIssue[]} an array of issue objects with stuses and descriptions
 */
export function categorizeIssues(issues) {
  return issues.map((issue) => {
    let status = '';
    switch (issue.lastAction) {
      case ISSUE_STATUS.fieldGrant:
        status = 'granted';
        break;
      case ISSUE_STATUS.withdrawn:
        status = 'withdrawn';
        break;
      case ISSUE_STATUS.allowed:
        status = 'allowed';
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
 * Finds an appeal from the Redux store with ID matching arg ID
 * @param {object} state Full redux store state tree
 * @param {string} id Appeal ID of the appeal to find
 * @returns {object} One appeal object or undefined if not found in the array
 */
export function isolateAppeal(state, id) {
  return _.find(state.disability.status.claims.appeals, (a) => a.id === id);
}

export function formatDate(date) {
  return moment(date, 'YYYY-MM-DD').format('MMMM DD, YYYY');
}

// TO DO: Replace made up properties and content with real versions once finalized.
/**
 * Grabs the matching title and dynamically-generated description for a given current status type
 * @typedef {Object} Contents
 * @property {string} title a current status type's title
 * @property {HTMLElement} description details about the current status, can be any element
 * ----------------------------------------------------------------------------------------------
 * @param {string} statusType the status type of a claim appeal as returned by the api
 * @param {Object} details optional, properties vary depending on the status type
 * @returns {Contents}
 */
export function getStatusContents(statusType, details) {
  const contents = {};
  switch (statusType) {
    case STATUS_TYPES.pendingSoc:
      contents.title = 'A Decision Review Officer is reviewing your appeal';
      contents.description = (
        <p>The Veterans Benefits Administration received your Notice of Disagreement. A Decision
        Review Officer will review all of the evidence related to your appeal, including any new
        evidence you sent. The officer may contact you to request additional evidence or medical
        examinations, as needed. When the officer has completed their review, they will determine
        whether or not they can grant your appeal.</p>
      );
      break;
    case STATUS_TYPES.pendingForm9:
      contents.title = 'Please review your Statement of the Case';
      contents.description = (
        <div>
          <p>
            The Veterans Benefits Administration sent you a Statement of the Case on [date]. The
            Statement of the Case explains the reasons why they could not fully grant your appeal.
          </p>
          <p>
            If you don’t agree with the Statement of the Case, you can bring your appeal to the Board
            of Veterans’ Appeals. To do this you must complete and return a Form 9 within 60 days.
          </p>
        </div>
      );
      break;
    case STATUS_TYPES.pendingCertification:
      contents.title = 'The Decision Review Officer is finishing their review of your appeal';
      contents.description = (
        <p>The Veterans Benefits Administration received your Form 9 and will transfer your appeal
        to the Board of Veterans’ Appeals. Before doing so, the Decision Review Officer must
        certify that they have finished reviewing all of the evidence related to your appeal.</p>
      );
      break;
    case STATUS_TYPES.pendingCertificationSsoc:
      contents.title = 'Please review your new Statement of the Case';
      contents.description = (
        <div>
          <p>
            The Veterans Benefits Administration sent you a new Statement of the Case on [DATE].
            This is because:
          </p>
          <ul>
            <li>
              You, your legal representative, your health care provider, or VA added new evidence
              to your appeal, and/or
            </li>
            <li>
              VA found it had further duty to assist you in developing your appeal, such as helping
              you get treatment records or providing a physical exam if needed.
            </li>
          </ul>
        </div>
      );
      break;
    case STATUS_TYPES.remandSsoc:
      contents.title = 'Please review your new Statement of the Case';
      contents.description = (
        <p>The Veterans Benefits Administration sent you a new Statement of the Case on [DATE]
        because after completing the remand instructions from the Board, they couldn’t fully grant
        your appeal.</p>
      );
      break;
    case STATUS_TYPES.pendingHearingScheduling:
      contents.title = 'You’re waiting for your hearing to be scheduled';
      contents.description = (
        <p>You requested a [TYPE] hearing on your Form 9. When your hearing is scheduled, you will
        receive a notice in the mail at least 30 days before the hearing date.</p>
      );
      break;
    case STATUS_TYPES.scheduledHearing:
      contents.title = 'Your hearing has been scheduled';
      contents.description = (
        <p>Your [TYPE] hearing is scheduled for [DATE] at [LOCATION]. If you need to change this
        date, please contact your Veteran Service Organization or representative as soon as
        possible.</p>
      );
      break;
    case STATUS_TYPES.onDocket:
      contents.title = 'Your appeal is waiting to be assigned to a judge';
      contents.description = (
        <p>Your appeal is at the Board of Veterans’ Appeals waiting to be assigned to a Veterans
        Law Judge. Staff at the Board will make sure that your case is complete, accurate, and
        ready to be decided by a judge.</p>
      );
      break;
    case STATUS_TYPES.atVso:
      contents.title = 'Your appeal is currently with your Veteran Service Organization';
      contents.description = (
        <p>[VSO] is currently preparing a document in support of your appeal. For more information,
        please contact your Veteran Service Organization or representative.</p>
      );
      break;
    case STATUS_TYPES.decisionInProgress:
      contents.title = 'A judge is reviewing your appeal';
      contents.description = (
        <p>Your appeal is at the Board of Veterans’ Appeals being reviewed by a Veterans Law Judge
        and their team of attorneys. If you submit evidence that isn’t already included in your
        case, this may delay your appeal.</p>
      );
      break;
    case STATUS_TYPES.bvaDevelopment:
      contents.title = 'The judge is seeking additional information before making a decision';
      contents.description = (
        <p>The Board of Veterans’ Appeals is seeking evidence or an outside opinion from a legal,
        medical, or other professional necessary to make decision about your appeal.</p>
      );
      break;
    case STATUS_TYPES.stayed:
      contents.title = 'The Board is waiting until a higher court makes a decision';
      contents.description = (
        <p>A higher court has requested that a group of appeals currently before the Board of
        Veterans’ Appeals be held open. This is because the decision the court makes on a different
        appeal could impact your appeal.</p>
      );
      break;
    case STATUS_TYPES.remand: {
      const { decisionIssues } = details;
      const allowedIssues = decisionIssues
        .filter((issue) => (issue.disposition === 'allowed'))
        .map((issue, i) => (<li key={`allowed-${i}`}>{issue.description}</li>));
      const deniedIssues = decisionIssues
        .filter((issue) => (issue.disposition === 'denied'))
        .map((issue, i) => (<li key={`denied-${i}`}>{issue.description}</li>));
      const remandIssues = decisionIssues
        .filter((issue) => (issue.disposition === 'remand'))
        .map((issue, i) => (<li key={`remanded-${i}`}>{issue.description}</li>));

      const pluralize = {
        allowed: (allowedIssues.length > 1) ? 'these issues' : 'this issue',
        denied: (deniedIssues.length > 1) ? 'issues' : 'issue',
        remand: (remandIssues.length > 1) ? 'issues' : 'issue'
      };

      let allowedBlock = null;
      let deniedBlock = null;
      let remandBlock = null;
      if (allowedIssues.length) {
        allowedBlock = (
          <div>
            <h5 className="allowed-items">Allowed</h5>
            <p>
              The judge overrules the original decision and finds {pluralize.allowed} in
              your favor
            </p>
            <ul>{allowedIssues}</ul>
          </div>
        );
      }
      if (deniedIssues.length) {
        deniedBlock = (
          <div>
            <h5 className="denied-items">Denied</h5>
            <p>The judge upholds the original decision for the following {pluralize.denied}</p>
            <ul>{deniedIssues}</ul>
          </div>
        );
      }
      if (remandIssues.length) {
        remandBlock = (
          <div>
            <h5 className="remand-items">Remand</h5>
            <p>
              The judge needs additional evidence to be collected or a procedural error to be
              corrected for the following {pluralize.remand}
            </p>
            <ul>{remandIssues}</ul>
          </div>
        );
      }

      contents.title = 'The Board made a decision on your appeal';
      contents.description = (
        <div>
          <p>
            The Board of Veterans’ Appeals made a decision on your appeal. Here is an overview of
            the decision:
          </p>
          <div className="decision-items">
            {allowedBlock}
            {deniedBlock}
            {remandBlock}
          </div>
          <p>
            If this decision changes your disability rating or your eligibility for VA benefits,
            you should expect this adjustment to be made in 1 to 2 months.
          </p>
        </div>
      );
      break;
    }
    case STATUS_TYPES.bvaDecision: {
      const { decisionIssues } = details;
      const allowedIssues = decisionIssues
        .filter((issue) => (issue.disposition === 'allowed'))
        .map((issue, i) => (<li key={`allowed-${i}`}>{issue.description}</li>));
      const deniedIssues = decisionIssues
        .filter((issue) => (issue.disposition === 'denied'))
        .map((issue, i) => (<li key={`denied-${i}`}>{issue.description}</li>));

      const pluralize = {
        allowed: (allowedIssues.length > 1) ? 'these issues' : 'this issue',
        denied: (deniedIssues.length > 1) ? 'issues' : 'issue',
      };

      let allowedBlock = null;
      let deniedBlock = null;

      if (allowedIssues.length) {
        allowedBlock = (
          <div>
            <h5 className="allowed-items">Allowed</h5>
            <p>The judge overrules the original decision and finds {pluralize.allowed} in your favor</p>
            <ul>{allowedIssues}</ul>
          </div>
        );
      }
      if (deniedIssues.length) {
        deniedBlock = (
          <div>
            <h5 className="denied-items">Denied</h5>
            <p>The judge upholds the original decision for the following {pluralize.denied}</p>
            <ul>{deniedIssues}</ul>
          </div>
        );
      }

      contents.title = 'The Board made a decision on your appeal';
      contents.description = (
        <div>
          <p>
            The Board of Veterans’ Appeals made a decision on your appeal. Here is an overview of
            the decision:
          </p>
          <div className="decision-items">
            {allowedBlock}
            {deniedBlock}
          </div>
          <p>
            If this decision changes your disability rating or your eligibility for VA benefits,
            you should expect this adjustment to be made in 1 to 2 months.
          </p>
        </div>
      );
      break;
    }
    case STATUS_TYPES.fieldGrant:
      contents.title = 'The Veterans Benefits Administration granted your appeal';
      contents.description = (
        <p>The Veterans Benefits Administration agreed with you and decided to overturn the
        original decision. If this decision changes your disability rating or eligibility for VA
        benefits, you should expect this adjustment to be made in 1 to 2 months.</p>
      );
      break;
    case STATUS_TYPES.withdrawn:
      contents.title = 'You withdrew your appeal';
      contents.description = (
        <p>You have opted to not continue your appeal. If this information is incorrect, please
        contact your Veteran Service Organization or representative for more information.</p>
      );
      break;
    case STATUS_TYPES.ftr:
      contents.title = 'Your appeal was closed';
      contents.description = (
        <p>You did not take an action VA requested in order to continue your appeal. If this
        information is incorrect, or if you want to reopen your appeal, please contact your Veteran
        Service Organization or representative for more information.</p>
      );
      break;
    case STATUS_TYPES.ramp:
      contents.title = 'You opted in to the Rapid Appeals Modernization Program (RAMP)';
      contents.description = (
        <div>
          <p>
            You chose to participate in the new supplemental claim or higher-level review lanes.
            This does not mean that your appeal has been closed. If this information is incorrect,
            please contact your Veteran Service Organization or representative as soon as possible.
          </p>
          <p>
            At this time, Vets.gov is not able to provide information about appeals that are part
            of RAMP.
          </p>
        </div>
      );
      break;
    case STATUS_TYPES.reconsideration:
      contents.title = 'Your motion for reconsideration was denied';
      contents.description = (
        <p>The Board of Veterans’ Appeals declined to reopen your appeal. Please contact your
        Veteran Service Organization or representative for more information.</p>
      );
      break;
    case STATUS_TYPES.death:
      contents.title = 'The appeal was closed';
      contents.description = (
        <p>VA records indicate that [VETERAN NAME] is deceased, so this appeal has been closed. If
        this information is incorrect, please contact your Veteran Service Organization or
        representative as soon as possible.</p>
      );
      break;
    case STATUS_TYPES.otherClose:
      contents.title = 'Your appeal was closed';
      contents.description = (
        <p>Your appeal was dismissed or closed. Please contact your Veteran Service Organization or
        representative for more information.</p>
      );
      break;
    default:
      contents.title = 'Current Appeal Status Unknown';
      contents.description = <p>Your current appeal status is unknown at this time</p>;
  }

  return contents;
}

export const EVENT_TYPES = {
  claim: 'claim',
  nod: 'nod',
  droHearing: 'dro_hearing',
  fieldGrant: 'field_grant',
  soc: 'soc',
  form9: 'form9',
  ssoc: 'ssoc',
  certified: 'certified',
  hearingHeld: 'hearing_held',
  hearingCancelled: 'hearing_cancelled',
  hearingNoShow: 'hearing_no_show',
  bvaDecision: 'bva_decision',
  bvaRemand: 'bva_remand',
  withdrawn: 'withdrawn',
  merged: 'merged',
  cavcDecision: 'cavc_decision',
  recordDesignation: 'record_designation',
  reconsideration: 'reconsideration'
};

/**
 * Returns an object with the content used in the timeline.
 * @param {Object} event
 * @returns {Object}
 */
export function getEventContent(event) {
  switch (event.type) {
    case EVENT_TYPES.claim:
      return {
        title: 'VBA sent the original claim decision to you',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.nod:
      return {
        title: 'VBA received your Notice of Disagreement',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.droHearing:
      return {
        title: 'Dro Hearing',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.fieldGrant:
      return {
        title: 'Field grant',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.soc:
      return {
        title: 'VBA prepared a Statement of the Case (SOC)',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.form9:
      return {
        title: 'Form 9 Recieved',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.ssoc:
      return {
        title: 'Supplemental Statement of the Case',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.certified:
      return {
        title: 'The Board received your appeal',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.hearingHeld:
      return {
        title: `Your hearing was held at the ${event.details.regionalOffice} Regional Office`,
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.hearingCancelled:
      return {
        title: 'Hearing Cancelled',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.hearingNoShow:
      return {
        title: 'Hearing No Show',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.bvaDecision:
      return {
        title: 'The Board made a decision on your appeal',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.bvaRemand:
      return {
        title: 'Board Remand',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.withdrawn:
      return {
        title: 'Withdrawn',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.merged:
      return {
        title: 'Merged',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.cavcDecision:
      return {
        title: 'CAVC Decision',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.recordDesignation:
      return {
        title: 'Designation of Record',
        description: '',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.reconsideration:
      return {
        title: 'Reconsideration by Letter',
        description: '',
        liClass: 'section-complete'
      };
    default:
      return {
        title: 'Unknown Event',
        description: '',
        liClass: 'section-complete'
      };
  }
}

// This static piece of content gets reused throughout getNextEvents()
const DECISION_REVIEW_CONTENT = (
  <div>
    <p>
      A Veterans Law Judge, working with their team of attorneys, will review all of the
      available evidence and write a decision. For each issue you are appealing, they can
      decide to:
    </p>
    <ul>
      <li>
        <strong>Allow:</strong> The judge overrules the original decision and decides in
        your favor.
      </li>
      <li><strong>Deny:</strong> The judge upholds the original decision.</li>
      <li>
        <strong>Remand:</strong> The judge is sending the issue back to the Veterans
        Benefits Administration to gather more evidence or to fix a mistake before
        making a decision.
      </li>
    </ul>
    <p><strong>Note:</strong> About 60% of all cases have at least 1 issue remanded.</p>
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
 * @typedef {Object} allNextEvents
 * @property {string} header a short description to introduce all of the nextEvents
 * @property {nextEvent[]} events each contain text content for a NextEvent component
 * ----------------------------------------------------------------------------------------------
 * @param {string} currentStatus an appeal's current status, one of STATUS_TYPES
 * @param {Object} details can contain dynamic info to fill in for certain NextEvent descriptions
 * @returns {allNextEvents} a section description and array containing all next event possibilities
 *                          for a given current status
 */
// TO-DO: Add 'details' to args list once they're complete in the API
export function getNextEvents(currentStatus) {
  switch (currentStatus) {
    case STATUS_TYPES.pendingSoc:
      return {
        header: `What happens next depends on whether the Decision Review Officer has enough 
          evidence to decide in your favor.`,
        events: [
          {
            title: 'The Veterans Benefits Administration will grant some or all of your appeal',
            description: (
              <p>
                <strong>If the Decision Review Officer determines that there is enough evidence to grant
                one or more of the issues on your appeal</strong>, they will make a new decision. If this
                decision changes your disability rating or eligibility for VA benefits, you should
                expect this change to be made in 1 to 2 months.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          }, {
            title: 'The Veterans Benefits Administration will send you a Statement of the Case',
            description: (
              <p>
                <strong>If the Decision Review Officer determines that there is not enough evidence to
                fully grant your appeal</strong>, they will send you their findings in a document called
                a Statement of the Case. You can then decide whether to continue your appeal to the
                Board of Veterans’ Appeals.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          },
        ]
      };
    case STATUS_TYPES.pendingForm9:
      return {
        header: `If you return a Form 9 within 60 days, what happens next depends on whether you 
          also send in new evidence.`,
        events: [
          {
            title: 'Your appeal will be sent to the Board',
            description: (
              <p>
                <strong>If you don’t send in new evidence after the Statement of the Case on [DATE]</strong>,
                the Decision Review Officer will finish their review and transfer your case to the
                Board of Veterans’ Appeals.
              </p>
            ),
            durationText: '',
            cardDescription: ''
          }, {
            title: 'The Veterans Benefits Administration will send you a new Statement of the Case',
            description: (
              <p>
                <strong>If you send in new evidence after the Statement of the Case on [DATE]</strong>, the
                Decision Review Officer will need to write a new Statement of the Case before
                transferring your case to the Board of Veterans’ Appeals. Once your appeal is
                transferred, new evidence can be sent directly to the Board and will not be reviewed
                by the Veterans Benefits Administration.
              </p>
            ),
            durationText: '',
            cardDescription: ''
          },
        ]
      };
    case STATUS_TYPES.pendingCertification:
      return {
        header: 'What happens next depends on whether you send in new evidence.',
        events: [
          {
            title: 'Your appeal will be sent to the Board',
            description: (
              <p>
                <strong>If you don’t send in new evidence after the Statement of the Case on [DATE]</strong>,
                the Decision Review Officer will finish their review and transfer your case to the
                Board of Veterans’ Appeals.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          }, {
            title: 'The Veterans Benefits Administration will send you a new Statement of the Case',
            description: (
              <p>
                <strong>If you send in new evidence after the Statement of the Case on [DATE]</strong>, the
                Decision Review Officer will need to write a new Statement of the Case before
                transferring your case to the Board of Veterans’ Appeals. Once your appeal is
                transferred, new evidence can be sent directly to the Board and will not be reviewed
                by the Veterans Benefits Administration.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          }
        ]
      };
    case STATUS_TYPES.pendingCertificationSsoc:
      return  {
        header: 'What happens next depends on whether you send in new evidence.',
        events: [
          {
            title: 'Your appeal will be sent to the Board',
            description: (
              <p>
                <strong>If you don’t send in new evidence after the Statement of the Case on [DATE]</strong>,
                the Decision Review Officer will finish their review and transfer your case to the
                Board of Veterans’ Appeals.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          }, {
            title: 'The Veterans Benefits Administration will send you a new Statement of the Case',
            description: (
              <p>
                <strong>If you send new evidence after the Statement of the Case on [DATE]</strong>, the
                Decision Review Officer will need to write a new Statement of the Case before
                transferring your case to the Board of Veterans’ Appeals. Once your appeal is
                transferred, new evidence can be sent directly to the Board and will not be reviewed
                by the Veterans Benefits Administration.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          }
        ]
      };
    case STATUS_TYPES.remandSsoc:
      return {
        header: 'What happens next depends on whether you send in new evidence.',
        events: [
          {
            title: 'Your appeal will be returned to the Board',
            description: (
              <p>
                <strong>If you don’t send in new evidence after the Statement of the Case on [DATE]</strong>,
                the Veterans Benefits Administration will finish their work on the remand and return
                your case to the Board of Veterans’ Appeals.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          }, {
            title: 'The Veterans Benefits Administration will send you a new Statement of the Case',
            description: (
              <p>
                <strong>If you send in new evidence after the Statement of the Case on [DATE]</strong>, the
                Veterans Benefits Administration will need to write a new Statement of the Case
                before returning your case to the Board of Veterans’ Appeals.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          }
        ]
      };
    case STATUS_TYPES.pendingHearingScheduling:
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'You will have your [TYPE] hearing',
            description: (
              <p>
                At your hearing, a Veterans Law Judge will ask you questions about your appeal. A
                transcript of your hearing will be taken and added to your appeal file. The judge
                will not make a decision about your appeal at the hearing. Learn more about hearings,
                including how to request a different kind of hearing or withdraw your hearing
                request.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          }
        ]
      };
    case STATUS_TYPES.scheduledHearing:
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'You will have your [TYPE] hearing',
            description: (
              <p>
                Your hearing is scheduled for [DATE] at [LOCATION]. At your hearing, a Veterans Law
                Judge will ask you questions about your appeal. A transcript of your hearing will be
                taken and added to your appeal file. The judge will not make a decision about your
                appeal at the hearing. Learn more about hearings, including how to prepare for your
                hearing.
              </p>
            ),
            durationText: '',
            cardDescription: '',
          }
        ]
      };
    case STATUS_TYPES.onDocket: {
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The Board will make a decision',
            description: DECISION_REVIEW_CONTENT,
            durationText: '10 months',
            cardDescription: 'A Veterans Law Judge typically takes 10 months to write a decision.'
          }
        ]
      };
    }
    case STATUS_TYPES.atVso:
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The Board will make a decision',
            description: DECISION_REVIEW_CONTENT,
            durationText: '',
            cardDescription: '',
          }
        ]
      };
    case STATUS_TYPES.decisionInProgress:
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The Board will make a decision',
            description: DECISION_REVIEW_CONTENT,
            durationText: '',
            cardDescription: '',
          }
        ]
      };
    case STATUS_TYPES.bvaDevelopment:
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The Board will make a decision',
            description: DECISION_REVIEW_CONTENT,
            durationText: '',
            cardDescription: '',
          }
        ]
      };
    case STATUS_TYPES.stayed:
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The Board will make a decision',
            description: DECISION_REVIEW_CONTENT,
            durationText: '',
            cardDescription: '',
          }
        ]
      };
    case STATUS_TYPES.remand:
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'The Veterans Benefits Administration completes the remand instructions',
            description: (
              <p>
                They may contact you to request additional evidence or medical examinations, as
                needed. When they have completed the remand instructions, they will determine whether
                or not they can grant your appeal. If not, your appeal will return to the Board of
                Veterans’ Appeals for a new decision.
              </p>
            ),
            durationText: '11 months',
            cardDescription: 'VBA takes about 11 months to produce a Statement of the Case (SOC)'
          }
        ]
      };
    default:
      return {
        header: '', // intentionally empty
        events: [
          {
            title: 'Unknown event',
            description: (<p>We could not find the next event in your appeal</p>),
            durationText: 'Unknown',
            cardDescription: 'No description found'
          }
        ]
      };
  }
}

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
export function getAlertContent(alert) {
  const { type } = alert; // also destructure 'details' out of alert once api finalizes
  switch (type) {
    case ALERT_TYPES.form9Needed:
      return {
        title: 'Return the Form 9 by [DATE] in order to continue your appeal',
        description: (
          <div>
            <p>
              A Form 9 was included with your Statement of the Case. By completing and returning
              the form, you bring your appeal to the Board of Veterans’ Appeals. On this form,
              you can request a hearing with a Veterans Law Judge, if you would like one.
            </p>
            <p>
              If you need help with understanding your Statement of the Case or completing the Form
              9, contact your VSO or representative.
            </p>
            <p><a href="#">[LINK] Learn more about completing the Form 9</a>.</p>
          </div>
        ),
        displayType: 'take_action',
        type
      };
    case ALERT_TYPES.scheduledHearing:
      return {
        title: 'A hearing has been scheduled',
        description: (
          <p>Your [TYPE] hearing has been scheduled for [DATE] at [LOCATION].</p>
        ),
        displayType: 'take_action',
        type
      };
    case ALERT_TYPES.hearingNoShow:
      return {
        title: 'You have 14 days to reschedule your hearing from [ORIG HEARING DATE]',
        description: (
          <p>You missed your hearing on [DATE]. If you want to reschedule your
          hearing, please contact your VSO or representative for more information.</p>
        ),
        displayType: 'take_action',
        type
      };
    case ALERT_TYPES.heldForEvidence:
      return {
        title: 'Your appeals case is being held open',
        description: (
          <p>You or your representative asked to hold your appeal open to
          submit additional evidence. Please make sure the Board gets your
          evidence by [DATE].</p>
        ),
        displayType: 'take_action',
        type
      };
    case ALERT_TYPES.rampEligible:
      return {
        title: 'You have opted-in to the Rapid Appeals Modernization Program (RAMP)',
        description: (
          <div>
            <p>You chose to participate in the new supplemental claim or
            higher-level review lanes. This does not mean that your appeal has
            been closed. If you didn’t choose this, please call your VSO or
            representative as soon as possible.</p>
            <p>At this time, Vets.gov Appeal Status is not able to get
            information related to appeals that are part of RAMP.</p>
          </div>
        ),
        displayType: 'info',
        type,
      };
    case ALERT_TYPES.rampIneligible:
      return {
        title: 'Your appeal is not eligible for the Rapid Appeals Modernization Program (RAMP)',
        description: (
          <p>This appeal is not eligible for RAMP because it’s near the front
          of the docket line and ready to be assigned to a Veterans Law Judge
          at the Board. For more information, please call your VSO or
          representative.</p>
        ),
        displayType: 'info',
        type,
      };
    case ALERT_TYPES.decisionSoon:
      return {
        title: 'Your appeal is near the front of line',
        description: (
          <p>Your appeal is near the front of the Board’s docket line for a
          Veterans Law Judge to review your appeal and write a decision.
          Sending in new evidence at this time will delay your case being
          reviewed. Please make sure the Board has your correct mailing address.</p>
        ),
        displayType: 'info',
        type,
      };
    case ALERT_TYPES.blockedByVso:
      return {
        title: 'Waiting on your representative',
        description: (
          <p>You’re at the front of the Board’s docket line, but your appeal is
          with your Veteran Service Organization. Please contact them to make
          sure they are sending the needed information to the Board.</p>
        ),
        displayType: 'info',
        type,
      };
    // we don't know content for these yet
    case ALERT_TYPES.scheduledDroHearing:
      return {};
    case ALERT_TYPES.droHearingNoShow:
      return {};
    case ALERT_TYPES.cavcOption:
      return {};
    default:
      return {
        title: '',
        description: null,
        displayType: '',
        type,
      };
  }
}
