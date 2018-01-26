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

export const CLOSED_STATUSES = [
  STATUS_TYPES.bvaDecision,
  STATUS_TYPES.fieldGrant,
  STATUS_TYPES.withdrawn,
  STATUS_TYPES.ftr,
  STATUS_TYPES.ramp,
  STATUS_TYPES.reconsideration,
  STATUS_TYPES.death,
  STATUS_TYPES.otherClose
];

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

/**
 * @param {string} currentStatus an appeal's current status, one of STATUS_TYPES
 * @returns {array} of objects that each contain text details of a next event
 */
export function getNextEvents(currentStatus) {
  switch (currentStatus) {
    case STATUS_TYPES.nod:
      return [
        {
          title: 'Additional evidence',
          description: `VBA must reveiw any additional evidence you submit prios to certifying
          your appeal to the Board of Veterans’ Appeals. This evidence could cause VBA
          to grant your appeal, but if not, they will need to produce an additional
          Statement of the Case.`,
          durationText: '11 months',
          cardDescription: 'The Oakland regional office takes about 11 months to produce additional Statements of the Case.'
        }, {
          title: 'Appeal certified to the Board',
          description: 'Your appeal will be sent to the Board of Veterans’ Appeals in Washington, D.C.',
          durationText: '2 months',
          cardDescription: 'The Oakland regional office takes about 2 months to certify your appeal to the Board.'
        }
      ];
    case STATUS_TYPES.pendingForm9:
      return [
        {
          title: 'The Board receives your appeal',
          description: `If you send the Form 9 without new evidence, the Veterans Benefits
            Administration (VBA) will finish its review and transfer your case to the Board of
            Veterans’ Appeals.`,
          durationText: '2 months',
          cardDescription: 'VBA takes about 2 months to certify appeals to the Board'
        }, {
          title: 'VBA prepares a Statement of the Case (SOC)',
          description: `If you send the Form 9 with new evidence, the Veterans Benefits
            Administration (VBA) will finish its review and transfer your case to the Board of
            Veterans’ Appeals.`,
          durationText: '11 months',
          cardDescription: 'VBA takes about 11 months to produce a Statement of the Case (SOC)'
        }, {
          title: 'You withdraw your appeal',
          description: 'If you do not send the Form 9 within 60 days, your appeal will be closed.',
          durationText: '2 months',
          cardDescription: 'You have 60 days to submit your appeal before it is closed'
        }
      ];
    case STATUS_TYPES.awaitingHearingDate:
      return [
        {
          title: 'Awaiting hearing date',
          description: 'VBA is in the process of scheduling your hearing date',
          durationText: '2 months',
          cardDescription: 'The Oakland regional office takes about 2 months to schedule a hearing date.'
        }
      ];
    case STATUS_TYPES.bvaDecision:
      return [
        {
          title: 'Board decision reached',
          description: 'Your appeal decision is being sent to your mailing address',
          durationText: '2 weeks',
          cardDescription: 'The Oakland regional office takes about 2 weeks to mail your decision.'
        }
      ];
    case STATUS_TYPES.remand:
      return [
        {
          title: 'VBA prepares a Statement of the Case (SOC)',
          description: `If you send the Form 9 with new evidence, the Veterans Benefits
            Administration (VBA) will finish its review and transfer your case to the Board of
            Veterans’ Appeals.`,
          durationText: '11 months',
          cardDescription: 'VBA takes about 11 months to produce a Statement of the Case (SOC)'
        }
      ];
    case STATUS_TYPES.onDocket: {
      return [
        {
          title: 'Judge Decides Your Appeal',
          description: (
            <div>
              <div>
                A Veterans Law Judge, working with one of the Board attorneys, will review all of
                the available evidence and write a decision. For each issue you are appealing, they
                can decide to:
              </div>
              <ul>
                <li>
                  <strong>Allow - </strong>The judge overrules the Regional Office and makes a decision
                  on your rating
                </li>
                <li><strong>Deny - </strong>The judge agrees with the Regional Office decision</li>
                <li>
                  <strong>Remand - </strong>The judge sends the issue to Veterans Benefits
                    Administration (VBA) for more evidence or to fix a mistake before making a
                    decision
                </li>
              </ul>
              <div><strong>Note:</strong> About 60% of all cases have at least 1 issue remanded.</div>
            </div>
          ),
          durationText: '10 months',
          cardDescription: 'A Veterans Law Judge typically takes 10 months to write a decision.'
        }
      ];
    }
    default:
      return [
        {
          title: 'Unknown event',
          description: 'We could not find the next event in your appeal',
          durationText: 'Unknown',
          cardDescription: 'No description found'
        }
      ];
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
