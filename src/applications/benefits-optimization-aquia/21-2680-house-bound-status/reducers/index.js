import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import { formConfig } from '@bio-aquia/21-2680-house-bound-status/config';

export default {
  form: createSaveInProgressFormReducer(formConfig),
};
