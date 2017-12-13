import {
  REVEAL_FORM,
  SET_FORM_VALUES,
  SEND_FEEDBACK,
  FEEDBACK_RECEIVED,
  FEEDBACK_ERROR,
  CLEAR_FEEDBACK_ERROR
} from '../actions';

const initialState = {
  requestPending: false,
  feedbackReceived: false,
  errorMessage: null,
  formIsVisible: false,
  formValues: {
    description: '',
    email: '',
    shouldSendResponse: false
  }
};

function feedbackReducer(state = initialState, action) {
  switch (action.type) {
    case REVEAL_FORM:
      return {
        ...state,
        formIsVisible: true
      };
    case SET_FORM_VALUES:
      return {
        ...state,
        formValues: {
          ...state.formValues,
          ...action.formValues
        }
      };
    case SEND_FEEDBACK:
      return {
        ...state,
        requestPending: true,
        errorMessage: null
      };
    case FEEDBACK_RECEIVED:
      return {
        ...state,
        requestPending: false,
        feedbackReceived: true,
      };
    case FEEDBACK_ERROR:
      return {
        ...state,
        requestPending: false,
        errorMessage: action.message
      };
    case CLEAR_FEEDBACK_ERROR:
      return {
        ...state,
        errorMessage: null
      };
    default:
      return state;
  }
}

export default feedbackReducer;
