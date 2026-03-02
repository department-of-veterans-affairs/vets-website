import { apiRequest } from 'platform/utilities/api';
import environment from 'platform/utilities/environment';

import { LOADING_STATUS } from '../utils';

export const FORM_DATA_UPDATED = 'MANAGE_DEPENDENTS_UPDATED';
export const FORM_DATA_CLEANUP = 'MANAGE_DEPENDENTS_CLEANUP';
export const FORM_DATA_SUBMIT_START = 'MANAGE_DEPENDENTS_SUBMIT_START';
export const FORM_DATA_SUBMIT_SUCCESS = 'MANAGE_DEPENDENTS_SUBMIT_SUCCESS';
export const FORM_DATA_SUBMIT_FAILED = 'MANAGE_DEPENDENTS_SUBMIT_FAILED';

/**
 * Update form data action (submit 686C-674 from inside view dependents) -
 * We don't have a plan to move forward with this implementation
 * @param {object} formSchema - schema for 686c-674 (possibly using v1 still)
 * @param {object} uiSchema - uiSchema for 686c-674
 * @param {object} formData - form data for 686c-674
 * @param {string} stateKey - form data key
 * @returns {object} action
 */
export function updateFormData(formSchema, uiSchema, formData, stateKey) {
  return {
    type: FORM_DATA_UPDATED,
    formSchema,
    uiSchema,
    formData,
    stateKey,
  };
}

/**
 * Form data cleanup action
 * @param {string} stateKey - form data key
 * @returns {object} action to clean up form data
 */
export function cleanupFormData(stateKey) {
  return {
    type: FORM_DATA_CLEANUP,
    stateKey,
  };
}

/**
 * Submit 686c-674 form action
 * @param {string} stateKey - section key for type of dependent to remove
 * @param {object} payload - form data payload
 * @returns {Promise} dispatches actions based on API request result
 */
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
