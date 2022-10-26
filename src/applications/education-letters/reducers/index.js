import {
  FETCH_CLAIM_STATUS,
  FETCH_CLAIM_STATUS_FAILED,
  FETCH_CLAIM_STATUS_SUCCESS,
} from '../actions';

const initialState = {};

export default {
  data: (state = initialState, action) => {
    switch (action.type) {
      case FETCH_CLAIM_STATUS:
        return {
          ...state,
          claimStatusFetchInProgress: true,
        };
      case FETCH_CLAIM_STATUS_SUCCESS:
      case FETCH_CLAIM_STATUS_FAILED:
        return {
          ...state,
          claimStatusFetchComplete: true,
          claimStatusFetchInProgress: false,
          claimStatus: {
            ...action.response?.data?.attributes,
          },
        };
      default:
        return state;
    }
  },
};
