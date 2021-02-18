import {
  updateSchemaAndData,
  updateUiSchema,
} from 'platform/forms-system/src/js/state/helpers';

import { FORM_DATA_UPDATED, FORM_DATA_CLEANUP } from './actions';

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

  return state;
}
