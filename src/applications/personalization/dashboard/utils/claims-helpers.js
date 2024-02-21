// Claims helpers
export const FETCH_CLAIMS_PENDING = 'FETCH_CLAIMS_PENDING';
export const FETCH_CLAIMS_SUCCESS = 'FETCH_CLAIMS_SUCCESS';
export const FETCH_CLAIMS_ERROR = 'FETCH_CLAIMS_ERROR';
export const CHANGE_INDEX_PAGE = 'CHANGE_INDEX_PAGE';

export const claimsAvailability = {
  AVAILABLE: 'AVAILABLE',
  UNAVAILABLE: 'UNAVAILABLE',
};
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
