import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from './config/form';

/**
 * Redux reducers for the 21-4192 form application
 * @module reducers
 */
export default {
  form: createSaveInProgressFormReducer(formConfig),
};
