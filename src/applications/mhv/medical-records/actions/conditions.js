import { Actions } from '../util/actionTypes';
import { getConditions, getCondition } from '../api/MrApi';

export const getConditionsList = () => async dispatch => {
  const response = await getConditions();
  dispatch({ type: Actions.Conditions.GET_LIST, response });
};

export const getConditionDetails = conditionId => async dispatch => {
  const response = await getCondition(conditionId);
  dispatch({ type: Actions.Conditions.GET, response });
};
