import formConfig from '../config/form';
import authorization from './authorization';
import { createSaveInProgressFormReducer } from '../../../../platform/forms/save-in-progress/reducers';

export default {
  form: createSaveInProgressFormReducer(formConfig),
  authorization686: authorization,
};
