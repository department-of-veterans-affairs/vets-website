import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

import formConfig from '../config/form';
import enrollmentStatus from './enrollment-status';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  enrollmentStatus,
};
