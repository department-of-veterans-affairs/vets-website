import { Actions } from '../util/actionTypes';
import { getPrescription, getPaginatedSortedList, fillRx } from '../api/rxApi';
import { getAllergies } from '../../medical-records/api/MrApi';

export const getPrescriptionsPaginatedSortedList = (
  pageNumber,
  sortEndpoint,
) => async dispatch => {
  try {
    const response = await getPaginatedSortedList(pageNumber, sortEndpoint);
    dispatch({
      type: Actions.Prescriptions.GET_PAGINATED_SORTED_LIST,
      response,
    });
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
    dispatch({ type: Actions.Allergies.GET_LIST_ERROR });
    return error;
  }
};

export const clearAllergiesError = () => async dispatch => {
  dispatch({ type: Actions.Allergies.GET_LIST_ERROR_RESET });
};

export const getPrescriptionDetails = prescriptionId => async dispatch => {
  const response = await getPrescription(prescriptionId);
  const prescription = response.data.attributes;
  dispatch({ type: Actions.Prescriptions.GET_DETAILS, prescription });
};

export const setPrescriptionDetails = prescription => async dispatch => {
  dispatch({ type: Actions.Prescriptions.SET_DETAILS, prescription });
};

export const fillPrescription = prescriptionId => async dispatch => {
  try {
    dispatch({ type: Actions.Prescriptions.CLEAR_ERROR, prescriptionId });
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
