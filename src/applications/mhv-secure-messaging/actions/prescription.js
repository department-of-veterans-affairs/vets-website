import { Actions } from '../util/actionTypes';
import { getPrescriptionById as apiGetPrescriptionById } from '../api/RxApi';

export const getPrescriptionById = prescriptionId => async dispatch => {
  try {
    dispatch({ type: Actions.Prescriptions.CLEAR_PRESCRIPTION });
    dispatch({ type: Actions.Prescriptions.IS_LOADING });
    const response = await apiGetPrescriptionById(prescriptionId);
    if (response?.errors) {
      throw new Error('API returned errors');
    }
    dispatch({
      type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID,
      payload: response.data?.attributes,
    });
  } catch (e) {
    const error = e.errors[0] || e;
    const errorPayload = error?.status === '404' ? error.title : error;
    dispatch({
      type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR,
      payload: errorPayload,
    });
  }
};

export const clearPrescription = () => ({
  type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
});
