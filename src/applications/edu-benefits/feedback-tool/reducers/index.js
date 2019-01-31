import formConfig from '../config/form';
import { createSaveInProgressFormReducer } from '../../../../platform/forms/save-in-progress/reducers';
import schoolSelect from './schoolSelect';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  schoolSelect,
};
