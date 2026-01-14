import { updateSchemasAndData } from 'platform/forms-system/src/js/state/helpers';

import {
  FORM_DATA_UPDATED,
  FORM_DATA_CLEANUP,
  FORM_DATA_SUBMIT_FAILED,
  FORM_DATA_SUBMIT_SUCCESS,
  FORM_DATA_SUBMIT_START,
} from './actions';

const initialState = {
  dependentsState: null,
  openFormlett: null,
  submittedDependents: [],
};

/**
 * @typedef {Object} ManageDependentsState
 * @property {object} dependentsState - redux state for manage dependents forms
 * @property {boolean|null} openFormlett - whether formlett is open
 * @property {Array} submittedDependents - list of successfully submitted
 * dependents
 *
 * @typedef {Object} ManageDependentsAction
 * @property {string} type - action type
 * @property {object} formSchema - schema for 686c-674
 * @property {object} uiSchema - uiSchema for 686c-674
 * @property {object} formData - form data for 686c-674
 * @property {string} stateKey - form data key
 * @property {string} status - loading status
 * @property {object} error - error object
 *
 * @param {ManageDependentsState} state - redux state
 * @param {ManageDependentsAction} action - redux action
 * @returns {ManageDependentsState} - updated redux state
 */
export function removeDependents(state = initialState, action) {
  // schema, uiSchema, and formData are already extracted based on index (stateKey) here.
  if (action.type === FORM_DATA_UPDATED) {
    const {
      data: newFormData,
      schema: newFormSchema,
      uiSchema: newUiSchema,
    } = updateSchemasAndData(
      action.formSchema,
      action.uiSchema,
      action.formData,
      true,
    );

    return {
      ...state,
      openFormlett: true,
      dependentsState: {
        ...state.dependentsState,
        [action.stateKey]: {
          uiSchema: newUiSchema,
          formSchema: newFormSchema,
          formData: newFormData,
        },
      },
    };
  }

  if (action.type === FORM_DATA_CLEANUP) {
    const nextDependentsState = state.dependentsState;
    delete nextDependentsState[action.stateKey];
    return {
      ...state,
      openFormlett: null,
      dependentsState: nextDependentsState,
    };
  }

  if (action.type === FORM_DATA_SUBMIT_START) {
    return {
      ...state,
      dependentsState: {
        ...state.dependentsState,
        [action.stateKey]: {
          ...state.dependentsState[action.stateKey],
          status: action.status,
        },
      },
    };
  }

  // we want to clean up the data but also keep track of
  // which dependents have been submitted. We need to
  // switch off openFormlett and include a way to track
  // which indexes have been submitted
  if (action.type === FORM_DATA_SUBMIT_SUCCESS) {
    return {
      ...state,
      openFormlett: null,
      submittedDependents: [...state.submittedDependents, action.stateKey],
      dependentsState: {
        ...state.dependentsState,
        [action.stateKey]: {
          ...state.dependentsState[action.stateKey],
          status: action.status,
        },
      },
    };
  }

  if (action.type === FORM_DATA_SUBMIT_FAILED) {
    return {
      ...state,
      dependentsState: {
        ...state.dependentsState,
        [action.stateKey]: {
          ...state.dependentsState[action.stateKey],
          status: action.status,
          error: action.error.errors?.[0],
        },
      },
    };
  }

  return state;
}
