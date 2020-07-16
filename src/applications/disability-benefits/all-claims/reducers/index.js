import itf from './itf';
import mvi from './mvi';
import formConfig from '../config/form';

import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  itf,
  mvi,
};
