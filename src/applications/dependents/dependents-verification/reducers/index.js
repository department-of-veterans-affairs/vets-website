import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

import formConfig from '../config/form';
import dependents from '../../shared/reducers/dependents';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  dependents,
};
