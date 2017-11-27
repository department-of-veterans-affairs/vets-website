import React from 'react';
// TO DO: Replace made up properties and content with real versions once finalized.
export const STATUS_TYPES = {
  nod: 'nod',
  awaitingHearingDate: 'awaiting_hearing_date',
  bvaDecision: 'bva_decision',
};

export const ALERT_STYLE_TYPES = {
  warning: 'warning',
  information: 'information'
};

export const ALERT_CONTENT_TYPES = {
  waitingOnAction: 'waiting_on_action',
  hearingScheduled: 'hearing_scheduled',
  bvaDecisionPending: 'bva_decision_pending'
};

// TO DO: Replace made up properties and content with real versions once finalized.
/**
 * Grabs the matching title and dynamically-generated description for a given current status type
 * @typedef {Object} Contents
 * @property {string} title a current status type's title
 * @property {string} description a short paragraph describing the current status
 * ----------------------------------------------------------------------------------------------
 * @param {string} statusType the status type of a claim appeal as returned by the api
 * @param {Object} details optional, properties vary depending on the status type
 * @returns {Contents}
 */
export function getStatusContents(type, details) {
  const { nod, awaitingHearingDate, bvaDecision } = STATUS_TYPES;

  const contents = {};
  if (type === nod) {
    const office = details.regionalOffice || 'Regional Office';
    contents.title = `The ${office} is reviewing your appeal`;
    contents.description = `The ${office} received your Notice of Disagreement and is revewing 
      your appeal. This means they review all of the evidence related to your appeal, including 
      any new evidence you submit. They may contact you to request additional evidence or 
      medical examinations, as needed. When they have completed their review, they will 
      determine whether or not they can grant your appeal.`;
  } else if (type === awaitingHearingDate) {
    const hearingType = details.hearingType || 'hearing';
    const currenltyHearing = details.currentlyHearing || 'an earlier month';
    contents.title = 'You are waiting for your hearing date';
    contents.description = `You have selected to have a ${hearingType} in your form 9. 
      Currently the Board is having hearings for appeals of ${currenltyHearing}`;
  } else if (type === bvaDecision) {
    const decisionType = details.decisionType || 'Unknown (please wait for your letter)';
    contents.title = 'The Board has made a decision on your appeal';
    contents.description = `The Board of Veterans’ Appeals has made a decision on your appeal. 
    You will receive your decision letter in the mail in 7 business days. Your appeal  
    decision is: ${decisionType}`;
  } else {
    contents.title = 'Current Status Unknown';
    contents.description = 'Your current appeal status is unknown at this time';
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
        title: 'Claim Decision',
        description: 'Your original claim decision was sent to you.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.nod:
      return {
        title: 'Notice of Disagreement',
        description: 'Notice of Disagreement received by your Regional Office.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.droHearing:
      return {
        title: 'Dro Hearing',
        description: 'You have a hearing at VBA with a Decision Review Officer prior to SOC.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.fieldGrant:
      return {
        title: 'Field grant',
        description: 'You have received a Field Grant.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.soc:
      return {
        title: 'Statement of the Case',
        description: 'Statement of the Case (SOC) prepared by your Regional Office.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.form9:
      return {
        title: 'Form 9 Recieved',
        description: 'Form 9 received by your Regional Office.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.ssoc:
      return {
        title: 'Supplemental Statement of the Case',
        description: 'Supplemental Statement of the Case (SOC) prepared by your Regional Office.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.certified:
      return {
        title: 'Certification',
        description: 'Your appeal was received by the Board.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.hearingHeld:
      return {
        title: 'Hearing Held',
        description: `Your hearing was held at ${event.details.location}.`,
        liClass: 'section-complete'
      };
    case EVENT_TYPES.hearingCancelled:
      return {
        title: 'Hearing Cancelled',
        description: 'Your hearing was cancelled.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.hearingNoShow:
      return {
        title: 'Hearing No Show',
        description: 'You missed your hearing.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.bvaDecision:
      return {
        title: 'Board Decision',
        description: 'The Board has made a decision on your appeal.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.bvaRemand:
      return {
        title: 'Board Remand',
        description: 'BVA is collecting more evidence.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.withdrawn:
      return {
        title: 'Withdrawn',
        description: 'You have withdrawn your appeal.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.merged:
      return {
        title: 'Merged',
        description: 'Your appeals have been merged.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.cavcDecision:
      return {
        title: 'CAVC Decision',
        description: 'CAVC has made a decision.',
        liClass: 'section-complete'
      };
    case EVENT_TYPES.recordDesignation:
      return {
        title: 'Designation of Record',
        description: `${event.details.name} has submitted a motion to continue this appeal.`,
        liClass: 'section-complete'
      };
    case EVENT_TYPES.reconsideration:
      return {
        title: 'Reconsideration by Letter',
        description: 'The Board has denied your motion for reconsideration.',
        liClass: 'section-complete'
      };
    default:
      return {
        title: 'Unknown Event',
        description: 'Not sure what happened here...weird.',
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
          descirption: 'Your appeal decision is being sent to your mailing address',
          durationText: '2 weeks',
          cardDescription: 'The Oakland regional office takes about 2 weeks to mail your decision.'
        }
      ];
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
 * 
 * @param {string} type each alert can have one of two types as defined by ALERT_TYPES
 * @returns {object} containing dynamically-generated title & description properties
 */
export function getAlertContent(alert) {
  const { type, date, details } = alert;
  switch (details.type) {
    case ALERT_CONTENT_TYPES.waitingOnAction:
      return {
        title: 'Your appeal is waiting on action by your representative',
        description: `Your appeal is near the front of the line, but it is not
          ready to go to a judge. It is currently waiting on your
          representative, the ${details.representative}, to complete an
          informal hearing presentation (IHP). Please contact your
          representative for more information.`,
        cssClass: 'usa-alert-warning',
        type,
        date
      };
    case ALERT_CONTENT_TYPES.hearingScheduled:
      return {
        title: `Your hearing has been scheduled for ${details.date}`,
        description: '',
        cssClass: 'usa-alert-info',
        type,
        date
      };
    case ALERT_CONTENT_TYPES.bvaDecisionPending:
      return {
        title: 'You will soon receive your Board decision',
        description: (
          <ul>
            <li>
              While a judge is reviewing your case, please do not send any
              additional evidence. This may delay your decision and increase
              your wait time.
            </li>
            <li>
              Please call your representative or Regional Office to make
              sure we have the correct address to mail your decision letter.
            </li>
          </ul>
        ),
        cssClass: 'usa-alert-info',
        type,
        date
      };
    default:
      return {
        title: '',
        description: '',
        cssClass: '',
        type,
        date
      };
  }
}
