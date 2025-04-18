// import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../new-28-1900/config/form';

export default {
  form: createSaveInProgressFormReducer(formConfig),
};
