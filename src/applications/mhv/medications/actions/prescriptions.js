import { Actions } from '../util/actionTypes';
import { getPrescription, getPrescriptionList } from '../api/rxApi';

export const setSortedRxList = rxList => async dispatch => {
  dispatch({ type: Actions.Prescriptions.SET_SORTED_LIST, rxList });
};

export const getPrescriptionsList = () => async dispatch => {
  const response = await getPrescriptionList();
  dispatch({ type: Actions.Prescriptions.GET_LIST, response });
};

export const getPrescriptionDetails = prescriptionId => async dispatch => {
  const response = await getPrescription(prescriptionId);
  dispatch({ type: Actions.Prescriptions.GET, response });
};
