import formConfig from './form/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

export default {
  form: createSaveInProgressFormReducer(formConfig),
};
