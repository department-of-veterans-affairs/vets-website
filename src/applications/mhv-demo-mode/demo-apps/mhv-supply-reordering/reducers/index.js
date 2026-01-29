import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import { mdotInProgressFormReducer } from './mdotInProgressFormReducer';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  mdotInProgressForm: mdotInProgressFormReducer,
};
