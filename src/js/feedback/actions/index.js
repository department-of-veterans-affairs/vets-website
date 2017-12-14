import { apiRequest } from '../../common/helpers/api';
import { isValidEmail } from '../../common/utils/validations';

export const REVEAL_FORM = 'REVEAL_FORM';
export const SET_FORM_VALUES = 'SET_FORM_VALUES';
export const SEND_FEEDBACK = 'SEND_FEEDBACK';
export const FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED';
export const FEEDBACK_ERROR = 'FEEDBACK_ERROR';
export const CLEAR_FEEDBACK_ERROR = 'CLEAR_FEEDBACK_ERROR';

const errorMessage = 'An error occurred while trying to submit the form. We apologize for the inconvenience.';

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

export function sendFeedback(formValues) {
  return (dispatch) => {
    const { description, email: ownerEmail } = formValues;
    const targetPage = window.location.pathname;
    const settings = {
      headers: { 'Content-Type': 'application/json', Authorization: '' },
      method: 'post',
      body: JSON.stringify({ ownerEmail, description, targetPage })
    };

    dispatch({ type: SEND_FEEDBACK });

    return apiRequest(
      '/feedback',
      settings,
      () => dispatch({ type: FEEDBACK_RECEIVED }),
      () => dispatch({ type: FEEDBACK_ERROR, message: errorMessage })
    );
  };
}

export function clearError() {
  return { type: CLEAR_FEEDBACK_ERROR };
}
