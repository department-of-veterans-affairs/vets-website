import { Actions } from '../util/actionTypes';
import { getRefreshStatus } from '../api/MrApi';

export const fetchRefreshStatus = () => async dispatch => {
  try {
    const response = await getRefreshStatus();
    const statusList = response?.facilityExtractStatusList || [];
    const mostRecentLastRequested =
      statusList.length > 0
        ? Math.max(...statusList.map(extract => extract.lastRequested ?? 0))
        : 0; // Fallback to 0 (beginning of time) if no valid data

    window.localStorage.setItem('lastPhrRefreshDate', mostRecentLastRequested);
    dispatch({ type: Actions.Refresh.GET_STATUS, payload: response });
  } catch (error) {
    dispatch({ type: Actions.Refresh.STATUS_CALL_FAILED });
    throw error;
  }
};

export const setStatusPollBeginDate = statusPollBeginDate => dispatch => {
  dispatch({
    type: Actions.Refresh.SET_STATUS_POLL_BEGIN,
    payload: statusPollBeginDate,
  });
};
