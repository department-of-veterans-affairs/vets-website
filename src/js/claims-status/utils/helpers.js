import _ from 'lodash/fp';
import Raven from 'raven-js';

import environment from '../../common/helpers/environment';
import { SET_UNAUTHORIZED } from '../actions/index.jsx';

const evidenceGathering = 'Evidence gathering, review, and decision';

const phaseMap = {
  1: 'Claim received',
  2: 'Initial review',
  3: evidenceGathering,
  4: evidenceGathering,
  5: evidenceGathering,
  6: evidenceGathering,
  7: 'Preparation for notification',
  8: 'Complete'
};

export function getPhaseDescription(phase) {
  return phaseMap[phase];
}

export function getUserPhaseDescription(phase) {
  if (phase < 3) {
    return phaseMap[phase];
  } else if (phase === 3) {
    return evidenceGathering;
  }

  return phaseMap[phase + 3];
}

export function getPhaseDescriptionFromEvent(event) {
  const phase = parseInt(event.type.replace('phase', ''), 10);
  return phaseMap[phase];
}

export function getUserPhase(phase) {
  if (phase < 3) {
    return phase;
  } else if (phase >= 3 && phase < 7) {
    return 3;
  }

  return phase - 3;
}

export function getItemDate(item) {
  if (item.receivedDate) {
    return item.receivedDate;
  } else if (item.documents && item.documents.length) {
    return item.documents[item.documents.length - 1].uploadDate;
  } else if (item.type === 'other_documents_list' && item.uploadDate) {
    return item.uploadDate;
  }

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
          date: event.date
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

export const DOC_TYPES = [
  { value: 'L029', label: 'Copy of a DD214' },
  { value: 'L450', label: 'STR - Dental - Photocopy' },
  { value: 'L451', label: 'STR - Medical - Photocopy' },
  { value: 'L049', label: 'Medical Treatment Record - Non-Government Facility' },
  { value: 'L034', label: 'Military Personnel Record' },
  { value: 'L107', label: 'VA Form 21-4142 - Authorization To Disclose Information' },
  { value: 'L827', label: 'VA Form 21-4142a - General Release for Medical Provider Information' },
  { value: 'L229', label: 'VA Form 21-0781a - Statement in Support of Claim for PTSD Secondary to Personal Assault' },
  { value: 'L228', label: 'VA Form 21-0781 - Statement in Support of Claim for PTSD' },
  { value: 'L149', label: 'VA Form 21-8940 - Veterans Application for Increased Compensation Based on Un-employability' },
  { value: 'L115', label: 'VA Form 21-4192 - Request for Employment Information in Connection with Claim for Disability' },
  { value: 'L159', label: 'VA Form 26-4555 - Application in Acquiring Specially Adapted Housing or Special Home Adaptation Grant' },
  { value: 'L117', label: 'VA Form 21-4502 - Application for Automobile or Other Conveyance and Adaptive Equipment Under 38 U.S.C. 3901-3904' },
  { value: 'L139', label: 'VA Form 21-686c - Declaration of Status of Dependents' },
  { value: 'L133', label: 'VA Form 21-674 - Request for Approval of School Attendance' },
  { value: 'L102', label: 'VA Form 21-2680 - Examination for Housebound Status or Permanent Need for Regular Aid & Attendance' },
  { value: 'L222', label: 'VA Form 21-0779 - Request for Nursing Home Information in Connection with Claim for Aid & Attendance' },
  { value: 'L702', label: 'Disability Benefits Questionnaire (DBQ)' },
  { value: 'L703', label: 'Goldmann Perimetry Chart/Field Of Vision Chart' },
  { value: 'L070', label: 'Photographs' },
  { value: 'L023', label: 'Other Correspondence' }
];

export function getDocTypeDescription(docType) {
  return DOC_TYPES.filter(type => type.value === docType)[0].label;
}

export function isPopulatedClaim({ attributes }) {
  return !!attributes.claimType
    && (attributes.contentionList && !!attributes.contentionList.length)
    && !!attributes.dateFiled;
}

export function hasBeenReviewed(trackedItem) {
  return trackedItem.type.startsWith('received_from') && trackedItem.status !== 'SUBMITTED_AWAITING_REVIEW';
}

// Adapted from http://stackoverflow.com/a/26230989/487883
export function getTopPosition(elem) {
  const box = elem.getBoundingClientRect();
  const body = document.body;
  const docEl = document.documentElement;

  const scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
  const clientTop = docEl.clientTop || body.clientTop || 0;

  return Math.round(box.top + scrollTop - clientTop);
}

export function truncateDescription(text) {
  const maxLength = 120;
  if (text && text.length > maxLength) {
    return `${text.substr(0, maxLength)}…`;
  }

  return text;
}

export function isClaimComplete(claim) {
  return claim.attributes.decisionLetterSent || claim.attributes.phase === 8;
}

export function itemsNeedingAttentionFromVet(events) {
  return events.filter(event => event.status === 'NEEDED' && event.type === 'still_need_from_you_list').length;
}

export function makeAuthRequest(url, userOptions, dispatch, onSuccess, onError) {
  const options = _.merge({
    method: 'GET',
    mode: 'cors',
    headers: {
      'X-Key-Inflection': 'camel',
      Authorization: `Token token=${sessionStorage.userToken}`
    },
    responseType: 'json',
  }, userOptions);

  fetch(`${environment.API_URL}${url}`, options)
    .catch(err => {
      Raven.captureMessage(`vets_client_error: ${err.message}`, {
        extra: {
          error: err
        }
      });

      return Promise.reject(err);
    })
    .then((resp) => {
      if (resp.ok) {
        if (options.responseType) {
          return resp[options.responseType]();
        }
        return Promise.resolve();
      }

      return Promise.reject(resp);
    })
    .then(onSuccess)
    .catch((resp) => {
      if (resp.status === 401) {
        dispatch({
          type: SET_UNAUTHORIZED
        });
      } else {
        onError(resp);
      }
    });
}

export function getCompletedDate(claim) {
  if (claim.attributes && claim.attributes.eventsTimeline) {
    const completedEvents = claim.attributes.eventsTimeline.filter(event => event.type === 'completed');
    if (completedEvents.length) {
      return completedEvents[0].date;
    }
  }

  return null;
}

export function getClaimType(claim) {
  return claim.attributes.claimType || 'Disability Compensation';
}

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

// Alternative implementation
// export function getStatusContents(type, details) {
//   // Define content for each status type
//   const makeNodContents = (info) => {
//     const office = info.regionalOffice || 'Regional Office';
//     const title = `The ${office} is reviewing your appeal`;
//     const description = `The ${office} received your Notice of Disagreement and is revewing 
//       your appeal. This means they review all of the evidence related to your appeal, including 
//       any new evidence you submit. They may contact you to request additional evidence or 
//       medical examinations, as needed. When they have completed their review, they will 
//       determine whether or not they can grant your appeal.`;
//     return { title, description };
//   };

//   const makeAwaitingHearingDateContents = (info) => {
//     const hearingType = info.hearingType || 'hearing';
//     const currenltyHearing = info.currentlyHearing || 'an earlier month';
//     const title = 'You are waiting for your hearing date';
//     const description = `You have selected to have a ${hearingType} in your form 9. 
//       Currently the Board is having hearings for appeals of ${currenltyHearing}`;
//     return { title, description };
//   };

//   const makeBvaDecisionContents = (info) => {
//     const decisionType = info.decisionType || 'Unknown (please wait for your letter)';
//     const title = 'The Board has made a decision on your appeal';
//     const description = `The Board of Veterans’ Appeals has made a decision on your appeal. 
//     You will receive your decision letter in the mail in 7 business days. Your appeal  
//     decision is: ${decisionType}`;
//     return { title, description };
//   };

//   // map content to known 'current status' types
//   // TO DO: what happens if we get a bad type from the api?
//   const makeContent = {
//     nod: makeNodContents,
//     awaitingHearingDate: makeAwaitingHearingDateContents,
//     bvaDecision: makeBvaDecisionContents
//   };

//   // Return a new content object with title and description
//   return makeContent[type](details);
// }
