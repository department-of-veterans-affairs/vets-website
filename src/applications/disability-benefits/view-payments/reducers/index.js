import {
  PAYMENTS_RECEIVED_SUCCEEDED,
  PAYMENTS_RECEIVED_FAILED,
  PAYMENTS_RECEIVED_STARTED,
} from '../actions';

const initialState = {
  isLoading: true,
  payments: null,
  error: null,
};

const allPayments = (state = initialState, action) => {
  switch (action.type) {
    case PAYMENTS_RECEIVED_STARTED:
      return {
        ...state,
        isLoading: true,
      };
    case PAYMENTS_RECEIVED_SUCCEEDED:
      return {
        ...state,
        isLoading: false,
        payments: action.response,
      };
    case PAYMENTS_RECEIVED_FAILED:
      return {
        ...state,
        isLoading: false,
        error: action.response,
      };
    default:
      return state;
  }
};

export default { allPayments };
