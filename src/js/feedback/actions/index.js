export const UPDATE_FEEDBACK_STATE = 'UPDATE_FEEDBACK_STATE';
export const FEEDBACK_STATES = {
  OPEN: 'OPEN',
  PENDING: 'PENDING',
  SUBMITTED: 'SUBMITTED'
};

export function showFeedbackForm(){
  return {
    type: UPDATE_FEEDBACK_STATE,
    value: FEEDBACK_STATES.OPEN
  };
}

export function submitFeedbackForm(){
  return {
    type: UPDATE_FEEDBACK_STATE,
    value: FEEDBACK_STATES.SUBMITTED
  };
}
