import { Actions } from '../util/actionTypes';
import { getRefreshStatus } from '../api/MrApi';

export const fetchRefreshStatus = () => async dispatch => {
  const response = await getRefreshStatus();
  window.localStorage.setItem('lastPhrRefreshDate', response?.lastRefreshDate);
  dispatch({ type: Actions.Refresh.GET_STATUS, payload: response });
};

export const setStatusPollBeginDate = statusPollBeginDate => async dispatch => {
  dispatch({
    type: Actions.Refresh.SET_STATUS_POLL_BEGIN,
    payload: statusPollBeginDate,
  });
};
