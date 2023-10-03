import { Actions } from '../util/actionTypes';
import { getPrescription, getPrescriptionList, fillRx } from '../api/rxApi';
import { getAllergies } from '../../medical-records/api/MrApi';

export const setSortedRxList = rxList => async dispatch => {
  dispatch({ type: Actions.Prescriptions.SET_SORTED_LIST, rxList });
};

export const getPrescriptionsList = (
  pageNumber,
  sortEndpoint,
) => async dispatch => {
  try {
    const response = await getPrescriptionList(pageNumber, sortEndpoint);
    dispatch({ type: Actions.Prescriptions.GET_LIST, response });
    return null;
  } catch (error) {
    return error;
  }
};

// TODO: consider re-using this action from medical-records
export const getAllergiesList = () => async dispatch => {
  try {
    const response = await getAllergies();
    dispatch({ type: Actions.Allergies.GET_LIST, response });
    return null;
  } catch (error) {
    return error;
  }
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
    const err = error;
    err.id = prescriptionId;
    dispatch({
      type: Actions.Prescriptions.FILL_ERROR,
      err,
    });
    return error;
  }
};
