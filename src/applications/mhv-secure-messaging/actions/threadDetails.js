import { Actions } from '../util/actionTypes';

export const clearThread = () => dispatch => {
  dispatch({ type: Actions.Thread.CLEAR_THREAD });
};

// updates should be an object with key-value pairs
// e.g., { body: 'new message body', subject: 'new subject' }
export const updateDraftInProgress = updates => dispatch => {
  dispatch({
    type: Actions.Draft.UPDATE_DRAFT_IN_PROGRESS,
    payload: updates,
  });
};

export const clearDraftInProgress = () => dispatch => {
  dispatch({ type: Actions.Draft.CLEAR_DRAFT_IN_PROGRESS });
};
