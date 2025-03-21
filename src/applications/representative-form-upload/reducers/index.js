import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';

const config = formConfig();

export default {
  form: createSaveInProgressFormReducer(config),
};
