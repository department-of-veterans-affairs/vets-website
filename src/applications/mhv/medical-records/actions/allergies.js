import { Actions } from '../util/actionTypes';
import { getAllergies, getAllergy } from '../api/MrApi';

export const getAllergiesList = () => async dispatch => {
  const response = await getAllergies();
  const allergies = response.entry.map(item => item.resource);
  dispatch({ type: Actions.Allergies.GET_LIST, response: allergies });
};

export const getAllergyDetails = conditionId => async dispatch => {
  const response = await getAllergy(conditionId);
  dispatch({ type: Actions.Allergies.GET, response });
};
