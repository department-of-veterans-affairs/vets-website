import { SET_HAS_PRIVATE_EVIDENCE, SET_HAS_VA_EVIDENCE } from '../actions';

// Added separate tracking for hasPrivateEvidence and hasVAEvidence
// because array builder does not reliably persist a "true" value.
// Once you finish adding evidence and say you don't have any more, this value
// becomes false, and then we can't use it to determine whether to show
// evidence pages when navigating backwards, etc.
const initialState = {
  hasPrivateEvidence: false,
  hasVAEvidence: false,
};

const evidenceTrackingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_HAS_PRIVATE_EVIDENCE: {
      return {
        ...state,
        hasPrivateEvidence: action.payload,
      };
    }
    case SET_HAS_VA_EVIDENCE: {
      return {
        ...state,
        hasVAEvidence: action.payload,
      };
    }
    default:
      return state;
  }
};

export default evidenceTrackingReducer;
