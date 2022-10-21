import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import itf from './itf';
import mvi from './mvi';
import formConfig from '../config/form';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  itf,
  mvi,
};
