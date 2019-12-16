import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from '../../../../platform/forms/save-in-progress/reducers';
import form2346Reducer from './form2346Reducer';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  form2346Reducer
};

