import {
  updateSchemaAndData,
  updateUiSchema,
} from 'platform/forms-system/src/js/state/helpers';

import { FORM_DATA_UPDATED } from '../actions';

const initialState = {
  formState: null,
};

function reducer(state = initialState, action) {
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

  return state;
}

export default {
  coronavirusVaccinationApp: reducer,
};
