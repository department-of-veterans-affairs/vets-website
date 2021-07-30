import {
  updateSchemaAndData,
  updateUiSchema,
} from 'platform/forms-system/src/js/state/helpers';

import {
  FORM_DATA_UPDATED,
  FORM_DATA_CLEANUP,
  FORM_DATA_SUBMIT_FAILED,
  // FORM_DATA_SUBMIT_SUCCESS,
  FORM_DATA_SUBMIT_START,
} from './actions';

const initialState = {
  dependentsState: null,
};

export function removeDependents(state = initialState, action) {
  // schema, uiSchema, and formData are already extracted based on index (stateKey) here.
  if (action.type === FORM_DATA_UPDATED) {
    const newUiSchema = updateUiSchema(action.uiSchema, action.formData);
    const { data: newFormData, schema: newFormSchema } = updateSchemaAndData(
      action.formSchema,
      action.uiSchema,
      action.formData,
      true,
    );

    return {
      ...state,
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

  if (action.type === FORM_DATA_SUBMIT_FAILED) {
    return {
      ...state,
      dependentsState: {
        ...state.dependentsState,
        [action.stateKey]: {
          ...state.dependentsState[action.stateKey],
          status: action.status,
          error: action.error.errors[0],
        },
      },
    };
  }

  return state;
}
