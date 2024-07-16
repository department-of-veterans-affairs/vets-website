import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';
import { getFormContent } from '../helpers';

const formContent = getFormContent();
const config = formConfig(formContent);

export default {
  form: createSaveInProgressFormReducer(config),
};
