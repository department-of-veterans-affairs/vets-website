import {SEND_FEEDBACK, FEEDBACK_RECEIVED} from '../actions';

const initialState = {
  requestPending: false,
  feedbackReceived: false,
  shouldSendResponse: false
};

function feedbackReducer(state = initialState, action) {
  switch (action.type) {
    case SEND_FEEDBACK:
      return {
        requestPending: true,
        feedbackReceived: false,
        shouldSendResponse: action.values.shouldSendResponse
      };
    case FEEDBACK_RECEIVED:
      return {
        requestPending: false,
        feedbackReceived: true,
        shouldSendResponse: state.shouldSendResponse
      };
    default:
      return state;
  }
}

export default feedbackReducer;
