import { Actions } from '../util/actionTypes';
import { mockGetConditionsList, mockGetCondition } from '../api/MrApi';

export const getConditionsList = () => async dispatch => {
  const response = await mockGetConditionsList();
  dispatch({ type: Actions.Conditions.GET_LIST, response });
};

export const getConditionDetails = conditionId => async dispatch => {
  const response = await mockGetCondition(conditionId);
  dispatch({ type: Actions.Conditions.GET, response });
};
