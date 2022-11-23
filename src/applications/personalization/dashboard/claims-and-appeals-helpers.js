// Appeals helpers
const APPEAL_TYPES = {
  legacy: 'legacyAppeal',
  supplementalClaim: 'supplementalClaim',
  higherLevelReview: 'higherLevelReview',
  appeal: 'appeal',
};

export const appealTypes = Object.values(APPEAL_TYPES);

// Claims helpers
const evidenceGathering = 'Evidence gathering, review, and decision';

const PHASE_MAP = {
  1: 'Claim received',
  2: 'Initial review',
  3: evidenceGathering,
  4: evidenceGathering,
  5: evidenceGathering,
  6: evidenceGathering,
  7: 'Preparation for notification',
  8: 'Complete',
};

export function getClaimType(claim) {
  return (
    claim?.attributes?.claimType || 'disability compensation'
  ).toLowerCase();
}

export function getPhaseDescription(phase) {
  return PHASE_MAP[phase];
}

export function isClaimComplete(claim) {
  return claim.attributes.decisionLetterSent || claim.attributes.phase === 8;
}
