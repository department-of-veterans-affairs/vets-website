/* eslint-disable camelcase, strict */

import environment from '../../common/helpers/environment.js';

export const SEND_FEEDBACK = 'SEND_FEEDBACK';
export const FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED';
export const FEEDBACK_ERROR = 'FEEDBACK_ERROR';
export const CLEAR_FEEDBACK_ERROR = 'CLEAR_FEEDBACK_ERROR';

const errorMessage = 'An error occurred while trying to submit the form. We apologize for the inconvenience.';

function handleFeedbackApiResponse(dispatch, values, response) {
  if (response.ok) {
    dispatch({ type: FEEDBACK_RECEIVED });
  } else {
    dispatch({ type: FEEDBACK_ERROR, message: errorMessage });
  }
}

export function sendFeedback(values) {
  return (dispatch) => {
    const { description: feedback, email } = values;
    const url = `${environment.API_URL}/v0/feedback`;
    const body = {
      target_page: window.location.pathname,
      owner_email: email,
      feedback
    };
    const settings = {
      headers: { 'Content-Type': 'application/json' },
      method: 'post',
      body: JSON.stringify(body)
    };

    dispatch({ type: SEND_FEEDBACK, values });
    return fetch(url, settings)
      .then(response => handleFeedbackApiResponse(dispatch, values, response));
  };
}

export function clearError() {
  return { type: CLEAR_FEEDBACK_ERROR };
}
