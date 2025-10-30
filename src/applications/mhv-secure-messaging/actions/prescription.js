import { datadogRum } from '@datadog/browser-rum';
import { Actions } from '../util/actionTypes';
import { getPrescriptionById as apiGetPrescriptionById } from '../api/RxApi';

export const getPrescriptionById = prescriptionId => async dispatch => {
  dispatch({ type: Actions.Prescriptions.CLEAR_PRESCRIPTION });
  try {
    dispatch({ type: Actions.Prescriptions.IS_LOADING });
    if (!prescriptionId || prescriptionId === 'undefined') {
      throw new Error('Prescription ID is required');
    }
    const response = await apiGetPrescriptionById(prescriptionId);
    if (response?.errors) {
      const error = new Error(
        response.errors[0]?.title || 'API returned errors',
      );
      error.errors = response.errors; // Preserve the original errors array
      throw error;
    }
    dispatch({
      type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID,
      payload: response.data?.attributes,
    });
  } catch (e) {
    const error = e?.errors?.[0] || e;
    const errorPayload =
      error?.status === '404'
        ? error.title
        : error.title || error.detail || error.message || error;

    // Log error to Datadog with context
    const errorMessage = `Error fetching medication data for Secure Messaging Rx renewal request: ${errorPayload}`;
    datadogRum.addError(new Error(errorMessage), {
      source: 'prescription_action',
      prescriptionId,
      originalError: errorPayload,
      errorStatus: error?.status,
      context: 'Secure Messaging - Medication Renewal Request',
    });

    dispatch({
      type: Actions.Prescriptions.GET_PRESCRIPTION_BY_ID_ERROR,
      payload: errorPayload,
    });
  }
};

export const clearPrescription = () => ({
  type: Actions.Prescriptions.CLEAR_PRESCRIPTION,
});

export const setRedirectPath = redirectPath => ({
  type: Actions.Prescriptions.SET_REDIRECT_PATH,
  payload: redirectPath,
});
