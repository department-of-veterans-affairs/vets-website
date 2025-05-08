import formConfig from './form/form';
import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';

export default {
  form: createSaveInProgressFormReducer(formConfig),
};
