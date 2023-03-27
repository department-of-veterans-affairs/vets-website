import { Actions } from '../util/actionTypes';
import { mockGetVitalsList } from '../api/MrApi';

export const getVitalsList = () => async dispatch => {
  const response = await mockGetVitalsList();
  dispatch({ type: Actions.Vitals.GET_LIST, response });
};
