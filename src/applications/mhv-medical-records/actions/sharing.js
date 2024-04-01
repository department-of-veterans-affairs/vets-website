import { Actions } from '../util/actionTypes';
import { getSharingStatus, postSharingUpdateStatus } from '../api/MrApi';

export const fetchSharingStatus = () => async dispatch => {
  try {
    const response = await getSharingStatus();
    dispatch({ type: Actions.Sharing.STATUS, response });
  } catch (error) {
    dispatch({
      type: Actions.Sharing.STATUS_ERROR,
      response: { type: 'fetch', error },
    });
    throw error;
  }
};

export const updateSharingStatus = optIn => async dispatch => {
  try {
    const response = await postSharingUpdateStatus(optIn);
    dispatch({
      type: Actions.Sharing.UPDATE,
      response: { ...response, optIn },
    });
  } catch (error) {
    dispatch({
      type: Actions.Sharing.STATUS_ERROR,
      response: { type: optIn ? 'optin' : 'optout', error },
    });
    throw error;
  }
};

export const clearSharingStatus = () => async dispatch => {
  dispatch({ type: Actions.Sharing.CLEAR });
};
