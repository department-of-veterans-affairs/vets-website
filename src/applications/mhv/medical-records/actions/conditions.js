import { Actions } from '../util/actionTypes';
import { getConditions, getCondition } from '../api/MrApi';
import * as Constants from '../util/constants';
import { addAlert } from './alerts';

export const getConditionsList = () => async dispatch => {
  try {
    const response = await getConditions();
    dispatch({ type: Actions.Conditions.GET_LIST, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const getConditionDetails = conditionId => async dispatch => {
  try {
    const response = await getCondition(conditionId);
    dispatch({ type: Actions.Conditions.GET, response });
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearConditionDetails = () => async dispatch => {
  dispatch({ type: Actions.Conditions.CLEAR_DETAIL });
};
