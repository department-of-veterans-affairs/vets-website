import {
  CREATE_COMPLEX_CLAIM_FAILURE,
  CREATE_COMPLEX_CLAIM_STARTED,
  CREATE_COMPLEX_CLAIM_SUCCESS,
  CREATE_EXPENSE_FAILURE,
  CREATE_EXPENSE_STARTED,
  CREATE_EXPENSE_SUCCESS,
  DELETE_EXPENSE_FAILURE,
  DELETE_EXPENSE_STARTED,
  DELETE_EXPENSE_SUCCESS,
  FETCH_APPOINTMENT_FAILURE,
  FETCH_APPOINTMENT_STARTED,
  FETCH_APPOINTMENT_SUCCESS,
  FETCH_CLAIM_DETAILS_FAILURE,
  FETCH_CLAIM_DETAILS_STARTED,
  FETCH_CLAIM_DETAILS_SUCCESS,
  FETCH_COMPLEX_CLAIM_DETAILS_FAILURE,
  FETCH_COMPLEX_CLAIM_DETAILS_STARTED,
  FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS,
  FETCH_TRAVEL_CLAIMS_FAILURE,
  FETCH_TRAVEL_CLAIMS_STARTED,
  FETCH_TRAVEL_CLAIMS_SUCCESS,
  SUBMIT_CLAIM_FAILURE,
  SUBMIT_CLAIM_STARTED,
  SUBMIT_CLAIM_SUCCESS,
  SUBMIT_COMPLEX_CLAIM_FAILURE,
  SUBMIT_COMPLEX_CLAIM_STARTED,
  SUBMIT_COMPLEX_CLAIM_SUCCESS,
  UPDATE_EXPENSE_FAILURE,
  UPDATE_EXPENSE_STARTED,
  UPDATE_EXPENSE_SUCCESS,
} from './actions';

