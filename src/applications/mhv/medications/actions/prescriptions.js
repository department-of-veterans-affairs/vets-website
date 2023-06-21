import { Actions } from '../util/actionTypes';
import { getPrescriptionList, mockGetPrescription } from '../api/medApi';

export const getPrescriptionsList = () => async dispatch => {
  const response = await getPrescriptionList();
  dispatch({ type: Actions.Prescriptions.GET_LIST, response });
};

export const getPrescriptionDetails = prescriptionId => async dispatch => {
  const response = await mockGetPrescription(prescriptionId);
  dispatch({ type: Actions.Prescriptions.GET, response });
};
