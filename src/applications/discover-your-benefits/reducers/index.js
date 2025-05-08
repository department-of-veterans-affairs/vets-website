import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';
import formConfig from '../config/form';
import reducer from './reducer';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  results: reducer.results,
};
