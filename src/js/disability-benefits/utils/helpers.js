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
