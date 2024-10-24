import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import { mdotApiResults } from './mdot';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  mdot: mdotApiResults,
};
