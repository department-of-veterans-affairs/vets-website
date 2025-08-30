import { Actions } from '../util/actionTypes';
import {
  getConditions,
  getCondition,
  getAcceleratedConditions,
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
) => async (dispatch, getState) => {
  // Accelerated path: find locally; else fetch list and match.
  // Remove when GET_UNIFIED_ITEM is available.
  if (isAccelerating) {
    let matchingItem;
    matchingItem =
      conditionList && conditionList.find(item => item.id === conditionId);

    if (!matchingItem) {
      // No local match; fetch list, then read from store
      await dispatch(getConditionsList(false, isAccelerating));
      // Read from store and normalize shape (array or { data: [] })
      const raw = getState().mr?.conditions?.conditionsList;
      const list = Array.isArray(raw) ? raw : raw?.data || [];
      const found =
        list.find(
          item =>
            item?.id === conditionId || item?.attributes?.id === conditionId,
        ) || null;
      // Prefer attributes payload if present
      matchingItem = found?.attributes ?? found ?? undefined;
    }

    dispatch({
      type: Actions.Conditions.GET_FROM_LIST,
      response: matchingItem,
    });
    return; // done (accelerated)
  }

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
