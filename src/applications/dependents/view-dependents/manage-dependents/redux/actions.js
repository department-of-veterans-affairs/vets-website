import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

import { LOADING_STATUS } from '../utils';

export const FORM_DATA_UPDATED = 'MANAGE_DEPENDENTS_UPDATED';
export const FORM_DATA_CLEANUP = 'MANAGE_DEPENDENTS_CLEANUP';
export const FORM_DATA_SUBMIT_START = 'MANAGE_DEPENDENTS_SUBMIT_START';
export const FORM_DATA_SUBMIT_SUCCESS = 'MANAGE_DEPENDENTS_SUBMIT_SUCCESS';
export const FORM_DATA_SUBMIT_FAILED = 'MANAGE_DEPENDENTS_SUBMIT_FAILED';

export function updateFormData(formSchema, uiSchema, formData, stateKey) {
  return {
    type: FORM_DATA_UPDATED,
    formSchema,
    uiSchema,
    formData,
    stateKey,
  };
}

export function cleanupFormData(stateKey) {
  return {
    type: FORM_DATA_CLEANUP,
    stateKey,
  };
}

export function submitFormData(stateKey, payload) {
  return async dispatch => {
    dispatch({
      type: FORM_DATA_SUBMIT_START,
      status: LOADING_STATUS.pending,
      stateKey,
    });
    try {
      const response = await apiRequest(
        `${environment.API_URL}/v0/dependents_applications`,
        {
          method: 'POST',
          body: JSON.stringify({
            ...payload,
          }),
          credentials: 'include',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': localStorage.getItem('csrfToken'),
          },
        },
      );
      return dispatch({
        type: FORM_DATA_SUBMIT_SUCCESS,
        status: LOADING_STATUS.success,
        response,
        stateKey,
      });
    } catch (error) {
      return dispatch({
        type: FORM_DATA_SUBMIT_FAILED,
        status: LOADING_STATUS.failed,
        error,
        stateKey,
      });
    }
  };
}
