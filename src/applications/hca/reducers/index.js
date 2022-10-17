import { createSaveInProgressFormReducer } from '~/platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import hcaEnrollmentStatus from './hca-enrollment-status-reducer';
import totalRating from './total-disabilities';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  hcaEnrollmentStatus,
  totalRating,
};
