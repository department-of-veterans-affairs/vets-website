export const SEND_FEEDBACK = 'SEND_FEEDBACK';
export const FEEDBACK_RECEIVED = 'FEEDBACK_RECEIVED';

export function sendFeedback(values) {
  return (dispatch) => {

    const sendFeedbackAction = { type: SEND_FEEDBACK, values };
    const feedbackReceivedAction = { type: FEEDBACK_RECEIVED };

    // @todo Send a network request once we know the endpoint
    dispatch(sendFeedbackAction);

    return new Promise((resolve) => {
      setTimeout(() => resolve(dispatch(feedbackReceivedAction)), 2000);
    });
  };
}
