import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';
import schoolSelect from './schoolSelect';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  schoolSelect,
};
