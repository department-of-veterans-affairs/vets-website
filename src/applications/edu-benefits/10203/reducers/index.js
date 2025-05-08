import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';
import { post911GIBStatus } from './post911GIBStatus';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  post911GIBStatus,
};
