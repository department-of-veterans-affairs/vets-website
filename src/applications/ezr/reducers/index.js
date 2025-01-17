import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

import formConfig from '../config/form';
import enrollmentStatus from './enrollment-status';
import veteranPrefillData from './veteran-prefill-data';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  enrollmentStatus,
  veteranPrefillData,
};
