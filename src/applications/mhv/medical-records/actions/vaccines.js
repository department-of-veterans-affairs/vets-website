import { Actions } from '../util/actionTypes';
import { mockGetVaccine, mockGetVaccinesList } from '../api/MrApi';

export const getVaccinesList = () => async dispatch => {
  const response = await mockGetVaccinesList();
  dispatch({ type: Actions.Vaccines.GET_LIST, response });
};

export const getVaccineDetails = vaccineId => async dispatch => {
  const response = await mockGetVaccine(vaccineId);
  dispatch({ type: Actions.Vaccines.GET, response });
};
