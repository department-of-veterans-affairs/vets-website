import {FEEDBACK_STATES, UPDATE_FEEDBACK_STATE} from '../actions';

const initialState = {
  isOpen: false,
  shouldSendResponse: false,
  isSubmitted: false
}

function expandFeedbackState(state, action){
  const {value, formValues} = action;

  switch (action.value) {
    case FEEDBACK_STATES.OPEN:
      return { isOpen: true };
    case FEEDBACK_STATES.SUBMITTED:
      return { isSubmitted: true, shouldSendResponse: false }
  }
}

function feedbackReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_FEEDBACK_STATE:
      return expandFeedbackState(state, action);
    default:
      return state;
  }
}

export default feedbackReducer;