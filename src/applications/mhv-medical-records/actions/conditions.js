import { Actions } from '../util/actionTypes';
import {
  getConditions,
  getCondition,
  getAcceleratedConditions,
  getAcceleratedCondition,
} from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { dispatchDetails, sendDatadogError } from '../util/helpers';
import { getListWithRetry } from './common';

export const getConditionsList =
  (isCurrent = false, isAccelerating = false) =>
  async dispatch => {
    dispatch({
      type: Actions.Conditions.UPDATE_LIST_STATE,
      payload: Constants.loadStates.FETCHING,
    });
    try {
      const getData = isAccelerating ? getAcceleratedConditions : getConditions;
      const requestActionType = isAccelerating
        ? Actions.Conditions.GET_UNIFIED_LIST
        : Actions.Conditions.GET_LIST;

      const response = await getListWithRetry(dispatch, getData);

      dispatch({
        type: requestActionType,
        response,
        isCurrent,
      });
    } catch (error) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
      sendDatadogError(error, 'actions_conditions_getConditionsList');
    }
  };

export const getConditionDetails =
  (conditionId, conditionList, isAccelerating = false) =>
  async dispatch => {
    try {
      const getDetailsFunc = isAccelerating
        ? getAcceleratedCondition
        : getCondition;

      const detailsRequestActionType = isAccelerating
        ? Actions.Conditions.GET_UNIFIED_ITEM
        : Actions.Conditions.GET;

      await dispatchDetails(
        conditionId,
        conditionList,
        dispatch,
        getDetailsFunc,
        Actions.Conditions.GET_FROM_LIST,
        detailsRequestActionType,
      );
    } catch (error) {
      dispatch(addAlert(Constants.ALERT_TYPE_ERROR, error));
      sendDatadogError(error, 'actions_conditions_getConditionDetails');
    }
  };

export const clearConditionDetails = () => async dispatch => {
  dispatch({ type: Actions.Conditions.CLEAR_DETAIL });
};

export const reloadRecords = () => async dispatch => {
  dispatch({ type: Actions.Conditions.COPY_UPDATED_LIST });
};
