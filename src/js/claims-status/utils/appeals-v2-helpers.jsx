// TO DO: Replace made up properties and content with real versions once finalized.
export const STATUS_TYPES = {
  nod: 'nod',
  awaitingHearingDate: 'awaiting_hearing_date',
  bvaDecision: 'bva_decision',
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

