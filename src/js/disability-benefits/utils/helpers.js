const evidenceGathering = 'Evidence gathering, review, and decision';

const phaseMap = {
  1: 'Claim received',
  2: 'Initial review',
  3: evidenceGathering,
  4: evidenceGathering,
  5: evidenceGathering,
  6: evidenceGathering,
  7: 'Preparation for decision notification',
  8: 'Complete'
};

const microPhaseMap = {
  3: 'Gathering of evidence',
  4: 'Review of evidence',
  5: 'Preparation for decision',
  6: 'Pending Decision approval'
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

export function getHistoryPhaseDescription(phase) {
  if (phase === 3) {
    return microPhaseMap[phase];
  }

  return getUserPhaseDescription(phase);
}

export function getMicroPhaseDescription(phase) {
  return microPhaseMap[phase] || phaseMap[phase];
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

export function groupTimelineActivity(events) {
  const phases = {};
  const phaseEvents = events;
  let activity = [];
  let lastPhaseNumber = 1;
  let firstPhase = true;

  phaseEvents.forEach(event => {
    if (event.type.startsWith('phase')) {
      const phaseNumber = parseInt(event.type.replace('phase', ''), 10);
      const userPhaseNumber = getUserPhase(phaseNumber);
      if (userPhaseNumber !== lastPhaseNumber || firstPhase) {
        activity.push({
          type: 'phase_entered',
          date: event.date
        });
        phases[userPhaseNumber + 1] = (phases[userPhaseNumber + 1] || []).concat(activity);
        activity = [];
        lastPhaseNumber = userPhaseNumber;
        firstPhase = false;
      } else {
        activity.push({
          type: 'micro_phase',
          phaseNumber: phaseNumber + 1,
          date: event.date
        });
      }
    } else {
      activity.push(event);
    }
  });

  if (activity.length > 0) {
    phases[lastPhaseNumber] = (phases[lastPhaseNumber] || []).concat(activity);
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

export function isCompleteClaim({ attributes }) {
  return !!attributes.claimType
    && (attributes.contentionList && !!attributes.contentionList.length)
    && !!attributes.dateFiled
    && !!attributes.vaRepresentative;
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
