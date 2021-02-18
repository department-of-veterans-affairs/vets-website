import {
  updateSchemaAndData,
  updateUiSchema,
} from 'platform/forms-system/src/js/state/helpers';

import { FORM_DATA_UPDATED, FORM_DATA_CLEANUP } from './actions';

const initialState = {
  formState: null,
};

export function removeDependent(state = initialState, action) {
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
      formState: {
        uiSchema: newUiSchema,
        formSchema: newFormSchema,
        formData: newFormData,
      },
    };
  }

  if (action.type === FORM_DATA_CLEANUP) {
    return {
      ...state,
      formState: null,
    };
  }

  return state;
}
