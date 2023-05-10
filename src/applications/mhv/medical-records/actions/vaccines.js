import { Actions } from '../util/actionTypes';
import { getVaccine, getVaccineList } from '../api/MrApi';

export const getVaccinesList = () => async dispatch => {
  // const response = await mockGetVaccinesList();
  const response = await getVaccineList();
  dispatch({ type: Actions.Vaccines.GET_LIST, response });
};

export const getVaccineDetails = vaccineId => async dispatch => {
  // const response = await mockGetVaccine(vaccineId);
  const response = await getVaccine(vaccineId);
  dispatch({ type: Actions.Vaccines.GET, response });
};
