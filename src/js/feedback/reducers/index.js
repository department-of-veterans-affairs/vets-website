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
  formIsSubmittable: false,
  formValues: {
    description: '',
    email: '',
    shouldSendResponse: ''
  },
  formErrors: {
    description: '',
    email: '',
    shouldSendResponse: ''
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
    {
      const formValues = { ...state.formValues, ...action.formValues };
      const formErrors = { ...state.formErrors, ...action.formErrors };

      let formIsSubmittable = true;
      //if no description is entered, or an error has displayed, form cannot be submitted
      if (!formValues.description || formErrors.description) formIsSubmittable = false;
      //else if no radio has been selected (Y/N) and no e-mail has been entered or an email error is displayed, form cannot be submitted
      else if (!formValues.shouldSendResponse && (!formValues.email || formErrors.email)) formIsSubmittable = false;
      // else if YES is selected but no e-mail has been entered or an e-mail error is displayed, form cannot be submitted
      else if (formValues.shouldSendResponse === 'yes' && (!formValues.email || formErrors.email)) formIsSubmittable = false;
      // else if NO is selected, form is submittable
      else if (formValues.shouldSendResponse) formIsSubmittable = true;

      console.log("form is submittable: " , formIsSubmittable, '|| should send response: ', formValues.shouldSendResponse, ' || email: ', formValues.email, 'email errors: ', formErrors.email);

      return {
        ...state,
        formIsSubmittable,
        formValues,
        formErrors
      };
    }
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
