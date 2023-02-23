import { Actions } from '../util/actionTypes';
import { mockGetVaccineList, mockGetVaccine } from '../api/MrApi';

export const getVaccineList = () => async dispatch => {
  const response = await mockGetVaccineList();
  dispatch({ type: Actions.Vaccines.GET_LIST, response });
};

export const getVaccineDetails = vaccineId => async dispatch => {
  const response = await mockGetVaccine(vaccineId);
  dispatch({ type: Actions.Vaccines.GET, response });
};
