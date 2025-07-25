import {
  FETCH_TRAVEL_CLAIMS_STARTED,
  FETCH_TRAVEL_CLAIMS_SUCCESS,
  FETCH_TRAVEL_CLAIMS_FAILURE,
  FETCH_CLAIM_DETAILS_STARTED,
  FETCH_CLAIM_DETAILS_SUCCESS,
  FETCH_CLAIM_DETAILS_FAILURE,
  FETCH_APPOINTMENT_STARTED,
  FETCH_APPOINTMENT_SUCCESS,
  FETCH_APPOINTMENT_FAILURE,
  SUBMIT_CLAIM_STARTED,
  SUBMIT_CLAIM_SUCCESS,
  SUBMIT_CLAIM_FAILURE,
} from './actions';

const initialState = {
  travelClaims: {
    isLoading: false,
    claims: {},
  },
  claimDetails: {
    isLoading: false,
    error: null,
    data: {},
  },
  appointment: {
    isLoading: false,
    error: null,
    data: null,
  },
  claimSubmission: {
    isSubmitting: false,
    error: null,
    data: null,
  },
};

function travelPayReducer(state = initialState, action) {
  switch (action.type) {
    case FETCH_TRAVEL_CLAIMS_STARTED:
      return {
        ...state,
        travelClaims: {
          ...state.travelClaims,
          isLoading: true,
        },
      };
    case FETCH_TRAVEL_CLAIMS_SUCCESS:
      return {
        ...state,
        travelClaims: {
          ...state.travelClaims,
          isLoading: false,
          claims: {
            ...state.travelClaims.claims,
            [action.dateRangeId]: {
              error: null,
              metadata: action.payload.metadata,
              data: action.payload.data,
            },
          },
        },
      };
    case FETCH_TRAVEL_CLAIMS_FAILURE:
      return {
        ...state,
        travelClaims: {
          ...state.travelClaims,
          isLoading: false,
          claims: {
            ...state.travelClaims.claims,
            [action.dateRangeId]: {
              error: action.error,
              metadata: {},
              data: [],
            },
          },
        },
      };
    case FETCH_CLAIM_DETAILS_STARTED:
      return {
        ...state,
        claimDetails: {
          ...state.claimDetails,
          isLoading: true,
        },
      };
    case FETCH_CLAIM_DETAILS_SUCCESS:
      return {
        ...state,
        claimDetails: {
          error: null,
          isLoading: false,
          data: {
            ...state.claimDetails.data,
            [action.id]: action.payload,
          },
        },
      };
    case FETCH_CLAIM_DETAILS_FAILURE:
      return {
        ...state,
        claimDetails: {
          ...state.claimDetails,
          isLoading: false,
          error: action.error,
        },
      };

    case FETCH_APPOINTMENT_STARTED:
      return {
        ...state,
        appointment: {
          ...state.appointment,
          isLoading: true,
        },
      };
    case FETCH_APPOINTMENT_SUCCESS:
      return {
        ...state,
        appointment: {
          error: null,
          isLoading: false,
          data: action.payload,
        },
      };
    case FETCH_APPOINTMENT_FAILURE:
      return {
        ...state,
        appointment: {
          ...state.appointment,
          isLoading: false,
          error: action.error,
        },
      };
    case SUBMIT_CLAIM_STARTED:
      return {
        ...state,
        claimSubmission: {
          ...state.claimSubmission,
          isSubmitting: true,
        },
      };
    case SUBMIT_CLAIM_SUCCESS:
      return {
        ...state,
        claimSubmission: {
          error: null,
          isSubmitting: false,
          data: action.payload,
        },
      };
    case SUBMIT_CLAIM_FAILURE:
      return {
        ...state,
        claimSubmission: {
          ...state.claimSubmission,
          isSubmitting: false,
          error: action.error,
        },
      };
    default:
      return state;
  }
}

export default {
  travelPay: travelPayReducer,
};
