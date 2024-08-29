import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';

const rootReducer = {
  form: createSaveInProgressFormReducer(formConfig),
};

export default rootReducer;
