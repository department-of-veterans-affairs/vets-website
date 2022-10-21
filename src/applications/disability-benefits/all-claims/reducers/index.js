import itf from './itf';
import mvi from './mvi';
import serviceBranchesReducer from './serviceBranchesReducer';
import formConfig from '../config/form';

import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  itf,
  mvi,
  serviceBranchesReducer,
};
