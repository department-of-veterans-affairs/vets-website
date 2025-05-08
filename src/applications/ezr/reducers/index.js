import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';

import formConfig from '../config/form';
import enrollmentStatus from './enrollment-status';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  enrollmentStatus,
};
