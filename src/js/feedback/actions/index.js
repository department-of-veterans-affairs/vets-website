import { apiRequest } from '../../common/helpers/api';
import { isValidEmail } from '../../common/utils/validations';

export const REVEAL_FORM = 'REVEAL_FORM';
export const SET_FORM_VALUES = 'SET_FORM_VALUES';
export const SEND_FEEDBACK = 'SEND_FEEDBACK';
export const FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED';
export const FEEDBACK_ERROR = 'FEEDBACK_ERROR';
export const CLEAR_FEEDBACK_ERROR = 'CLEAR_FEEDBACK_ERROR';

export function revealForm() {
  return { type: REVEAL_FORM };
}

export function setFormValues(formValues) {
  const formErrors = {};
  if (formValues.description !== undefined) formErrors.description = formValues.description.length > 0 ? '' : 'Please enter a description';
  if (formValues.email !== undefined) formErrors.email = isValidEmail(formValues.email) ? '' : 'Please enter a valid email';

  return {
    type: SET_FORM_VALUES,
    formValues,
    formErrors
  };
}

function errorMessage(status) {
  switch (status) {
    case 429:
      return 'We’re sorry. We can’t process this request right now. Please try again later.';
    default:
      return 'An error occurred while trying to submit the form. We apologize for the inconvenience.';
  }
}

export function sendFeedback(formValues) {
  return (dispatch) => {
    const { description, shouldSendResponse, email: ownerEmail } = formValues;
    const targetPage = window.location.pathname;
    const body = { description, targetPage };
    if (shouldSendResponse) body.ownerEmail = ownerEmail;

    const settings = {
      headers: { 'Content-Type': 'application/json', Authorization: '' },
      method: 'post',
      body: JSON.stringify(body)
    };

    dispatch({ type: SEND_FEEDBACK });

    return apiRequest(
      '/feedback',
      settings,
      () => dispatch({ type: FEEDBACK_RECEIVED }),
      (error) => dispatch({ type: FEEDBACK_ERROR, message: errorMessage(error.status) })
    );
  };
}

export function clearError() {
  return { type: CLEAR_FEEDBACK_ERROR };
}
