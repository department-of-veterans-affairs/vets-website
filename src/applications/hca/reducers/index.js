import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';
import formConfig from '../config/form';
import hcaEnrollmentStatus from './enrollment-status';
import disabilityRating from './disability-rating';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  hcaEnrollmentStatus,
  disabilityRating,
};
