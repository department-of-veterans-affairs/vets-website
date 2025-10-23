import { createSaveInProgressFormReducer } from '~/platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import hcaEnrollmentStatus from './hca-enrollment-status-reducer';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  hcaEnrollmentStatus,
};
