import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import vapService from 'platform/user/profile/vap-svc/reducers';
import formConfig from '../config/form';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  vapService,
};
