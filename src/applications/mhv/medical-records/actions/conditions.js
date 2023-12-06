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

export const getConditionDetails = (
  conditionId,
  conditionList,
) => async dispatch => {
  try {
    // Check if conditionList has data
    if (conditionList && conditionList.length > 0) {
      const matchingConditon = conditionList.find(
        item => item.id === conditionId,
      );

      if (matchingConditon) {
        // If a matching condition is found, dispatch it
        dispatch({
          type: Actions.Conditions.GET_FROM_LIST,
          response: matchingConditon,
        });
        return;
      }
    } else {
      // If conditionList has no data,
      // or if the conditionList item can't be found, use getCondition(conditionId)
      const response = await getCondition(conditionId);
      dispatch({ type: Actions.Conditions.GET, response });
    }
  } catch (error) {
    dispatch(addAlert(Constants.ALERT_TYPE_ERROR));
  }
};

export const clearConditionDetails = () => async dispatch => {
  dispatch({ type: Actions.Conditions.CLEAR_DETAIL });
};
