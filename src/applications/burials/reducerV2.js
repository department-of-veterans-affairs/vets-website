import {formConfigV2} from './config/form';
import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';

export default {
  form: createSaveInProgressFormReducer(formConfigV2),
};
