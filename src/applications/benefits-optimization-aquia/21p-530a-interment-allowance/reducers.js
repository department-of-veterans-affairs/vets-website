import { createSaveInProgressFormReducer } from 'platform/forms/save-in-progress/reducers';
import formConfig from '@bio-aquia/21p-530a-interment-allowance/config/form';

/**
 * Redux reducers for the 21P-530a form application
 * @module reducers
 */
export default {
  form: createSaveInProgressFormReducer(formConfig),
};
