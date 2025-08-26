import { Actions } from '../util/actionTypes';
import {
  getConditions,
  getCondition,
  getAcceleratedConditions,
  // getAcceleratedCondition,
} from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { dispatchDetails } from '../util/helpers';
import { getListWithRetry } from './common';

export const getConditionsList = (
  isCurrent = false,
  isAccelerating = false,
) => async dispatch => {
  dispatch({
    type: Actions.Conditions.UPDATE_LIST_STATE,
    payload: Constants.loadStates.FETCHING,
  });
  try {
    const getData = isAccelerating ? getAcceleratedConditions : getConditions;
    const response = await getListWithRetry(dispatch, getData);
    dispatch({
      type: isAccelerating
        ? Actions.Conditions.GET_UNIFIED_LIST
        : Actions.Conditions.GET_LIST,
      response,
      isCurrent,
    });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const getConditionDetails = (
  conditionId,
  conditionList,
) => async dispatch => {
  try {
    await dispatchDetails(
      conditionId,
      conditionList,
      dispatch,
      getCondition,
      Actions.Conditions.GET_FROM_LIST,
      Actions.Conditions.GET,
    );
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
    throw error;
  }
};

export const clearConditionDetails = () => async dispatch => {
  dispatch({ type: Actions.Conditions.CLEAR_DETAIL });
};

export const reloadRecords = () => async dispatch => {
  dispatch({ type: Actions.Conditions.COPY_UPDATED_LIST });
};
