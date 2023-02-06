import { Actions } from '../util/actionTypes';
import { mockGetVaccineList } from '../api/MrApi';

export const getVaccineList = () => async dispatch => {
  const response = await mockGetVaccineList();
  dispatch({ type: Actions.Vaccines.GET_LIST, response });
};

export const getVaccineDetails = vaccineId => async dispatch => {
  dispatch({ type: Actions.Vaccines.GET, vaccineId });
};
