import {
  UPDATE_EXPENSE_STARTED,
  UPDATE_EXPENSE_SUCCESS,
  UPDATE_EXPENSE_FAILURE,
  FETCH_APPOINTMENT_FAILURE,
  FETCH_APPOINTMENT_STARTED,
  FETCH_APPOINTMENT_SUCCESS,
  FETCH_CLAIM_DETAILS_FAILURE,
  FETCH_CLAIM_DETAILS_STARTED,
  FETCH_CLAIM_DETAILS_SUCCESS,
  FETCH_TRAVEL_CLAIMS_FAILURE,
  FETCH_TRAVEL_CLAIMS_STARTED,
  FETCH_TRAVEL_CLAIMS_SUCCESS,
  SUBMIT_CLAIM_FAILURE,
  SUBMIT_CLAIM_STARTED,
  SUBMIT_CLAIM_SUCCESS,
  CREATE_COMPLEX_CLAIM_STARTED,
  CREATE_COMPLEX_CLAIM_SUCCESS,
  CREATE_COMPLEX_CLAIM_FAILURE,
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
  complexClaimCreation: {
    isLoading: false,
    error: null,
    data: null,
  },
  expense: {
    isLoading: false,
    error: null,
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
    case CREATE_COMPLEX_CLAIM_STARTED:
      return {
        ...state,
        complexClaimCreation: {
          ...state.complexClaimCreation,
          isLoading: true,
        },
      };
    case CREATE_COMPLEX_CLAIM_SUCCESS:
      return {
        ...state,
        complexClaimCreation: {
          error: null,
          isLoading: false,
          data: action.payload,
        },
        // Also add the newly created claim to claimDetails for immediate access
        claimDetails: {
          ...state.claimDetails,
          data: {
            ...state.claimDetails.data,
            [action.payload.claimId]: action.payload,
          },
        },
      };
    case CREATE_COMPLEX_CLAIM_FAILURE:
      return {
        ...state,
        complexClaimCreation: {
          ...state.complexClaimCreation,
          isLoading: false,
          error: action.error,
        },
      };
    case UPDATE_EXPENSE_STARTED:
      return {
        ...state,
        expense: {
          ...state.expense,
          isLoading: true,
        },
      };
    case UPDATE_EXPENSE_SUCCESS:
      // Expense delete
      if (action.expenseId) {
        return {
          ...state,
          expense: {
            error: null,
            isLoading: false,
          },
          claimDetails: {
            ...state.claimDetails,
            data: {
              ...state.claimDetails.data,
              [action.claimId]: {
                ...state.claimDetails.data[action.claimId],
                expenses: state.claimDetails.data[
                  action.claimId
                ].expenses.filter(expense => expense.id !== action.expenseId),
              },
            },
          },
        };
      }
      // Create/Update expense
      return {
        ...state,
        expense: {
          error: null,
          isLoading: false,
        },
        claimDetails: {
          ...state.claimDetails,
          data: {
            ...state.claimDetails.data,
            [action.claimId]: {
              ...state.claimDetails.data[action.claimId],
              expenses: [
                ...state.claimDetails.data[action.claimId].expenses.filter(
                  expense => expense.id !== action.payload.id,
                ),
                action.payload,
              ],
            },
          },
        },
      };
    case UPDATE_EXPENSE_FAILURE:
      return {
        ...state,
        expense: {
          ...state.expense,
          isLoading: false,
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
