import { SEND_FEEDBACK, FEEDBACK_RECEIVED, FEEDBACK_ERROR, CLEAR_FEEDBACK_ERROR } from '../actions';

const initialState = {
  requestPending: false,
  feedbackReceived: false,
  shouldSendResponse: false,
  errorMessage: null
};

function feedbackReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_FEEDBACK:
      return {
        requestPending: true,
        feedbackReceived: false,
        shouldSendResponse: action.values.shouldSendResponse,
        errorMessage: null
      };
    case FEEDBACK_RECEIVED:
      return {
        requestPending: false,
        feedbackReceived: true,
        shouldSendResponse: state.shouldSendResponse,
        errorMessage: null
      };
    case FEEDBACK_ERROR:
      return {
        requestPending: false,
        feedbackReceived: false,
        shouldSendResponse: state.shouldSendResponse,
        errorMessage: action.message
      };
    case CLEAR_FEEDBACK_ERROR:
      return { ...state, errorMessage: null };
    default:
      return state;
  }
}

export default feedbackReducer;
