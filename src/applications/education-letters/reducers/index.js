import {
  FETCH_CLAIM_STATUS,
  FETCH_CLAIM_STATUS_FAILED,
  FETCH_CLAIM_STATUS_SUCCESS,
} from '../actions';

const initialState = {};

const getLatestClaim = action => {
  return {
    ...action.response?.data?.attributes.reduce(
      (currentDate, nextDate) =>
        currentDate?.claimStatus?.receivedDate >
        nextDate?.claimStatus?.receivedDate
          ? currentDate
          : nextDate,
    ),
  };
};

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
          claimStatus: getLatestClaim(action),
        };
      default:
        return state;
    }
  },
};
