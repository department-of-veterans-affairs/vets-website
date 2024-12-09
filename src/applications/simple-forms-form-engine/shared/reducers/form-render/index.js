import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

export const getReducerFromFormConfig = formConfig => ({
  form: createSaveInProgressFormReducer(formConfig),
});
