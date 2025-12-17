import vapService from '@@vap-svc/reducers';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import contestableIssues from './contestableIssues';
import itf from './itf';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  contestableIssues,
  vapService,
  itf,
};
