import { Actions } from '../util/actionTypes';
import { getPrescription, getPrescriptionList } from '../api/rxApi';

export const getPrescriptionsList = () => async dispatch => {
  const response = await getPrescriptionList();
  dispatch({ type: Actions.Prescriptions.GET_LIST, response });
};

export const getPrescriptionDetails = prescriptionId => async dispatch => {
  const response = await getPrescription(prescriptionId);
  dispatch({ type: Actions.Prescriptions.GET, response });
};
