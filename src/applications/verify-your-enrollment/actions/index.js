// Action Types
export const UPDATE_PENDING_VERIFICATIONS = 'UPDATE_PENDING_VERIFICATIONS';
export const UPDATE_VERIFICATIONS = 'UPDATE_VERIFICATIONS';

// Action Creators
export const updatePendingVerifications = pendingVerifications => ({
  type: UPDATE_PENDING_VERIFICATIONS,
  payload: pendingVerifications,
});

export const updateVerifications = verifications => ({
  type: UPDATE_VERIFICATIONS,
  payload: verifications,
});
