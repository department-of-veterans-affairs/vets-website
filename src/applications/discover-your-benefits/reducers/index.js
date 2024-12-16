import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import reducer from './reducer';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  results: reducer.results,
};
