import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';
import itf from './itf';
import mvi from './mvi';
import formConfig from '../config/form';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  itf,
  mvi,
};
