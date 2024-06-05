import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form.js';

export default {
  form: createSaveInProgressFormReducer(formConfig),
};
