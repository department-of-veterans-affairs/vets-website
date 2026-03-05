import { getOHSyncStatus } from '../api/SmApi';
import { Actions } from '../util/actionTypes';
import { sendDatadogError } from '../util/helpers';

export const fetchOHSyncStatus = () => async dispatch => {
  try {
    const response = await getOHSyncStatus();
    dispatch({
      type: Actions.OHSyncStatus.GET,
      response,
    });
  } catch (error) {
    dispatch({
      type: Actions.OHSyncStatus.GET_ERROR,
    });
    sendDatadogError(error, 'action_ohSyncStatus_fetchOHSyncStatus');
  }
};
