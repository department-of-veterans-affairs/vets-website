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
