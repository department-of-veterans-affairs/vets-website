import { Actions } from '../util/actionTypes';
import { mockGetAllergiesList, mockGetAllergy } from '../api/MrApi';

export const getAllergiesList = () => async dispatch => {
  const response = await mockGetAllergiesList();
  dispatch({ type: Actions.Allergies.GET_LIST, response });
};

export const getAllergyDetails = conditionId => async dispatch => {
  const response = await mockGetAllergy(conditionId);
  dispatch({ type: Actions.Allergies.GET, response });
};
