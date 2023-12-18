import { Actions } from '../util/actionTypes';
import { getRefreshStatus } from '../api/MrApi';

export const fetchRefreshStatus = () => async dispatch => {
  const response = await getRefreshStatus();
  dispatch({ type: Actions.Refresh.GET_STATUS, payload: response });
};

export const updatePhase = status => async dispatch => {
  dispatch({ type: Actions.Refresh.UPDATE_PHASE, payload: status });
};
