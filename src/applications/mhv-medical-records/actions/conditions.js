import { Actions } from '../util/actionTypes';
import {
  getConditions,
  getCondition,
  getAcceleratedConditions,
  getAcceleratedCondition,
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
    const actionType = isAccelerating
      ? Actions.Conditions.GET_UNIFIED_LIST
      : Actions.Conditions.GET_LIST;

    const response = await getListWithRetry(dispatch, getData);

    dispatch({
      type: actionType,
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
  isAccelerating = false,
) => async dispatch => {
  // Workaround: GET_UNIFIED_ITEM is not ready for deployment yet
  // For accelerated conditions, attempt to find the item in the existing list
  // If not found, fetch the full list and dispatch the matching item
  // TODO: Remove this workaround once GET_UNIFIED_ITEM endpoint is available
  if (isAccelerating) {
    const matchingItem =
      conditionList && conditionList.find(item => item.id === conditionId);

    // This dispatches a placeholder response until the proper API endpoint is ready
    if (!matchingItem) {
      // Fetch updated conditions list since the item wasn't found locally
      await dispatch(getConditionsList(false, isAccelerating));
    }

    // Item found in local list, dispatch it directly
    dispatch({
      type: Actions.Conditions.GET_FROM_LIST,
      response: matchingItem,
    });
    return; // Exit early for accelerated path
  }

  try {
    const getDataFunction = isAccelerating
      ? getAcceleratedCondition
      : getCondition;
    const actionType = isAccelerating
      ? Actions.Conditions.GET_UNIFIED_ITEM
      : Actions.Conditions.GET;

    await dispatchDetails(
      conditionId,
      conditionList,
      dispatch,
      getDataFunction,
      Actions.Conditions.GET_FROM_LIST,
      actionType,
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
