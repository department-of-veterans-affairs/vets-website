import {
  CHECK_CLAIMANT_START,
  CHECK_CLAIMANT_SUCCESS,
  CHECK_CLAIMANT_FAIL,
  CHECK_CLAIMANT_END,
} from '../actions';

const initialState = {
  claimantId: null,
  isLoading: false,
  error: null,
  profile: null,
};

const claimantIdReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHECK_CLAIMANT_START:
      return {
        ...state,
        isLoading: true,
      };
    case CHECK_CLAIMANT_SUCCESS:
      return {
        ...state,
        isLoading: false,
        claimantId: action.claimantId,
        profile: action.profile,
      };
    case CHECK_CLAIMANT_FAIL:
      return {
        ...state,
        isLoading: false,
        error: action.errors,
        profile: action.profile,
      };
    case CHECK_CLAIMANT_END:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

export default claimantIdReducer;
