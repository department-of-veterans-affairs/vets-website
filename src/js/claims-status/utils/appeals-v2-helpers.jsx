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

