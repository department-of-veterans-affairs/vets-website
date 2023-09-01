import { Actions } from '../util/actionTypes';
import { getPrescription, getPrescriptionList, fillRx } from '../api/rxApi';

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

export const fillPrescription = prescriptionId => async dispatch => {
  try {
    const response = await fillRx(prescriptionId);
    response.id = prescriptionId;
    dispatch({ type: Actions.Prescriptions.FILL, response });
    return null;
  } catch (error) {
    const err = error.errors[0];
    dispatch({
      type: Actions.Prescriptions.FILL_ERROR,
      err,
    });
    return error;
  }
};
