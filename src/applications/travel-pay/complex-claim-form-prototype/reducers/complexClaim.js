import { v4 as uuidv4 } from 'uuid';

const SET_COMPLEX_CLAIM = 'SET_COMPLEX_CLAIM';

export const setComplexClaim = claim => ({
  type: SET_COMPLEX_CLAIM,
  payload: claim,
});

const initialState = {
  claimId: uuidv4(),
  claimData: null,
};

export default function complexClaimReducer(state = initialState, action) {
  if (action.type === SET_COMPLEX_CLAIM) {
    return { ...state, claimId: action.payload.id, claimData: action.payload };
  }
  return state;
}
