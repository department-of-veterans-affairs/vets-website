// Appeals helpers
const APPEAL_TYPES = {
  legacy: 'legacyAppeal',
  supplementalClaim: 'supplementalClaim',
  higherLevelReview: 'higherLevelReview',
  appeal: 'appeal',
};

export const appealTypes = Object.values(APPEAL_TYPES);

// Claims helpers
export function isClaimComplete(claim) {
  return (
    claim.attributes.decisionLetterSent ||
    claim.attributes.status === 'COMPLETE'
  );
}

const claimStatusMap = {
  CLAIM_RECEIVED: 'Claim received',
  INITIAL_REVIEW: 'Initial review',
  EVIDENCE_GATHERING_REVIEW_DECISION:
    'Evidence gathering, review, and decision',
  PREPARATION_FOR_NOTIFICATION: 'Preparation for notification',
  COMPLETE: 'Closed',
};

export function getClaimStatusDescription(status) {
  return claimStatusMap[status];
}

export function getClaimType(claim) {
  return (
    claim?.attributes?.claimType || 'disability compensation'
  ).toLowerCase();
}

// returns the value rounded to the nearest interval
// ex: roundToNearest({interval: 5000, value: 13000}) => 15000
// ex: roundToNearest({interval: 5000, value: 6500}) => 5000
export function roundToNearest({ interval, value }) {
  return Math.round(value / interval) * interval;
}
