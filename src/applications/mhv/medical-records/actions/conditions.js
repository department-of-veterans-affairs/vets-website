import { Actions } from '../util/actionTypes';
import { getConditions, getCondition } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';
import { dispatchDetails } from '../util/helpers';

export const getConditionsList = () => async dispatch => {
  try {
    const response = await getConditions();
    dispatch({ type: Actions.Conditions.GET_LIST, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
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
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearConditionDetails = () => async dispatch => {
  dispatch({ type: Actions.Conditions.CLEAR_DETAIL });
};
