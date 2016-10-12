const evidenceGathering = 'Evidence gathering & review';

const phaseMap = {
  1: 'Claim received',
  2: 'Initial processing',
  3: evidenceGathering,
  4: evidenceGathering,
  5: evidenceGathering,
  6: evidenceGathering,
  7: 'Preparation for decision notification',
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

export function groupTimelineActivity(events) {
  const phases = {};
  const phaseEvents = events;
  let activity = [];
  let lastPhaseNumber = 1;

  phaseEvents.forEach(event => {
    if (event.type.startsWith('phase')) {
      const phaseNumber = parseInt(event.type.replace('phase', ''), 10);
      const userPhaseNumber = getUserPhase(phaseNumber);
      if (userPhaseNumber !== lastPhaseNumber) {
        activity.push({
          type: 'phase_entered',
          date: event.date
        });
      }
      phases[userPhaseNumber + 1] = (phases[userPhaseNumber + 1] || []).concat(activity);
      activity = [];
      lastPhaseNumber = userPhaseNumber;
    } else {
      activity.push(event);
    }
  });

  if (activity.length > 0) {
    phases[lastPhaseNumber] = (phases[lastPhaseNumber] || []).concat(activity);
  }

  return phases;
}

