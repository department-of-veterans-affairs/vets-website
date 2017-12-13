import { apiRequest } from '../../common/helpers/api';

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
  return { type: SET_FORM_VALUES, formValues };
}

export function sendFeedback() {
  return (dispatch, getState) => {
    const { formValues } = getState().feedback;
    const { description, email: ownerEmail } = formValues;
    const targetPage = window.location.pathname;
    const settings = {
      headers: { 'Content-Type': 'application/json', Authorization: '' },
      method: 'post',
      body: JSON.stringify({ ownerEmail, description, targetPage })
    };

    dispatch({ type: SEND_FEEDBACK });

    return apiRequest('/feedback', settings)
      .then(() => dispatch({ type: FEEDBACK_RECEIVED }))
      .catch(() => dispatch({ type: FEEDBACK_ERROR, message: errorMessage }));
  };
}

export function clearError() {
  return { type: CLEAR_FEEDBACK_ERROR };
}
