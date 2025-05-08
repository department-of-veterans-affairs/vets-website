import vapService from '@@vap-svc/reducers';
import { createSaveInProgressFormReducer } from '@department-of-veterans-affairs/platform-forms/reducers';

import formConfig from '../config/form';
import contestableIssues from './contestableIssues';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  contestableIssues,
  vapService,
};
