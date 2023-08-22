import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/save-in-progress/reducers';

import formConfig from '../config/form';
import disabilityRating from './disability-rating';
import enrollmentStatus from './enrollment-status';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  disabilityRating,
  enrollmentStatus,
};
