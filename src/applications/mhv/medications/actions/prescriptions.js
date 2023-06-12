import { Actions } from '../util/actionTypes';
import { mockGetPrescription, mockGetPrescriptionList } from '../api/medApi';

export const getPrescriptionsList = () => async dispatch => {
  const response = await mockGetPrescriptionList();
  dispatch({ type: Actions.Prescriptions.GET_LIST, response });
};

export const getPrescriptionDetails = prescriptionId => async dispatch => {
  const response = await mockGetPrescription(prescriptionId);
  dispatch({ type: Actions.Prescriptions.GET, response });
};