// Helper function to merge expenses, avoiding duplicates
function mergeExpenses(existingExpenses, newExpenses) {
  // Create a map of existing expenses, filtering out any without valid IDs
  const existingExpensesMap = existingExpenses
    .filter(expense => expense && expense.id != null && expense.id !== '')
    .reduce(
      (map, expense) => ({
        ...map,
        [String(expense.id)]: expense,
      }),
      {},
    );

  // Merge new expenses with existing ones, preserving all properties
  const mergedExpensesMap = newExpenses
    .filter(expense => expense && expense.id != null && expense.id !== '')
    .reduce((map, newExpense) => {
      const key = String(newExpense.id);
      return {
        ...map,
        [key]: {
          // Merge existing expense properties with new ones
          ...(map[key] || {}),
          ...newExpense,
        },
      };
    }, existingExpensesMap);

  // Convert back to array
  return Object.values(mergedExpensesMap);
}

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
  complexClaim: {
    claim: {
      creation: {
        isLoading: false,
        error: null,
      },
      submission: {
        id: '',
        isSubmitting: false,
        error: null,
        data: null,
      },
      fetch: {
        isLoading: false,
        error: null,
      },
      data: null,
    },
    expenses: {
      creation: {
        isLoading: false,
        error: null,
      },
      update: {
        id: '',
        isLoading: false,
        error: null,
      },
      delete: {
        id: '',
        isLoading: false,
        error: null,
      },
      data: [],
    },
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
    case SUBMIT_COMPLEX_CLAIM_STARTED:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          claim: {
            ...state.complexClaim.claim,
            submission: {
              ...state.complexClaim.claim.submission,
              isSubmitting: true,
              error: null,
            },
          },
        },
      };
    case SUBMIT_COMPLEX_CLAIM_SUCCESS:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          claim: {
            ...state.complexClaim.claim,
            submission: {
              ...state.complexClaim.claim.submission,
              isSubmitting: false,
              error: null,
              data: action.payload,
            },
          },
        },
      };
    case SUBMIT_COMPLEX_CLAIM_FAILURE:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          claim: {
            ...state.complexClaim.claim,
            submission: {
              ...state.complexClaim.claim.submission,
              isSubmitting: false,
              error: action.error,
            },
          },
        },
      };
    case CREATE_COMPLEX_CLAIM_STARTED:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          claim: {
            ...state.complexClaim.claim,
            creation: {
              isLoading: true,
              error: null,
            },
          },
        },
      };
    case CREATE_COMPLEX_CLAIM_SUCCESS:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          claim: {
            ...state.complexClaim.claim,
            creation: {
              error: null,
              isLoading: false,
              data: action.payload,
            },
            data: action.payload,
          },
        },
      };
    case CREATE_COMPLEX_CLAIM_FAILURE:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          claim: {
            ...state.complexClaim.claim,
            creation: {
              isLoading: false,
              error: action.error,
            },
          },
        },
      };
    case UPDATE_EXPENSE_STARTED:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          expenses: {
            ...state.complexClaim.expenses,
            update: {
              id: action.expenseId,
              isLoading: true,
              error: null,
            },
          },
        },
      };
    case UPDATE_EXPENSE_SUCCESS: {
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          expenses: {
            ...state.complexClaim.expenses,
            update: {
              id: '',
              isLoading: false,
              error: null,
            },
            data: mergeExpenses(state.complexClaim.expenses.data, [
              action.payload,
            ]),
          },
        },
      };
    }
    case UPDATE_EXPENSE_FAILURE:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          expenses: {
            ...state.complexClaim.expenses,
            update: {
              id: action.expenseId,
              isLoading: false,
              error: action.error,
            },
          },
        },
      };
    case DELETE_EXPENSE_STARTED: {
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          expenses: {
            ...state.complexClaim.expenses,
            delete: {
              id: action.expenseId,
              isLoading: true,
              error: null,
            },
          },
        },
      };
    }
    case DELETE_EXPENSE_SUCCESS: {
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          expenses: {
            ...state.complexClaim.expenses,
            delete: {
              id: '',
              isLoading: false,
              error: null,
            },
            data: state.complexClaim.expenses.data.filter(
              expense => expense.id !== action.expenseId,
            ),
          },
        },
      };
    }
    case DELETE_EXPENSE_FAILURE:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          expenses: {
            ...state.complexClaim.expenses,
            delete: {
              id: action.expenseId,
              isLoading: false,
              error: action.error,
            },
          },
        },
      };

    // New bifurcated expense operations
    case CREATE_EXPENSE_STARTED:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          expenses: {
            ...state.complexClaim.expenses,
            creation: {
              isLoading: true,
              error: null,
            },
          },
        },
      };

    case CREATE_EXPENSE_SUCCESS:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          expenses: {
            ...state.complexClaim.expenses,
            creation: {
              isLoading: false,
              error: null,
            },
            data: mergeExpenses(state.complexClaim.expenses.data, [
              action.payload,
            ]),
          },
        },
      };

    case CREATE_EXPENSE_FAILURE:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          expenses: {
            ...state.complexClaim.expenses,
            creation: {
              isLoading: false,
              error: action.error,
            },
          },
        },
      };

    case FETCH_COMPLEX_CLAIM_DETAILS_STARTED:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          claim: {
            ...state.complexClaim.claim,
            fetch: {
              isLoading: true,
              error: null,
            },
          },
        },
      };

    case FETCH_COMPLEX_CLAIM_DETAILS_SUCCESS: {
      const existingExpenses = state.complexClaim.expenses.data || [];
      const newExpenses = action.payload?.expenses || [];
      const mergedExpenses = mergeExpenses(existingExpenses, newExpenses);

      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          claim: {
            ...state.complexClaim.claim,
            fetch: {
              isLoading: false,
              error: null,
            },
            data: action.payload,
          },
          expenses: {
            ...state.complexClaim.expenses,
            data: mergedExpenses,
          },
        },
      };
    }

    case FETCH_COMPLEX_CLAIM_DETAILS_FAILURE:
      return {
        ...state,
        complexClaim: {
          ...state.complexClaim,
          claim: {
            ...state.complexClaim.claim,
            fetch: {
              isLoading: false,
              error: action.error,
            },
          },
        },
      };

    default:
      return state;
  }
}

export default {
  travelPay: travelPayReducer,
};
