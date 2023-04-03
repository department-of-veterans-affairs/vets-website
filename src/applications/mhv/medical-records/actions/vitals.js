import { Actions } from '../util/actionTypes';
import { mockGetVitalsList } from '../api/MrApi';

export const getVitalsList = () => async dispatch => {
  const response = await mockGetVitalsList();
  dispatch({ type: Actions.Vitals.GET_LIST, response });
};

export const getVitalDetails = vitalType => async dispatch => {
  await dispatch(getVitalsList());
  dispatch({ type: Actions.Vitals.GET, vitalType });
};
