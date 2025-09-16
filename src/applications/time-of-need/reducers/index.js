import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '../config/form';

const reducer = createSaveInProgressFormReducer(formConfig);

export default {
  form: reducer,
};
