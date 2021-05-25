import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import contestableIssues from './contestableIssues';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  contestableIssues,
};
