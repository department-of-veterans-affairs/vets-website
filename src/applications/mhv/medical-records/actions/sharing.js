import { Actions } from '../util/actionTypes';
import { getSharingStatus, postSharingUpdateStatus } from '../api/MrApi';

export const fetchSharingStatus = () => async dispatch => {
  try {
    const response = await getSharingStatus();
    dispatch({ type: Actions.Sharing.STATUS, response });
  } catch (e) {
    dispatch({
      type: Actions.Sharing.STATUS_ERROR,
      response: { type: 'fetch', error: e },
    });
  }
};

export const updateSharingStatus = optIn => async dispatch => {
  try {
    const response = await postSharingUpdateStatus(optIn);
    dispatch({
      type: Actions.Sharing.UPDATE,
      response: { ...response, optIn },
    });
  } catch (e) {
    dispatch({
      type: Actions.Sharing.STATUS_ERROR,
      response: { type: optIn ? 'optin' : 'optout', error: e },
    });
  }
};

export const clearSharingStatus = () => async dispatch => {
  dispatch({ type: Actions.Sharing.CLEAR });
};
