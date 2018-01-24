import React from 'react';
import moment from 'moment';
import _ from 'lodash';

// TO DO: Replace made up properties and content with real versions once finalized.
export const STATUS_TYPES = {
  nod: 'nod',
  pendingForm9: 'pending_form9',
  awaitingHearingDate: 'awaiting_hearing_date',
  onDocket: 'on_docket',
  bvaDecision: 'bva_decision',
  remand: 'remand'
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
export function getStatusContents(type, details) {
  const { nod, awaitingHearingDate, bvaDecision, remand, pendingForm9, onDocket } = STATUS_TYPES;
  const contents = {};
  if (type === nod) {
    const office = details.regionalOffice || 'Regional Office';
    contents.title = `The ${office} is reviewing your appeal`;
    contents.description = (
      <p>The {office} received your Notice of Disagreement and is revewing
      your appeal. This means they review all of the evidence related to your appeal, including
      any new evidence you submit. They may contact you to request additional evidence or
      medical examinations, as needed. When they have completed their review, they will
      determine whether or not they can grant your appeal.</p>
    );
  } else if (type === awaitingHearingDate) {
    const hearingType = details.hearingType || 'hearing';
    const currenltyHearing = details.currentlyHearing || 'an earlier month';
    contents.title = 'You are waiting for your hearing date';
    contents.description = (
      <p>You have selected to have a {hearingType} in your form 9.
      Currently the Board is having hearings for appeals of {currenltyHearing}</p>
    );
  } else if (type === bvaDecision) {
    const { decisionIssues } = details;
    const allowedIssues = decisionIssues
      .filter((issue) => (issue.disposition === 'allowed'))
      .map((issue, i) => (<li key={`allowed-${i}`}>{issue.description}</li>));
    const deniedIssues = decisionIssues
      .filter((issue) => (issue.disposition === 'denied'))
      .map((issue, i) => (<li key={`denied-${i}`}>{issue.description}</li>));
    const businessDays = details.businessDays;
    contents.title = 'The Board has made a decision on some of your appeals';
    contents.description = (
      <div>
        <div>
          The Board of Veterans Appeals has made a decision on some of your appeals.
          You will receive your decision letter in the mail in {businessDays} business days. Here is an overview
          of the decision:
        </div>
        <br/>
        <div className="decision-items">
          <h5 className="allowed-items">Allowed</h5>
          <ul>{allowedIssues}</ul>
          <h5 className="denied-items">Denied</h5>
          <ul>{deniedIssues}</ul>
        </div>
        <div>
          For issues that are allowed, you will receive compensation. For more information, please
          contact your VSO or representative.
        </div>
      </div>
    );
  } else if (type === remand) {
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
    const businessDays = details.businessDays;
    contents.title = 'The Board has made a decision on some of your appeals';
    contents.description = (
      <div>
        <div>
          The Board of Veterans Appeals has made a decision on some of your appeals.
          You will receive your decision letter in the mail in {businessDays} business days. Here is an overview
          of the decision:
        </div>
        <br/>
        <div className="decision-items">
          <h5 className="allowed-items">Allowed</h5>
          <ul>{allowedIssues}</ul>
          <h5 className="denied-items">Denied</h5>
          <ul>{deniedIssues}</ul>
          <h5 className="remand-items">Remand</h5>
          <ul>{remandIssues}</ul>
        </div>
        <div>
          For issues that are allowed, you will receive compensation. For more information, please
          contact your VSO or representative.
        </div>
      </div>
    );
  } else if (type === pendingForm9) {
    contents.title = 'Review your Statement of the Case';
    contents.description = (
      <div>
        <p>
          The Veterans Benefits Administration (VBA) sent you a Statement of the Case on November
          28, 2017. The Statement of the Case document explains the reasons why the Regional Office
          could not fully grant your appeal. If you don’t agree with the Statement of the Case, you
          can bring your appeal to the Board of Veterans’ Appeals. To do this you must complete and
          return a Form 9 within 60 days.
        </p>
        <p>
          <em>Note:</em> If you send more evidence with the Form 9, it will be reviewed by the
          Regional Office and will likely delay a decision on your appeal. If you have new
          evidence, it’s best to send it when the Board of Veterans Appeals is reviewing your
          case.
        </p>
      </div>
    );
  } else if (type === onDocket) {
    contents.title = 'Waiting to be assigned to a judge';
    contents.description = (
      <p>Your appeal is at the Board of Veterans’ Appeals waiting to be
      assigned to a Veterans Law Judge. Staff at the Board are making sure that your case is
      complete, accurate, and ready to be decided by a judge. If you have evidence that isn’t
      already included in your case, now is a good time to send it to the Board.</p>);
  } else {
    contents.title = 'Current Status Unknown';
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
  bvaRemand: 'bva_remandu',
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
