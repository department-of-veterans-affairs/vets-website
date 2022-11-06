import {
  MEB_FETCH_CLAIM_STATUS,
  MEB_FETCH_CLAIM_STATUS_FAILED,
  MEB_FETCH_CLAIM_STATUS_SUCCESS,
  TOE_FETCH_CLAIM_STATUS,
  TOE_FETCH_CLAIM_STATUS_FAILED,
  TOE_FETCH_CLAIM_STATUS_SUCCESS,
} from '../actions';

const initialState = {};

export default {
  data: (state = initialState, action) => {
    switch (action.type) {
      case MEB_FETCH_CLAIM_STATUS:
        return {
          ...state,
          MEBClaimStatusFetchInProgress: true,
        };
      case MEB_FETCH_CLAIM_STATUS_SUCCESS:
      case MEB_FETCH_CLAIM_STATUS_FAILED:
        return {
          ...state,
          MEBClaimStatusFetchComplete: true,
          MEBClaimStatusFetchInProgress: false,
          MEBClaimStatus: {
            ...action?.response?.data?.attributes,
          },
        };
      case TOE_FETCH_CLAIM_STATUS:
        return {
          ...state,
          TOEClaimStatusFetchInProgress: true,
        };
      case TOE_FETCH_CLAIM_STATUS_SUCCESS:
      case TOE_FETCH_CLAIM_STATUS_FAILED:
        return {
          ...state,
          TOEClaimStatusFetchComplete: true,
          TOEClaimStatusFetchInProgress: false,
          TOEClaimStatus: {
            ...action?.response?.data?.attributes,
          },
        };
      default:
        return state;
    }
  },
};
