import { Actions } from '../util/actionTypes';
import { mockGetVitalsList, mockGetVital } from '../api/MrApi';

export const getVitalsList = () => async dispatch => {
  const response = await mockGetVitalsList();
  dispatch({ type: Actions.Vitals.GET_LIST, response });
};

export const getVitalDetails = vitalId => async dispatch => {
  const response = await mockGetVital(vitalId);
  dispatch({ type: Actions.Vital.GET, response });
};
