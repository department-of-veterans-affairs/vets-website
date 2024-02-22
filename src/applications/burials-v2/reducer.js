import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';
import formConfig from './config/form';

export default {
  form: createSaveInProgressFormReducer(formConfig),
};
