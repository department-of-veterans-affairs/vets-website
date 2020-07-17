import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import { post911GIBStatus } from './post911GIBStatus';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  post911GIBStatus,
};
