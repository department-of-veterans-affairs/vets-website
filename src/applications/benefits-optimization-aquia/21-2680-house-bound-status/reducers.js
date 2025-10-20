import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '@bio-aquia/21-2680-house-bound-status/config/form';

/**
 * Redux reducers for the 21-2680 form application
 * @module reducers
 */
export default {
  form: createSaveInProgressFormReducer(formConfig),
};
